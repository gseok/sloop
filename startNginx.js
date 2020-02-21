#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const { spawn } = require('child_process');

const confPath = `${__dirname}/nginx-conf/nginx.conf`;

const runCommand = (command, options) => {
  return new Promise((resolve, reject) => {
    const cProcess = spawn(command, options);

    cProcess.stdout.setEncoding('utf8');
    cProcess.stderr.setEncoding('utf8');
    cProcess.stdout.on('data', console.log);
    cProcess.stderr.on('data', console.error);
    cProcess.on('close', resolve);
    cProcess.on('error', reject);
  });
};

// start
(() => {
  runCommand('nginx', ['-s', 'quit'])
    .catch(() => console.log('There are no previous launched ngnix process'))
    .then(() => runCommand('nginx', ['-p', __dirname, '-c', confPath]));
})();
