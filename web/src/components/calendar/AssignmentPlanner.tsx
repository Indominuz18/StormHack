import React, {PropsWithChildren} from 'react';

import Controller from "$app/controller/controller";
import {useAsync} from "$app/react-async-hook";
import ErrorCard from "$app/components/misc/ErrorCard";
import {Assignment} from "$modal/assignment";
import AssignmentCard from "$app/components/calendar/AssignmentCard";

import Styles from "./AssignmentPlanner.module.scss";
import Accents from "$app/accents.module.scss";
import Button from "$app/components/input/Button";
import {TimeFormatter} from "$app/controller/time-formatter";

namespace AssignmentPlanner {
	export interface Props {
		timeFormatter: TimeFormatter;
		assignment: Assignment;

		className?: string;

		onReturn: () => void;
	}
}

function AssignmentPlanner(props: AssignmentPlanner.Props) {
	const {timeFormatter, assignment} = props;

	const due = new Date(assignment.dueDate)
	const dueString = `${timeFormatter.formatHourMinute(due.getHours(), due.getMinutes())}, ${timeFormatter.formatShortMonthOfYear(due.getMonth())} ${due.getDate()}, ${timeFormatter.formatShortDayOfWeek(due.getDay())}`;

	return (
		<div className={[Styles.assignmentPlanner, Accents[assignment.color ?? "none"], props.className].filter(n => n != null).join(' ')}>
			<div className={Styles.header}>
				<div>Assignment Planning</div>
				<Button kind={"link"} onClick={props.onReturn} className={Styles.returnButton}>Return</Button>
			</div>
			<div className={Styles.content}>
				<div className={Styles.info}>
					<div className={Styles.course}>{assignment.course}</div>
					<div className={Styles.name}>{assignment.name}</div>
					<div className={Styles.due}><strong>Due: </strong>{dueString}</div>
				</div>
			</div>
		</div>
	);
}

export default AssignmentPlanner;
