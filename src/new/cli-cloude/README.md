# SimpleCLI Framework

A lightweight, zero-dependency JavaScript framework for building powerful command-line interface (CLI) applications with ease.

## Features

- **Zero Dependencies** - No external packages required
- **Intuitive API** - Clean, chainable interface for defining commands
- **Flexible Options** - Support for short (`-v`) and long (`--verbose`) flags
- **Auto-Generated Help** - Automatic help documentation for all commands
- **Colorized Output** - Built-in terminal colors for better UX
- **Middleware Support** - Add cross-cutting functionality easily
- **Command Arguments** - Required and optional arguments with validation
- **Global & Local Options** - Options at CLI and command level
- **Default Commands** - Set fallback commands when none specified

## Installation

Simply download `cli-framework.js` and require it in your project:

```javascript
const { SimpleCLI } = require('./cli-framework.js');
```

Or copy the code directly into your project.

## Quick Start

```javascript
#!/usr/bin/env node
const { SimpleCLI } = require('./cli-framework.js');

// Create your CLI
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
    let message = `Hello, ${context.args[0]}!`;
    if (context.options.uppercase) {
      message = message.toUpperCase();
    }
    console.log(message);
  });

// Run the CLI
cli.run();
```

Save as `my-app.js`, make it executable, and run:

```bash
chmod +x my-app.js
./my-app.js greet John --uppercase
# Output: HELLO, JOHN!
```

## Core Concepts

### Creating a CLI

```javascript
const cli = new SimpleCLI({
  name: 'my-cli',           // CLI name (shown in help)
  version: '1.0.0',         // Version number
  description: 'CLI app'    // Brief description
});
```

### Adding Commands

Commands are the main actions your CLI can perform:

```javascript
cli.command('build', {
  description: 'Build the project'
}).action((context) => {
  console.log('Building...');
});
```

### Command Arguments

Define required or optional arguments:

```javascript
cli
  .command('create')
  .argument('name', 'Project name', true)      // Required
  .argument('template', 'Template type', false) // Optional
  .action((context) => {
    const name = context.args[0];
    const template = context.args[1] || 'default';
    console.log(`Creating ${name} with ${template} template`);
  });
```

### Command Options

Add flags to commands:

```javascript
cli
  .command('serve')
  .option('-p, --port', 'Port number', 3000)
  .option('-h, --host', 'Host address', 'localhost')
  .action((context) => {
    const port = context.options.port || context.options.p;
    const host = context.options.host || context.options.h;
    console.log(`Server running on ${host}:${port}`);
  });
```

### Global Options

Options available to all commands:

```javascript
cli
  .option('-v, --version', 'Show version')
  .option('--verbose', 'Enable verbose output', false)
  .option('-c, --config', 'Config file path');
```

### Default Command

Set a command to run when none is specified:

```javascript
cli
  .command('help')
  .action((context) => {
    console.log(context.cli.generateHelp());
  });

cli.default('help');
```

### Middleware

Add functionality that runs before every command:

```javascript
// Logging middleware
cli.use(async (context) => {
  console.log(`[${new Date().toISOString()}] Running: ${context.command}`);
});

// Authentication middleware
cli.use(async (context) => {
  if (!process.env.API_KEY) {
    throw new Error('API_KEY environment variable required');
  }
});

// Timing middleware
cli.use(async (context) => {
  context.startTime = Date.now();
});
```

## API Reference

### SimpleCLI Class

#### Constructor

```javascript
new SimpleCLI(config)
```

**Parameters:**
- `config.name` (string) - CLI application name
- `config.version` (string) - Version number
- `config.description` (string) - Brief description

#### Methods

##### `command(name, config)`
Create a new command.

```javascript
cli.command('deploy', {
  description: 'Deploy the application'
});
```

**Returns:** Command instance (chainable)

##### `option(flags, description, defaultValue)`
Add a global option.

```javascript
cli.option('-v, --verbose', 'Verbose output', false);
```

**Returns:** SimpleCLI instance (chainable)

##### `use(middleware)`
Add middleware function.

```javascript
cli.use(async (context) => {
  // Middleware logic
});
```

**Returns:** SimpleCLI instance (chainable)

