const path = require('path');
const WindiCSSWebpackPlugin = require('windicss-webpack-plugin');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const sassResourcesLoader = require('craco-sass-loader');
const CompressionPlugin = require('compression-webpack-plugin');
const CracoPluginScopedCss = require('craco-plugin-scoped-css');
const CracoAntDesignPlugin = require('craco-antd');

const resolve = (dir) => path.resolve(__dirname, dir);
const { REACT_APP_API_URL, NODE_ENV, REACT_APP_THEME_COLOR } = process.env;

module.exports = {
    style: {
        postcss: {
            mode: 'extends',
            loaderOptions: {
                postcssOptions: {
                    ident: 'postcss',
                    plugins: [['autoprefixer']],
                },
            },
        },
    },
    webpack: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
        alias: {
            '@': resolve('src'),
        },
        plugins: {
            add: [
                new WindiCSSWebpackPlugin({
                    virtualModulePath: 'src',
                }),
                new WebpackBar({
                    profile: true,
                    name: 'webpack',
                    color: 'green',
                }),
            ],
        },
        configure: (webpackConfig, { env, paths }) => {
            // 修改build的生成文件名称
            paths.appBuild = 'dist';
            webpackConfig.output = {
                ...webpackConfig.output,
                path: resolve('dist'),
                publicPath: '/',
                pathinfo: false,
            };

            if (NODE_ENV === 'production') {
                webpackConfig.plugins = webpackConfig.plugins.concat(
                    //开启Gzip
                    new CompressionPlugin({
                        algorithm: 'gzip',
                        threshold: 10240,
                        minRatio: 0.8,
                    }),
                );
                webpackConfig.optimization = {
                    ...webpackConfig.optimization,
                    //开启代码分割
                    splitChunks: {
                        minSize: 30000,
                        maxSize: 50000,
                        minChunks: 1,
                        maxAsyncRequests: 5,
                        maxInitialRequests: 3,
                        automaticNameDelimiter: '~',
                        cacheGroups: {
                            vendors: {
                                test: /[\\/]node_modules[\\/]/,
                                priority: -10,
                                chunks: 'all',
                                name(module, chunks, cacheGroupKey) {
                                    const moduleFileName = module
                                        .identifier()
                                        .split('/')
                                        .reduceRight((item) => item);
                                    const allChunksNames = chunks
                                        .map((item) => item.name)
                                        .join('~');
                                    return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
                                },
                            },
                            default: {
                                minChunks: 2,
                                priority: -20,
                                reuseExistingChunk: true,
                            },
                        },
                    },
                    runtimeChunk: {
                        name: (entrypoint) => `runtime-${entrypoint.name}`,
                    },
                };
            }

            return webpackConfig;
        },
    },
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeTheme: {
                    '@primary-color': REACT_APP_THEME_COLOR,
                },
            },
        },
        {
            plugin: sassResourcesLoader,
            options: {
                resources: './src/assets/scss/index.scss', //设置公共scss
            },
        },
        {
            plugin: CracoPluginScopedCss,
        },
    ],

    devServer: {
        port: 8000,
        hot: true,
        proxy: {
            '/api': {
                target: REACT_APP_API_URL,
                changeOrigin: true,
                logLevel: 'debug',
                headers: {
                    Cookie: '',
                },
                // pathRewrite: {
                //     '^/api': '',
                // },
            },
        },
    },
};
