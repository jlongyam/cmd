#!/usr/bin/env node

/**
 * CLI Framework Tester - A comprehensive testing suite for the SimpleCLI framework
 * Built without external dependencies
 */

// Import the CLI framework (assuming it's in the same directory)
const { SimpleCLI } = require('./cli-framework.js');

class TestRunner {
  constructor() {
    this.tests = [];
    this.suites = new Map();
    this.currentSuite = null;
    this.stats = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0
    };
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m',
      gray: '\x1b[90m'
    };
  }

  // Create a test suite
  describe(name, fn) {
    this.currentSuite = name;
    if (!this.suites.has(name)) {
      this.suites.set(name, []);
    }
    fn();
    this.currentSuite = null;
  }

  // Create a test case
  it(description, fn) {
    const test = {
      description,
      fn,
      suite: this.currentSuite,
      skip: false
    };
    
    if (this.currentSuite) {
      this.suites.get(this.currentSuite).push(test);
    } else {
      this.tests.push(test);
    }
  }

  // Skip a test
  skip(description, fn) {
    const test = {
      description,
      fn,
      suite: this.currentSuite,
      skip: true
    };
    
    if (this.currentSuite) {
      this.suites.get(this.currentSuite).push(test);
    } else {
      this.tests.push(test);
    }
  }

  // Color text
  colorize(text, color) {
    return `${this.colors[color]}${text}${this.colors.reset}`;
  }

  // Assertion methods
  expect(actual) {
    return new Assertion(actual);
  }

  // Mock console output
  mockConsole() {
    const original = {
      log: console.log,
      error: console.error
    };
    
    const output = {
      stdout: [],
      stderr: []
    };
    
    console.log = (...args) => {
      output.stdout.push(args.join(' '));
    };
    
    console.error = (...args) => {
      output.stderr.push(args.join(' '));
    };
    
    return {
      restore: () => {
        console.log = original.log;
        console.error = original.error;
      },
      getOutput: () => output
    };
  }

  // Mock process.exit
  mockExit() {
    const original = process.exit;
    let exitCode = null;
    let exitCalled = false;
    
    process.exit = (code = 0) => {
      exitCode = code;
      exitCalled = true;
      // Don't actually exit during tests
    };
    
    return {
      restore: () => {
        process.exit = original;
      },
      getExitCode: () => exitCode,
      wasExitCalled: () => exitCalled
    };
  }

  // Run a single test
  async runTest(test) {
    if (test.skip) {
      this.stats.skipped++;
      console.log(`    ${this.colorize('○', 'yellow')} ${test.description} ${this.colorize('(skipped)', 'gray')}`);
      return;
    }

    this.stats.total++;
    
    try {
      await test.fn();
      this.stats.passed++;
      console.log(`    ${this.colorize('✓', 'green')} ${test.description}`);
    } catch (error) {
      this.stats.failed++;
      console.log(`    ${this.colorize('✗', 'red')} ${test.description}`);
      console.log(`      ${this.colorize('Error:', 'red')} ${error.message}`);
      if (error.stack) {
        const stack = error.stack.split('\n').slice(1, 3).join('\n');
        console.log(`      ${this.colorize(stack, 'gray')}`);
      }
    }
  }

  // Run all tests
  async run() {
    console.log(this.colorize('\nCLI Framework Test Suite', 'bright'));
    console.log(this.colorize('========================\n', 'bright'));

    // Run standalone tests
    if (this.tests.length > 0) {
      console.log(this.colorize('Standalone Tests:', 'blue'));
      for (const test of this.tests) {
        await this.runTest(test);
      }
      console.log();
    }

    // Run suite tests
    for (const [suiteName, suiteTests] of this.suites) {
      console.log(this.colorize(`${suiteName}:`, 'blue'));
      for (const test of suiteTests) {
        await this.runTest(test);
      }
      console.log();
    }

    // Print summary
    this.printSummary();
    
    // Exit with error code if tests failed
    if (this.stats.failed > 0) {
      process.exit(1);
    }
  }

  // Print test summary
  printSummary() {
    console.log(this.colorize('Test Summary:', 'bright'));
    console.log(`  Total: ${this.stats.total}`);
    console.log(`  ${this.colorize('Passed:', 'green')} ${this.stats.passed}`);
    console.log(`  ${this.colorize('Failed:', 'red')} ${this.stats.failed}`);
    console.log(`  ${this.colorize('Skipped:', 'yellow')} ${this.stats.skipped}`);
    
    const percentage = this.stats.total > 0 ? 
      Math.round((this.stats.passed / this.stats.total) * 100) : 0;
    
    console.log(`  ${this.colorize('Success Rate:', 'bright')} ${percentage}%\n`);
  }
}

