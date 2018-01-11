/* global __dirname module require*/
/* eslint comma-dangle: ["error", "never"] */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    // Tell Webpack which file kicks off our app.
    entry: path.resolve(__dirname, 'src/my-app.html'),
    // Tell Webpack to output our bundle to ./dist/bundle.js
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    // Tell Webpack which directories to look in to resolve import statements.
    // Normally Webpack will look in node_modules by default but since we’re overriding
    // the property we’ll need to tell it to look there in addition to the
    // bower_components folder.
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'bower_components')
        ]
    },
    devtool: 'inline-source-map',
    module: {
        rules: [{
                test: /\.html$/,
                use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: ['env'],
                            plugins: ['syntax-dynamic-import']
                        }
                    },
                    {
                        loader: 'polymer-webpack-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }]
            }
        ]
    },
    plugins: [
        // This plugin will generate an index.html file for us that can be used
        // by the Webpack dev server. We can give it a template file (written in EJS)
        // and it will handle injecting our bundle for us.
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.ejs'),
            inject: false
        }),
        // This plugin will copy files over for us without transforming them.
        // That's important because the custom-elements-es5-adapter.js MUST
        // remain in ES2015.
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'bower_components/webcomponentsjs/*.js'),
            to: 'bower_components/webcomponentsjs/[name].[ext]'
        }]),
        // Needed for app-indexedbd-mirror
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'bower_components/app-storage/app-indexeddb-mirror/*.js'),
            to: '[name].[ext]'
        }]),
        // Needed for firebase
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'bower_components/firebase/firebase-app.js'),
            to: 'bower_components/firebase/[name].[ext]'
        }]),
        // Copy manifest.json
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'manifest.json'),
            to: 'manifest.json'
        }]),
        // Copy images directory
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'images/'),
            to: 'images/'
        }]),
        new SWPrecacheWebpackPlugin({
            cacheId: 'genius-mirror',
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            minify: true,
            navigateFallback: '/index.html',
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
        }),
    ]
};