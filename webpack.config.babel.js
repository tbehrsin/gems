/* global module, process, __dirname, __filename */
'use strict';

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { ProvidePlugin } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { sync as globSync } from 'glob';

class DefaultWebpackConfig {
  constructor() {
    this.configurePaths();
    this.configureModule();
    this.configureLoaders();
    this.configurePlugins();
  }


  configurePaths() {
    this.entry = {
      'client': path.resolve(__dirname, 'src', 'client'),
      'loader': path.resolve(__dirname, 'src', 'loader')
    };

    globSync(path.resolve(__dirname, 'src', 'client', 'levels', 'level-*.js')).forEach(p => {
      let name = path.basename(p, '.js');
      this.entry[name] = p;
    });

    this.output = {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].js',
      publicPath: 'http://localhost:3000'
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
      loader: 'raw-loader'
    };
  }

  configureJsonLoader() {
    return {
      test: /\.json$/,
      loader: 'json-loader'
    };
  }

  configureLessLoader() {
    return {
      test: /\.less$/,
      loader: 'style-loader?sourceMap!css-loader?sourceMap!less-loader?sourceMap'
    };
  }

  configureImageLoader() {
    return {
      test: /\.(woff2?|ttf|eot|svg|png|jpg|jpeg|m4a|mp3)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "file-loader?name=/images/[name]-[md5:hash:base62:8].[ext]"
    }
  }

  configureBabelLoader() {
    return {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader'
    };
  }


  configurePlugins() {
    this.plugins = [
      this.configureHtmlPlugin(),
      this.configureProivdePlugin(),
      new CopyWebpackPlugin([{ from: 'src/client/images/ogml-image.jpg', to: '/images/ogml-image.jpg' }, { from: 'src/client/images/icon.jpg', to: '/images/icon.jpg' }])
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
  constructor() {
    super();
    this.output.publicPath = 'http://localhost:3000';
  }
}

class ProductionWebpackConfig extends DefaultWebpackConfig {
  constructor() {
    super();
    this.output.publicPath = 'https://gems.github.io';
  }
}

module.exports = new ({
  'test': TestWebpackConfig,
  'development': DevelopmentWebpackConfig,
  'production': ProductionWebpackConfig
}[process.env.NODE_ENV || 'development'])();
