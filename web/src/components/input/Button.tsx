import React, {PropsWithChildren} from "react";

import Styles from "./Button.module.scss";

namespace Button {
	export interface Props {
		kind?: 'link' | 'primary';
		large?: boolean;

		name?: string;
		className?: string;
		onClick?: React.MouseEventHandler<HTMLButtonElement>;

		'data-action'?: string;
	}
}

function Button(props: PropsWithChildren<Button.Props>) {
	const classes = [
		(props.kind ?? 'primary') === 'primary' ? Styles.primaryButton : null,
		props.kind === 'link' ? Styles.linkButton : null,
		props.large ? Styles.large : null,
	]

	return (
		<button {...Object.assign({}, props, {large: undefined, kind: undefined})}
				className={[...classes, props.className].filter(n => n != null).join(" ")}>
			{props.children}
		</button>
	);
}

export default Button;
