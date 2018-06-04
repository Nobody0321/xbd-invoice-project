const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
// const url = require('url');
const { resolve } = require('path');
const fs = require('fs');
const root_path = 'dist';
const public_path = '/dist/';

// 写入环境变量
fs.open('./src/config/env.js', 'w', function (err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer){});
});

module.exports = merge(webpackBaseConfig, {
    // devtool: '#source-map',
    devtool: '#eval-source-map',
    output: {
        path: resolve(__dirname, root_path),
        publicPath: public_path,
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },

    devServer: {
        // host: '127.0.0.1',
        // host: '10.0.0.22',
        // host: '192.168.66.199',
        host:'0.0.0.0',
        port: 8010,
        contentBase: "./",//本地服务器所加载的页面所在的目录

        //代理
        proxy: {
            /*'/api/': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/api': ''
                }
            },*/
            '/api/file': {
                target: 'https://ysbd-dev.xbdedu.cn',
                changeOrigin: true,
                secure: false,
            },
            '/wechatserver/api/': {
                target: 'https://ysbd-dev.xbdedu.cn',
                changeOrigin: true,
                secure: false,
            },
            /*
            '/wechatserver/api/*': {
                target: 'https://ysbd-dev.xbdedu.cn',
                changeOrigin: true,
             secure: false,
            },
            */
        },

        historyApiFallback: true,//不跳转
        // historyApiFallback: {
        //     index: url.parse(public_path).pathname
        // },
        inline: true, //实时刷新
        hot: false, //热部署
        compress: false, //压缩
        open: false //打开浏览器
    },

    plugins: [
        // 提取CSS
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        // 版权信息
        // new webpack.BannerPlugin("Copyrights (C) zuv inc."),
        // 热部署
        // new webpack.HotModuleReplacementPlugin(),
        // 提取第三方库
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.js'
        }),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: '"development"'
        //     }
        // }),
        // 构建html文件
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './src/templates/index.ejs',
            inject: false
        }),
        new webpack.ProvidePlugin({
            jQuery: "jquery",
            $: "jquery"
        }),
    ]
});
