import { FunctionComponent, useState } from "react";
import {
	Button,
	Form,
	FormGroup,
	TextInput
} from '@patternfly/react-core';
import {
	Modal
} from '@patternfly/react-core/deprecated';
import { UsernameAndPassword } from "../auth";

type BasicAuthState = {
    username: string,
    password: string,
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
        username: "",
        password: "",
    });

    const onLogin = (): void => {
        props.onLogin(authState);
    };

    const onUsernameChange = (_event: any, value: string): void => {
        setAuthState({
            ...authState,
            username: value
        });
    };

    const onPasswordChange = (_event: any, value: string): void => {
        setAuthState({
            ...authState,
            password: value
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
                <Button key="login" variant="primary" data-testid="modal-btn-login" onClick={onLogin} isDisabled={authState?.username === "" || authState?.password === ""}>Login</Button>
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
                        value={authState?.username}
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
                        type="password"
                        id="form-password"
                        data-testid="basic-auth-login-modal-password"
                        name="form-password"
                        value={authState?.password}
                        placeholder="Password"
                        onChange={onPasswordChange}
                    />
                </FormGroup>
            </Form>
        </Modal>
    );

};
