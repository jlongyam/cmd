"use strict";

var cb, mod, require_flags = (cb = function(exports$1, module) {
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x.default : x;
  }
  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e2 = 0, n = Array(a); e2 < a; e2++) n[e2] = r[e2];
    return n;
  }
  var flaget_1, hasRequiredFlaget, flags_1, hasRequiredFlags, e = getDefaultExportFromCjs(function() {
    if (hasRequiredFlaget) return flaget_1;
    hasRequiredFlaget = 1;
    var isArg = function(raw, i) {
      return null != raw[++i] && "-" !== raw[i][0];
    }, cast = function(val) {
      return "true" === val || "false" !== val && (/^-?\d+(\.\d+)?$/.test(val) ? Number(val) : val);
    }, setFlag = function(res, key, val) {
      var camelKey = key.includes("-") ? key.replace(/-([a-z])/g, function(_, char) {
        return char.toUpperCase();
      }) : key;
      res.flags[key] = val, camelKey !== key && (res.flags[camelKey] = val);
    }, flaget = function(options) {
      void 0 === options && (options = {});
      var raw = options.raw;
      void 0 === raw && (raw = process.argv.slice(2));
      var alias = options.alias;
      void 0 === alias && (alias = {});
      var array = options.array;
      void 0 === array && (array = []);
      var boolean = options.boolean;
      void 0 === boolean && (boolean = []);
      for (var res = {
        args: {},
        flags: {},
        _: [],
        _tail: []
      }, parseLong = function(arg2, i2) {
        var j = arg2.indexOf("="), isNo = arg2.startsWith("--no-"), key2 = arg2.slice(isNo ? 5 : 2, ~j ? j : void 0), val = ~j ? arg2.slice(++j) : null;
        if (key2 = alias[key2] || key2, isNo || boolean.includes(key2)) return setFlag(res, key2, !isNo), 
        i2;
        if (array.includes(key2)) {
          var ref = function(raw2, i3, val2) {
            var values2 = [], j2 = i3;
            if (null != val2) return values2.push(cast(val2)), {
              values: values2,
              offset: 0
            };
            for (;isArg(raw2, j2); ) values2.push(cast(raw2[++j2]));
            return {
              values: values2,
              offset: j2 - i3
            };
          }(raw, i2, val), values = ref.values, offset = ref.offset;
          return setFlag(res, key2, (res.flags[key2] || []).concat(values)), i2 + offset;
        }
        return val = null != val ? cast(val) : !isArg(raw, i2) || cast(raw[++i2]), setFlag(res, key2, val), 
        i2;
      }, parseShort = function(arg2, i2) {
        if (arg2.length > 2) {
          var _step, _iterator = function(r) {
            var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
            if (!t) {
              if (Array.isArray(r) || (t = function(r2) {
                if (r2) {
                  if ("string" == typeof r2) return _arrayLikeToArray(r2, void 0);
                  var t2 = {}.toString.call(r2).slice(8, -1);
                  return "Object" === t2 && r2.constructor && (t2 = r2.constructor.name), "Map" === t2 || "Set" === t2 ? Array.from(r2) : "Arguments" === t2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t2) ? _arrayLikeToArray(r2, void 0) : void 0;
                }
              }(r))) {
                t && (r = t);
                var _n = 0, F = function() {};
                return {
                  s: F,
                  n: function() {
                    return _n >= r.length ? {
                      done: !0
                    } : {
                      done: !1,
                      value: r[_n++]
                    };
                  },
                  e: function(r2) {
                    throw r2;
                  },
                  f: F
                };
              }
              throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            var o, a = !0, u = !1;
            return {
              s: function() {
                t = t.call(r);
              },
              n: function() {
                var r2 = t.next();
                return a = r2.done, r2;
              },
              e: function(r2) {
                u = !0, o = r2;
              },
              f: function() {
                try {
                  a || null == t.return || t.return();
                } finally {
                  if (u) throw o;
                }
              }
            };
          }(arg2.slice(1));
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
              var char = _step.value, key$12 = alias[char] || char;
              setFlag(res, key$12, !0);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          return i2;
        }
        var key2 = alias[arg2[1]] || arg2[1];
        if (boolean.includes(key2)) return setFlag(res, key2, !0), i2;
        if (array.includes(key2)) {
          for (var values = [], j = i2; isArg(raw, j); ) values.push(cast(raw[++j]));
          return setFlag(res, key2, (res.flags[key2] || []).concat(values)), j;
        }
        var val = !isArg(raw, i2) || cast(raw[++i2]);
        return setFlag(res, key2, val), i2;
      }, i = 0; i < raw.length; i++) {
        var arg = raw[i];
        if ("--" === arg) {
          res._tail = raw.slice(++i);
          break;
        }
        "-" === arg[0] ? i = "-" === arg[1] ? parseLong(arg, i) : parseShort(arg, i) : res._.push(arg);
      }
      var defs = options.default || {};
      for (var key in defs) key in res.flags || setFlag(res, key, defs[key]);
      for (var args = options.args || [], i$1 = 0; i$1 < args.length; i$1++) {
        var key$1 = args[i$1];
        if (key$1.startsWith("...")) {
          res.args[key$1.slice(3)] = res._.slice(i$1);
          break;
        }
        res.args[key$1] = res._[i$1];
      }
      return res;
    };
    return flaget_1 = flaget, flaget.default = flaget, flaget_1;
  }()), flags = getDefaultExportFromCjs(hasRequiredFlags ? flags_1 : (hasRequiredFlags = 1, 
  flags_1 = function(n) {
    if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
    var f = n.default;
    if ("function" == typeof f) {
      var a = function a2() {
        var isInstance = !1;
        try {
          isInstance = this instanceof a2;
        } catch (_unused) {}
        return isInstance ? Reflect.construct(f, arguments, this.constructor) : f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else a = {};
    return Object.defineProperty(a, "__esModule", {
      value: !0
    }), Object.keys(n).forEach(function(k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: !0,
        get: function() {
          return n[k];
        }
      });
    }), a;
  }(Object.freeze({
    __proto__: null,
    default: e
  }))));
  module.exports = flags;
}, function() {
  return mod || cb(mod = {
    exports: {}
  }, mod), mod.exports;
}), flags = require_flags();

