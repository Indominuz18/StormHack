import React from 'react';

import {Assignment} from "$modal/assignment";

import {TimeFormatter} from "$app/controller/time-formatter";

import Styles from "./AssignmentCard.module.scss";
import Accents from "$app/accents.module.scss";
import FancyCard from "$app/components/abstract/FancyCard";

namespace AssignmentCard {
	export interface Props {
		assignment: Assignment;
		timeFormatter: TimeFormatter;
		onClick?: React.EventHandler<React.MouseEvent<HTMLDivElement>>;
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
		<FancyCard title={assignment.course} onClick={props.onClick} accent={assignment.color}>
			<div className={Styles.name}>{assignment.name}</div>
			<div className={Styles.due}>{dueString}</div>
		</FancyCard>
	);
}

export default AssignmentCard;
