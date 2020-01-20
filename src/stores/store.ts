/**
 * NOTE:
 *  Since Svelte doesn't export the direct input / output type
 *  aliases, we need to redefine them below
 */

/**
 *
 */
export type IInvalidator<T> = (value?: T) => void;

/**
 *
 */
export type IStartStopNotifier<T> = (set: ISubscriber<T>) => IUnsubscriber;

/**
 *
 */
export type ISubscriber<T> = (value: T) => void;

/**
 *
 */
export type IUnsubscriber = () => void;

/**
 *
 */
export type IUpdater<T> = (value: T) => T;

/**
 * Returns if the `value` matches a `Readable` Svelte Store implementation
 */
export function is_readable(value: unknown): boolean {
    // @ts-ignore
    return typeof value === "object" && typeof value.subscribe === "function";
}

/**
 * Returns if the `value` matches a `Writable` Svelte Store implementation
 * @param value
 */
export function is_writable(value: unknown): boolean {
    return (
        // @ts-ignore
        typeof value === "object" &&
        // @ts-ignore
        typeof value.set === "function" &&
        // @ts-ignore
        typeof value.subscribe === "function" &&
        // @ts-ignore
        typeof value.update === "function"
    );
}
