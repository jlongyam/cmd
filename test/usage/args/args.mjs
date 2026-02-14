import { Args } from "../../../dist/cmd.mjs";

let cli = new Args;
// bun run test/usage/args/args.mjs array length
/*
{
  args: {
    method: "array",
    arguments: [ "length" ],
  },
  flags: {},
}
*/
// bun run test/usage/args/args.mjs array insert -o 0 'new'
/*
{
  args: {
    method: "array",
    arguments: [ "insert" ],
  },
  flags: {
    option: [ 0, "new" ],
  },
}
*/
// bun run test/usage/args/args.mjs array insert -o 0 'new' --force
/*
{
  args: {
    method: "array",
    arguments: [ "insert" ],
  },
  flags: {
    option: [ 0, "new" ],
    force: true,
  },
}
*/
console.log(cli)