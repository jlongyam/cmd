import { Args } from "../../../../dist/cmd.mjs";

let cli = new Args({
  array: ['file']
});
// bun run test/usage/args/custom/array.mjs --file a.js b.js
/*
{
  args: {
    method: undefined,
    arguments: [],
  },
  flags: {
    file: [ "a.js", "b.js" ],
  },
}
*/
console.log(cli);