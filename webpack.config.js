const path = require('path');


module.exports = {
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 4444,
    },
    context: path.resolve(__dirname,'src'),
    mode: 'development',
    entry:{
      main:['@babel/polyfill', './index.js']
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname,'dist')
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}