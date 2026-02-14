import { Args } from "../../../dist/cmd.js";

let cli = new Args;

// bun run test/usage/args/custom/array.js --option 1 2 3
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