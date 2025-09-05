import { User, UserManager } from "oidc-client-ts";
import { AuthConfig, AuthConfigContext } from "./AuthConfigContext.ts";
import { useContext } from "react";


/** ********************************
 * OIDC auth implementation
 ** ******************************** */

const OIDC_CONFIG_OPTIONS: string[] = ["url", "clientId", "redirectUri", "scope", "logoutUrl"];
const OIDC_DEFAULT_SCOPES = "openid profile email";

function only(items: string[], allOptions: any): any {
    const rval: any = {};
    items.forEach(item => {
        if (allOptions[item] !== undefined) {
            rval[item] = allOptions[item];
        }
    });
    return rval;
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
        loadUserInfo: true
    });
};

const oidc_login = async (): Promise<void> => {
    try {
        console.debug("[Auth] Logging in using OIDC");
        const url = new URL(window.location.href);
        const currentUser = await userManager?.getUser();
        if (url.searchParams.get("state") || currentUser) {
            await userManager?.signinRedirectCallback();
        } else {
            await userManager?.signinRedirect()
                .then(() => {
                    userManager?.startSilentRenew();
                    userManager?.signinRedirectCallback();
                }).catch(reason => {
                    console.log(reason);
                });
        }
    } catch (e) {
        console.error("[Auth] Error logging in using OIDC: ", e);
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
        logout: () => Promise.resolve()
    };
};
