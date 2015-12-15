/* global module, process, __dirname, __filename */
'use strict';

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { ProvidePlugin } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';

class DefaultWebpackConfig {
  constructor() {
    this.configurePaths();
    this.configureModule();
    this.configureLoaders();
    this.configurePlugins();
  }


  configurePaths() {
    this.entry = {
      'client': path.resolve(__dirname, 'src', 'client')
    };

    this.output = {
      path: path.resolve(__dirname, 'dist'),
      filename: '/js/[name].js'
    };
  }

  configureModule() {
    this.module = {
      loaders: this.configureLoaders()
    };
  }

  configureLoaders() {
    return [
      this.configureShaderLoader(),
      this.configureJsonLoader(),
      this.configureLessLoader(),
      this.configureImageLoader(),
      this.configureBabelLoader()
    ];
  }

  configureShaderLoader() {
    return {
      test: /\.glsl$/,
      loader: 'raw'
    };
  }

  configureJsonLoader() {
    return {
      test: /\.json$/,
      loader: 'json'
    };
  }

  configureLessLoader() {
    return {
      test: /\.less$/,
      loader: 'style?sourceMap!css?sourceMap!less?sourceMap'
    };
  }

  configureImageLoader() {
    return {
      test: /\.(woff2?|ttf|eot|svg|png|jpg|jpeg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "file-loader?name=/images/[name]-[md5:hash:base62:8].[ext]"
    }
  }

  configureBabelLoader() {
    return {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: path.join(__dirname, 'node_modules/babel-loader/index.js'),
      query: {
        stage: 0,
        optional: ['runtime']
      }
    };
  }


  configurePlugins() {
    this.plugins = [
      this.configureHtmlPlugin(),
      this.configureProivdePlugin(),
      new CopyWebpackPlugin([{ from: 'src/client/images/ogml-image.png', to: '/images/ogml-image.png' }, { from: 'src/client/images/icon.jpg', to: '/images/icon.jpg' }])
    ];
  }

  configureHtmlPlugin() {
    return new HtmlWebpackPlugin({
      title: 'Grexie Gems',
      inject: false,
      template: 'src/client/index.html'
    });
  }

  configureProivdePlugin() {
    return new ProvidePlugin({
    });
  }

}

class TestWebpackConfig extends DefaultWebpackConfig {

}


class DevelopmentWebpackConfig extends DefaultWebpackConfig {

}

class ProductionWebpackConfig extends DefaultWebpackConfig {

}

module.exports = new ({
  'test': TestWebpackConfig,
  'development': DevelopmentWebpackConfig,
  'production': ProductionWebpackConfig
}[process.env.NODE_ENV || 'development'])();
