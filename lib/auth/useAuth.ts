import { User, UserManager } from "oidc-client-ts";
import { AuthConfig, AuthConfigContext } from "./AuthConfigContext.ts";
import { useContext } from "react";


/** ********************************
 * OIDC auth implementation
 ** ******************************** */

const OIDC_CONFIG_OPTIONS: string[] = ["url", "clientId", "redirectUri", "scope", "logoutUrl", "loadUserInfo", "useStateBasedRedirect", "stateMaxAge", "onRedirect"];
const OIDC_DEFAULT_SCOPES = "openid profile email";
const SESSION_STORAGE_PREFIX = "apicurio.oidc.state.";
const DEFAULT_STATE_MAX_AGE = 300000; // 5 minutes

function only(items: string[], allOptions: any): any {
    const rval: any = {};
    items.forEach(item => {
        if (allOptions[item] !== undefined) {
            rval[item] = allOptions[item];
        }
    });
    return rval;
}

/** ********************************
 * Session storage helpers for state-based redirection
 ** ******************************** */

interface StoredRedirectState {
    location: string;
    timestamp: number;
}

/**
 * Generate a unique state ID for storing redirect location
 */
function generateStateId(): string {
    // Use crypto.randomUUID() if available, otherwise fallback to timestamp + random
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Store the redirect location in session storage
 */
function storeRedirectLocation(stateId: string, location: string): void {
    const key = `${SESSION_STORAGE_PREFIX}${stateId}`;
    const state: StoredRedirectState = {
        location,
        timestamp: Date.now()
    };
    sessionStorage.setItem(key, JSON.stringify(state));
}

/**
 * Retrieve the redirect location from session storage
 */
function getRedirectLocation(stateId: string): string | null {
    const key = `${SESSION_STORAGE_PREFIX}${stateId}`;
    const stored = sessionStorage.getItem(key);
    if (!stored) {
        return null;
    }
    try {
        const state: StoredRedirectState = JSON.parse(stored);
        return state.location;
    } catch (e) {
        console.error("[Auth] Error parsing stored redirect state:", e);
        return null;
    }
}

/**
 * Clear a specific redirect location from session storage
 */
function clearRedirectLocation(stateId: string): void {
    const key = `${SESSION_STORAGE_PREFIX}${stateId}`;
    sessionStorage.removeItem(key);
}

/**
 * Clean up expired state entries from session storage
 */
function cleanupExpiredStates(maxAge: number): void {
    const now = Date.now();
    const keysToRemove: string[] = [];

    // Iterate through all session storage keys
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(SESSION_STORAGE_PREFIX)) {
            const stored = sessionStorage.getItem(key);
            if (stored) {
                try {
                    const state: StoredRedirectState = JSON.parse(stored);
                    if (now - state.timestamp > maxAge) {
                        keysToRemove.push(key);
                    }
                } catch {
                    // If we can't parse it, remove it
                    keysToRemove.push(key);
                }
            }
        }
    }

    // Remove expired entries
    keysToRemove.forEach(key => sessionStorage.removeItem(key));

    if (keysToRemove.length > 0) {
        console.debug(`[Auth] Cleaned up ${keysToRemove.length} expired state entries`);
    }
}

/**
 * Validate that a redirect location is safe to navigate to
 */
function isValidRedirectLocation(location: string): boolean {
    if (!location || location.trim() === "") {
        return false;
    }

    // Only allow relative paths (must start with "/" and not contain "://")
    if (!location.startsWith("/") || location.includes("://")) {
        console.warn(`[Auth] Invalid redirect location (must be relative path): ${location}`);
        return false;
    }

    // Basic XSS prevention - reject javascript: protocol
    if (location.toLowerCase().startsWith("javascript:")) {
        console.warn(`[Auth] Blocked potentially malicious redirect location: ${location}`);
        return false;
    }

    return true;
}

let userManager: UserManager | undefined = undefined;
let oidcConfigOptions: any;

