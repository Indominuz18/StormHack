import React, {PropsWithChildren} from 'react';

import Styles from "./FancyCard.module.scss";
import Accents from "$app/accents.module.scss";
import {Accent} from "$modal/accents";

namespace FancyCard {
	export interface Props {
		title?: string;
		accent?: Accent;
		onClick?: React.EventHandler<React.MouseEvent<HTMLDivElement>>;
		className?: string;
	}
}

function FancyCard(props: PropsWithChildren<FancyCard.Props>) {
	const title = props.title ? <div className={Styles.title}>{props.title}</div> : null;
	return (
		<div onClick={props.onClick} className={[
			props.className,
			Styles.card,
			Accents[props.accent ?? 'none'],
			props.onClick ? Styles.clickable : null].filter(n => n != null).join(' ')}>
			{title}
			<div className={Styles.cardBody}>
				{props.children}
			</div>
		</div>
	);
}

export default FancyCard;
