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
var shared_1 = require("../shared");
/**
 * Updates the current search string
 * NOTE: Set `hash` to `true`, to update `location.hash` as a proper URL
 * @param search
 * @param hash
 * @param push_state
 * @param state
 */
function update_search(search, hash, push_state, state) {
    if (hash === void 0) { hash = false; }
    if (push_state === void 0) { push_state = false; }
    if (state === void 0) { state = history.state; }
    var url = get_url(hash);
    url.search = search.toString();
    update_url(url, hash, push_state, state);
}
/**
 * Returns an object mapping of the current `location.search` value
 * NOTE: Set `hash` to `true` for hash-based routing systems
 * @param hash
 */
function get_query_params(hash) {
    var e_1, _a;
    if (hash === void 0) { hash = false; }
    var search = get_url(hash).searchParams;
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
 * Returns the current URL based on `Location`
 * NOTE: Set `hash` to `true`, to use `location.hash` as the source instead
 * @param hash
 */
function get_url(hash) {
    if (hash === void 0) { hash = false; }
    // NOTE: We need to be able to support the current context's
    // set URL. That way we can run properly in SSR mode
    var url = shared_1.get_current_url();
    if (hash)
        return new URL(url.hash.slice(1), shared_1.get_current_origin());
    return url;
}
exports.get_url = get_url;
/**
 * Sets the current url
 * NOTE: Set `hash` to `true`, to update `location.hash` as a proper URL
 * @param url
 * @param hash
 * @param push_state
 * @param state
 */
function update_url(url, hash, push_state, state) {
    if (hash === void 0) { hash = false; }
    if (push_state === void 0) { push_state = false; }
    if (state === void 0) { state = history.state; }
    var updater = push_state ? "pushState" : "replaceState";
    // Want to make sure empty pathnames are just removed from the
    // hash string entirely
    var pathname = url.pathname;
    if (pathname === "/")
        pathname = "";
    var href = "" + pathname + url.search + url.hash;
    if (hash)
        href = "" + location.pathname + location.search + (href ? "#" + href : "");
    history[updater](state, "", href);
}
exports.update_url = update_url;
/**
 * Updates the current `location.search` with the `*.toString()` values from a `params` mapping
 * NOTE: Set `hash` to `true` for hash-based routing systems
 * NOTE: Mapped values set to `undefined` / `""` / `false`, they will be deleted from the query string instead
 * @param params
 * @param hash_mode
 */
function update_query_params(params, hash) {
    if (hash === void 0) { hash = false; }
    var search = get_url(hash).searchParams;
    for (var key in params) {
        var value = params[key];
        if (typeof value === "undefined" || value === "" || value === false)
            search.delete(key);
        else
            search.set(key, value.toString());
    }
    update_search(search, hash);
}
exports.update_query_params = update_query_params;
//# sourceMappingURL=location.js.map