module.exports = {
	devServer: {
		host: 'localhost'
	},
	// productionSourceMap: process.env.NODE_ENV !== 'production',
	publicPath: process.env.NODE_ENV == 'production' ? '/' : '/'
}
