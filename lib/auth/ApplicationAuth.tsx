import React, { FunctionComponent, useEffect, useState } from "react";
import { EmptyState, EmptyStateBody, EmptyStateHeader, EmptyStateIcon, Spinner } from "@patternfly/react-core";
import { ErrorCircleOIcon } from "@patternfly/react-icons";
import { AuthService, UsernameAndPassword, useAuth } from "./useAuth.ts";
import { If } from "../common";
import { BasicAuthModal } from "../modals";

enum AuthState {
    AUTHENTICATING, AUTHENTICATED, AUTHENTICATION_FAILED
}

/**
 * Properties
 */
export type AuthProps = {
    children: React.ReactNode;
};

/**
 * Protect the application with OIDC authentication.
 */
export const ApplicationAuth: FunctionComponent<AuthProps> = (props: AuthProps) => {
    const [authState, setAuthState] = useState<AuthState>(AuthState.AUTHENTICATING);
    const auth: AuthService = useAuth();

    const basicAuthLogin = (creds: UsernameAndPassword): void => {
        console.info("[ApplicationAuth] Using username and password.");
        auth.login(creds.username, creds.password);
        setAuthState(AuthState.AUTHENTICATED);
    };

    useEffect(() => {
        if (auth.isOidcAuthEnabled()) {
            auth.login("", "").then(() => {
                console.info("[ApplicationAuth] Authentication successful.");
                setAuthState(AuthState.AUTHENTICATED);
            }).catch(error => {
                // TODO display the auth error
                console.error("[ApplicationAuth] Authentication failed: ", error);
                setAuthState(AuthState.AUTHENTICATION_FAILED);
            });
        } else if (auth.isBasicAuthEnabled()) {
            // DO NOTHING
        } else {
            setAuthState(AuthState.AUTHENTICATED);
        }
    }, []);

    return (
        <>
            <If condition={authState === AuthState.AUTHENTICATING && auth.isOidcAuthEnabled()}>
                <EmptyState>
                    <EmptyStateHeader titleText="Loading" headingLevel="h4" />
                    <EmptyStateBody>
                        <Spinner size="xl" aria-label="Loading spinner" />
                    </EmptyStateBody>
                </EmptyState>
            </If>
            <If condition={authState === AuthState.AUTHENTICATING && auth.isBasicAuthEnabled()}>
                <BasicAuthModal onLogin={basicAuthLogin}></BasicAuthModal>
            </If>
            <If condition={authState === AuthState.AUTHENTICATION_FAILED}>
                <EmptyState>
                    <EmptyStateHeader titleText="Empty state" headingLevel="h4" icon={<EmptyStateIcon icon={ErrorCircleOIcon} />} />
                    <EmptyStateBody>
                        Authentication failed.
                    </EmptyStateBody>
                </EmptyState>
            </If>
            <If condition={authState === AuthState.AUTHENTICATED} children={props.children} />
        </>
    );
};
