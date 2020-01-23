"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents the href of the current context (with no origin), used in various places
 * in `svelte-commons`, such as `util/browser/location` in-lieu of `window.location.href`.
 * IMPLEMENTATION NOTE: Servers! Set it in your middleware / routes to support proper SSR.
 *
 * @internal
 */
var CONTEXT_CURRENT_HREF = "";
/**
 * Represents the origin of the current context, used in various places in `svelte-commons`,
 * such as `util/browser/location` in-lieu of `window.location`.
 * IMPLEMENTATION NOTE: This value is currently only used so `URL` will construct with `URL.hash`
 * values. So you normally shouldn't have to update this!
 *
 * @internal
 */
var CONTEXT_CURRENT_ORIGIN = "http://localhost/";
/**
 * Represents if the current context of the code is running in Browser
 */
exports.CONTEXT_IS_BROWSER = typeof window !== "undefined";
/**
 * Returns the current **COMPLETE** (e.g. incl. query params / hash) href of the context, `location.href` (Browser) / `CONTEXT_CURRENT_HREF` (Server)
 */
function get_current_href() {
    if (exports.CONTEXT_IS_BROWSER)
        return "" + location.href + location.search + location.hash;
    return CONTEXT_CURRENT_HREF;
}
exports.get_current_href = get_current_href;
/**
 * Returns the `URL` instance of the current context, based on `location` (Browser) / `CONTEXT_CURRENT_HREF` and `CONTEXT_CURRENT_ORIGIN` (Server)
 */
function get_current_url() {
    if (exports.CONTEXT_IS_BROWSER)
        return new URL(location);
    return new URL(get_current_href(), get_current_href());
}
exports.get_current_url = get_current_url;
/**
 * Returns the URL origin of the context, `location.origin` (Browser) / `CONTEXT_CURRENT_ORIGIN` (Server)
 */
function get_current_origin() {
    if (exports.CONTEXT_IS_BROWSER)
        return location.origin;
    return CONTEXT_CURRENT_ORIGIN;
}
exports.get_current_origin = get_current_origin;
/**
 * Sets the current **COMPLETE** (e.g. incl. query params / hash) href of the context, `location.href` (Browser) / `CONTEXT_CURRENT_HREF` (Server)
 * @param href
 */
function set_current_href(href) {
    if (exports.CONTEXT_IS_BROWSER)
        location.href = href;
    else
        CONTEXT_CURRENT_HREF = href;
}
exports.set_current_href = set_current_href;
/**
 * Sets the current URL origin of the context, `CONTEXT_CURRENT_ORIGIN` (Server)
 *
 * NOTE: Will throw an exception when ran on Browser
 *
 * @param origin
 */
function set_current_origin(origin) {
    if (exports.CONTEXT_IS_BROWSER) {
        throw ReferenceError("bad dispatch to 'set_current_origin' (readonly in Browser)");
    }
    else
        CONTEXT_CURRENT_ORIGIN = origin;
}
exports.set_current_origin = set_current_origin;
//# sourceMappingURL=context.js.map