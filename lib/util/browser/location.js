"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("../shared/url");
/**
 * Returns the options passable into [[goto]], with standard defaults
 *
 * @internal
 *
 * @param options
 */
function GotoOptions(options) {
    if (options === void 0) { options = {}; }
    var _a = options.base_url, base_url = _a === void 0 ? "" : _a, _b = options.hash, hash = _b === void 0 ? false : _b, _c = options.replace, replace = _c === void 0 ? false : _c;
    return { base_url: base_url, hash: hash, replace: replace };
}
/**
 * Return a new `URL` instance, based off the current Browser `Location`
 *
 * > **NOTE**: Set `hash` to `true`, to parse the current `Location.hash` as the URL
 *
 * @internal
 *
 * @param hash
 */
function get_location_url(hash) {
    if (hash === void 0) { hash = false; }
    if (hash) {
        var href = location.hash.slice(1);
        return new URL(href, location.origin);
    }
    return new URL(location);
}
exports.get_location_url = get_location_url;
/**
 * Updates the current Browser `Location` with a given `URL` instance, using its `.hash`, `.pathname`, and `.search` components
 *
 * > **NOTE**: Set `hash` to `true`, to set `Location.hash` as the URL
 *
 * @internal
 *
 * @param url
 * @param hash
 * @param replace
 */
function update_location_url(url, hash, replace) {
    if (hash === void 0) { hash = false; }
    if (replace === void 0) { replace = false; }
    var href;
    if (hash)
        href = url_1.format_url(location, false) + "#" + url_1.format_url(url);
    else
        href = url_1.format_url(url);
    if (replace)
        history.replaceState(null, "", href);
    else
        history.pushState(null, "", href);
    // We need to trigger the `popstate` event, so any listener can update, e.g. `router` Store.
    var state = history.state;
    var event = new PopStateEvent("popstate", { state: state });
    window.dispatchEvent(event);
}
exports.update_location_url = update_location_url;
/**
 * Progammatically navigates the Browser to the given `href`, and pushes a new History state
 *
 * > **NOTE**: If your `<head>` element contains a [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) element, [[goto]] will read it as the base url
 *
 * As a simple example:
 *
 * ```javascript
 * import {goto} from "svelte-commons/lib/util/browser";
 *
 * // Navigate to a page decending from the current origin
 * goto("/shopping-cart/item-274");
 *
 * // Similar to above, by updates the Browser's hash string instead
 * goto("/shopping-cart/item-274", {hash: true});
 * ```
 *
 * You can also replace the current History state:
 *
 * ```javascript
 * import {goto} from "svelte-commons/lib/util/browser";
 *
 * // Same above, but replacing current History state
 * goto("/shopping-cart/item-274", {replace: true});
 * ```
 *
 * Finally, you can navigate to entirely different websites:
 *
 * ```javascript
 * import {goto} from "svelte-commons/lib/util/browser";
 *
 * // This will cause a full page reload while navigating
 * goto("https://google.com");
 * ```
 * @param href
 * @param options
 */
function goto(href, options) {
    if (!url_1.is_internal_href(href)) {
        var url_2 = new URL(href);
        // If the `href` doesn't have a matching origin, we can just do a full page navigation
        // to it, otherwise we just need to extract the exact everything after the origin
        if (url_2.origin !== location.origin)
            location.href = href;
        else
            href = url_1.format_url(url_2);
    }
    var _a = GotoOptions(options), base_url = _a.base_url, hash = _a.hash, replace = _a.replace;
    // We need to have the Browser process the URL, so properly URL directives are followed
    // e.g. `/absolute/path`, `./relative/path`, `../directory/up/path`, etc...
    var url = new URL(href, get_location_url(hash).href);
    // We need to support passable base urls overrides here
    if (base_url)
        url.pathname = url_1.join(base_url, url.pathname);
    else if (!hash) {
        // We can also support non-hash mode base urls via `<base href="XXX" />` in `<head>`
        if (location.href !== document.baseURI) {
            var pathname = new URL(document.baseURI).pathname;
            url.pathname = url_1.join(pathname, url.pathname);
        }
    }
    update_location_url(url, hash, replace);
}
exports.goto = goto;
//# sourceMappingURL=location.js.map