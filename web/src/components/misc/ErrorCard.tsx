import React, {PropsWithChildren} from "react";

import Styles from "./ErrorCard.module.scss";

namespace ErrorCard {
	export interface Props {
		title?: string;
		error?: any;
	}
}

function ErrorCard(props: PropsWithChildren<ErrorCard.Props>) {
	return (
		<div className={Styles.errorCard}>
			<div className={Styles.title}>
				{props.title ?? "Failed to load data."}
			</div>
			<div className={Styles.message}>
				{props.error}
			</div>
		</div>
	);
}

export default ErrorCard;
