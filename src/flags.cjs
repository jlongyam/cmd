function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x.default : x;
}

function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var f = n.default;
  if ("function" == typeof f) {
    var a = function a() {
      var isInstance = !1;
      try {
        isInstance = this instanceof a;
      } catch {}
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
}

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}

var flaget_1, hasRequiredFlaget;

function requireFlaget() {
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
    }, parseLong = function(arg, i) {
      var j = arg.indexOf("="), isNo = arg.startsWith("--no-"), key = arg.slice(isNo ? 5 : 2, ~j ? j : void 0), val = ~j ? arg.slice(++j) : null;
      if (key = alias[key] || key, isNo || boolean.includes(key)) return setFlag(res, key, !isNo), 
      i;
      if (array.includes(key)) {
        var ref = function(raw, i, val) {
          var values = [], j = i;
          if (null != val) return values.push(cast(val)), {
            values: values,
            offset: 0
          };
          for (;isArg(raw, j); ) values.push(cast(raw[++j]));
          return {
            values: values,
            offset: j - i
          };
        }(raw, i, val), values = ref.values, offset = ref.offset;
        return setFlag(res, key, (res.flags[key] || []).concat(values)), i + offset;
      }
      return val = null != val ? cast(val) : !isArg(raw, i) || cast(raw[++i]), setFlag(res, key, val), 
      i;
    }, parseShort = function(arg, i) {
      if (arg.length > 2) {
        var _step, _iterator = function(r, e) {
          var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
          if (!t) {
            if (Array.isArray(r) || (t = function(r, a) {
              if (r) {
                if ("string" == typeof r) return _arrayLikeToArray(r, a);
                var t = {}.toString.call(r).slice(8, -1);
                return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
              }
            }(r)) || e) {
              t && (r = t);
              var n = 0, F = function() {};
              return {
                s: F,
                n: function() {
                  return n >= r.length ? {
                    done: !0
                  } : {
                    done: !1,
                    value: r[n++]
                  };
                },
                e: function(r) {
                  throw r;
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
              var r = t.next();
              return a = r.done, r;
            },
            e: function(r) {
              u = !0, o = r;
            },
            f: function() {
              try {
                a || null == t.return || t.return();
              } finally {
                if (u) throw o;
              }
            }
          };
        }(arg.slice(1));
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done; ) {
            var char = _step.value, key$1 = alias[char] || char;
            setFlag(res, key$1, !0);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return i;
      }
      var key = alias[arg[1]] || arg[1];
      if (boolean.includes(key)) return setFlag(res, key, !0), i;
      if (array.includes(key)) {
        for (var values = [], j = i; isArg(raw, j); ) values.push(cast(raw[++j]));
        return setFlag(res, key, (res.flags[key] || []).concat(values)), j;
      }
      var val = !isArg(raw, i) || cast(raw[++i]);
      return setFlag(res, key, val), i;
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
}

var flags_1, hasRequiredFlags, e = getDefaultExportFromCjs(requireFlaget()), flags = getDefaultExportFromCjs(hasRequiredFlags ? flags_1 : (hasRequiredFlags = 1, 
flags_1 = getAugmentedNamespace(Object.freeze({
  __proto__: null,
  default: e
}))));

module.exports = flags;
