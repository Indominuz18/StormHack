import React, {PropsWithChildren} from 'react';

import Controller from "$app/controller/controller";
import {useAsync} from "$app/react-async-hook";
import ErrorCard from "$app/components/misc/ErrorCard";
import {Assignment} from "$modal/assignment";
import AssignmentCard from "$app/components/calendar/AssignmentCard";

import Styles from "./AssignmentPlanner.module.scss";
import Accents from "$app/accents.module.scss";
import Button from "$app/components/input/Button";
import FancyCard from "$app/components/abstract/FancyCard";
import {Session} from "$modal/session";
import {TimeFormatter} from "$app/controller/time-formatter";

namespace AssignmentPlanner {
	export interface Props {
		controller: Controller;
		assignment: Assignment;

		className?: string;

		onReturn: () => void;
	}
}

function AssignmentPlanner(props: AssignmentPlanner.Props) {
	const {controller, assignment} = props;
	const tf = controller.timeformatter

	const due = new Date(assignment.dueDate);
	const dueString = `${tf.formatHourMinute(due.getHours(), due.getMinutes())}, ${tf.formatShortMonthOfYear(due.getMonth())} ${due.getDate()}, ${tf.formatShortDayOfWeek(due.getDay())}`;

	// Get the elements for the sessions.
	const sessions = useAsync(() => controller.api.getSessionsOfAssignment(assignment.id), true);
	let sessionsElements: any[] = [];
	if (sessions !== useAsync.loading && sessions.error != null) {
		sessionsElements.push(<ErrorCard key={"err"} error={sessions.error}/>);
	} else if (sessions !== useAsync.loading && sessions.value != null) {
		sessionsElements = sessions.value
			.map((s, i) => <React.Fragment key={i}>{createSessionCard(tf, assignment, s)}</React.Fragment>);
	}

	return (
		<div
			className={[Styles.assignmentPlanner, Accents[assignment.color ?? "none"], props.className].filter(n => n != null).join(' ')}>
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
				<div className={Styles.sessions}>
					{sessionsElements}
					<FancyCard
						accent={assignment.color}
						className={Styles.newSessionButton}>+</FancyCard>
				</div>
			</div>
		</div>
	);
}

export default AssignmentPlanner;

function createSessionCard(tf: TimeFormatter, assignment: Assignment, session: Session) {
	const start = new Date(session.startDate);
	const end = new Date(session.endDate);

	const rangeString = `${tf.formatHourMinuteRange(start.getHours(),start.getMinutes(),end.getHours(),end.getMinutes())}`;

	return (
		<FancyCard accent={assignment.color} title={assignment.course} className={Styles.sessionCard}>
			<div className={Styles.sessionCardTitle}>{session.title}</div>
			<div className={Styles.sessionCardDates}>{rangeString}</div>
		</FancyCard>
	)
}
