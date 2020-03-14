import { SvelteComponent } from "svelte/internal";
import { Readable } from "svelte/store";
import { IRouterParameters } from "../../util";
export declare type IGoto = (href: string, options?: IGotoOptions) => void;
export declare type IRouterQuery = {
    [key: string]: boolean | string | undefined;
};
export interface IGotoOptions {
    replace: boolean;
}
export interface IRouterOptions {
    base_url: string;
    hash: boolean;
}
export interface IRouterReturn {
    goto: IGoto;
    page: {
        host: Readable<string>;
        path: Readable<string>;
        params: Readable<IRouterParameters>;
        query: Readable<IRouterQuery>;
    };
}
/**
 * Represents value provided to subscriptions of the [[router]] Svelte Store
 */
export interface IRouterValue {
    /**
     * Represents the Svelte Component assigned to the current route
     */
    Component: SvelteComponent;
    /**
     * Represents the parsed parameters of the current route
     */
    parameters: IRouterParameters;
}
