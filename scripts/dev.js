// rollup
const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const { targets: allTargets } = require('./utils');
const args = require('minimist')(process.argv.slice(2));

run();

async function run() {
  await buildAll(allTargets);
}

async function buildAll(targets) {
  for (const target of targets) {
    await build(target);
  }
}

async function build(target) {
  const pkgDir = path.resolve(`packages/${target}`);

  // 移除dist
  await fs.remove(`${pkgDir}/dist`);

  execa('rollup', ['-c', '--environment', [`TARGET:${target}`].filter(Boolean).join(',')], {
    stdio: 'inherit'
  });
}
