/**
 * Represents the callback supplied by subscribers to be called every dispatch
 */
export declare type IEventCallback<T> = (value: T) => void;
/**
 * Represents the notification subscription used whenever a first subscription is added
 */
export declare type IEventNotifier<T> = (dispatch: IEventCallback<T>) => IEventUnsubscriber;
/**
 * Represents the unsubscribe function returned by [[IEvent.subscribe]]
 */
export declare type IEventUnsubscriber = () => void;
/**
 * Represents an interface to publish event data via a singleton instance, that is compatible with Svelte Store subscriptions
 */
export interface IEvent<T> {
    /**
     * Dispatches new event details to every subscriber
     * @param details
     */
    dispatch(details: T): void;
    /**
     * Subscribes to new incoming event dispatches
     * @param run
     */
    subscribe(run: IEventCallback<T>): IEventUnsubscriber;
}
/**
 * Returns a new [[IEvent]] instance, for handling event publishing in non-DOM related contexts
 * @param start
 */
export declare function event<T>(start: IEventNotifier<T>): IEvent<T>;
