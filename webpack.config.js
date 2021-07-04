const path = require('path');

module.exports = [
    'source-map'
].map(devtool => ({
    mode: 'production',
    entry: './src/POS.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'POS.js',
        library: 'Transbank',
        libraryTarget: 'window',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            }
        ]
    },
    devtool,
    optimization: {
        minimize: true
    }
}));