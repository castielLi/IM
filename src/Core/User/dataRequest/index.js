/**
 * Created by apple on 2017/11/3.
 */

import * as httpMethods from './httpRequest'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

let _type = undefined;

export default class DataRequest {
    constructor(type="http") {
        if (__instance()) return __instance();

        __instance(this);

        _type = type;
    }


    getAccountByAccountIdAndType(accountId,type,callback){
        if(_type == "http"){
            httpMethods.getAccountByAccountId(accountId,type,callback);
        }
    }


}