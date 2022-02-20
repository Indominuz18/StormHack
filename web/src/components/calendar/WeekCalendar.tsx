import React, {PropsWithChildren} from 'react';

import Styles from './WeekCalendar.module.scss';
import Controller from "$app/controller/controller";
import WeekCalendarHours from "$app/components/calendar/WeekCalendarHours";
import WeekCalendarColumn from "$app/components/calendar/WeekCalendarColumn";

namespace WeekCalendar {
	export interface Props {
		controller: Controller;
		start: Date;
		cellHeight: number;
	}
}

function WeekCalendar(props: WeekCalendar.Props) {
	const timeformatter = props.controller.timeformatter;

	let columns = [];
	for (let i = 0; i < 7; i++) {
		let targetDate = new Date(props.start.getFullYear(), props.start.getMonth(), props.start.getDate() + i); // FIXME: This'll probably break towards the end of the year.
		columns.push(
			<WeekCalendarColumn {...props} timeFormatter={timeformatter} day={targetDate} key={targetDate.getTime()}/>
		)
	}

	return (
		<div className={Styles.container} style={{"--height": `${props.cellHeight}px`} as any}>
			<WeekCalendarHours timeFormatter={timeformatter}/>
			<div className={Styles.dayGrid}>
				{columns}
			</div>
		</div>
	);
}

export default WeekCalendar;
