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

    getAllRelation(callback){
        return storeSqlite.GetRelationList(callback)
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
    deleteRelation(RelationId){
       storeSqlite.deleteRelation(RelationId)
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


    //获取所有关系的名字和头像
    getAllRelationNameAndAvator(callback){
       storeSqlite.getAllRelationAvatorAndName(callback);
    }

    //添加新关系
    AddNewRelation(Relation){
        storeSqlite.addNewRelation(Relation)
    }

    //获取关系设置
    GetRelationSetting(RelationId,callback){
        storeSqlite.getRelationSetting(RelationId,callback);
    }

    //修改关系设置
    ChangeRelationSetting(RelationSetting){
        storeSqlite.updateRelationSetting(RelationSetting);
    }

    //添加关系设置
    AddNewRelationSetting(RelationSetting){
        storeSqlite.addNewRelationSetting(RelationSetting);
    }
}