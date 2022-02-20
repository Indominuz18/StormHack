import React from 'react';
import Styles from './WeekCalendar.module.scss';
import Controller from "$app/controller/controller";
import {TimeFormatter} from "$app/controller/time-formatter";
import {useAsync} from "$app/react-async-hook";
import {Assignment} from "$modal/assignment";
import ErrorCard from "$app/components/misc/ErrorCard";
import AssignmentCard from "$app/components/calendar/AssignmentCard";
import {Session} from "$modal/session";
import WeekCalendarColumnSession from "$app/components/calendar/WeekCalendarColumnSession";

namespace WeekCalendarColumn {
	export interface Props {
		controller: Controller;
		day: Date;
		timeFormatter: TimeFormatter;
		cellHeight: number;
	}
}

function WeekCalendarColumn(props: WeekCalendarColumn.Props) {
	const {controller} = props;
	const result = useAsync<readonly Session[]>(() => {
		return controller.api.getSessionsForDateRange({
			from: new Date(props.day.getFullYear(), props.day.getMonth(), props.day.getDate()),
			to:new Date(props.day.getFullYear(), props.day.getMonth(), props.day.getDate() + 1), // FIXME: Might break on last day of year.
		});
	});

	let contents = null;
	if (result === useAsync.loading) {
		contents = <div>Loading...</div>;
	} else if (result.error) {
		contents = <ErrorCard error={result.error}/>;
	} else if (result.value != null) {
		contents = result.value
			.map(a => {
				const startDate = new Date(a.startDate);
				const endDate = new Date(a.endDate);

				// Calculate how many hours into the day the event is.
				// If it's < 0 (i.e. started the day before, clamp it to zero.
				const startOffsetMillis = startDate.getTime() - props.day.getTime();
				const startOffsetHours = Math.max(0, startOffsetMillis / 1000 / 60 / 60);

				// Calculate how many hours into the day the event ends at.
				const endOffsetMillis = endDate.getTime() - props.day.getTime();
				const endOffsetHours = endOffsetMillis / 1000 / 60 / 60;
				return <WeekCalendarColumnSession
					controller={controller}
					yBegin={startOffsetHours * props.cellHeight}
					yEnd={Math.min(24 * props.cellHeight, endOffsetHours * props.cellHeight)}
					timeFormatter={controller.timeformatter}
					key={a.startDate}
					session={a}/>
			});
	}

	return (
		<div className={Styles.day}>
			<div className={Styles.columnTitle}>
				{props.timeFormatter.formatShortDayOfWeek(props.day.getDay())}
				{" "}
				{props.day.getDate()}
			</div>
			<div className={Styles.columnBody}>
				<div className={Styles.sessionsOverlay}>
					{contents}
				</div>
			</div>
		</div>
	);
}

export default WeekCalendarColumn;
