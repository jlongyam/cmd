function showHelp(cmd, option = {}) {
  let message = '';
  if(cmd.args.method === undefined) {
    message += 'Usage:  <method> <command> [option]\n';
    if(option.methods !== undefined) {
      message += '\nmethod:\n';
      for(let i in option.methods) {
        message += '  '+option.methods[i]+'\n';
      }
    }
  }
  else {
    message += '\nmethod:\n';
    if(option.method === undefined) {
      message += '  undefined';
    }
    else {
      let method = Object.keys(option.method)[0];
      message += '  '+method+': '+option.method[method]+'\n';
    }
    message += '\ncommand:\n';
    if(option.arguments === undefined) {
      message += '  undefined';
    }
    else {
      let args = Object.keys(option.arguments);
      for(let i in args) {
        message += '  '+args[i]+': '+option.arguments[args[i]]+'\n';
      }
    }
  }
  if(cmd.args.method === undefined) {
    message += '\noptions:\n';
    message += '  -h, --help\t\t: show help\n';
    message += '  -v, --version\t\t: show version\n';
    message += '  -o, --option\t\t: array option\n';
    message += '  --force\t\t: force operation\n';
  }
  console.log(message.trim());
}

export default showHelp;