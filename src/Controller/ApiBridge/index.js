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

    AddGroupToContact(params,callback){
        this.network.methodPOST(ApiUrls.API_AddGroupToContact,params,function(result){
            callback(result);
        })
    }

    RemoveGroupFromContact(params,callback){
        this.network.methodPOST(ApiUrls.API_RemoveGroupFromContact,params,function(result){
            callback(result);
        })
    }

    GetGroupInfo(params,callback){
        this.network.methodPOST(ApiUrls.API_GetGroupInfo,params,function(result){
            callback(result);
        })
    }

    ExitGroup(params,callback){
        this.network.methodPOST(ApiUrls.API_ExitGroup,params,function(result){
            callback(result);
        })
    }

    RemoveGroupMember(params,callback){
        this.network.methodPOST(ApiUrls.API_RemoveGroupMember,params,function(result){
            callback(result);
        })
    }

    SearchUser(params,callback){
        this.network.methodPOST(ApiUrls.API_SearchUser,params,function(result){
            callback(result);
        })
    }

    RemoveBlackMember(params,callback){
        this.network.methodPOST(ApiUrls.API_RemoveBlackMember,params,function(result){
            callback(result);
        })
    }

    AddBlackMember(params,callback){
        this.network.methodPOST(ApiUrls.API_AddBlackMember,params,function(result){
            callback(result);
        })
    }

    DeleteFriend(params,callback){
        this.network.methodPOST(ApiUrls.API_DeleteFriend,params,function(result){
            callback(result);
        })
    }

    GetFriendUserInfo(params,callback){
        this.network.methodPOST(ApiUrls.API_GetFriendUserInfo,params,function(result){
            callback(result);
        })
    }

    ApplyFriend(params,callback){
        this.network.methodPOST(ApiUrls.API_ApplyFriend,params,function(result){
            callback(result);
        })
    }

    CreateGroup(params,callback){
        this.network.methodPOST(ApiUrls.API_CreateGroup,params,function(result){
            callback(result);
        })
    }

    AddGroupMember(params,callback){
        this.network.methodPOST(ApiUrls.API_AddGroupMember,params,function(result){
            callback(result);
        })
    }

    ModifyGroupName(params,callback){
        this.network.methodPOST(ApiUrls.API_ModifyGroupName,params,function(result){
            callback(result);
        })
    }

    ModifyGroupDescription(params,callback){
        this.network.methodPOST(ApiUrls.API_ModifyGroupDescription,params,function(result){
            callback(result);
        })
    }
}