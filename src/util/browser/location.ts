import {IS_BROWSER} from "../shared/browser";
import {is_internal_url, join} from "../shared/url";

/**
 * Represents the options passable into [[goto]]
 */
export interface IGotoOptions {
    base_url: string;

    hash: boolean;

    replace: boolean;
}

/**
 * Returns the options passable into [[goto]], with standard defaults
 *
 * @internal
 *
 * @param options
 */
function GotoOptions(options: Partial<IGotoOptions> = {}): IGotoOptions {
    const {base_url = "", hash = false, replace = false} = options;

    return {base_url, hash, replace};
}

/**
 * Returns a `URL` instance stringified via `.pathname` + `.search` + `.hash`
 *
 * > **NOTE**: Set `include_hash` to `false`, to disabled `.hash` as a postfix
 *
 * @internal
 *
 * @param url
 * @param include_hash
 */
export function format_url(url: Location | URL, include_hash: boolean = true): string {
    const {hash, pathname, search} = url;

    if (include_hash) return pathname + search + hash;
    return pathname + search;
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
export function get_url(hash: boolean = false): URL {
    if (hash) {
        const href = location.hash.slice(1);

        return new URL(href, location.origin);
    }

    return new URL(location as any);
}

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
export function update_url(
    url: Location | URL,
    hash: boolean = false,
    replace: boolean = false
): void {
    let href: string;
    if (hash) href = format_url(location, false) + "#" + format_url(url);
    else href = format_url(url);

    if (replace) history.replaceState(null, "", href);
    else history.pushState(null, "", href);

    // We need to trigger the `popstate` event, so any listener can update, e.g. `router` Store.
    const {state} = history;
    const event = new PopStateEvent("popstate", {state});

    window.dispatchEvent(event);
}

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
export function goto(href: string, options: Partial<IGotoOptions>): void {
    if (!is_internal_url(href)) {
        const url = new URL(href);

        // If the `href` doesn't have a matching origin, we can just do a full page navigation
        // to it, otherwise we just need to extract the exact everything after the origin
        if (url.origin !== location.origin) location.href = href;
        else href = format_url(url);
    }

    const {base_url, hash, replace} = GotoOptions(options);

    // We need to have the Browser process the URL, so properly URL directives are followed
    // e.g. `/absolute/path`, `./relative/path`, `../directory/up/path`, etc...
    const url = new URL(href, get_url(hash).href);

    // We need to support passable base urls overrides here
    if (base_url) url.pathname = join(base_url, url.pathname);
    else if (!hash && IS_BROWSER) {
        // We can also support non-hash mode base urls via `<base href="XXX" />` in `<head>`
        if (location.href !== document.baseURI) {
            const {pathname} = new URL(document.baseURI);

            url.pathname = join(pathname, url.pathname);
        }
    }

    update_url(url, hash, replace);
}
