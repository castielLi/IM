/**
 * Created by apple on 2017/11/3.
 */

import HttpBridge from './Http/HttpBridge'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

let _type = undefined;

export default class ApiBridge {
    constructor(type="http") {
        if (__instance()) return __instance();

        __instance(this);

        _type = type;
        if(type == "http"){
            this.request = new HttpBridge();
        }
    }
}