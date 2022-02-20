import React, {PropsWithChildren} from 'react';
import Styles from './WeekCalendar.module.scss';
import Controller from "$app/controller/controller";
import {TimeFormatter} from "$app/controller/time-formatter";

namespace WeekCalendarColumn {
	export interface Props {
		controller: Controller;
		day: Date;
		timeFormatter: TimeFormatter;
	}
}

function WeekCalendarColumn(props: WeekCalendarColumn.Props) {
	return (
		<div className={Styles.day}>
			<div className={Styles.columnTitle}>
				{props.timeFormatter.formatShortDayOfWeek(props.day.getDay())}
				{" "}
				{props.day.getDate()}
			</div>
			<div className={Styles.columnBody}/>
		</div>
	);
}

export default WeekCalendarColumn;
