# Cmd

JS Command utility

## Usage
<details name="usage"><summary>Install</summary>
<br>

### Deno

```js
import { Args, showHelp } from 'npm:@jlongyam/cmd';
```

- optional

```sh
deno add 'npm:@jlongyam/cmd'
```

```js
import { Args, showHelp } from '@jlongyam/cmd';
```

### NPM

```sh
npm i @jlongyam/cmd
```

### Bun

```sh
bun add @jlongyam/cmd
```

</details>
<details name="usage"><summary>Basic</summary>
<br>

File: `cli.js`

```js
import { Args } from "@jlongyam/cmd";

const cli = new Args();

console.log(cli);
```

Use:

```txt
node cli.js array length
bun run cli.js array length
deno run cli.js array length
```

Output:

```js
{
  args: {
    method: "array",
    arguments: [ "length" ],
  },
  flags: {},
}
```

</details>
<details name="usage"><summary>Advance</summary>
<br>

File: `cli.js`

```js
import { Args } from "@jlongyam/cmd";

let cli = new Args({
  alias: { f: 'file' },
  array: ['file']
});

console.log(cli);
```
Use:

```txt
bun run test/usage/args/custom/array_alias.js -f a.js b.js
```

Output:

```js
{
  args: {
    method: undefined,
    arguments: [],
  },
  flags: {
    file: [ "a.js", "b.js" ],
  },
}
```

</details>

## More

See more usage in __test/usage__

## Note

Tested:

- node v5.12.0
- npm v3.8.6

Legacy node require `Array.includes` polyfill

## Related

- [polyfill](https://github.com/jlongyam/polyfill)

