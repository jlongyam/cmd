var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// src/flags.cjs
var require_flags = __commonJS((exports, module) => {
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x.default : x;
  }
  function getAugmentedNamespace(n) {
    if (Object.prototype.hasOwnProperty.call(n, "__esModule"))
      return n;
    var f = n.default;
    if (typeof f == "function") {
      var a = function a2() {
        var isInstance = false;
        try {
          isInstance = this instanceof a2;
        } catch {}
        return isInstance ? Reflect.construct(f, arguments, this.constructor) : f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else
      a = {};
    return Object.defineProperty(a, "__esModule", {
      value: true
    }), Object.keys(n).forEach(function(k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function() {
          return n[k];
        }
      });
    }), a;
  }
  function _arrayLikeToArray(r, a) {
    (a == null || a > r.length) && (a = r.length);
    for (var e2 = 0, n = Array(a);e2 < a; e2++)
      n[e2] = r[e2];
    return n;
  }
  var flaget_1;
  var hasRequiredFlaget;
  function requireFlaget() {
    if (hasRequiredFlaget)
      return flaget_1;
    hasRequiredFlaget = 1;
    var isArg = function(raw, i) {
      return raw[++i] != null && raw[i][0] !== "-";
    }, cast = function(val) {
      return val === "true" || val !== "false" && (/^-?\d+(\.\d+)?$/.test(val) ? Number(val) : val);
    }, setFlag = function(res, key, val) {
      var camelKey = key.includes("-") ? key.replace(/-([a-z])/g, function(_, char) {
        return char.toUpperCase();
      }) : key;
      res.flags[key] = val, camelKey !== key && (res.flags[camelKey] = val);
    }, flaget = function(options) {
      options === undefined && (options = {});
      var raw = options.raw;
      raw === undefined && (raw = process.argv.slice(2));
      var alias = options.alias;
      alias === undefined && (alias = {});
      var array = options.array;
      array === undefined && (array = []);
      var boolean = options.boolean;
      boolean === undefined && (boolean = []);
      for (var res = {
        args: {},
        flags: {},
        _: [],
        _tail: []
      }, parseLong = function(arg2, i2) {
        var j = arg2.indexOf("="), isNo = arg2.startsWith("--no-"), key2 = arg2.slice(isNo ? 5 : 2, ~j ? j : undefined), val = ~j ? arg2.slice(++j) : null;
        if (key2 = alias[key2] || key2, isNo || boolean.includes(key2))
          return setFlag(res, key2, !isNo), i2;
        if (array.includes(key2)) {
          var ref = function(raw2, i3, val2) {
            var values2 = [], j2 = i3;
            if (val2 != null)
              return values2.push(cast(val2)), {
                values: values2,
                offset: 0
              };
            for (;isArg(raw2, j2); )
              values2.push(cast(raw2[++j2]));
            return {
              values: values2,
              offset: j2 - i3
            };
          }(raw, i2, val), values = ref.values, offset = ref.offset;
          return setFlag(res, key2, (res.flags[key2] || []).concat(values)), i2 + offset;
        }
        return val = val != null ? cast(val) : !isArg(raw, i2) || cast(raw[++i2]), setFlag(res, key2, val), i2;
      }, parseShort = function(arg2, i2) {
        if (arg2.length > 2) {
          var _step, _iterator = function(r, e2) {
            var t = typeof Symbol != "undefined" && r[Symbol.iterator] || r["@@iterator"];
            if (!t) {
              if (Array.isArray(r) || (t = function(r2, a2) {
                if (r2) {
                  if (typeof r2 == "string")
                    return _arrayLikeToArray(r2, a2);
                  var t2 = {}.toString.call(r2).slice(8, -1);
                  return t2 === "Object" && r2.constructor && (t2 = r2.constructor.name), t2 === "Map" || t2 === "Set" ? Array.from(r2) : t2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t2) ? _arrayLikeToArray(r2, a2) : undefined;
                }
              }(r)) || e2) {
                t && (r = t);
                var n = 0, F = function() {};
                return {
                  s: F,
                  n: function() {
                    return n >= r.length ? {
                      done: true
                    } : {
                      done: false,
                      value: r[n++]
                    };
                  },
                  e: function(r2) {
                    throw r2;
                  },
                  f: F
                };
              }
              throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
            }
            var o, a = true, u = false;
            return {
              s: function() {
                t = t.call(r);
              },
              n: function() {
                var r2 = t.next();
                return a = r2.done, r2;
              },
              e: function(r2) {
                u = true, o = r2;
              },
              f: function() {
                try {
                  a || t.return == null || t.return();
                } finally {
                  if (u)
                    throw o;
                }
              }
            };
          }(arg2.slice(1));
          try {
            for (_iterator.s();!(_step = _iterator.n()).done; ) {
              var char = _step.value, key$12 = alias[char] || char;
              setFlag(res, key$12, true);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          return i2;
        }
        var key2 = alias[arg2[1]] || arg2[1];
        if (boolean.includes(key2))
          return setFlag(res, key2, true), i2;
        if (array.includes(key2)) {
          for (var values = [], j = i2;isArg(raw, j); )
            values.push(cast(raw[++j]));
          return setFlag(res, key2, (res.flags[key2] || []).concat(values)), j;
        }
        var val = !isArg(raw, i2) || cast(raw[++i2]);
        return setFlag(res, key2, val), i2;
      }, i = 0;i < raw.length; i++) {
        var arg = raw[i];
        if (arg === "--") {
          res._tail = raw.slice(++i);
          break;
        }
        arg[0] === "-" ? i = arg[1] === "-" ? parseLong(arg, i) : parseShort(arg, i) : res._.push(arg);
      }
      var defs = options.default || {};
      for (var key in defs)
        key in res.flags || setFlag(res, key, defs[key]);
      for (var args = options.args || [], i$1 = 0;i$1 < args.length; i$1++) {
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
  }
  var flags_1;
  var hasRequiredFlags;
  var e = getDefaultExportFromCjs(requireFlaget());
  var flags = getDefaultExportFromCjs(hasRequiredFlags ? flags_1 : (hasRequiredFlags = 1, flags_1 = getAugmentedNamespace(Object.freeze({
    __proto__: null,
    default: e
  }))));
  module.exports = flags;
});
export default require_flags();
