// 引入webpack
var webpack = require('webpack');

//引入文本抽离插件
var ExtractTextPlugin = require('extract-text-webpack-plugin');

//引入html生成插件
var HtmlWebpackPlugin = require('html-webpack-plugin');

var outputDir = '';
var hashvalue = [];

if (process.env.NODE_ENV==='dev') {
	outputDir = '/build/dev';
}else{
	outputDir = '/build/prod';
	hashvalue = [{chunkhash:7}];
}
var public = {
	//入口
	entry: {
		'scripts/app': './src/scripts/app.js',
		'scripts/search': './src/scripts/search.js'
	},

	//出口
	output: {
		filename: '[name]'+hashvalue+'.js',
		path: __dirname + outputDir
	},

	
	//source-map
	devtool: 'source-map',
	
	//别名配置
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.js'
		}
	},
	//配置模块
	module: {
		rules: [
			//解析ES6+，（preset-env在.balbelcr文件里配置）
			{
				test: /\.js$/,
				exclude: /node_modules/,

				use: [{
					loader: 'babel-loader'
				}]
			},
			//加载css
			{
				test: /\.css$/,
				use: [{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					}
				]
			},
			//加载scss
			{
				test: /\.scss$/,
				use:
					/*[
						{loader:'style-loader'},
						{loader:'css-loader'},
						{loader:'sass-loader'}
					]*/
					//加载用插件抽离
					ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: ['css-loader', 'sass-loader']
					})
			},
			// 加载图片
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 1000,
					name: 'media/images/[name]'+hashvalue+'.[ext]'
				}
			},

			// 加载媒体文件
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'media/mp4/[name]'+hashvalue+'.[ext]'
				}
			},

			// 加载iconfont
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'media/iconfont/[name]'+hashvalue+'.[ext]'
				}
			}
		]
	},
	
	//配置插件
	plugins: [
		new ExtractTextPlugin({
			//抽离以后出口的文件名
			//filename: '[app].css'
			//filename: '[name].css',
			filename: (getPath) => {
				return getPath('[name]'+hashvalue+'.css').replace('scripts', 'styles')
			},
			allChunks: true

		}),
		new HtmlWebpackPlugin({

			template: './src/index.html',
			filename: 'index.html',
			chunks: ['scripts/app']
		}),
		new HtmlWebpackPlugin({

			template: './src/search.html',
			filename: 'search.html',
			chunks: ['scripts/search']
		}),
		/*new webpack.optimize.UglifyJsPlugin({
			compress:{
				warnings: false
			},
			output: {
				comments: false
			}
		})*/
	]
	
}
var devenv = {
	
	
	//开启webpack服务器
	devServer: {
		host: 'localhost',
		port: 4000,
		contentBase: __dirname + '/build/dev',
		noInfo: true,
		proxy:{
			'/^api/': {
				target: 'https://api.douban.com/',
				changeOrigin: true,
				pathRewirte:{
					'api':''
				}
			},
			'/^vip/':{
				target: 'http://localhost:9000/',
				changeOrigin: true,
				pathRewrite:{
					'vip':''
				}
			}
		}
		
	}

}

if (process.env.NODE_ENV==='dev') {
	module.exports = Object.assign({}, public, devenv);
}else{
	module.exports = public;
}
