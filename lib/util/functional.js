"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns true if the passed in `value` is `false`, `undefined`, or `null`
 * @param value
 */
function is_falsy(value) {
    return typeof value === "undefined" || value === false || value === null;
}
exports.is_falsy = is_falsy;
/**
 * Returns a lookup map of the supplied `object`
 *
 * e.g.
 * ```json
 * [
 *  "my_value_one",
 *  "my_value_two"
 * ]
 * ```
 *
 * becomes:
 * ```json
 * {
 *  "my_value_one": true,
 *  "my_value_two": true
 * }
 * ```
 * @param array
 * @param blacklist
 */
function make_array_lookup(array, blacklist) {
    var e_1, _a;
    if (blacklist === void 0) { blacklist = []; }
    var lookup = {};
    try {
        for (var array_1 = __values(array), array_1_1 = array_1.next(); !array_1_1.done; array_1_1 = array_1.next()) {
            var key = array_1_1.value;
            if (!blacklist.includes(key))
                lookup[key] = true;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (array_1_1 && !array_1_1.done && (_a = array_1.return)) _a.call(array_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return lookup;
}
exports.make_array_lookup = make_array_lookup;
/**
 * Returns a lookup map of the supplied `object`
 *
 * e.g.
 * ```json
 * {
 *  "my_key_one": "...some value...",
 *  "my_key_two": "...some value..."
 * }
 * ```
 *
 * becomes:
 * ```json
 * {
 *  "my_key_one": true,
 *  "my_key_two": true
 * }
 * ```
 * @param object
 * @param blacklist
 */
function make_object_lookup(object, blacklist) {
    var e_2, _a;
    if (blacklist === void 0) { blacklist = []; }
    var lookup = {};
    try {
        for (var _b = __values(Object.keys(object)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            if (!blacklist.includes(key))
                lookup[key] = true;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return lookup;
}
exports.make_object_lookup = make_object_lookup;
//# sourceMappingURL=functional.js.map