class Assertion {
  constructor(actual) {
    this.actual = actual;
  }

  toBe(expected) {
    if (this.actual !== expected) {
      throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(this.actual)}`);
    }
  }

  toEqual(expected) {
    if (!this.deepEqual(this.actual, expected)) {
      throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(this.actual)}`);
    }
  }

  toContain(expected) {
    if (Array.isArray(this.actual)) {
      if (!this.actual.includes(expected)) {
        throw new Error(`Expected array to contain ${JSON.stringify(expected)}`);
      }
    } else if (typeof this.actual === 'string') {
      if (!this.actual.includes(expected)) {
        throw new Error(`Expected string to contain "${expected}"`);
      }
    } else {
      throw new Error('toContain() can only be used with arrays or strings');
    }
  }

  toHaveLength(expected) {
    if (!this.actual || typeof this.actual.length !== 'number') {
      throw new Error('Expected value to have a length property');
    }
    if (this.actual.length !== expected) {
      throw new Error(`Expected length ${expected} but got ${this.actual.length}`);
    }
  }

  toBeInstanceOf(expected) {
    if (!(this.actual instanceof expected)) {
      throw new Error(`Expected instance of ${expected.name} but got ${typeof this.actual}`);
    }
  }

  toThrow(expectedMessage) {
    if (typeof this.actual !== 'function') {
      throw new Error('Expected a function');
    }
    
    let didThrow = false;
    let thrownError = null;
    
    try {
      this.actual();
    } catch (error) {
      didThrow = true;
      thrownError = error;
    }
    
    if (!didThrow) {
      throw new Error('Expected function to throw an error');
    }
    
    if (expectedMessage && !thrownError.message.includes(expectedMessage)) {
      throw new Error(`Expected error message to contain "${expectedMessage}" but got "${thrownError.message}"`);
    }
  }

  toBeUndefined() {
    if (this.actual !== undefined) {
      throw new Error(`Expected undefined but got ${JSON.stringify(this.actual)}`);
    }
  }

  toBeDefined() {
    if (this.actual === undefined) {
      throw new Error('Expected value to be defined');
    }
  }

  toBeTruthy() {
    if (!this.actual) {
      throw new Error(`Expected truthy value but got ${JSON.stringify(this.actual)}`);
    }
  }

  toBeFalsy() {
    if (this.actual) {
      throw new Error(`Expected falsy value but got ${JSON.stringify(this.actual)}`);
    }
  }

  // Deep equality check
  deepEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;
    
    if (typeof a === 'object') {
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);
      
      if (aKeys.length !== bKeys.length) return false;
      
      for (let key of aKeys) {
        if (!bKeys.includes(key)) return false;
        if (!this.deepEqual(a[key], b[key])) return false;
      }
      return true;
    }
    
    return false;
  }
}

// Create test runner instance
const runner = new TestRunner();

// Test Suite: Basic CLI Creation
runner.describe('Basic CLI Creation', () => {
  runner.it('should create a CLI instance with default values', () => {
    const cli = new SimpleCLI();
    runner.expect(cli.name).toBe('cli-app');
    runner.expect(cli.version).toBe('1.0.0');
    runner.expect(cli.description).toBe('A CLI application');
  });

  runner.it('should create a CLI instance with custom config', () => {
    const cli = new SimpleCLI({
      name: 'my-app',
      version: '2.0.0',
      description: 'My custom app'
    });
    runner.expect(cli.name).toBe('my-app');
    runner.expect(cli.version).toBe('2.0.0');
    runner.expect(cli.description).toBe('My custom app');
  });

  runner.it('should have colors defined', () => {
    const cli = new SimpleCLI();
    runner.expect(cli.colors).toBeDefined();
    runner.expect(cli.colors.red).toBe('\x1b[31m');
    runner.expect(cli.colors.green).toBe('\x1b[32m');
  });
});

// Test Suite: Command Management
runner.describe('Command Management', () => {
  runner.it('should add commands to the CLI', () => {
    const cli = new SimpleCLI();
    const command = cli.command('test', { description: 'Test command' });
    
    runner.expect(cli.commands.has('test')).toBe(true);
    runner.expect(command.name).toBe('test');
    runner.expect(command.description).toBe('Test command');
  });

  runner.it('should set default command', () => {
    const cli = new SimpleCLI();
    cli.command('hello');
    cli.default('hello');
    
    runner.expect(cli.defaultCommand).toBe('hello');
  });

  runner.it('should add options to commands', () => {
    const cli = new SimpleCLI();
    const command = cli.command('test')
      .option('-v, --verbose', 'Enable verbose output');
    
    runner.expect(command.options.has('verbose')).toBe(true);
    const option = command.options.get('verbose');
    runner.expect(option.short).toBe('-v');
    runner.expect(option.long).toBe('--verbose');
  });

  runner.it('should add arguments to commands', () => {
    const cli = new SimpleCLI();
    const command = cli.command('test')
      .argument('name', 'Name argument', true)
      .argument('optional', 'Optional argument', false);
    
    runner.expect(command.args).toHaveLength(2);
    runner.expect(command.args[0].name).toBe('name');
    runner.expect(command.args[0].required).toBe(true);
    runner.expect(command.args[1].required).toBe(false);
  });
});

