#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const { spawn } = require('child_process');
const fs = require('fs');

const confPath = `${__dirname}/nginx-conf/nginx.conf`;

const nginxGuideMessage = `
sloop이 아닌 다른곳에서 구동한 nginx의 port중복등의 영향으로 nginx구동이 실패했습니다.
아래 명령등으로, nginx process을 확인하시고, config변경이나, sloop이 아닌곳에서 구동한 nginx을 직접 quit한 이후 재기동 해주세요

$ ps -ef | grep nginx | grep master

nginx의 master procss의 pid로 다음 명령어 실행하면 nginx가 kill됩나다.

$ kill -QUIT master-process-pid
`;

const getPid = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('.nginx.pid', 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const runCommand = (command, options) => {
  return new Promise((resolve, reject) => {
    const cProcess = spawn(command, options);
    let hasError = false;

    cProcess.stdout.setEncoding('utf8');
    cProcess.stderr.setEncoding('utf8');
    cProcess.stdout.on('data', console.log);
    cProcess.stderr.on('data', (data) => {
      console.error(data);
      if (!hasError && data.includes('nginx: [emerg]')) hasError = true;
    });
    cProcess.on('close', (data) => {
      if (hasError) return reject();
      return resolve(data);
    });
    cProcess.on('error', reject);
  });
};

// start
(() => {
  // NOTE: sloop의 nginx-conf로 구동된 sloop nginx process만 kill and re-start 한다.
  // 그외 다른 project에서 start한 nginx process는 kill하지 않음. 따라서 port가 중복일때 정상적으로 뜨지 않을 수 있음.
  getPid()
    .then((pid) => {
      console.log('Kill previous sloop nginx process', pid);
      process.kill(pid, 'SIGTERM');
    })
    .catch(() => console.log('There are no previous launched sloop ngnix process'))
    .then(() => {
      console.log('Start nginx process');
      return runCommand('nginx', ['-p', __dirname, '-c', confPath]).catch(() => {
        console.log(nginxGuideMessage);
      });
    });
})();
