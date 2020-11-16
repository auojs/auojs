import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { fs as mfs } from 'memfs';

const baseConfig: webpack.Configuration = {
  mode: 'development',
  devtool: false,
  output: {
    path: '/',
    filename: 'test.build.js'
  },
  resolve: {
    alias: {}
  },
  resolveLoader: {
    alias: {
      'vue-docs-loader': require.resolve('../src/index.ts')
    }
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: 'vue-docs-loader'
      }
    ]
  }
};

type BundleOptions = webpack.Configuration & {
  modify?: (config: webpack.Configuration) => void;
  suppressJSDOMConsole?: boolean;
};

export function bundle(options: BundleOptions) {
  let config: BundleOptions = merge({}, baseConfig, options);

  if (typeof config.entry === 'string') {
    const file = config.entry;
    config = merge(config, {
      entry: require.resolve('./fixtures/entry'),
      resolve: {
        alias: {
          '~target': path.resolve(__dirname, './fixtures', file)
        }
      }
    });
  }

  const webpackCompiler = webpack(config);

  webpackCompiler.outputFileSystem = Object.assign(
    {
      join: path.join.bind(path)
    },
    mfs
  );

  return new Promise((resolve, reject) => {
    webpackCompiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          code: mfs.readFileSync('/test.build.js').toString(),
          stats
        });
      }
    });
  });
}
