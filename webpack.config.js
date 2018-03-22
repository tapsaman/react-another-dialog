const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

/* BUG:
webpack-dev-server DOES NOT hot reload @imported less-files,
only "parents" included in scenes.
*/

const extractLess = new ExtractTextPlugin({
    filename: "[name].css"
});

module.exports = {

	mode: 'development',

	entry: 
	{
		"another-dialog": "./src/AnotherDialog.jsx",
		style_prompt: "./src/AnotherDialog.less",
		example: "./src/example.jsx",
		style_example: "./src/example.less"
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				use: [{
					loader: "style-loader"
				},
				{
					loader: "css-loader"
				}]
			},
			{
				test: /\.less$/,
				use: extractLess.extract(
				{
					use: [
					/*{
						loader: "style-loader"
					},*/
					{
						loader: "css-loader",
						options: { url: false }
					},
					{
						loader: "less-loader",
						options: {
							// define paths for @imports
							// because using webpack's resolver tries to
							// look up @import web urls as relative file paths
							paths: ["src"],
							// without this @imported less-file urls will 
							// for some reason be changed to 
							// '../../../' etc. '/src/'
							relativeUrls: false,

							//env: "production"
						}

					}]
				})
			}]
	},

	resolve: {
		modules: ["src", "node_modules"],
		extensions: ['.js', '.jsx']
	},

	output: {
		path: __dirname + '/dev',
		publicPath: '/',
		filename: '[name].js',
	},

	devServer: {
		contentBase: './dev',
		hot: true
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		extractLess
	]
};