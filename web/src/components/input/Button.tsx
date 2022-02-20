import React, {PropsWithChildren} from "react";

import Styles from "./Button.module.scss";

namespace Button {
	export interface Props {
		kind?: 'link' | 'primary' | 'square' | 'square-inverted';

		large?: boolean;
		disabled?: boolean;

		name?: string;
		className?: string;
		onClick?: React.MouseEventHandler<HTMLButtonElement>;

		'data-action'?: string;
	}
}

function Button(props: PropsWithChildren<Button.Props>) {
	const classes = [
		Styles.button,

		// Kinds
		(props.kind ?? 'primary') === 'primary' ? Styles.primaryButton : null,
		props.kind === 'link' ? Styles.linkButton : null,
		props.kind === 'square' ? Styles.squareButton : null,
		props.kind === 'square-inverted' ? Styles.squareInvertedButton : null,

		// Modifiers
		props.large ? Styles.large : null,
		props.disabled ? Styles.disabled : null,
	]

	return (
		<button {...Object.assign({}, props, {large: undefined, kind: undefined})}
				className={[...classes, props.className].filter(n => n != null).join(" ")}>
			{props.children}
		</button>
	);
}

export default Button;
