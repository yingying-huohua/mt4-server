const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = env => {
    console.log('build: ', getPackageMode()); // true
    console.debug('environment:', getEnvironment());

    return {
        mode: getPackageMode(),
        entry: `./src/server.ts`,
        target: 'node',
        output: {
            filename: 'bootstrap',
            path: path.resolve(__dirname, `../dist`),
            libraryTarget: "commonjs"
        },
        externals: [
            /^[a-z\-0-9]+$/ // Ignore node_modules folder
        ],
        resolve: {
            // Add in `.ts` and `.tsx` as a resolvable extension.
            extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.css', '.ico','jpeg','.png','.less'],
            modules: [
                `./node_modules`,
                'node_modules'
            ]
        },
        plugins: [
            new webpack.ProgressPlugin(),
            new CopyWebpackPlugin([
                {from:'./views/**/*',  to:'./' },
                {from:'./public/**/*', to:'./' },
            ]),
            new webpack.NormalModuleReplacementPlugin(/\.\/environment\.dev/, `./environment.${getEnvironment()}`)
        ],

        module: {
            rules: [{
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                    }
                ]
            }]
        }
    };

    /**
     * 获取打包模式
     * @returns {string}
     */
    function getPackageMode() {
        let mode = 'development'
        if (env.build) {
            mode = 'production'
        }
        return mode;
    }

    function getEnvironment() {
        if (env.test) {
           return 'test';
        }

        if (env.prod) {
            return 'prod';
        }

        return 'dev';
    }
};