##### `default(commandName)`
Set default command.

```javascript
cli.default('help');
```

**Returns:** SimpleCLI instance (chainable)

##### `run(args)`
Execute the CLI with arguments.

```javascript
cli.run(); // Uses process.argv
cli.run(['command', 'arg1', '--flag']); // Custom args
```

**Returns:** Promise

##### `log(text, color)`
Log colored text to console.

```javascript
cli.log('Success!', 'green');
cli.log('Warning', 'yellow');
cli.log('Error', 'red');
```

**Available colors:** `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `bright`, `dim`

##### `error(text)`
Log error message.

```javascript
cli.error('Something went wrong');
```

##### `generateHelp(commandName)`
Generate help text.

```javascript
const help = cli.generateHelp();        // Main help
const cmdHelp = cli.generateHelp('build'); // Command help
```

### Command Class

#### Methods

##### `argument(name, description, required)`
Add an argument to the command.

```javascript
command.argument('file', 'File to process', true);
```

**Returns:** Command instance (chainable)

##### `option(flags, description, defaultValue)`
Add an option to the command.

```javascript
command.option('-f, --force', 'Force operation', false);
```

**Returns:** Command instance (chainable)

##### `action(handler)`
Set the command handler function.

```javascript
command.action(async (context) => {
  // Command logic
});
```

**Returns:** Command instance (chainable)

### Context Object

Passed to middleware and command handlers:

```javascript
{
  command: 'build',              // Command name
  args: ['file.js', 'output/'],  // Arguments array
  options: {                     // Parsed options
    force: true,
    verbose: false
  },
  cli: cliInstance              // Reference to CLI instance
}
```

## Advanced Examples

### File Management CLI

```javascript
const cli = new SimpleCLI({
  name: 'filemanager',
  version: '1.0.0',
  description: 'File management utility'
});

const fs = require('fs');

cli
  .command('list', { description: 'List files' })
  .argument('directory', 'Directory to list', false)
  .option('-a, --all', 'Show hidden files')
  .action((context) => {
    const dir = context.args[0] || '.';
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      if (!context.options.all && file.startsWith('.')) return;
      console.log(file);
    });
  });

cli
  .command('copy', { description: 'Copy a file' })
  .argument('source', 'Source file')
  .argument('destination', 'Destination file')
  .option('-f, --force', 'Overwrite if exists')
  .action((context) => {
    const [src, dest] = context.args;
    
    if (fs.existsSync(dest) && !context.options.force) {
      context.cli.error('Destination exists. Use --force to overwrite');
      process.exit(1);
    }
    
    fs.copyFileSync(src, dest);
    context.cli.log(`Copied ${src} to ${dest}`, 'green');
  });

cli.run();
```

### Package Manager CLI

```javascript
const cli = new SimpleCLI({
  name: 'pkg',
  version: '2.0.0',
  description: 'Package manager'
});

// Middleware for loading config
cli.use(async (context) => {
  try {
    const config = JSON.parse(fs.readFileSync('package.json'));
    context.config = config;
  } catch (error) {
    if (context.command !== 'init') {
      throw new Error('No package.json found. Run "pkg init" first.');
    }
  }
});

cli
  .command('init', { description: 'Initialize new package' })
  .action((context) => {
    const pkg = {
      name: 'my-package',
      version: '1.0.0',
      dependencies: {}
    };
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    context.cli.log('Created package.json', 'green');
  });

cli
  .command('install', { description: 'Install packages' })
  .argument('package', 'Package to install', false)
  .option('-D, --save-dev', 'Save to devDependencies')
  .action((context) => {
    const pkg = context.args[0];
    if (pkg) {
      context.cli.log(`Installing ${pkg}...`, 'cyan');
      // Installation logic here
    } else {
      context.cli.log('Installing all dependencies...', 'cyan');
      // Install from package.json
    }
  });

cli.run();
```

### Build Tool CLI

```javascript
const cli = new SimpleCLI({
  name: 'builder',
  version: '3.0.0',
  description: 'Build automation tool'
});

cli.option('--verbose', 'Verbose output', false);

// Timing middleware
cli.use(async (context) => {
  context.startTime = Date.now();
});

