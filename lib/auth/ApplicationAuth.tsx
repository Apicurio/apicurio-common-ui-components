import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, EmptyState, EmptyStateBody, EmptyStateHeader, EmptyStateIcon, Form, FormGroup, Modal, Spinner, TextInput } from "@patternfly/react-core";
import { ErrorCircleOIcon } from "@patternfly/react-icons";
import { AuthService, UsernameAndPassword, useAuth } from "./useAuth.ts";
import { If } from "../common";

export interface AuthStateData {
    state: AuthState;
    creds: UsernameAndPassword;
}

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
    const [authState, setAuthState] = useState<AuthStateData>({
        state: AuthState.AUTHENTICATING,
        creds: {
            username: "",
            password: ""
        }
    });
    const auth: AuthService = useAuth();

    const onUsernameChange = (_event: any, value: string): void => {
        setAuthState({
            ...authState,
            creds: {
                ...authState.creds,
                username: value
            }
        });
    };

    const onPasswordChange = (_event: any, value: string): void => {
        setAuthState({
            ...authState,
            creds: {
                ...authState.creds,
                password: value
            }
        });
    };

    const basicAuthLogin = (): void => {
        console.info("[ApplicationAuth] Using username and password.");
        auth.login(authState.creds.username, authState.creds.password);
        setAuthState({
            ...authState,
            state: AuthState.AUTHENTICATED
        });
    };

    useEffect(() => {
        if (auth.isOidcAuthEnabled()) {
            auth.login("", "").then(() => {
                console.info("[ApplicationAuth] Authentication successful.");
                setAuthState({
                    ...authState,
                    state: AuthState.AUTHENTICATED
                });
            }).catch(error => {
                // TODO display the auth error
                console.error("[ApplicationAuth] Authentication failed: ", error);
                setAuthState({
                    ...authState,
                    state: AuthState.AUTHENTICATION_FAILED
                });
            });
        } else if (auth.isBasicAuthEnabled()) {
            // DO NOTHING
        } else {
            setAuthState({
                ...authState,
                state: AuthState.AUTHENTICATED
            });
        }
    }, []);

    return (
        <>
            <If condition={authState.state === AuthState.AUTHENTICATING && auth.isOidcAuthEnabled()}>
                <EmptyState>
                    <EmptyStateHeader titleText="Loading" headingLevel="h4" />
                    <EmptyStateBody>
                        <Spinner size="xl" aria-label="Loading spinner" />
                    </EmptyStateBody>
                </EmptyState>
            </If>
            <If condition={authState.state === AuthState.AUTHENTICATING && auth.isBasicAuthEnabled()}>
                <Modal
                    title="Login"
                    variant="small"
                    isOpen={true}
                    header={<a href="#" />}
                    showClose={false}
                    className="please-wait pf-m-redhat-font"
                    aria-label="please-wait-modal"
                    style={{ marginTop: "-15px" }}
                    actions={[
                        <Button key="login" variant="primary" data-testid="modal-btn-login" onClick={basicAuthLogin} isDisabled={authState.creds.username === "" || authState.creds.password === ""}>Login</Button>
                    ]}
                >
                    <Form>
                        <FormGroup
                            label="Username"
                            fieldId="form-username"
                        >
                            <TextInput
                                isRequired={true}
                                type="text"
                                id="form-username"
                                data-testid="basic-auth-login-modal-username"
                                name="form-username"
                                value={authState.creds.username}
                                placeholder="Username"
                                onChange={onUsernameChange}
                            />
                        </FormGroup>
                        <FormGroup
                            label="Password"
                            fieldId="form-password"
                        >
                            <TextInput
                                isRequired={true}
                                type="text"
                                id="form-password"
                                data-testid="basic-auth-login-modal-password"
                                name="form-password"
                                value={authState.creds.password}
                                placeholder="Password"
                                onChange={onPasswordChange}
                            />
                        </FormGroup>
                    </Form>
                </Modal>
            </If>
            <If condition={authState.state === AuthState.AUTHENTICATION_FAILED}>
                <EmptyState>
                    <EmptyStateHeader titleText="Empty state" headingLevel="h4" icon={<EmptyStateIcon icon={ErrorCircleOIcon} />} />
                    <EmptyStateBody>
                        Authentication failed.
                    </EmptyStateBody>
                </EmptyState>
            </If>
            <If condition={authState.state === AuthState.AUTHENTICATED} children={props.children} />
        </>
    );
};