const oidc_createUserManager = (options: any): (UserManager | undefined) => {
    oidcConfigOptions = only(OIDC_CONFIG_OPTIONS, options);

    return new UserManager({
        authority: oidcConfigOptions.url,
        client_id: oidcConfigOptions.clientId,
        redirect_uri: oidcConfigOptions.redirectUri,
        response_type: "code",
        scope: oidcConfigOptions.scope || OIDC_DEFAULT_SCOPES,
        filterProtocolClaims: true,
        includeIdTokenInSilentRenew: true,
        includeIdTokenInSilentSignout: true,
        loadUserInfo: oidcConfigOptions.loadUserInfo ?? true
    });
};

const oidc_login = async (): Promise<void> => {
    try {
        console.debug("[Auth] Logging in using OIDC");
        const url = new URL(window.location.href);
        const currentUser = await userManager?.getUser();

        // Determine if state-based redirect is enabled (default: true)
        const useStateBasedRedirect = oidcConfigOptions.useStateBasedRedirect !== false;
        const stateMaxAge = oidcConfigOptions.stateMaxAge || DEFAULT_STATE_MAX_AGE;

        // Clean up expired state entries
        if (useStateBasedRedirect) {
            cleanupExpiredStates(stateMaxAge);
        }

        // Check if this is a callback from the OIDC provider
        if (url.searchParams.get("state") || currentUser) {
            // Handle the callback
            const user = await userManager?.signinRedirectCallback();

            // Start silent token renewal after successful authentication
            userManager?.startSilentRenew();
            console.debug("[Auth] Started silent token renewal");

            // If state-based redirect is enabled, navigate to stored location
            if (useStateBasedRedirect && user?.state) {
                const stateId = (user.state as any).redirectStateId;
                if (stateId) {
                    const storedLocation = getRedirectLocation(stateId);
                    clearRedirectLocation(stateId);

                    if (storedLocation && isValidRedirectLocation(storedLocation)) {
                        console.debug(`[Auth] Redirecting to stored location: ${storedLocation}`);

                        // Use custom redirect handler if provided, otherwise use window.location.href
                        if (oidcConfigOptions.onRedirect) {
                            oidcConfigOptions.onRedirect(storedLocation);
                        } else {
                            window.location.href = storedLocation;
                        }
                        return;
                    } else {
                        console.debug("[Auth] No valid stored location found, staying at current page");
                    }
                }
            }
        } else {
            // Initiate the login
            if (useStateBasedRedirect) {
                // Generate state ID and store current location
                const stateId = generateStateId();
                const currentLocation = window.location.pathname + window.location.search + window.location.hash;
                storeRedirectLocation(stateId, currentLocation);
                console.debug(`[Auth] Stored redirect location: ${currentLocation} with state ID: ${stateId}`);

                // Call signinRedirect with custom state
                await userManager?.signinRedirect({
                    state: { redirectStateId: stateId }
                });
            } else {
                // Use old behavior without state-based redirect
                await userManager?.signinRedirect();
            }
        }
    } catch (e) {
        console.error("[Auth] Error logging in using OIDC: ", e);
    }
};

const oidc_refresh = async (): Promise<void> => {
    try {
        console.debug("[Auth] Refreshing token using OIDC");
        await userManager?.signinSilent();
    } catch (e) {
        console.error("[Auth] Error refreshing token using OIDC: ", e);
    }
};

const oidc_logout = async (): Promise<void> => {
    // Capture the id_token before removing the user, as Okta and other providers expect id_token_hint
    const user: User | null | undefined = await userManager?.getUser();
    const idToken = user?.id_token;
    return userManager?.removeUser().then(() => {
        return userManager?.signoutRedirect({
            id_token_hint: idToken,
            post_logout_redirect_uri: oidcConfigOptions.logoutUrl || window.location.href
        });
    });
};

const oidc_isAuthenticated = async (): Promise<boolean> => {
    return await userManager?.getUser() != null;
};

const oidc_getAccessToken = async (): Promise<string> => {
    const user: User | null | undefined = await userManager?.getUser();
    return Promise.resolve(user?.access_token as string);
};

