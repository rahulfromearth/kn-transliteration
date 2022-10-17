const path = require('path');

// https://stackoverflow.com/questions/67289563/how-do-i-get-readable-javascript-files-in-the-development-mode-of-webpack

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    devtool: 'eval-source-map',
    module: {
        rules: [
            // convert Typescript to Javascript
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            // convert Modern Javascript to Browser compatible JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        // https://stackoverflow.com/a/44620578
        publicPath: "/dist/",
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
    },
};