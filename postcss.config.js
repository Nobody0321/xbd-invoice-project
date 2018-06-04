module.exports = {
    plugins: [
        /*require('autoprefixer-loader')({
            browsers: ["last 5 versions"]
        })*/
        require('postcss-px2rem')({remUnit: 100})
    ]
}
