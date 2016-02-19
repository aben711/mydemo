var webpack = require("webpack");
var path = require("path");
module.exports = {
	entry: {
		vendors:['avalon','jquery'],
		router:'./src/router'
	},
	output: {
		path: path.join(__dirname, "./assets/"),
		filename: "js/[name].js",
		publicPath:'assets/',
		chunkFilename:"js/[name].chunk.js"
	},
	module: {
		loaders:[
			{test:/\.css$/,loader:'style!css'}
		],
		noParse:['avalon','jquery']
	},
	resolve: {
		extensions: ['',".js",".css"],
		alias: {
			'jquery': path.join(__dirname, 'src/js/jquery/jquery.min.js'),
			'avalon': path.join(__dirname, 'src/js/avalon/avalon.shim.min'),
			'mmState': path.join(__dirname, 'src/js/mmRouter/mmState.js'),
			'mmRequest': path.join(__dirname, 'src/js/mmRequest/mmRequest.modern.js'),
			'mmPromise': path.join(__dirname, 'src/js/mmRouter/mmPromise.js')
		}
	},
	plugins:[
		new webpack.optimize.CommonsChunkPlugin('js/common.js')
	]
}