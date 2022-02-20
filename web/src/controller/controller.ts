import type {Config} from "$app/config";

import {User} from "$modal/user";

import {API} from "$app/controller/api";
import {resultify} from "$app/util";
import {TimeFormatter, TimeFormatter12, TimeFormatter24} from "$app/controller/time-formatter";
import {Accent} from "$modal/accents";

/**
 * Controller is the main controller for the application.
 * This manages the application state and communicates through the {@link API} controller.
 */
export default class Controller {
	public readonly api: API;
	public readonly config: ControllerConfig;
	public readonly me?: User;
	public readonly timeformatter: TimeFormatter;
	public readonly defaultAccent: Accent;

	constructor(api: API, config: ControllerConfig) {
		this.api = api;
		this.config = config;
		this.defaultAccent = Accent.Mint;
		this.timeformatter = this.is24Hour() ?
			new TimeFormatter24() :
			new TimeFormatter12();
	}

	/**
	 * Returns true if the user prefers 24-hour time.
	 */
	is24Hour(): boolean {
		return false;
	}

	async isLoggedIn(): Promise<boolean> {
		if (this.me != null) {
			return true;
		}

		const loginUserInfo = await resultify(this.api.getLoginUserInfo());
		if (loginUserInfo.error != null) {
			err("unable to get login user info", loginUserInfo.error);
			return false;
		}

		(this as any).me = loginUserInfo.value; // Set the readonly property. #hacks
		return true;
	}
}

// function log(message: string, ...args: any) {
// 	console.log(`[controller] ${message}`, ...args);
// }

function err(message: string, ...args: any) {
	console.error(`[controller] ${message}`, ...args);
}

export type ControllerConfig = typeof Config;
