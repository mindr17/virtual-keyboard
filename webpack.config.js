const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = (args) => {
  const { useTs } = args;
  let entryVar = '';
  if (useTs) {
    entryVar = {
      index: './src-ts/index.ts',
    };
  } else {
    entryVar = {
      index: './src/index.js',
    };
  }

  return {
    mode: 'development',
    entry: entryVar,
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: { configFile: 'tsconfig.json' },
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'defaults' }]],
            },
          },
        },
        {
          test: /\.(json)$/,
          type: 'asset/source',
        },
        {
          test: /\.(jpe?g|png|gif|svg|webp|ico|xml)$/,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: true,
        chunks: ['index'],
        filename: 'index.html',
      }),
    ],
    output: {
      filename: '[name].bundle.js',
      assetModuleFilename: '[path]/[name][ext]',
      chunkFilename: '[id].[chunkhash].js',
      path: path.resolve(__dirname, 'dist/'),
      publicPath: 'auto',
      clean: true,
    },
  };
};

module.exports = config;
