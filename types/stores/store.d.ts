/**
 * NOTE:
 *  Since Svelte doesn't export the direct input / output type
 *  aliases, we need to redefine them below
 */
/**
 *
 */
export declare type IInvalidator<T> = (value?: T) => void;
/**
 *
 */
export declare type IStartStopNotifier<T> = (set: ISubscriber<T>) => IUnsubscriber;
/**
 *
 */
export declare type ISubscriber<T> = (value: T) => void;
/**
 *
 */
export declare type IUnsubscriber = () => void;
/**
 *
 */
export declare type IUpdater<T> = (value: T) => T;
/**
 * Returns if the `value` matches a `Readable` Svelte Store implementation
 */
export declare function is_readable(value: unknown): boolean;
/**
 * Returns if the `value` matches a `Writable` Svelte Store implementation
 * @param value
 */
export declare function is_writable(value: unknown): boolean;
