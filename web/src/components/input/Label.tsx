import React from 'react';

import LabelStyles from './Label.module.scss';

namespace Label {
	export interface Props {
		text?: string
		for?: string
	}
}

function Label(props: Label.Props) {
	return (
		<>
			<label className={LabelStyles.label} htmlFor={props.for}>{props.text}</label>
		</>
	);
}

export default Label;
