import flags from './flags.mjs';

class Args {
  option = {
    args: ['method', '...arguments'],
    alias: { h: 'help', v: 'version', o: 'option' },
    array: ['option'],
    boolean: ['force']
  }
  combine(original, update) {
    return [...new Set([...original, ...update])]
  }
  constructor(option = {}) {
    if(option.alias) {
      Object.assign(this.option.alias, option.alias);
    }
    if(option.array) {
      let combined =  this.combine(this.option.array, option.array);
      this.option.array = combined;
    }
    if(option.boolean) {
      this.option.boolean.push(option.boolean);
      let combined =  this.combine(this.option.boolean, option.boolean);
      this.option.boolean = combined;
    }
    const args = flags(this.option);
    let tail = false;
    if(args._tail.length > 0 ) tail = args._tail;
    delete args._;
    delete args._tail;
    if(tail) {
      args.tail = {
        exec: tail[0],
        command: tail.slice(1).join(' ')
      };
    }
    return args;
  }
}

export default Args;