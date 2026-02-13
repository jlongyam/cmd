import { Args } from "../../../dist/cmd.js";

let cli = new Args;
// bun run test/usage/args/new.js
/*
{
  args: {
    method: undefined,
    arguments: [],
  },
  flags: {},
}
*/
console.log(cli);