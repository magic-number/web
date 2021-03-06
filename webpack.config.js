const path = require('path');
const Html = require('html-webpack-plugin');
const pkg = require('./package.json');

const Setting = {
  common: 'common',
  ...process.env,
};

const setAlias = (wbpCfg, k, uri) => {
  wbpCfg.resolve.alias[k] = path.resolve(__dirname, uri);
};

const config = {
  mode: 'development',
  entry: {},
  devtool: Setting.SOURCE_MAP === 'true' ? 'source-map' : false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
        ],

      },
      {
        test: /\.less$/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'node_modules'),
        ],
        use: [{
          loader: 'style-loader', // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader',
          options: {
            modifyVars: pkg.theme,
            javascriptEnabled: true,
          },
        }],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
        },
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192',
      },
    ],
  },
  plugins: [],
  resolve: {
    alias: {
    },
  },
  optimization: {
    minimize: Setting.NODE_ENV === 'production',
    splitChunks: {
      cacheGroups: {
        commons: {
          name: Setting.common,
          chunks: 'initial',
          minChunks: 2,
        },
      },
    },
  },
};

setAlias(config, 'UTIL', './src/util');
setAlias(config, 'FETCH', './src/service/rpc');


if (Setting.NODE_ENV === 'production' || Setting.NODE_ENV === 'analyze') {
  config.externals = {
    react: 'React',
    'react-dom': 'ReactDOM',
  };

  // eslint-disable-next-line global-require
  const Uglify = require('uglifyjs-webpack-plugin');
  config.plugins.push(new Uglify({
    uglifyOptions: {
      compress: true,
      output: {
        // 最紧凑的输出
        beautify: false,
        // 删除所有的注释
        comments: false,
      },
    },
  }));
}

if (Setting.ANALYZE === 'true') {
  // eslint-disable-next-line global-require
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  config.plugins.push(new BundleAnalyzerPlugin());
}

Object.keys(pkg.entry).forEach((k) => {
  const { main, title } = pkg.entry[k];
  config.entry[k] = main;
  config.plugins.push(new Html({
    inject: true,
    title,
    env: Setting.NODE_ENV,
    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
    template: 'src/template.ejs',
    filename: `${k}.html`,
    chunks: [k, Setting.common],
    minify: Setting.NODE_ENV === 'production' || Setting.NODE_ENV === 'analyze' ? {
      removeComments: true,
    } : false,
  }));
});

config.devServer = {
  host: '0.0.0.0',
  open: true,
};

module.exports = config;
