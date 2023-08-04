const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { GenerateSW, InjectManifest } = require('workbox-webpack-plugin');

const is_prod = process.env.NODE_ENV === 'production';

const plugins = [
  new HtmlWebpackPlugin({
    title: 'PWA Text Editor',
    template: './index.html'
  }),
  new WebpackPwaManifest({
    name: 'PWA Text Editor',
    short_name: 'TextEditor',
    description: 'A Progressive Web App for text editing!',
    background_color: '#ffffff',
    theme_color: '#35ae9b',
    icons: [
      {
        src: path.resolve('src/images/logo.png'),
        sizes: [96, 128, 192, 256, 384, 512]
      },
    ],
  }),
];

if (is_prod) {
  plugins.push(new GenerateSW());
  plugins.push(new InjectManifest({
    swSrc: './src-sw.js', 
    swDest: 'service-worker.js',
  }));
}

module.exports = () => {
  return {
    mode: is_prod ? 'production' : 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'ie 9' }]
              ]
            }
          }
        },
      ],
    },
  };
};