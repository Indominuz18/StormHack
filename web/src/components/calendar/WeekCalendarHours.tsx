import React from 'react';

import {TimeFormatter} from "$app/controller/time-formatter";

import Styles from './WeekCalendar.module.scss';

namespace WeekCalendarHours {
	export interface Props {
		className?: string;
		timeFormatter: TimeFormatter;
	}
}

function WeekCalendarHours(props: WeekCalendarHours.Props) {
	let hours = [];
	for (let hour = 0; hour <= 23; hour++) {
		hours.push(
			<div key={hour}>{props.timeFormatter.formatHour(hour).toUpperCase()}</div>
		)
	}

	return (
		<div className={props.className}>
			<div className={Styles.hours}>
				<div className={Styles.columnTitle}/>
				<div className={Styles.columnBody}>
					{hours}
				</div>
			</div>
		</div>
	);
}

export default WeekCalendarHours;