const oidc_getIdToken = async (): Promise<string> => {
    const user: User | null | undefined = await userManager?.getUser();
    return Promise.resolve(user?.id_token as string);
};

const oidc_getUsername = async (): Promise<string> => {
    const user = await userManager?.getUser();
    return Promise.resolve(user?.profile.preferred_username as string);
};

/** ********************************
 * Basic auth implementation
 ** ******************************** */

let username: string | undefined = undefined;
let password: string | undefined = undefined;

const basic_login = async (usernameValue: string, passwordValue: string): Promise<void> => {
    try {
        console.debug("[Auth] Setting Username and Password for BasicAuth");
        username = usernameValue;
        password = passwordValue;
    } catch (e) {
        console.error("[Auth] Error logging in using BasicAuth: ", e);
    }
};

const basic_logout = async (): Promise<void> => {
    console.debug("[Auth] Logout for BasicAuth");
    username = undefined;
    password = undefined;
    window.location.reload();
    return;
};

const basic_isAuthenticated = async (): Promise<boolean> => {
    return username !== undefined && password !== undefined;
};

const basic_getUsername = async (): Promise<string> => {
    return Promise.resolve(username!);
};

const basic_getUsernameAndPassword = (): UsernameAndPassword | undefined => {
    if (username !== undefined && password != undefined) {
        return {
            username: username,
            password: password
        };
    } else {
        return undefined;
    }
};

/** ********************************
 * AuthService interface and hook.
 ** ******************************** */

export interface UsernameAndPassword {
  username: string;
  password: string;
}

export interface AuthService {
    isOidcAuthEnabled: () => boolean;
    isBasicAuthEnabled: () => boolean;
    isAuthenticated: () => Promise<boolean>;
    getUsername: () => Promise<string | undefined>;
    getToken: () => Promise<string | undefined>;
    getUsernameAndPassword: () => UsernameAndPassword | undefined;
    login: (username: string, password: string) => Promise<void>;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
}

/**
 * React hook to get the application Auth service.
 */
export const useAuth: () => AuthService = (): AuthService => {
    const config: AuthConfig = useContext(AuthConfigContext);

    if (config.type === "oidc") {
        // TODO: if the config changes after we've initialized the UserManager, should we detect that and relogin or something?
        if (userManager === undefined) {
            console.debug("[Auth] Creating OIDC UserManager with options: ", config.options);
            userManager = oidc_createUserManager(config.options);
        }
        return {
            isOidcAuthEnabled: () => true,
            isBasicAuthEnabled: () => false,
            isAuthenticated: oidc_isAuthenticated,
            getToken: async () => {
                if (config.options.logTokens) {
                    const user: User | null | undefined = await userManager?.getUser();
                    console.debug("[Auth] ID Token:");
                    console.debug(user?.id_token);
                    console.debug("[Auth] Access Token:");
                    console.debug(user?.access_token);
                }
                return config.options.tokenType === "id" ? oidc_getIdToken() : oidc_getAccessToken();
            },
            getUsernameAndPassword: () => undefined,
            getUsername: oidc_getUsername,
            login: oidc_login,
            refresh: oidc_refresh,
            logout: oidc_logout
        };
    } else if (config.type === "basic") {
        return {
            isOidcAuthEnabled: () => false,
            isBasicAuthEnabled: () => true,
            isAuthenticated: basic_isAuthenticated,
            getToken: async () => undefined,
            getUsernameAndPassword: basic_getUsernameAndPassword,
            getUsername: basic_getUsername,
            login: basic_login,
            refresh: () => Promise.resolve(),
            logout: basic_logout
        };
    }

    // Default: no auth
    return {
        isOidcAuthEnabled: () => false,
        isBasicAuthEnabled: () => false,
        isAuthenticated: () => Promise.resolve(false),
        getToken: () => Promise.resolve(undefined),
        getUsername: () => Promise.resolve(undefined),
        getUsernameAndPassword: () => undefined,
        login: () => Promise.resolve(),
        refresh: () => Promise.resolve(),
        logout: () => Promise.resolve()
    };
};
