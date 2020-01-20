/**
 * Represents a Svelte Action initializer on a `HTMLElement` via a `use:*` directive
 */
export type IAction = (element: HTMLElement, parameters: any) => IActionLifecycle;

/**
 * Represents the resulting Svelte Action lifecycle function map
 */
export interface IActionLifecycle {
    /**
     * Represents when the `HTMLElement` is about to be cleaned up
     */
    destroy?(): void;

    /**
     * Called whenever the parameters of the `use:*` directive change
     * @param parameters
     */
    update?(parameters: any): void;
}
