/**
 * Represents values that can be serialize / deserialized via `JSON.stringify` / `JSON.parse`
 */
export declare type IJSONType = boolean | number | string | IJSONType[] | {
    [key: string]: IJSONType;
};
