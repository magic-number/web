const path = require('path');
const html = require('html-webpack-plugin');
const pkg = require('./package.json')

const Setting = {
    common: 'common',
    ... process.env
}

const setAlias = (wbpCfg, k, uri) => {
    wbpCfg.resolve.alias[k] = path.resolve(__dirname, uri)
}

const config = {
    mode: 'development',
    entry: {},
    devtool: Setting.SOURCE_MAP === 'true' ? 'source-map' : false,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js'
    },
    module: {
      rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader' // translates CSS into CommonJS
                    }
                ],
                
            },
            {
                test: /\.less$/,
                include: [
                    path.join(__dirname, 'src'),
                    path.join(__dirname, 'node_modules'),
                ],
                use: [{
                  loader: 'style-loader' // creates style nodes from JS strings
                }, {
                  loader: 'css-loader' // translates CSS into CommonJS
                }, {
                  loader: 'less-loader', options: {
                    modifyVars: pkg.theme,
                    javascriptEnabled: true,
                  },
                }]
              },
            {
                test: /\.jsx?$/,
                // include: [path.resolve(__dirname, 'src'), fs.realpathSync(path.resolve(__dirname, './node_modules/react-svg-joystick/src'))],
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
    　　　　{
    　　　　　　test: /\.(png|jpg)$/,
    　　　　　　loader: 'url-loader?limit=8192'
    　　　　}
        ]
    },
    plugins: [],
    resolve: {
        alias: { }
    },
    optimization: {
        minimize: Setting.NODE_ENV === 'production',
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: Setting.common,
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    }
}

setAlias(config, 'FETCH', Setting.MOCK === 'true' ? './src/service/mock' : './src/service/rpc')
setAlias(config, 'UTIL', './src/util')


if (Setting.NODE_ENV === 'production' || Setting.NODE_ENV === 'analyze') {
    config.externals = {
        react: 'React',
        'react-dom': 'ReactDOM'
    }
    
    const uglify = require('uglifyjs-webpack-plugin')
    config.plugins.push(new uglify({
        uglifyOptions: {
            compress: true,
            output: {
                // 最紧凑的输出
                beautify: false,
                // 删除所有的注释
                comments: false,
            }
        },
    }))

}

if (Setting.ANALYZE === 'true') {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    config.plugins.push(new BundleAnalyzerPlugin())
}

Object.keys(pkg.entry).forEach((k) => {
    const { main, title } = pkg.entry[k]
    config.entry[k] = main
    config.plugins.push(new html({
        inject: true,
        title: title,
        env: Setting.NODE_ENV,
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        template: 'src/template.ejs',
        filename: `${k}.html`,
        chunks: [k, Setting.common],
        minify: Setting.NODE_ENV === 'production' || Setting.NODE_ENV === 'analyze' ? {
            removeComments: true,
        } : false,
    }))
})

config.devServer = {
    host: "0.0.0.0",
    open: true
}

module.exports = config