// Test Suite: Argument Parsing
runner.describe('Argument Parsing', () => {
  runner.it('should parse simple commands', () => {
    const cli = new SimpleCLI();
    cli.command('hello');
    
    const parsed = cli.parseArgs(['hello']);
    runner.expect(parsed.command).toBe('hello');
    runner.expect(parsed.args).toHaveLength(0);
  });

  runner.it('should parse commands with arguments', () => {
    const cli = new SimpleCLI();
    cli.command('hello');
    
    const parsed = cli.parseArgs(['hello', 'world']);
    runner.expect(parsed.command).toBe('hello');
    runner.expect(parsed.args).toContain('world');
  });

  runner.it('should parse long options', () => {
    const cli = new SimpleCLI();
    const parsed = cli.parseArgs(['--verbose']);
    runner.expect(parsed.options.verbose).toBe(true);
  });

  runner.it('should parse short options', () => {
    const cli = new SimpleCLI();
    const parsed = cli.parseArgs(['-v']);
    runner.expect(parsed.options.v).toBe(true);
  });

  runner.it('should parse options with values', () => {
    const cli = new SimpleCLI();
    const parsed = cli.parseArgs(['--name', 'John']);
    runner.expect(parsed.options.name).toBe('John');
  });

  runner.it('should parse options with equals syntax', () => {
    const cli = new SimpleCLI();
    const parsed = cli.parseArgs(['--name=John']);
    runner.expect(parsed.options.name).toBe('John');
  });

  runner.it('should handle combined short options', () => {
    const cli = new SimpleCLI();
    const parsed = cli.parseArgs(['-abc']);
    runner.expect(parsed.options.a).toBe(true);
    runner.expect(parsed.options.b).toBe(true);
    runner.expect(parsed.options.c).toBe(true);
  });
});

// Test Suite: Help Generation
runner.describe('Help Generation', () => {
  runner.it('should generate basic help text', () => {
    const cli = new SimpleCLI({
      name: 'test-cli',
      version: '1.0.0',
      description: 'Test CLI'
    });
    
    const help = cli.generateHelp();
    runner.expect(help).toContain('test-cli');
    runner.expect(help).toContain('1.0.0');
    runner.expect(help).toContain('Test CLI');
  });

  runner.it('should include commands in help', () => {
    const cli = new SimpleCLI({ name: 'test-cli' });
    cli.command('hello', { description: 'Say hello' });
    
    const help = cli.generateHelp();
    runner.expect(help).toContain('Commands:');
    runner.expect(help).toContain('hello');
    runner.expect(help).toContain('Say hello');
  });

  runner.it('should generate command-specific help', () => {
    const cli = new SimpleCLI({ name: 'test-cli' });
    cli.command('hello', { description: 'Say hello' })
      .argument('name', 'Name to greet')
      .option('-u, --uppercase', 'Use uppercase');
    
    const help = cli.generateHelp('hello');
    runner.expect(help).toContain('hello');
    runner.expect(help).toContain('Arguments:');
    runner.expect(help).toContain('name');
    runner.expect(help).toContain('Options:');
    runner.expect(help).toContain('-u, --uppercase');
  });
});

// Test Suite: Command Execution
runner.describe('Command Execution', () => {
  runner.it('should execute command handlers', async () => {
    const cli = new SimpleCLI();
    let executed = false;
    
    cli.command('test').action(() => {
      executed = true;
    });
    
    await cli.run(['test']);
    runner.expect(executed).toBe(true);
  });

  runner.it('should pass context to command handlers', async () => {
    const cli = new SimpleCLI();
    let receivedContext = null;
    
    cli.command('test').action((context) => {
      receivedContext = context;
    });
    
    await cli.run(['test', 'arg1', '--option', 'value']);
    
    runner.expect(receivedContext).toBeDefined();
    runner.expect(receivedContext.command).toBe('test');
    runner.expect(receivedContext.args).toContain('arg1');
    runner.expect(receivedContext.options.option).toBe('value');
  });

  runner.it('should validate required arguments', async () => {
    const cli = new SimpleCLI();
    let errorThrown = false;
    
    cli.command('test')
      .argument('required', 'Required argument', true)
      .action(() => {});
    
    // Mock console to capture error output
    const consoleMock = runner.mockConsole();
    const exitMock = runner.mockExit();
    
    try {
      await cli.run(['test']);
    } catch (error) {
      errorThrown = true;
    }
    
    consoleMock.restore();
    exitMock.restore();
    
    // Should have called process.exit with error code
    runner.expect(exitMock.wasExitCalled()).toBe(true);
  });
});

