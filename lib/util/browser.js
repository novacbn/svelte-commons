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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents the origin url used in `get_hash_search` / `set_hash_search`
 * NOTE: Normally would use `location.origin` instead, but wouldn't support pages like `about:blank`
 */
var URL_DUMMY_ORIGIN = "http://localhost/";
/**
 * Represents if the current context of the code is running in Browser
 */
exports.IS_BROWSER = typeof window !== "undefined";
/**
 * Retrieves the current `URLSearchParams` via `location.hash`
 */
function get_hash_search() {
    var hash = location.hash ? location.hash.slice(1) : "";
    var url = new URL(hash, URL_DUMMY_ORIGIN);
    return url.searchParams;
}
/**
 * Retrieves the current `URLSearchParams` via `location.search`
 */
function get_location_search() {
    return new URLSearchParams(location.search);
}
/**
 * Updates the current `location.hash` via setter
 * @param query_string
 */
function set_hash_search(search) {
    var query_string = search.toString();
    var hash = location.hash ? location.hash.slice(1) : "";
    var url = new URL(hash, URL_DUMMY_ORIGIN);
    var pathname = hash.startsWith("/") ? url.pathname : url.pathname.slice(1);
    location.hash = query_string ? pathname + "?" + query_string : pathname;
}
/**
 * Updates the current `location.search` via `history.replaceState`
 * @param query_string
 */
function set_location_search(search) {
    var query_string = search.toString();
    var url = query_string ? location.pathname + "?" + query_string : location.pathname;
    url = url + location.hash;
    history.replaceState(null, "", url);
}
/**
 * Returns an object mapping of the current `location.search` value
 * NOTE: Set `hash_mode` to `true` for hash-based routing systems
 * @param hash_mode
 */
function get_query_params(hash_mode) {
    var e_1, _a;
    if (hash_mode === void 0) { hash_mode = false; }
    var search = hash_mode ? get_hash_search() : get_location_search();
    var params = {};
    try {
        for (var _b = __values(search.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
            params[key] = value ? value : true;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return params;
}
exports.get_query_params = get_query_params;
/**
 * Updates the current `location.search` with the `*.toString()` values from a `params` mapping
 * NOTE: Set `hash_mode` to `true` for hash-based routing systems
 * NOTE: Mapped values set to `undefined` / `""` / `false`, they will be deleted from the query string instead
 * @param params
 * @param hash_mode
 */
function update_query_params(params, hash_mode) {
    if (hash_mode === void 0) { hash_mode = false; }
    var search = hash_mode ? get_hash_search() : get_location_search();
    for (var key in params) {
        var value = params[key];
        if (typeof value === "undefined" || value === "" || value === false)
            search.delete(key);
        else
            search.set(key, value.toString());
    }
    if (hash_mode)
        set_hash_search(search);
    else
        set_location_search(search);
}
exports.update_query_params = update_query_params;
//# sourceMappingURL=browser.js.map