import { FunctionComponent, useState } from "react";
import { Button, Form, FormGroup, Modal, TextInput } from "@patternfly/react-core";
import { UsernameAndPassword } from "../auth";

type BasicAuthState = {
    creds: UsernameAndPassword
}

/**
 * Properties
 */
export type BasicAuthModalProps = {
    onLogin: (creds: UsernameAndPassword) => void;
};

/**
 * Models the login modal to be used with BasicAuth.
 */
export const BasicAuthModal: FunctionComponent<BasicAuthModalProps> = (props: BasicAuthModalProps) => {
    const [authState, setAuthState] = useState<BasicAuthState>({
        creds: {
            username: "",
            password: ""
        }
    });

    const onLogin = (): void => {
        props.onLogin(authState.creds);
    };

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

    return (
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
                <Button key="login" variant="primary" data-testid="modal-btn-login" onClick={onLogin} isDisabled={authState?.creds.username === "" || authState?.creds.password === ""}>Login</Button>
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
                        value={authState?.creds.username}
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
    );

};
