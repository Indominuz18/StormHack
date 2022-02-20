import React from 'react';
import Controller from "$app/controller/controller";
import {TimeFormatter} from "$app/controller/time-formatter";
import {Session} from "$modal/session";
import {useAsync} from "$app/react-async-hook";
import {Assignment} from "$modal/assignment";

import Styles from './WeekCalendar.module.scss';
import Accents from "$app/accents.module.scss";

namespace WeekCalendarColumnSession {
	export interface Props {
		filled?: boolean;
		controller: Controller;
		session: Session;
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

	if (result !== useAsync.loading && result.value != null) {
		assignment = result.value;
	}

	// Calculate the height.
	const height = (props.yEnd - props.yBegin);
	return (
		<div className={[
			Styles.sessionCard,
			height <= 50 ? Styles.sessionCardSmall : null,
			props.filled ? Styles.sessionCardFilled : null,
			Accents[assignment.color ?? 'none'],
		].filter(n => n != null).join(' ')}
			 style={{top: `${props.yBegin}px`, height}}>
			<div className={Styles.sessionCourse}>{assignment.course}</div>
			<div className={Styles.sessionTitle}>{props.session.title}</div>
		</div>
	);
}

export default WeekCalendarColumnSession;
