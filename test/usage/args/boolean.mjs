import { Args } from "../../../dist/cmd.mjs";

let cli = new Args;
// bun run test/usage/args/boolean.mjs --force
/*
{
  args: {
    method: undefined,
    arguments: [],
  },
  flags: {
    force: true,
  },
}
*/
// bun run test/usage/args/boolean.mjs --debug
/*
{
  args: {
    method: undefined,
    arguments: [],
  },
  flags: {
    debug: true,
  },
}
*/
// bun run test/usage/args/boolean.mjs --logout --force
/*
{
  args: {
    method: undefined,
    arguments: [],
  },
  flags: {
    logout: true,
    force: true,
  },
}
*/
console.log(cli);