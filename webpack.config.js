// const path = require('path');
// var webpack = require('webpack');

// module.exports = {
//     entry: path.join(__dirname, '/src/provenanceSetup.ts'),
//     output: {
//         filename: 'bundle2.js',
//         path: __dirname,
//         libraryTarget: 'umd',
//         library: 'EntryPoint',
//         umdNamedDefine: true,
//         libraryExport: 'default'
//     },
//     plugins: [
//         // fix "process is not defined" error:
//         // (do "npm install process" before running the build)
//         new webpack.ProvidePlugin({
//           process: 'process/browser',
//         }),
    
//         new MiniCssExtractPlugin(),
    
//         // Add your plugins here
//         // Learn more about plugins from https://webpack.js.org/configuration/plugins/
//     ],
//     module: {
//         rules: [
//             {
//                 test: /\.tsx?$/,
//                 loader: "awesome-typescript-loader",
//                 exclude: /node_modules/,
//             },
//         ]
//     },
//     resolve: {
//         extensions: [".tsx", ".ts", ".js"]
//     },
// };

// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack')

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
    entry: path.join(__dirname, '/src/provenanceSetup.ts'),
    output: {
        path: __dirname,
        chunkFilename: 'bundle2.js',
        filename: 'bundle2.js',
        library: 'eTrack',
        libraryTarget: 'umd'
    },
    plugins: [
        // fix "process is not defined" error:
        // (do "npm install process" before running the build)
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),

        new MiniCssExtractPlugin(),

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
            test: /\.(ts|tsx)$/i,
            loader: "ts-loader",
            exclude: ["/node_modules/"],
            },
            {
            test: /\.css$/i,
            use: [stylesHandler, "css-loader"],
            },
            {
            test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
            type: "asset",
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
        fallback: {
            "fs": false,
            "tls": false,
            "net": false,
            "path": false,
            "zlib": false,
            "http": false,
            "https": false,
            "stream": false,
            "crypto": false,
            "url": false,
            "util": false,
            "buffer": false
        },
    },
    devtool:'source-map',
};

module.exports = () => {
    if (isProduction) {
    config.mode = "production";
    } else {
    config.mode = "development";
    }
    return config;
};
