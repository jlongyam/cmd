import { Args } from '../../../dist/cmd.js';

const cli = new Args();
// bun test/usage/args/tail.js file read -i file.js -- npm run dev -w
/*
{
  args: {
    method: "file",
    arguments: [ "read" ],
  },
  flags: {
    i: "file.js",
  },
  tail: {
    exec: "npm",
    command: "run dev -w",
  },
}
*/
console.log(cli);