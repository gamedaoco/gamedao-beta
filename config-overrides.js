module.exports = {

	webpack: function(config,env) {
		config.module.rules.push({
			test: /\.mjs$/,
			include: /node_modules/,
			type: "javascript/auto"
		})
		return config;
	},

}
