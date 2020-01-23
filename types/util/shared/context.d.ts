/**
 * Represents if the current context of the code is running in Browser
 */
export declare const CONTEXT_IS_BROWSER: boolean;
/**
 * Returns the current **COMPLETE** (e.g. incl. query params / hash) href of the context, `location.href` (Browser) / `CONTEXT_CURRENT_HREF` (Server)
 */
export declare function get_current_href(): string;
/**
 * Returns the `URL` instance of the current context, based on `location` (Browser) / `CONTEXT_CURRENT_HREF` and `CONTEXT_CURRENT_ORIGIN` (Server)
 */
export declare function get_current_url(): URL;
/**
 * Returns the URL origin of the context, `location.origin` (Browser) / `CONTEXT_CURRENT_ORIGIN` (Server)
 */
export declare function get_current_origin(): string;
/**
 * Sets the current **COMPLETE** (e.g. incl. query params / hash) href of the context, `location.href` (Browser) / `CONTEXT_CURRENT_HREF` (Server)
 * @param href
 */
export declare function set_current_href(href: string): void;
/**
 * Sets the current URL origin of the context, `CONTEXT_CURRENT_ORIGIN` (Server)
 *
 * NOTE: Will throw an exception when ran on Browser
 *
 * @param origin
 */
export declare function set_current_origin(origin: string): void;
