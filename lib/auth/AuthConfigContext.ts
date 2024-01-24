import { createContext } from "react";

export interface AuthConfig {
    type: "none" | "oidc";
    options?: any;
}

export const AuthConfigContext = createContext<AuthConfig>({
    type: "none"
});
