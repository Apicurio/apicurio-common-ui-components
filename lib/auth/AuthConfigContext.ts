import { createContext } from "react";

/**
 * OIDC configuration options
 */
export interface OidcAuthOptions {
    url: string;
    clientId: string;
    redirectUri: string;
    scope?: string;
    logoutUrl?: string;
    loadUserInfo?: boolean;
    logTokens?: boolean;
    tokenType?: "id" | "access";
    /**
     * Enable state-based redirection after OIDC authentication.
     * When enabled, the user's location before authentication is stored in session storage
     * and they are redirected back to that location after successful authentication.
     * This is required for OIDC providers like Microsoft EntraID that don't support
     * dynamic redirect URIs.
     * @default true
     */
    useStateBasedRedirect?: boolean;
    /**
     * Maximum age in milliseconds for stored state entries in session storage.
     * State entries older than this will be cleaned up automatically.
     * Only applies when useStateBasedRedirect is enabled.
     * @default 300000 (5 minutes)
     */
    stateMaxAge?: number;
    /**
     * Custom redirect handler for client-side navigation after OIDC authentication.
     * This allows React Router or other routing libraries to handle navigation
     * without causing a full page refresh.
     *
     * If not provided, defaults to `window.location.href = location` which causes
     * a full page reload.
     *
     * @example
     * // With React Router v7
     * import { useNavigate } from 'react-router';
     *
     * const navigate = useNavigate();
     * const authConfig = {
     *   type: "oidc",
     *   options: {
     *     // ... other options
     *     onRedirect: (location) => navigate(location)
     *   }
     * };
     */
    onRedirect?: (location: string) => void;
}

export interface AuthConfig {
    type: "none" | "basic" | "oidc";
    options?: any;
}

export const AuthConfigContext = createContext<AuthConfig>({
    type: "none"
});
