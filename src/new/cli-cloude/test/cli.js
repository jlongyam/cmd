#!/usr/bin/env node

/**
 * SimpleCLI - A lightweight JavaScript framework for building CLI applications
 */

class SimpleCLI {
  constructor(config = {}) {
    this.name = config.name || 'cli-app';
    this.version = config.version || '1.0.0';
    this.description = config.description || 'A CLI application';
    this.commands = new Map();
    this.globalOptions = new Map();
    this.middleware = [];
    this.defaultCommand = null;
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      dim: '\x1b[2m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m'
    };
  }

  // Add a command to the CLI
  command(name, config = {}) {
    const command = new Command(name, config, this);
    this.commands.set(name, command);
    return command;
  }

  // Add a global option
  option(flags, description, defaultValue = null) {
    const option = this.parseOptionFlags(flags);
    this.globalOptions.set(option.name, {
      ...option,
      description,
      defaultValue,
      global: true
    });
    return this;
  }

  // Add middleware
  use(fn) {
    this.middleware.push(fn);
    return this;
  }

  // Set default command
  default(commandName) {
    this.defaultCommand = commandName;
    return this;
  }

  // Parse option flags like "-v, --version"
  parseOptionFlags(flags) {
    const parts = flags.split(',').map(f => f.trim());
    let short = null;
    let long = null;
    let name = null;

    for (const part of parts) {
      if (part.startsWith('--')) {
        long = part;
        name = part.substring(2);
      } else if (part.startsWith('-')) {
        short = part;
        if (!name) name = part.substring(1);
      }
    }

    return { short, long, name: name || long?.substring(2) || short?.substring(1) };
  }

  // Parse command line arguments
  parseArgs(args = process.argv.slice(2)) {
    const result = {
      command: null,
      args: [],
      options: {}
    };

    // Set default values for global options
    for (const [name, option] of this.globalOptions) {
      if (option.defaultValue !== null) {
        result.options[name] = option.defaultValue;
      }
    }

    let i = 0;
    while (i < args.length) {
      const arg = args[i];

      if (arg.startsWith('--')) {
        // Long option
        const [optionName, optionValue] = arg.split('=');
        const name = optionName.substring(2);
        
        if (optionValue !== undefined) {
          result.options[name] = optionValue;
        } else if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
          result.options[name] = args[++i];
        } else {
          result.options[name] = true;
        }
      } else if (arg.startsWith('-') && arg.length > 1) {
        // Short option(s)
        const flags = arg.substring(1);
        for (let j = 0; j < flags.length; j++) {
          const flag = flags[j];
          if (j === flags.length - 1 && i + 1 < args.length && !args[i + 1].startsWith('-')) {
            result.options[flag] = args[++i];
          } else {
            result.options[flag] = true;
          }
        }
      } else {
        // Command or argument
        if (!result.command && this.commands.has(arg)) {
          result.command = arg;
        } else {
          result.args.push(arg);
        }
      }
      i++;
    }

    return result;
  }

  // Apply middleware
  async applyMiddleware(context) {
    for (const middleware of this.middleware) {
      await middleware(context);
    }
  }

  // Color text
  colorize(text, color) {
    if (!this.colors[color]) return text;
    return `${this.colors[color]}${text}${this.colors.reset}`;
  }

  // Log with colors
  log(text, color = null) {
    console.log(color ? this.colorize(text, color) : text);
  }

  // Error logging
  error(text) {
    console.error(this.colorize(`Error: ${text}`, 'red'));
  }

  // Generate help text
  generateHelp(commandName = null) {
    if (commandName && this.commands.has(commandName)) {
      return this.commands.get(commandName).generateHelp();
    }

    let help = `${this.colorize(this.name, 'bright')} v${this.version}\n`;
    help += `${this.description}\n\n`;
    
    help += `${this.colorize('Usage:', 'bright')}\n`;
    help += `  ${this.name} [command] [options]\n\n`;

    if (this.commands.size > 0) {
      help += `${this.colorize('Commands:', 'bright')}\n`;
      for (const [name, command] of this.commands) {
        const desc = command.description || 'No description';
        help += `  ${this.colorize(name.padEnd(15), 'cyan')} ${desc}\n`;
      }
      help += '\n';
    }

    if (this.globalOptions.size > 0) {
      help += `${this.colorize('Global Options:', 'bright')}\n`;
      for (const [name, option] of this.globalOptions) {
        const flags = [option.short, option.long].filter(Boolean).join(', ');
        help += `  ${this.colorize(flags.padEnd(15), 'yellow')} ${option.description}\n`;
      }
    }

    return help;
  }

  // Run the CLI
  async run(args = process.argv.slice(2)) {
    try {
      const parsed = this.parseArgs(args);
      
      // Handle version
      if (parsed.options.version || parsed.options.v) {
        this.log(this.version);
        return;
      }

      // Handle help
      if (parsed.options.help || parsed.options.h) {
        this.log(this.generateHelp(parsed.command));
        return;
      }

      // Determine command to run
      let commandName = parsed.command;
      if (!commandName) {
        commandName = this.defaultCommand;
      }

      if (!commandName) {
        this.log(this.generateHelp());
        return;
      }

      const command = this.commands.get(commandName);
      if (!command) {
        this.error(`Unknown command: ${commandName}`);
        process.exit(1);
      }

      // Create context
      const context = {
        command: commandName,
        args: parsed.args,
        options: parsed.options,
        cli: this
      };

      // Apply middleware
      await this.applyMiddleware(context);

      // Run command
      await command.run(context);
    } catch (error) {
      this.error(error.message);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

class Command {
  constructor(name, config, cli) {
    this.name = name;
    this.description = config.description || '';
    this.options = new Map();
    this.args = [];
    this.handler = config.handler || (() => {});
    this.cli = cli;
  }

  // Add option to command
  option(flags, description, defaultValue = null) {
    const option = this.cli.parseOptionFlags(flags);
    this.options.set(option.name, {
      ...option,
      description,
      defaultValue
    });
    return this;
  }

  // Add argument to command
  argument(name, description = '', required = true) {
    this.args.push({ name, description, required });
    return this;
  }

  // Set command handler
  action(handler) {
    this.handler = handler;
    return this;
  }

  // Generate help for this command
  generateHelp() {
    let help = `${this.cli.colorize(this.name, 'bright')}\n`;
    if (this.description) {
      help += `${this.description}\n\n`;
    }

    help += `${this.cli.colorize('Usage:', 'bright')}\n`;
    let usage = `  ${this.cli.name} ${this.name}`;
    
    if (this.args.length > 0) {
      for (const arg of this.args) {
        usage += arg.required ? ` <${arg.name}>` : ` [${arg.name}]`;
      }
    }
    
    if (this.options.size > 0) {
      usage += ' [options]';
    }
    
    help += `${usage}\n\n`;

    if (this.args.length > 0) {
      help += `${this.cli.colorize('Arguments:', 'bright')}\n`;
      for (const arg of this.args) {
        const name = arg.required ? `<${arg.name}>` : `[${arg.name}]`;
        help += `  ${this.cli.colorize(name.padEnd(15), 'cyan')} ${arg.description}\n`;
      }
      help += '\n';
    }

    if (this.options.size > 0) {
      help += `${this.cli.colorize('Options:', 'bright')}\n`;
      for (const [name, option] of this.options) {
        const flags = [option.short, option.long].filter(Boolean).join(', ');
        help += `  ${this.cli.colorize(flags.padEnd(15), 'yellow')} ${option.description}\n`;
      }
    }

    return help;
  }

  // Run the command
  async run(context) {
    // Validate required arguments
    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i];
      if (arg.required && !context.args[i]) {
        throw new Error(`Missing required argument: ${arg.name}`);
      }
    }

    // Set default values for command options
    for (const [name, option] of this.options) {
      if (!(name in context.options) && option.defaultValue !== null) {
        context.options[name] = option.defaultValue;
      }
    }

    await this.handler(context);
  }
}

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SimpleCLI, Command };
}

