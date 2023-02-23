const path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, '/src/provenanceSetup.ts'),
    output: {
        filename: 'bundle2.js',
        path: __dirname,
        libraryTarget: 'umd',
        library: 'EntryPoint',
        umdNamedDefine: true,
        libraryExport: 'default'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};
