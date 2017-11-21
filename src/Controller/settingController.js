/**
 * Created by apple on 2017/11/21.
 */
import IM from '../Core/IM'
import User from '../Core/UserGroup'


let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
        this.im = new IM();
        this.user = new User();
    }
}());

export default class settingController {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);

    }
}