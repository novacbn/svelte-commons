"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function RouterOptions(options) {
    if (options === void 0) { options = {}; }
    var _a = options.base_url, base_url = _a === void 0 ? "/" : _a, _b = options.hash, hash = _b === void 0 ? false : _b;
    return { base_url: base_url, hash: hash };
}
/*
export function router(routes: IRouterMap, options?: Partial<IRouterOptions>): IRouterReturn {
    const router = make_router(routes);
    options = RouterOptions(options);

    const {base_url, hash} = options;
}*/
/*
export function router(
    routes: IRouterMap,
    options: IPathnameOptions = {}
): Readable<IRouterValue | null> {
    const router = make_router(routes);
    const store = pathname(options);

    return readable<IRouterValue | null>(null, (set) => {
        function on_pathname(pathname: string) {
            const results = router(pathname);

            if (results) set({Component: results[1], parameters: results[0]});
            else set(null);
        }

        const unsubscribe = store.subscribe(on_pathname);
        return () => {
            unsubscribe();
        };
    });
}*/
//# sourceMappingURL=router.js.map