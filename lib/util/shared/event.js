"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns a new [[IEvent]] instance, for handling event publishing in non-DOM related contexts
 * @param start
 */
function event(start) {
    var subscribers = [];
    var stop;
    var dispatch = function (details) {
        if (subscribers.length > 0) {
            for (var index = 0; index < subscribers.length; index++) {
                var _a = __read(subscribers[index], 1), run = _a[0];
                run(details);
            }
        }
    };
    var subscribe = function (run) {
        var subscriber = [run];
        subscribers.push(subscriber);
        if (start && subscribers.length === 1)
            stop = start(dispatch);
        return function () {
            var index = subscribers.indexOf(subscriber);
            if (index > 0) {
                subscribers.splice(index, 1);
                if (stop && subscribers.length == 0) {
                    stop();
                    stop = null;
                }
            }
        };
    };
    return { dispatch: dispatch, subscribe: subscribe };
}
exports.event = event;
//# sourceMappingURL=event.js.map