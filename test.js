/* eslint-env node */

const { exec } = require('child_process');
const { kill } = require('process');
const { get } = require('http');

async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function cmd(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);

      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function main() {
  console.log('$ ember server');
  let server = exec('./node_modules/.bin/ember server', (error, stdout, stderr) => {
    console.log({ error, stdout, stderr });
  });

  for (;;) {
    try {
      console.log('$ curl http://localhost:4200/');
      await new Promise((resolve, reject) => {
        get('http://localhost:4200/', resolve).on('error', reject);
      });
      break;
    } catch {
      // ignore
      console.log('$ sleep 1');
      await sleep(1000);
    }
  }

  console.log(`$ ps -f`);
  await cmd('ps -f');

  console.log(`$ lsof -i:4200`);
  await cmd('lsof -i:4200');

  console.log(`$ kill ${server.pid}`);
  server.kill();

  await new Promise(resolve => {
    server.on('exit', resolve);
  });

  for (;;) {
    try {
      kill(server.pid, 0);
    } catch {
      break;
    }
  }

  if (process.env.SLEEP) {
    console.log(`$ sleep ${process.env.SLEEP}`);
    await sleep(Number(process.env.SLEEP) * 1000);
  }

  console.log(`$ ps -f`);
  await cmd('ps -f');

  console.log(`$ lsof -i:4200`);
  await cmd('lsof -i:4200');

  let server2;

  console.log('$ ember server');
  let p = new Promise((resolve, reject) => {
    server2 = exec('./node_modules/.bin/ember server', (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);

      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

  console.log(`$ sleep 10`);
  await sleep(10000);

  server2.kill();

  return p;
}

main().then(
  function onResolve() {
    process.exit(0);
  },
  function onReject(e) {
    console.error(e);
    process.exit(1);
  }
);
