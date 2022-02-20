import React, {PropsWithChildren} from 'react';

import {Assignment} from "$modal/assignment";

import {TimeFormatter} from "$app/controller/time-formatter";

import Styles from "./FancyCard.module.scss";
import Accents from "$app/accents.module.scss";
import {Accent} from "$modal/accents";

namespace FancyCard {
	export interface Props {
		title: string;
		accent?: Accent;
		onClick?: React.EventHandler<React.MouseEvent<HTMLDivElement>>;
	}
}

function FancyCard(props: PropsWithChildren<FancyCard.Props>) {
	return (
		<div onClick={props.onClick} className={[
			Styles.card,
			Accents[props.accent ?? 'none'],
			props.onClick ? Styles.clickable : null].filter(n => n != null).join(' ')}>
			<div className={Styles.title}>{props.title}</div>
			<div className={Styles.cardBody}>
				{props.children}
			</div>
		</div>
	);
}

export default FancyCard;
