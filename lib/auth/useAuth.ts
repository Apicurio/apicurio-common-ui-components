import { UserManager } from "oidc-client-ts";
import { AuthConfig, AuthConfigContext } from "./AuthConfigContext.ts";
import { useContext } from "react";


/** ********************************
 * OIDC auth implementation
 ** ******************************** */

const OIDC_CONFIG_OPTIONS: string[] = ["url", "clientId", "redirectUri", "scope"];
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

const oidc_createUserManager = (options: any): (UserManager | undefined) => {
    const configOptions: any = only(OIDC_CONFIG_OPTIONS, options);

    return new UserManager({
        authority: configOptions.url,
        client_id: configOptions.clientId,
        redirect_uri: configOptions.redirectUri,
        response_type: "code",
        scope: configOptions.scope || OIDC_DEFAULT_SCOPES,
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
    return userManager?.removeUser().then(() => {
        return userManager?.signoutRedirect({ post_logout_redirect_uri: window.location.href });
    });
};

const oidc_isAuthenticated = async (): Promise<boolean> => {
    return await userManager?.getUser() != null;
};

const oidc_getToken = async (): Promise<string> => {
    const user = await userManager?.getUser();
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

const basic_login = async (): Promise<void> => {
    try {
        console.debug("[Auth] Logging in using BasicAuth");
        // TODO inject those values
        username = "alice";
        password = "alice";
        //  TODO do a test call
    } catch (e) {
        console.error("[Auth] Error logging in using BasicAuth: ", e);
        username = undefined;
        password = undefined;
    }
};

const basic_logout = async (): Promise<void> => {
    username = undefined;
    password = undefined;
    return;
};

const basic_isAuthenticated = async (): Promise<boolean> => {
    return username !== undefined && password !== undefined;
};

const basic_getUsername = async (): Promise<string> => {
    return Promise.resolve(username!);
};

/** ********************************
 * AuthService interface and hook.
 ** ******************************** */

export interface AuthService {
    isAuthEnabled: () => boolean;
    isAuthenticated: () => Promise<boolean>;
    getUsername: () => Promise<string | undefined>;
    getToken: () => Promise<string | undefined>;
    login: () => Promise<void>;
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
            isAuthEnabled: () => true,
            isAuthenticated: oidc_isAuthenticated,
            getToken: oidc_getToken,
            getUsername: oidc_getUsername,
            login: oidc_login,
            logout: oidc_logout
        };
    } else if (config.type === "basic") {
        return {
            isAuthEnabled: () => true,
            isAuthenticated: basic_isAuthenticated,
            getToken: () => Promise.resolve(undefined),
            getUsername: basic_getUsername,
            login: basic_login,
            logout: basic_logout
        };
    }

    // Default: no auth
    return {
        isAuthEnabled: () => false,
        isAuthenticated: () => Promise.resolve(false),
        getToken: () => Promise.resolve(undefined),
        getUsername: () => Promise.resolve(undefined),
        login: () => Promise.resolve(),
        logout: () => Promise.resolve()
    };
};
