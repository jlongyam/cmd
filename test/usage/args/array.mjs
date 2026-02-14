import { Args } from "../../../dist/cmd.mjs";

let cli = new Args;

// bun run test/usage/args/array.mjs  --option 1 2 3
/*

  args: {
    method: undefined,
    arguments: [],
  },
  flags: {
    option: [ 1, 2, 3 ],
  },
}
*/
console.log(cli);