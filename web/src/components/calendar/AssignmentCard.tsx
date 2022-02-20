import React from 'react';

import {Assignment} from "$modal/assignment";

import {TimeFormatter} from "$app/controller/time-formatter";

import Styles from "./AssignmentCard.module.scss";
import Accents from "$app/accents.module.scss";

namespace AssignmentCard {
	export interface Props {
		assignment: Assignment;
		timeFormatter: TimeFormatter;
	}
}

function AssignmentCard(props: AssignmentCard.Props) {
	const {assignment, timeFormatter} = props;
	const due = new Date(assignment.dueDate);

	const dueTime = timeFormatter.formatHourMinute(due.getHours(), due.getMinutes());
	const dueDate = `${timeFormatter.formatShortMonthOfYear(due.getMonth())} ${due.getDate()}`
	const dueDayOfWeek = timeFormatter.formatShortDayOfWeek(due.getDay());
	const dueString = `Due: ${dueTime}, ${dueDate} ${dueDayOfWeek}`;

	return (
		<div className={[Styles.card, Accents[assignment.color ?? 'none']].join(' ')}>
			<div className={Styles.course}>{assignment.course}</div>
			<div className={Styles.cardBody}>
				<div className={Styles.name}>{assignment.name}</div>
				<div className={Styles.due}>{dueString}</div>
			</div>
		</div>
	);
}

export default AssignmentCard;
