# CLI Framework Tester

A comprehensive testing framework built specifically for testing the SimpleCLI framework. This testing suite is built from scratch without any external dependencies and provides extensive coverage for CLI application functionality.

## Features

- 🧪 **Test Organization** - Organize tests into suites with `describe()` and `it()`
- ✅ **Rich Assertions** - Comprehensive assertion library for all testing needs
- 🎯 **CLI-Specific Testing** - Specialized utilities for testing CLI applications
- 📊 **Test Coverage** - Covers all aspects of the CLI framework
- 🌈 **Colorized Output** - Clear, visual test results
- 🚫 **Zero Dependencies** - No external testing libraries required

## Quick Start

1. **Setup Files**
   ```bash
   # Ensure you have both files in the same directory
   cli-framework.js    # The SimpleCLI framework
   cli-tester.js      # The testing framework
   ```

2. **Run Tests**
   ```bash
   node cli-tester.js
   ```

3. **Expected Output**
   ```
   CLI Framework Test Suite
   ========================

   Basic CLI Creation:
       ✓ should create a CLI instance with default values
       ✓ should create a CLI instance with custom config
       ✓ should have colors defined

   Command Management:
       ✓ should add commands to the CLI
       ✓ should set default command
       ...

   Test Summary:
     Total: 25
     Passed: 25
     Failed: 0
     Skipped: 0
     Success Rate: 100%
   ```

## Test Organization

### Test Suites

Use `describe()` to group related tests:

```javascript
const runner = new TestRunner();

runner.describe('Feature Name', () => {
  runner.it('should do something', () => {
    // Test code
  });

  runner.it('should handle edge case', () => {
    // Test code
  });
});
```

### Individual Tests

Use `it()` for individual test cases:

```javascript
runner.it('should create CLI with defaults', () => {
  const cli = new SimpleCLI();
  runner.expect(cli.name).toBe('cli-app');
});
```

### Skipping Tests

Use `skip()` to temporarily disable tests:

```javascript
runner.skip('should test feature not ready', () => {
  // This test will be skipped
});
```

## Assertion Methods

The testing framework provides a comprehensive assertion library:

### Equality Assertions

```javascript
runner.expect(actual).toBe(expected);           // Strict equality (===)
runner.expect(actual).toEqual(expected);        // Deep equality
```

### Collection Assertions

```javascript
runner.expect(array).toContain(item);           // Array/string contains
runner.expect(collection).toHaveLength(5);      // Length checking
```

### Type Assertions

```javascript
runner.expect(obj).toBeInstanceOf(Class);       // Instance checking
runner.expect(value).toBeDefined();             // Not undefined
runner.expect(value).toBeUndefined();           // Is undefined
```

### Boolean Assertions

```javascript
runner.expect(value).toBeTruthy();              // Truthy value
runner.expect(value).toBeFalsy();               // Falsy value
```

### Exception Assertions

```javascript
runner.expect(() => {
  throw new Error('test');
}).toThrow();                                   // Should throw

runner.expect(() => {
  throw new Error('specific message');
}).toThrow('specific message');                 // Should throw with message
```

## CLI-Specific Testing Utilities

### Mocking Console Output

```javascript
runner.it('should log message', async () => {
  const cli = new SimpleCLI();
  const consoleMock = runner.mockConsole();
  
  cli.log('Hello World');
  
  const output = consoleMock.getOutput();
  consoleMock.restore();
  
  runner.expect(output.stdout).toContain('Hello World');
});
```

### Mocking Process Exit

```javascript
runner.it('should exit on error', async () => {
  const cli = new SimpleCLI();
  const exitMock = runner.mockExit();
  
  await cli.run(['unknown-command']);
  
  runner.expect(exitMock.wasExitCalled()).toBe(true);
  runner.expect(exitMock.getExitCode()).toBe(1);
  
  exitMock.restore();
});
```

## Test Coverage Areas

