/**
 * Config is the static configuration for the website.
 */
export const Config = {
	project: {
		name: process.env.PROJECT_NAME ?? "Calendar",
	},

	url: {
		api: process.env.API_SERVER ?? "shim://dev",
	}
}
