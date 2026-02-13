import { describe, test, expect } from "bun:test";
import { Args } from "../dist/cmd.js";

describe('cmd', ()=> {
  test('new Args', ()=> {
    var cmd = new Args;
    expect(cmd.args.method).toBe(undefined);
    expect(cmd.args.arguments.length).toBe(0);
    expect(Object.keys(cmd.flags).length).toBe(0);
  });
});