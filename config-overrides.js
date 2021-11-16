const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {

	webpack: function(config,env) {
		config.module.rules.push({
			test: /\.mjs$/,
			include: /node_modules/,
			type: "javascript/auto"
		})

		if (!config.plugins) {
			config.plugins = [];
		}

		config.plugins.push(
			new BundleAnalyzerPlugin({
				analyzerMode: "disabled"
			})
		);
		
		return config;
	},

}