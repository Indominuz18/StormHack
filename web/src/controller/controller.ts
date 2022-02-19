import type {Config} from "$app/config";

import {API} from "$app/controller/api";

/**
 * Controller is the main controller for the application.
 * This manages the application state and communicates through the {@link API} controller.
 */
export default class Controller {
	public readonly api: API;
	public readonly config: ControllerConfig;

	constructor(api: API, config: ControllerConfig) {
		this.api = api;
		this.config = config;
	}

	async isLoggedIn(): Promise<boolean> {
		return false;
	}
}

export type ControllerConfig = typeof Config;
