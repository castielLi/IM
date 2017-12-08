/**
 * Created by apple on 2017/12/8.
 */


let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

let currentObj = undefined;

export default class ApplyFriend {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);

        currentObj = this;
    }
}