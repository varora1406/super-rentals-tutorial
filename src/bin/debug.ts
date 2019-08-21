import { exec } from 'child_process';

console.log(`From debug.ts\n`);

console.log(`CWD: ${process.cwd()}\n`);

console.log(`ARGV:`);

for (let arg of process.argv) {
  console.log(`- ${arg}`);
}

console.log();

console.log('PATH:');

for (let path of process.env.PATH!.split(':')) {
  console.log(`- ${path}`);
}

console.log();

function which(command: string): void {
  exec(`which ${command}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`which ${command} failed`);
      console.log(stdout);
      console.log(stderr);
      console.log(error);
      console.log();
    }

    console.log(`which ${command}: ${stdout || stderr}`);
  });
}

which('volta');
which('node');
which('yarn');
which('npm');
which('ember');
