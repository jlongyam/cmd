import { Args } from "../../../../dist/cmd.mjs";

let cli = new Args({
  alias: { f: 'file' },
  array: ['file']
});
// bun run test/usage/args/custom/array_alias.js -f a.js b.js
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