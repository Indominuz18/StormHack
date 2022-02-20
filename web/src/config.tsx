/**
 * Config is the static configuration for the website.
 */
export const Config = {
	project: {
		name: process.env.REACT_APP_PROJECT_NAME ?? "Calendar",
	},

	url: {
		api: process.env.REACT_APP_API_SERVER ?? "shim://dev",
	}
}
