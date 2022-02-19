import React, {PropsWithChildren} from "react";

import Button from "$app/components/input/Button";

namespace FormSubmit {
	export interface Props extends Button.Props {
		action?: string;
	}
}

function FormSubmit(props: PropsWithChildren<FormSubmit.Props>) {
	return (
		<Button {...props} data-action={props.action}>
			{props.children}
		</Button>
	);
}

export default FormSubmit;
