/**
 * Represents the callback supplied by subscribers to be called every dispatch
 */
export type IEventCallback<T> = (value: T) => void;

/**
 * Represents the notification subscription used whenever a first subscription is added
 */
export type IEventNotifier<T> = (dispatch: IEventCallback<T>) => IEventUnsubscriber;

/**
 * Represents the unsubscribe function returned by [[IEvent.subscribe]]
 */
export type IEventUnsubscriber = () => void;

/**
 * Represents the tuple that internally represents a subscription
 */
type IEventSubscriber<T> = [IEventCallback<T>];

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
 *
 * As a minimal example:
 *
 * ```javascript
 * import {event} from "svelte-commons/lib/util/event";
 *
 * // Initialize our event publisher as a singleton
 * const MY_EVENT = event((dispatch) => {
 *     // The callback we provided, will run whenever we get a first subscriber
 *     console.log("Got my first subscriber!");
 *
 *     return () => {
 *         // And the callback returned, will run whenever we lose our last subscriber
 *         console.log("Lost my last subscriber!");
 *     };
 * });
 *
 * MY_EVENT.subscribe((details) => {
 *     console.log(details);
 * }); // Will log any dispatches to the event publisher
 *
 * MY_EVENT.dispatch({message: "Hello world!"}); // logs: `{"message": "Hello world!"}`
 * ```
 *
 * @param start
 */
export function event<T>(start: IEventNotifier<T>): IEvent<T> {
    const subscribers: IEventSubscriber<T>[] = [];

    let stop: IEventUnsubscriber | null;

    const dispatch = (details: T) => {
        if (subscribers.length > 0) {
            for (let index = 0; index < subscribers.length; index++) {
                const [run] = subscribers[index];

                run(details);
            }
        }
    };

    const subscribe = (run: IEventCallback<T>) => {
        const subscriber: IEventSubscriber<T> = [run];

        subscribers.push(subscriber);
        if (start && subscribers.length === 1) stop = start(dispatch);

        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index > 0) {
                subscribers.splice(index, 1);

                if (stop && subscribers.length == 0) {
                    stop();
                    stop = null;
                }
            }
        };
    };

    return {dispatch, subscribe};
}
