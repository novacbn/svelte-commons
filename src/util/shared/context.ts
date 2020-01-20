/**
 * Represents the href of the current context (with no origin), used in various places
 * in `svelte-commons`, such as `util/browser/location` in-lieu of `window.location.href`.
 * IMPLEMENTATION NOTE: Servers! Set it in your middleware / routes to support proper SSR.
 *
 * @internal
 */
let CONTEXT_CURRENT_HREF = "";

/**
 * Represents the origin of the current context, used in various places in `svelte-commons`,
 * such as `util/browser/location` in-lieu of `window.location`.
 * IMPLEMENTATION NOTE: This value is currently only used so `URL` will construct with `URL.hash`
 * values. So you normally shouldn't have to update this!
 *
 * @internal
 */

let CONTEXT_CURRENT_ORIGIN = "http://localhost/";

/**
 * Represents if the current context of the code is running in Browser
 */
export const CONTEXT_IS_BROWSER = typeof window !== "undefined";

/**
 * Returns the current **COMPLETE** (e.g. incl. query params / hash) href of the context, `location.href` (Browser) / `CONTEXT_CURRENT_HREF` (Server)
 */
export function get_current_href(): string {
    if (CONTEXT_IS_BROWSER) return `${location.href}${location.search}${location.hash}`;
    return CONTEXT_CURRENT_HREF;
}

/**
 * Returns the `URL` instance of the current context, based on `location` (Browser) / `CONTEXT_CURRENT_HREF` and `CONTEXT_CURRENT_ORIGIN` (Server)
 */
export function get_current_url(): URL {
    if (CONTEXT_IS_BROWSER) return new URL(location as any);
    return new URL(get_current_href(), get_current_href());
}

/**
 * Returns the URL origin of the context, `location.origin` (Browser) / `CONTEXT_CURRENT_ORIGIN` (Server)
 */
export function get_current_origin(): string {
    if (CONTEXT_IS_BROWSER) return location.origin;
    return CONTEXT_CURRENT_ORIGIN;
}

/**
 * Sets the current **COMPLETE** (e.g. incl. query params / hash) href of the context, `location.href` (Browser) / `CONTEXT_CURRENT_HREF` (Server)
 * @param href
 */
export function set_current_href(href: string): void {
    if (CONTEXT_IS_BROWSER) location.href = href;
    else CONTEXT_CURRENT_HREF = href;
}

/**
 * Sets the current URL origin of the context, `location.origin` (Browser) / `CONTEXT_CURRENT_ORIGIN` (Server)
 * NOTE: `location.origin` is actually read-only in Browsers
 * @param origin
 */
export function set_current_origin(origin: string): void {
    if (CONTEXT_IS_BROWSER) {
        throw ReferenceError("bad dispatch to 'set_current_origin' (readonly in Browser)");
    } else CONTEXT_CURRENT_ORIGIN = origin;
}
