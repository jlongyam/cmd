#!/usr/bin/env node

const { SimpleCLI } = require('../cli-framework.js');

const cli = new SimpleCLI({
  name: 'my-app',
  version: '1.0.0',
  description: 'My awesome CLI application'
});


// Add a command
cli
  .command('greet', { description: 'Greet someone' })
  .argument('name', 'Person to greet')
  .option('-u, --uppercase', 'Use uppercase')
  .action((context) => {
    let message = `HI, ${context.args[0]}!`;
    if (context.options.uppercase) {
      message = message.toUpperCase();
    }
    console.log(message);
  });

// Run the CLI
cli.run();

