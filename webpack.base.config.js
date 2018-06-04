const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// module.exports = {
let webpackConfig = {
    // 入口
    entry: {
        main: './src/main-vux',
        vendors: './src/vendors-vux'
    },
    // 加载器
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        less: ExtractTextPlugin.extract({
                            use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                            fallback: 'vue-style-loader'
                        }),
                        css: ExtractTextPlugin.extract({
                            use: ['css-loader', 'autoprefixer-loader', 'less-loader'],
                            fallback: 'vue-style-loader'
                        })
                    },
                    postcss: [require('postcss-px2rem')({remUnit: 100})]
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'less-loader',
                    'autoprefixer-loader',
                    'postcss-loader']
            },
            /*{
                test: /\.css$/,
                // use: [{
                //     loader: 'style-loader|css-loader|postcss-loader',
                //     options: {
                //         postcss: [
                //             require('autoprefixer-loader')
                //         ]
                //     }
                // }],

                use: [
                    'style-loader',
                    'less-loader',
                    'autoprefixer-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },

                    {
                        loader: 'postcss-loader'
                    }
                ]
            },*/
            // {
            //     test: /\.css$/,
            //     loader: 'style-loader!css-loader!postcss-loader',
            // },
            // {
            //     test: /\.css$/,
            //     use: ExtractTextPlugin.extract({
            //         use: ['css-loader?minimize', 'autoprefixer-loader', 'postcss-loader'],
            //         fallback: 'style-loader'
            //     })
            // },
            {
                test: /\.less/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'autoprefixer-loader', 'less-loader'],
                    fallback: 'style-loader'
                })
            },
            //解析.scss文件,对于用 import 或 require 引入的sass文件进行加载，以及<style lang="sass">...</style>声明的内部样式进行加载
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'autoprefixer-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader',
                // options: {
                //     root: resolve(__dirname, 'src'),
                //     attrs: ['img:src', 'link:href']
                // }
            },
            // {
            //     test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
            //     loader: 'url-loader?limit=1024'
            // },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                exclude: /favicon\.png$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            },
            {
                test: /favicon\.png$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash]'
                    }
                }]
            },
        ]
    },
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['.js', '.vue'],
        // 别名，可以直接使用别名来代表设定的路径以及其他
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            '~': resolve(__dirname, 'src'),
            // 'bootstrap': resolve(__dirname, 'node_modules/bootstrap/dist'),
        }
    },
};

// module.exports = webpackConfig;


//vux : 1
const vuxLoader = require('vux-loader');
//vux : 2
module.exports = vuxLoader.merge(webpackConfig, {
    plugins: ['vux-ui', 'progress-bar', 'duplicate-style']
});
