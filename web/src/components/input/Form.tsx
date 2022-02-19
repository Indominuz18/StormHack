import React, {FormEvent, PropsWithChildren} from "react";

namespace Form {
	export type SubmitEvent = React.FormEvent<HTMLFormElement> & {
		action?: string;
		fields: {
			[key: string]: string
		};
	};

	export interface Props {
		className?: string;
		onSubmit: React.EventHandler<SubmitEvent>;
	}
}

function Form(props: PropsWithChildren<Form.Props>) {
	const onSubmit = (evt: FormEvent, ...args: any) => {
		evt.preventDefault();
		evt.stopPropagation();

		if (props.onSubmit != null) {
			const submitEvent = (evt as Form.SubmitEvent);

			// Get the action.
			submitEvent.action = (evt.nativeEvent as any).submitter!.getAttribute("data-action");

			// Get the fields.
			submitEvent.fields = {};
			for (const input of (evt.nativeEvent.target as any).querySelectorAll("input[name]")) {
				submitEvent.fields[input.name] = getInputValue(input);
			}

			// Propagate the event to the handler.
			(props.onSubmit as any)(evt, ...args);
		}
	}

	return (
		<form onSubmit={onSubmit} className={props.className}>
			{props.children}
		</form>
	);
}

function getInputValue(input: HTMLInputElement): any {
	switch (input.type) {
		case "text":
		case "password":
			return input.value;
	}

	throw new Error(`do not know how to get value for input of type ${input.type}`);
}

export default Form;
