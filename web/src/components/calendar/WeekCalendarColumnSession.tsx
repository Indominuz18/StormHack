import React, {PropsWithChildren} from 'react';
import Controller from "$app/controller/controller";
import {TimeFormatter} from "$app/controller/time-formatter";
import {Session} from "$modal/session";
import {useAsync} from "$app/react-async-hook";
import {Assignment} from "$modal/assignment";

import Styles from './WeekCalendar.module.scss';
import Accents from "$app/accents.module.scss";

namespace WeekCalendarColumnSession {
	export interface Props {
		controller: Controller;
		session: Session
		timeFormatter: TimeFormatter;
		yBegin: number;
		yEnd: number;
	}
}

function WeekCalendarColumnSession(props: WeekCalendarColumnSession.Props) {
	const {controller} = props;
	const result = useAsync<Assignment>(() => {
		return controller.api.getAssignmentById(props.session.assignment);
	});

	let assignment: Assignment = {
		course: "",
		dueDate: "",
		id: props.session.assignment,
		name: ""
	}

	let assignmentsContents = null;
	if (result !== useAsync.loading && result.value != null) {
		assignment = result.value;
	}
console.log(assignment);
	return (
		<div className={[Styles.sessionCard, Accents[assignment.color ?? 'none']].join(' ')}
			 style={{transform:`translateY(${props.yBegin}px)`, height: (props.yEnd - props.yBegin)}}>
			<div className={Styles.sessionCourse}>{assignment.course}</div>
			<div className={Styles.sessionTitle}>{props.session.title}</div>
		</div>
	);
}

export default WeekCalendarColumnSession;
