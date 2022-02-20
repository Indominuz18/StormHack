export interface TimeFormatter {

	/**
	 * Formats an hour.
	 * @param hour The hour to format.
	 */
	formatHour(hour: number): string;

	/**
	 * Formats an hour and minute.
	 * @param hour The hour to format.
	 * @param minute The minute to format.
	 */
	formatHourMinute(hour: number, minute: number): string;

	/**
	 * Formats the short form of the day of the week.
	 * @param dayOfWeek The day of the week (0-6).
	 */
	formatShortDayOfWeek(dayOfWeek: number): string;

	/**
	 * Formats the short form of the month of the year.
	 * @param monthOfYear The month of the year (0-11).
	 */
	formatShortMonthOfYear(monthOfYear: number): string;

}

abstract class AbstractTimeFormatter implements TimeFormatter {
	protected _dowShortTable: string[];
	protected _moyShortTable: string[];

	constructor() {
		this._dowShortTable = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		this._moyShortTable = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	}

	formatShortDayOfWeek(dayOfWeek: number): string {
		return this._dowShortTable[dayOfWeek];
	}

	formatShortMonthOfYear(monthOfYear: number): string {
		return this._moyShortTable[monthOfYear];
	}

	abstract formatHour(hour: number): string;
	abstract formatHourMinute(hour: number, minute: number): string;
}

export class TimeFormatter24 extends AbstractTimeFormatter {
	formatHour(hour: number): string {
		return hour.toString().padStart(2, '0');
	}

	formatHourMinute(hour: number, minute: number): string {
		return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
	}
}

export class TimeFormatter12 extends AbstractTimeFormatter {
	protected _formatHourParts(hour: number): [string, string] {
		let hourNum = hour % 12;
		if (hourNum === 0) hourNum = 12;
		return [`${hourNum}`, (hour > 11 ? 'pm' : 'am')];
	}

	formatHour(hour: number): string {
		return this._formatHourParts(hour).join(' ');
	}

	formatHourMinute(hour: number, minute: number): string {
		const [hour12, meridian] = this._formatHourParts(hour);
		return `${hour12}:${minute.toString().padStart(2, '0')} ${meridian}`;
	}
}
