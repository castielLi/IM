/**
 * Created by apple on 2017/9/29.
 */
import * as storeSqlite from './StoreSqlite'

import * as groupStoreSqlite from './StoreSqlite/Group'

import dataRquest from './dataRequest'


let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());


let _request = new dataRquest();

//缓存数据
let cache = {"user":[],"group":[]};

//在登录账号之后，返回账号id，通过id找到对应的文件夹来进行sqlite的选择
export default class User {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);

        this.request = _request;
    }

    //设置request的方式webapi，还是socket
    // setRequest(request){
    //     _request = request;
    // }


    //todo:lizongjun 用户管理模块里面包含了所有数据，1 从缓存找 2从数据库找 3请求获取，暴露给外界接口
    //新方法：

    //通过id和类型获取群或者好友的信息
    getInformationByIdandType(Id,type){
        if(cache[type].length == 0 || cache[type][Id] == undefined){

            let relations = storeSqlite.getRelation(Id,type,function(relations){
                return relations;
            });

            //数据库里面依旧没有这条消息
            if(relations.length == 0){

                this.request.getAccountByAccountIdAndType(Id,type,function(results){

                })

            }else{
                cache[type][Id] =  relations[0];
                return cache[type][Id];
            }

        }else{
            return cache[type][Id];
        }
    }
















    //初始化数据库
    initIMDatabase(AccountId){
        storeSqlite.initIMDatabase(AccountId,function(){

        });
        groupStoreSqlite.initIMDatabase(AccountId,function(){

        })
    }

    getAllRelation(callback){
        return storeSqlite.GetRelationList(callback)
    }


    getAllGroupFromGroup(callback){
        return groupStoreSqlite.GetRelationList(callback)
    }

    //添加群进Group
    AddNewGroupToGroup(Relation){
        groupStoreSqlite.addNewRelation(Relation)
    }
    initGroup(GroupList,callback){
        groupStoreSqlite.initRelations(GroupList,callback);
    }
    //更新群名
    updateGroupName(relationId,name){
        groupStoreSqlite.UpdateGroupName(relationId,name);
    }

    getRelation(Id,type,callback){

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

    updateDisplayOfRelation(relationId,bool){
        storeSqlite.updateRelationDisplayStatus(relationId,bool);
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