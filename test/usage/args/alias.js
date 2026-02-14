import { Args } from "../../../dist/cmd.mjs";

let cli = new Args;

// bun run test/usage/args/alias.js --version
// bun run test/usage/args/alias.js -v
/*
{
  args: {
    method: undefined,
    arguments: [],
  },
  flags: {
    version: true,
  },
}
*/

// bun run test/usage/args/alias.js --help
// bun run test/usage/args/alias.js -h
/*
{
  args: {
    method: undefined,
    arguments: [],
  },
  flags: {
    help: true,
  },
}
*/

// bun run test/usage/args/alias.js --option a.js b.js
// bun run test/usage/args/alias.js -o a.js b.js
/*
{
  args: {
    method: undefined,
    arguments: [],
  },
  flags: {
    option: [ "a.js", "b.js" ],
  },
}
*/
console.log(cli);