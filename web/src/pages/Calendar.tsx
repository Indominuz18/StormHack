import React, {useState} from 'react';
import Controller from "$app/controller/controller";
import WeekCalendar from "$app/components/calendar/WeekCalendar";

import Styles from "./Calendar.module.scss";
import AssignmentList from "$app/components/calendar/AssignmentList";
import {Assignment, AssignmentID} from "$modal/assignment";
import AssignmentPlanner from "$app/components/calendar/AssignmentPlanner";

namespace Calendar {
	export interface Props {
		controller: Controller
	}
}

function Calendar(props: Calendar.Props) {
	const start = new Date();
	const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7); // FIXME: This'll probably break towards the end of the year

	const [highlighedAssignment, setHighlightedAssignment] = useState<Assignment | null>(null);
	const onAssignmentClick = (assignment: Assignment) => {
		setHighlightedAssignment(assignment);
	}

	const sidebar = highlighedAssignment == null ? (
		<AssignmentList {...props} start={start} end={end} className={Styles.assignments}
						onAssignmentClick={onAssignmentClick}/>
	) : (
		<AssignmentPlanner {...props}
						   className={Styles.planner}
						   assignment={highlighedAssignment}
						   onReturn={() => setHighlightedAssignment(null)}/>
	);

	return (
		<div className={Styles.calendarPage}>
			{sidebar}
			<WeekCalendar {...props} start={new Date()}
						  highlightAssignments={[highlighedAssignment?.id].filter(n => n != null) as any}
						  cellHeight={50}
			/>
		</div>
	);
}

export default Calendar;