// Example usage
if (require.main === module) {
  const cli = new SimpleCLI({
    name: 'example-cli',
    version: '1.0.0',
    description: 'An example CLI application built with SimpleCLI'
  });

  // Global options
  cli
    .option('-v, --version', 'Show version')
    .option('-h, --help', 'Show help')
    .option('--verbose', 'Enable verbose output', false);

  // Add middleware for logging
  cli.use(async (context) => {
    if (context.options.verbose) {
      console.log(`Running command: ${context.command}`);
    }
  });

  // Hello command
  cli
    .command('hello', { description: 'Say hello' })
    .argument('name', 'Name to greet', false)
    .option('-u, --uppercase', 'Use uppercase')
    .action(async (context) => {
      const name = context.args[0] || 'World';
      let message = `Hello, ${name}!`;
      
      if (context.options.uppercase || context.options.u) {
        message = message.toUpperCase();
      }
      
      context.cli.log(message, 'green');
    });

  // File command
  cli
    .command('file', { description: 'File operations' })
    .argument('action', 'Action to perform (list, create, delete)')
    .argument('path', 'File path', false)
    .option('-f, --force', 'Force operation')
    .action(async (context) => {
      const action = context.args[0];
      const path = context.args[1] || '.';
      
      switch (action) {
        case 'list':
          const fs = require('fs');
          const files = fs.readdirSync(path);
          context.cli.log(`Files in ${path}:`, 'blue');
          files.forEach(file => console.log(`  ${file}`));
          break;
        case 'create':
          if (!path) {
            throw new Error('Path required for create action');
          }
          require('fs').writeFileSync(path, '');
          context.cli.log(`Created file: ${path}`, 'green');
          break;
        case 'delete':
          if (!path) {
            throw new Error('Path required for delete action');
          }
          if (!context.options.force && !context.options.f) {
            throw new Error('Use --force to confirm deletion');
          }
          require('fs').unlinkSync(path);
          context.cli.log(`Deleted file: ${path}`, 'red');
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    });

  // Set default command
  cli.default('hello');

  // Run the CLI
  cli.run();
}