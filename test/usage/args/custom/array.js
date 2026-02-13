import { Args } from "../../../../dist/cmd.js";

let cli = new Args({
  array: ['file']
});
// bun run test/usage/args/custom/array.js --file a.js b.js
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