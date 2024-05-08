import React, { FunctionComponent } from "react";
import { AuthService, useAuth } from "./useAuth.ts";

/**
 * Properties
 */
export type IfAuthProps = {
    enabled?: boolean;
    children?: React.ReactNode;
};

/**
 * Wrapper around a set of arbitrary child elements and displays them only if the
 * indicated authentication parameters are true.
 */
export const IfAuth: FunctionComponent<IfAuthProps> = (props: IfAuthProps) => {
    const auth: AuthService = useAuth();

    const accept = () => {
        let rval: boolean = true;
        if (props.enabled !== undefined) {
            rval = rval && (auth.isOidcAuthEnabled() === props.enabled || auth.isBasicAuthEnabled() === props.enabled);
        }
        return rval;
    };

    if (accept()) {
        return <React.Fragment children={props.children} />;
    } else {
        return <React.Fragment />;
    }

};
