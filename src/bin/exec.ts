import { exec } from 'child_process';

const command = process.argv[2];

console.log(`node exec ${command}`);

exec(command, (error, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);

  if (error) {
    console.log();
    console.log(`node exec ${command} failed`);
    console.log(error);
    console.log();
  }
});
