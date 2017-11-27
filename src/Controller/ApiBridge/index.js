/**
 * Created by apple on 2017/11/27.
 */

import * as ApiUrls from './apiConfig'
import Network from '../../Core/Networking/Network'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

let _network = new Network();

let currentObj = undefined;

export default class ApiBridge {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);
        this.network = _network;
        currentObj = this;
    }


    Login(params,callback){
        this.network.methodPOST(ApiUrls.API_Login,params,function(result){

            if(result.success){
                Network.setNeedAuth(true)
                Network.setAuthorization(result.data.Data["SessionToken"]);
            }
            callback(result);
        });
    }

    LoginWithToken(params,callback,storage){

        Network.setNeedAuth(true)
        Network.setAuthorization(storage.SessionToken);

        this.network.methodPOST(ApiUrls.API_LoginByToken,params,function(result){

            if(result.success){
                Network.setAuthorization(result.data.Data["SessionToken"]);
            }

            callback(result);
        })
    }

    GetContactList(params,callback){
        this.network.methodPOST(ApiUrls.API_GetContactList,params,function(result){
            callback(result);
        })
    }
}