cli
  .command('build', { description: 'Build project' })
  .option('-m, --minify', 'Minify output')
  .option('-w, --watch', 'Watch for changes')
  .action(async (context) => {
    context.cli.log('Building project...', 'cyan');
    
    // Build logic here
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const duration = Date.now() - context.startTime;
    context.cli.log(`Build complete in ${duration}ms`, 'green');
    
    if (context.options.watch) {
      context.cli.log('Watching for changes...', 'yellow');
      // Watch logic
    }
  });

cli
  .command('clean', { description: 'Clean build artifacts' })
  .action((context) => {
    context.cli.log('Cleaning...', 'yellow');
    // Clean logic
    context.cli.log('Clean complete', 'green');
  });

cli
  .command('test', { description: 'Run tests' })
  .option('-c, --coverage', 'Generate coverage report')
  .action((context) => {
    context.cli.log('Running tests...', 'cyan');
    // Test logic
  });

cli.run();
```

## Argument Parsing

SimpleCLI handles various argument formats:

```bash
# Commands
my-cli command

# Arguments
my-cli command arg1 arg2

# Long options
my-cli command --option value
my-cli command --option=value

# Short options
my-cli command -o value

# Boolean flags
my-cli command --flag

# Combined short flags
my-cli command -abc  # Same as -a -b -c

# Mixed usage
my-cli command arg1 --option value -f arg2
```

## Built-in Help System

Help is automatically generated for your CLI:

```bash
# Main help
my-cli --help
my-cli -h

# Command help
my-cli command --help

# Version
my-cli --version
my-cli -v
```

Help output includes:
- CLI name and version
- Description
- Usage examples
- List of commands
- List of global options
- Command-specific arguments and options

## Error Handling

SimpleCLI provides built-in error handling:

```javascript
cli
  .command('risky')
  .action((context) => {
    throw new Error('Something went wrong');
  });

// Errors are caught and displayed in red
// Process exits with code 1
```

Enable debug mode for stack traces:

```bash
DEBUG=true my-cli command
```

## Best Practices

### 1. Use Descriptive Names
```javascript
// Good
cli.command('deploy-production', { description: 'Deploy to production' });

// Avoid
cli.command('dp', { description: 'Deploy' });
```

### 2. Validate Input
```javascript
cli
  .command('create')
  .argument('name', 'Project name')
  .action((context) => {
    const name = context.args[0];
    
    if (!/^[a-z0-9-]+$/.test(name)) {
      throw new Error('Name must be lowercase alphanumeric with hyphens');
    }
    
    // Proceed with creation
  });
```

### 3. Provide Helpful Feedback
```javascript
cli
  .command('install')
  .action((context) => {
    context.cli.log('Installing packages...', 'cyan');
    // Installation logic
    context.cli.log('✓ Installation complete', 'green');
  });
```

### 4. Use Middleware for Common Tasks
```javascript
// Authentication
cli.use(async (context) => {
  if (requiresAuth(context.command)) {
    await authenticate();
  }
});

// Configuration loading
cli.use(async (context) => {
  context.config = await loadConfig();
});
```

### 5. Handle Async Operations
```javascript
cli
  .command('fetch')
  .action(async (context) => {
    try {
      const data = await fetchData();
      console.log(data);
    } catch (error) {
      context.cli.error(`Failed to fetch: ${error.message}`);
      process.exit(1);
    }
  });
```

## Testing

SimpleCLI can be easily tested. See `cli-tester.js` for a comprehensive testing framework.

```javascript
// Example test
const cli = new SimpleCLI({ name: 'test-cli' });

cli.command('test').action((context) => {
  context.cli.log('Success');
});

await cli.run(['test']);
```

## Platform Support

- ✅ Node.js (v12+)
- ✅ Windows
- ✅ macOS
- ✅ Linux

## License

This framework is provided as-is for building CLI applications. Feel free to use, modify, and distribute.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## Support

For issues and questions:
1. Check the examples in this README
2. Review the API reference
3. Look at the included example usage in the framework file

## Changelog

### v1.0.0
- Initial release
- Command and option parsing
- Auto-generated help
- Middleware support
- Colorized output
- Default commands
- Global and local options
