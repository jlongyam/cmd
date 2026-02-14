import { Args, showHelp } from "../../../dist/cmd.mjs";

const cli = new Args();

if(cli.flags.help) {
  // bun run test/usage/showHelp/new.js file -h
  if(cli.args.method === 'file') {
    showHelp(cli, {
      method: {
        file: 'file <command>'
      },
      arguments: {
        create: 'create <path>',
        delete: 'delete <path>'
      }
    });
  }
  // bun run test/usage/showHelp/new.js folder -h
  else if(cli.args.method === 'folder') {
    showHelp(cli, {
      method: {
        folder: 'folder <command>'
      },
      arguments: {
        list: 'list <path>'
      }
    });
  }
  // bun run test/usage/showHelp/new.js -h
  else {
    showHelp(cli, {
      methods: ['file <command>', 'folder <command>']
    });
  }
}
else {
  console.log(cli)
}