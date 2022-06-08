/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlInlineScriptWebpackPlugin = require('html-inline-script-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { ProvidePlugin } = require('webpack')

module.exports = (env, argv) =>
  /** @type {import('webpack').Configuration} */
  ({
    mode: argv.mode === 'production' ? 'production' : 'development',
    devtool: argv.mode === 'production' ? false : 'inline-source-map',
    entry: {
      code: './src/code.ts',
      ui: './src/ui/main.tsx'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader'
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { sourceMap: true } }
          ]
        },
        {
          test: /\.inline.svg$/,
          use: '@svgr/webpack'
        },
        {
          test: /\.jpe?g$|\.gif$|\.png$|^(?!.*\.inline\.svg$).*\.svg$/,
          type: 'asset/inline'
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    plugins: [
      new ProvidePlugin({
        ts: 'ts'
      }),
      new HtmlWebpackPlugin({
        template: './src/ui/index.html',
        filename: 'ui.html',
        inject: 'body',
        inlineSource: '.(js)$',
        chunks: ['ui'],
        cache: false
      }),
      new HtmlInlineScriptWebpackPlugin([/ui.js$/])
    ],
    externals: {
      ts: 'ts'
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            sourceMap: false,
            warnings: false,
            compress: {
              pure_funcs: ['console.log', 'console.error', 'console.warn']
            },
            output: {
              comments: /@license/i
            }
          }
        })
      ]
    }
  })
