import path from 'path';
import typescript from 'rollup-plugin-typescript2';

//const masterVersion = require('./package.json').version;
const packagesDir = path.resolve(__dirname, 'packages/@auojs');
const packageDir = path.resolve(packagesDir, process.env.TARGET);
const name = path.basename(packageDir);
const resolve = (p) => path.resolve(packageDir, p);
const pkg = require(resolve(`package.json`));
const packageOptions = pkg.buildOptions || {};

const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`
  },
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`,
    exports: 'auto'
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`
  },

  // runtime-only builds, for main "vue" package only
  'esm-bundler-runtime': {
    file: resolve(`dist/${name}.runtime.esm-bundler.js`),
    format: `es`
  },
  'esm-browser-runtime': {
    file: resolve(`dist/${name}.runtime.esm-browser.js`),
    format: 'es'
  },
  'global-runtime': {
    file: resolve(`dist/${name}.runtime.global.js`),
    format: 'iife'
  }
};

const defaultFormats = ['esm-bundler', 'cjs'];
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',');
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats;
const packageConfigs = packageFormats.map((format) => createConfig(format, outputConfigs[format]));

export default packageConfigs;

function createConfig(format, output, plugins = []) {
  const entryFile = `src/index.ts`;

  const nodePlugins =
    packageOptions.enableNonBrowserBranches && format !== 'cjs'
      ? [
          require('@rollup/plugin-node-resolve').nodeResolve({
            preferBuiltins: true
          }),
          require('@rollup/plugin-commonjs')({
            sourceMap: false
          }),
          require('rollup-plugin-node-builtins')(),
          require('rollup-plugin-node-globals')()
        ]
      : [];

  if (packageOptions.name) {
    output.name = packageOptions.name;
  }

  const tsPlugin = typescript({
    check: true,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    // cacheRoot: true,
    tsconfigOverride: {
      compilerOptions: {
        // sourceMap: true,
        // declaration: true
        // declarationMap: true
      },
      include: [resolve('src/**/*.ts')],
      exclude: ['**/tests']
    }
  });

  return {
    input: resolve(entryFile),
    output,
    plugins: [tsPlugin, ...nodePlugins, ...plugins]
  };
}
