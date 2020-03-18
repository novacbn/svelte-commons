import {format_url, is_internal_href, join} from "../shared/url";

/**
 * Represents the options passable into [[goto]]
 */
export interface IGotoOptions {
    /**
     * Represents the base url of your Web Application, e.g. if the entry point is `https://my.domain/my-application`, you should set to `/my-application/`
     *
     * **NOTE**: The [[goto]] function also reads from any [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) elements in `<head>`, if present
     */
    base_url: string;

    /**
     * Represents if the URL hash should be used as the target href source, e.g. `https://my.domain/path/to/route?x=y` or `https://my.domain/#path/to/route?x=y`
     */
    hash: boolean;

    /**
     * Represents if the navigation should create a new [History](https://developer.mozilla.org/en-US/docs/Web/API/History_API) entry or not, e.g. Forward / Back Button-able
     */
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
 * Return a new `URL` instance, based off the current Browser `Location`
 *
 * > **NOTE**: Set `hash` to `true`, to parse the current `Location.hash` as the URL
 *
 * @internal
 *
 * @param hash
 */
export function get_location_url(hash: boolean = false): URL {
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
export function update_location_url(
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
    if (!is_internal_href(href)) {
        const url = new URL(href);

        // If the `href` doesn't have a matching origin, we can just do a full page navigation
        // to it, otherwise we just need to extract the exact everything after the origin
        if (url.origin !== location.origin) location.href = href;
        else href = format_url(url);
    }

    const {base_url, hash, replace} = GotoOptions(options);

    // We need to have the Browser process the URL, so properly URL directives are followed
    // e.g. `/absolute/path`, `./relative/path`, `../directory/up/path`, etc...
    const url = new URL(href, get_location_url(hash).href);

    // We need to support passable base urls overrides here
    if (base_url) url.pathname = join(base_url, url.pathname);
    else if (!hash) {
        // We can also support non-hash mode base urls via `<base href="XXX" />` in `<head>`
        if (location.href !== document.baseURI) {
            const {pathname} = new URL(document.baseURI);

            url.pathname = join(pathname, url.pathname);
        }
    }

    update_location_url(url, hash, replace);
}
