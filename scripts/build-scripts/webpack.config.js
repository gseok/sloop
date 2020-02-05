/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
const path = require('path');

const rootPath = path.resolve(__dirname, '..', '..');

module.exports = (env) => {
  if (!env || !env.target || !env.phase) {
    console.error('build target is not setup in webpack env option');
    return;
  }
  const { target, phase } = env;
  console.log('build target >', target);
  console.log('build phase >', phase);

  // preload .env
  const dotEnv = require('dotenv').config({
    path: path.resolve(rootPath, `environments/.env.phase.${phase}`),
  });
  if (dotEnv.error) {
    throw dotEnv.error;
  }
  console.log('build enviroments >', dotEnv.parsed);

  // load target config
  const targetConf = require(path.resolve(__dirname, `webpack.config.${target}.js`));
  return targetConf({ ...env, ...dotEnv.parsed });
};
