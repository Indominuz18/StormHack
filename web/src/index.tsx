import React from 'react';
import ReactDOM from 'react-dom';

import App from '$app/App';
import {Config} from "$app/config";

import {LocalstorageAPI} from "$app/controller/api-shim";
import Controller, {ControllerConfig} from "$app/controller/controller";
import {API} from "$app/controller/api";

import reportWebVitals from './reportWebVitals';

// Global styles.
import './index.scss';

// ---------------------------------------------------------------------------------------------------------------------
// Initialization functions.
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Creates the controller that talks to the API.
 * @param config The application config.
 */
function createAPIController(config: ControllerConfig): API {
	const apiServer = new URL(Config.url.api);
	if (apiServer.protocol === 'shim:') {
		return new LocalstorageAPI(localStorage, apiServer.pathname.replaceAll(/^\/+/g, ''));
	}

	// TODO(eth-p): XHR/fetch-based API implementation.
	throw new Error('Unimplemented');
}

/**
 * Creates the main application controller.
 */
function createAppController(config: ControllerConfig): Controller {
	const apiController = createAPIController(config);
	return new Controller(apiController, config);
}

// ---------------------------------------------------------------------------------------------------------------------
// Start React app.
// ---------------------------------------------------------------------------------------------------------------------

try {

	// Create the application controller.
	const controller = createAppController(Config);

	// Add debug variables to global scope.
	if (process.env.NODE_ENV !== 'production') {
		Object.assign(window, {
			$controller: controller,
			$api: controller.api,
		});
	}

	// Render the DOM.
	ReactDOM.render(
		<React.StrictMode>
			<App controller={controller}/>
		</React.StrictMode>,
		document.getElementById('root')
	);

} catch (ex) {
	console.error(ex);

	let message = (ex as any).toString();
	let stack = '';

	if (ex instanceof Error) {
		message = ex.toString();
		stack = (ex.stack ?? "").replace(/^.*\n/, '') ?? '';
	}

	const errContainer = document.createElement("div");
	const errMessage = document.createElement("div");
	const errStack = document.createElement("div");
	errMessage.textContent = message;
	errMessage.style.color = '#ff0000';
	errStack.textContent = stack;
	errStack.style.whiteSpace = 'pre';
	errStack.style.fontFamily = 'monospace';

	errContainer.appendChild(errMessage);
	errContainer.appendChild(errStack);
	document.getElementById('root')!.appendChild(errContainer);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
