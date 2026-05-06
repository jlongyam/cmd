#!/usr/bin/env node

const { SimpleCLI } = require('../cli-framework.js');

console.dir(
  Object.getOwnPropertyNames(
    SimpleCLI.prototype
  )
);