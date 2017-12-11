/**
 * Created by apple on 2017/12/8.
 */
import * as storeSqlite from './StoreSqlite'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

let currentObj = undefined;

let ControllerApplyMessageHandle = undefined;

export default class ApplyFriend {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);

        currentObj = this;
    }

    //初始化IM的数据库
    initApplyFriendDatabase(AccountId){
        storeSqlite.initApplyFriendDatabase(AccountId,function(){
            //获取之前没有发送出去的消息重新加入消息队列
        });
    }


    connnectApplyFriend(updateApplyMessageHandle){
        ControllerApplyMessageHandle = updateApplyMessageHandle;
    }

    GetAllApplyMessage(callback){
       this.getSqlApplyMessage(callback);
    }


    UpdateApplyMessageStatus(key,status){
       this.updateSqlApplyMessageStatus(key,status);
    }

    AddApplyMessage(message,user){
        this.addSqlApplyMessage(message);
        ControllerApplyMessageHandle(message,user);
    }






    //数据库操作
    getSqlApplyMessage(callback){
        storeSqlite.getAllApplyMessage(callback);
    }

    updateSqlApplyMessageStatus(key,status){
        storeSqlite.updateApplyMessageStatus(key,status);
    }

    addSqlApplyMessage(message){
        storeSqlite.storeApplyMessage(message);
    }
}