exports.Args = class {
  combine(original, update) {
    return [ ...new Set([ ...original, ...update ]) ];
  }
  constructor() {
    var e, r, t, option = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    if (e = this, t = {
      args: [ "method", "...arguments" ],
      alias: {
        h: "help",
        v: "version",
        o: "option"
      },
      array: [ "option" ],
      boolean: [ "force" ]
    }, (r = function(t) {
      var i = function(t, r) {
        if ("object" != typeof t || !t) return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r);
          if ("object" != typeof i) return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return String(t);
      }(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }(r = "option")) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[r] = t, option.alias && Object.assign(this.option.alias, option.alias), option.array) {
      var combined = this.combine(this.option.array, option.array);
      this.option.array = combined;
    }
    if (option.boolean) {
      this.option.boolean.push(option.boolean);
      var _combined = this.combine(this.option.boolean, option.boolean);
      this.option.boolean = _combined;
    }
    var args = flags(this.option), tail = !1;
    return args._tail.length > 0 && (tail = args._tail), delete args._, delete args._tail, 
    tail && (args.tail = {
      exec: tail[0],
      command: tail.slice(1).join(" ")
    }), args;
  }
}, exports.showHelp = function(cmd) {
  var option = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, message = "";
  if (void 0 === cmd.args.method) {
    if (message += "Usage:  <method> <command> [option]\n", void 0 !== option.methods) for (var i in message += "\nmethod:\n", 
    option.methods) message += "  " + option.methods[i] + "\n";
  } else {
    if (message += "\nmethod:\n", void 0 === option.method) message += "  undefined"; else {
      var method = Object.keys(option.method)[0];
      message += "  " + method + ": " + option.method[method] + "\n";
    }
    if (message += "\ncommand:\n", void 0 === option.arguments) message += "  undefined"; else {
      var args = Object.keys(option.arguments);
      for (var _i in args) message += "  " + args[_i] + ": " + option.arguments[args[_i]] + "\n";
    }
  }
  void 0 === cmd.args.method && (message += "\noptions:\n", message += "  -h, --help\t\t: show help\n", 
  message += "  -v, --version\t\t: show version\n", message += "  -o, --option\t\t: array option\n", 
  message += "  --force\t\t: force operation\n"), console.log(message.trim());
};
