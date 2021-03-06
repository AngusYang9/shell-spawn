'use strict';

const { spawn } = require('child_process');

function shellSpawn (command = '', options = {}) {
  if (options.verbose) {
    console.log(command);
  }
  
  if (Array.isArray(command)) {
    command = command.join(';')
  }
  
  options = Object.assign({ env: process.env, cwd: process.cwd() }, options);
  
  const shell = process.platform === 'win32' ? { cmd: 'cmd', arg: '/C' } : { cmd: 'sh', arg: '-c' };
  
  return new Promise((resolve, reject) => {
    let child = spawn(shell.cmd, [shell.arg, command], options);
    
    let output = "";

    function toStdErr(data) {
      output += data;
      if (options.verbose) {
        console.warn(data.toString());
      }
    }

    function toStdOut(data) {
      output += data;
      if (options.verbose) {
        console.log(data.toString());
      }
    }

    child.stdout.on('data', toStdOut);
    child.stderr.on('data', toStdErr);
    child.on('error', reject);
    child.on('close', function(code) {
      if (code === 0) {
        resolve(output);
      } else {
        if (options.verbose) {
          console.warn(command + ' exited with exit code ' + code);
        }
        reject(new Error(output));
      }
    });
  });
};

module.exports = shellSpawn;
module.exports.shellSpawn = shellSpawn;
