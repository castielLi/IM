/**
 * Created by apple on 2017/9/29.
 */
import * as storeSqlite from './StoreSqlite'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

//在登录账号之后，返回账号id，通过id找到对应的文件夹来进行sqlite的选择
export default class User {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);
    }

    //初始化数据库
    initIMDatabase(AccountId){
        storeSqlite.initIMDatabase(AccountId,function(){

        });
    }

    getAllRelation(){
        return storeSqlite.GetRelationList(function(relations){

        })
    }


    //初始化好友列表
    initRelations(friendList,blackList,GroupList,callback){
        storeSqlite.initRelations(friendList,blackList,GroupList,callback);
    }

    //更改好友黑名单设置
    changeRelationBlackList(isBlackList,RelationId){
       storeSqlite.changeRelationBliackList(isBlackList,RelationId);
    }

    //删除好友或者退出群组
    deleteRelation(Relation){
       storeSqlite.deleteRelation(Relation)
    }

    //更新关系头像
    updateAvator(RelationId,localImagePath,avatorUrl){

    }

    //修改关系
    updateRelation(Relation){
        storeSqlite.updateRelation(Relation)
    }

    //修改群备注
    updateGroupComment(RelationId,Comment){

    }



    AddNewRelation(){

    }
}