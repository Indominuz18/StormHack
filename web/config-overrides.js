module.exports = function override(config, env) {
	return {
		...config,

		resolve: {
			...config.resolve,
			plugins: [
				...config.resolve.plugins,
				new (require("tsconfig-paths-webpack-plugin"))()
			]
		},

		plugins: [
			...config.plugins,
		]
	}
}
