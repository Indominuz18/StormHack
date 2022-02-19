import React, {useState} from 'react';
import Controller from "$app/controller/controller";

import TextField from "$app/components/input/TextField";
import PasswordField from "$app/components/input/PasswordField";
import Centered from "$app/components/layout/Centered";

import Styles from './Login.module.scss';
import Form from "$app/components/input/Form";
import FormSubmit from "$app/components/input/FormSubmit";

namespace Login {
	export interface Props {
		controller: Controller
	}
}

function Login(props: Login.Props) {
	const {controller} = props;
	const [statusMessage, setStatusMessage] = useState<string | null>(null);

	const onSubmit = async (evt: Form.SubmitEvent) => {
		const username = evt.fields.username;
		const password = evt.fields.password;

		let result: Result<any, any>;

		// Log in or register.
		if (evt.action === 'login') {
			result = await controller.api.login(username, password);
		} else if (evt.action === 'register') {
			result = await controller.api.register(username, password);
		} else {
			throw new Error(`unknown action: ${evt.action}`);
		}

		// If error, show the error.
		if (result.error) {
			setStatusMessage(`${result.error}`);
			return;
		}

		// Reload the page.
		window.history.go(0);
	}

	return (
		<Centered className={Styles.loginContainer} vertical horizontal>
			<div className={Styles.loginCardTitle}>
				Log in to {props.controller.config.project.name}
			</div>

			<div className={Styles.loginCardContents}>
				<Form onSubmit={onSubmit} className={Styles.loginFormContainer}>
					<div className={Styles.loginFormFields}>
						<TextField name={"username"} label={"Username"} grow/>
						<PasswordField name={"password"} label={"Password"} grow/>

						<div className={Styles.loginFormStatus}>{statusMessage}</div>
					</div>
					<div className={Styles.loginFormActions}>
						<FormSubmit action="login" large>Log In</FormSubmit>
						<FormSubmit action="register" kind="link">...or sign up</FormSubmit>
					</div>
				</Form>
			</div>
		</Centered>
	);
}

export default Login;
