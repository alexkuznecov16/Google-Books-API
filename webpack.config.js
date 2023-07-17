// ========================================== variables
const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

// ========================================== modules
module.exports = {
	//! basic settings
	mode,
	target,
	devtool,
	//! developer server settings
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'dist'),
		},
		port: 8080,
		open: true,
		hot: true,
	},
	//! entry files
	entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],

	//! output files
	output: {
		path: path.resolve(__dirname, 'dist'),
		clean: true,
		filename: '[name].[contenthash].js',
		assetModuleFilename: 'assets/[name][ext]',
	},
	module: {
		rules: [
			//! ========== html loader
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},

			//! ========== styles loader
			{
				test: /\.s?css$/i,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [require('postcss-preset-env')],
							},
						},
					},
					'sass-loader',
				],
			},

			//! ========== fonts
			{
				test: /\.ttf/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},
			//! ========== babel loader
			{
				test: /\.(?:js|mjs|cjs)$/i,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [['@babel/preset-env', {targets: 'defaults'}]],
					},
				},
			},
		],
	},
	// =============================== plugins
	plugins: [
		//! ========== html
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'index.html'),
		}),
		//! ========== css
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
		new ESLintPlugin(),
		new StylelintPlugin({
			files: 'src/index.scss',
		}),
		new CopyPlugin({
			patterns: [
				{from: './src/img', to: './assets'}, // Копирование всех файлов из папки src/img в dist/assets
			],
		}),
	],
	// =============================== optimizations
	optimization: {
		//! ========== code minimizer
		minimizer: ['...', new CssMinimizerPlugin()],
	},
};
