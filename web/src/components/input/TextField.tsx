import React from 'react';

import Label from "$app/components/input/Label";

import Styles from './TextField.module.scss';

namespace TextField {
	export interface Props {
		ref?: React.Ref<HTMLInputElement>;
		name?: string;
		label?: string;
		className?: string;
		grow?: boolean;

		_x_isPassword?: boolean;
	}
}

function TextField(props: TextField.Props) {
	let id = undefined;
	if (props.name != null) {
		id = `form-field-${props.name}`;
	}

	return (
		<>
			{props.label ? <Label text={props.label} for={id}/> : null}
			<input
				className={[Styles.textField, props.className, props.grow ? Styles.grow : null].filter(n => n != null).join(" ")}
				type={props._x_isPassword ? "password" : "text"}
				name={props.name} id={id}
				ref={props.ref}/>
		</>
	);
}

export default TextField;