// Test Suite: Middleware
runner.describe('Middleware', () => {
  runner.it('should execute middleware before commands', async () => {
    const cli = new SimpleCLI();
    const executionOrder = [];
    
    cli.use(async () => {
      executionOrder.push('middleware');
    });
    
    cli.command('test').action(() => {
      executionOrder.push('command');
    });
    
    await cli.run(['test']);
    
    runner.expect(executionOrder).toEqual(['middleware', 'command']);
  });

  runner.it('should pass context to middleware', async () => {
    const cli = new SimpleCLI();
    let middlewareContext = null;
    
    cli.use(async (context) => {
      middlewareContext = context;
    });
    
    cli.command('test').action(() => {});
    
    await cli.run(['test']);
    
    runner.expect(middlewareContext).toBeDefined();
    runner.expect(middlewareContext.command).toBe('test');
  });
});

// Test Suite: Option Flag Parsing
runner.describe('Option Flag Parsing', () => {
  runner.it('should parse short and long flags', () => {
    const cli = new SimpleCLI();
    const option = cli.parseOptionFlags('-v, --verbose');
    
    runner.expect(option.short).toBe('-v');
    runner.expect(option.long).toBe('--verbose');
    runner.expect(option.name).toBe('verbose');
  });

  runner.it('should parse only short flags', () => {
    const cli = new SimpleCLI();
    const option = cli.parseOptionFlags('-v');
    
    runner.expect(option.short).toBe('-v');
    runner.expect(option.long).toBe(null);
    runner.expect(option.name).toBe('v');
  });

  runner.it('should parse only long flags', () => {
    const cli = new SimpleCLI();
    const option = cli.parseOptionFlags('--verbose');
    
    runner.expect(option.short).toBe(null);
    runner.expect(option.long).toBe('--verbose');
    runner.expect(option.name).toBe('verbose');
  });
});

// Test Suite: Global Options
runner.describe('Global Options', () => {
  runner.it('should add global options', () => {
    const cli = new SimpleCLI();
    cli.option('-v, --version', 'Show version');
    
    runner.expect(cli.globalOptions.has('version')).toBe(true);
    const option = cli.globalOptions.get('version');
    runner.expect(option.global).toBe(true);
  });

  runner.it('should handle version option', async () => {
    const cli = new SimpleCLI({ version: '1.2.3' });
    const consoleMock = runner.mockConsole();
    
    await cli.run(['--version']);
    
    const output = consoleMock.getOutput();
    consoleMock.restore();
    
    runner.expect(output.stdout).toContain('1.2.3');
  });

  runner.it('should handle help option', async () => {
    const cli = new SimpleCLI({ name: 'test-app' });
    const consoleMock = runner.mockConsole();
    
    await cli.run(['--help']);
    
    const output = consoleMock.getOutput();
    consoleMock.restore();
    
    runner.expect(output.stdout.join(' ')).toContain('test-app');
  });
});

// Test Suite: Error Handling
runner.describe('Error Handling', () => {
  runner.it('should handle unknown commands', async () => {
    const cli = new SimpleCLI();
    const consoleMock = runner.mockConsole();
    const exitMock = runner.mockExit();
    
    await cli.run(['unknown-command']);
    
    const output = consoleMock.getOutput();
    consoleMock.restore();
    exitMock.restore();
    
    runner.expect(output.stderr.join(' ')).toContain('Unknown command: unknown-command');
    runner.expect(exitMock.wasExitCalled()).toBe(true);
  });

  runner.it('should handle command errors', async () => {
    const cli = new SimpleCLI();
    const consoleMock = runner.mockConsole();
    const exitMock = runner.mockExit();
    
    cli.command('error').action(() => {
      throw new Error('Test error');
    });
    
    await cli.run(['error']);
    
    const output = consoleMock.getOutput();
    consoleMock.restore();
    exitMock.restore();
    
    runner.expect(output.stderr.join(' ')).toContain('Test error');
    runner.expect(exitMock.wasExitCalled()).toBe(true);
  });
});

// Run the tests
if (require.main === module) {
  runner.run().catch(console.error);
}

module.exports = { TestRunner, Assertion };