The testing suite covers all major aspects of the CLI framework:

### 1. Basic CLI Creation
- Default configuration
- Custom configuration
- Color system initialization

### 2. Command Management
- Adding commands
- Command options and arguments
- Default command setting

### 3. Argument Parsing
- Simple commands
- Commands with arguments
- Short and long options
- Option values and combinations

### 4. Help Generation
- Basic help text
- Command listings
- Command-specific help
- Option documentation

### 5. Command Execution
- Handler execution
- Context passing
- Required argument validation

### 6. Middleware System
- Middleware execution order
- Context propagation
- Pre-command processing

### 7. Global Options
- Version handling
- Help option processing
- Global option inheritance

### 8. Error Handling
- Unknown command errors
- Command execution errors
- Proper exit codes

## Writing Custom Tests

You can extend the test suite by adding your own tests:

```javascript
// Add to existing file or create new test file
runner.describe('My Custom Tests', () => {
  runner.it('should test my feature', () => {
    const cli = new SimpleCLI();
    // Your test code here
    runner.expect(/* your assertion */);
  });
});

// Run tests
runner.run();
```

## Test Output Explanation

### Success Indicators
- ✓ Green checkmark - Test passed
- ○ Yellow circle - Test skipped
- ✗ Red X - Test failed

### Error Information
When tests fail, you'll see:
- Error message explaining what went wrong
- Stack trace (first 2 lines) for debugging
- Expected vs actual values

### Summary Statistics
- **Total**: Number of tests run (excluding skipped)
- **Passed**: Number of successful tests
- **Failed**: Number of failed tests
- **Skipped**: Number of skipped tests
- **Success Rate**: Percentage of tests that passed

## Best Practices

### 1. Organize Tests Logically
```javascript
runner.describe('Feature Group', () => {
  // Group related functionality together
});
```

### 2. Use Descriptive Test Names
```javascript
runner.it('should handle empty arguments gracefully', () => {
  // Clear description of what's being tested
});
```

### 3. Clean Up Resources
```javascript
runner.it('should mock console properly', () => {
  const mock = runner.mockConsole();
  // ... test code ...
  mock.restore(); // Always restore mocks
});
```

### 4. Test Edge Cases
```javascript
runner.it('should handle null values', () => {
  // Test boundary conditions
});

runner.it('should handle empty arrays', () => {
  // Test edge cases
});
```

### 5. Use Appropriate Assertions
```javascript
// Use toBe for primitives
runner.expect(count).toBe(5);

// Use toEqual for objects/arrays
runner.expect(result).toEqual({ status: 'success' });

// Use toContain for membership tests
runner.expect(items).toContain(targetItem);
```

## Exit Codes

- **0**: All tests passed
- **1**: One or more tests failed

## Environment Requirements

- Node.js (any modern version)
- No external dependencies required
- Works on all platforms (Windows, macOS, Linux)

## Integration

The testing framework is designed to work seamlessly with the SimpleCLI framework. Simply ensure both files are in the same directory and the CLI framework is properly exported.

## Troubleshooting

### Common Issues

1. **"Module not found" error**
   - Ensure `cli-framework.js` is in the same directory
   - Check that the CLI framework properly exports `SimpleCLI`

2. **Tests hanging**
   - Make sure to call `mock.restore()` on all mocks
   - Check for infinite loops in test code

3. **Unexpected failures**
   - Review assertion types (use `toEqual` vs `toBe` appropriately)
   - Check async/await usage in test functions

### Debug Mode

Set `DEBUG=true` environment variable to see stack traces:

```bash
DEBUG=true node cli-tester.js
```

## Contributing

To add new test cases:

1. Follow existing patterns for test organization
2. Use descriptive test names
3. Include both positive and negative test cases
4. Clean up any mocks or resources
5. Test edge cases and error conditions

## License

This testing framework is provided as-is for testing the SimpleCLI framework. Feel free to modify and extend it for your specific testing needs.