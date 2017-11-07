/**
 * Created by apple on 2017/9/29.
 */
import * as storeSqlite from './StoreSqlite/User/index'

import * as groupStoreSqlite from './StoreSqlite/Group'

import dataRquest from './dataRequest'
import RelationModel from '../../Core/User/dto/RelationModel'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());


let _request = new dataRquest();
let currentObj = undefined;

//缓存数据
let cache = {"private":{},"chatroom":{},"groupMember":{}};

//在登录账号之后，返回账号id，通过id找到对应的文件夹来进行sqlite的选择
export default class User {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);

        this.request = _request;

        currentObj = this;
    }

    //设置request的方式webapi，还是socket
    // setRequest(request){
    //     _request = request;
    // }


    //todo:lizongjun 用户管理模块里面包含了所有数据，1 从缓存找 2从数据库找 3请求获取，暴露给外界接口
    //新方法：

    //通过id和类型获取群或者好友的信息
    getInformationByIdandType(Id,type,callback){
        console.log(cache);
        if(cache[type].length == 0 || cache[type][Id] == undefined){

            if(type == 'private'){
                    storeSqlite.getRelation(Id,type,(relations)=>{
                        //如果数据库也没有这条消息
                        if(relations.length == 0){
                            this.request.getAccountByAccountIdAndType(Id,type,(success,results)=>{
                                if(success) {
                                    callback(results)
                                    cache[type][Id] = relations[0];
                                }
                            })
                        }else{
                            callback(relations[0])
                            cache[type][Id] = relations[0];
                        }
                    })

            }else if(type == 'chatroom'){
                groupStoreSqlite.getRelation(Id,type,(relations)=>{
                    //如果数据库也没有这条消息
                    if(relations.length == 0){
                        this.request.getAccountByAccountIdAndType(Id,type,(success,results)=>{
                            if(success) {
                                let relation = new RelationModel();
                                relation.RelationId = results.ID;
                                relation.owner = results.Owner;
                                relation.Nick = results.Name;
                                relation.Type = 'chatroom';
                                relation.show = 'false';
                                relation.avator = results.ProfilePicture == null?"":results.ProfilePicture;
                                callback(relation)


                                //数据库也没有这条group的记录，那么就需要添加进groupList中

                                currentObj.AddGroupAndMember(relation,results.MemberList);

                                cache[type][Id] = relations[0];
                            }
                        })
                    }else{
                        cache[type][Id]
                        callback(relations[0])
                        cache[type][Id] = relations[0];
                    }
                })
            }

        }else{
            callback(cache[type][Id])
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

    getRelation(Id,type,callback){

    }

    //添加Group到GourpList中去
    AddGroupAndMember(Group,members){

        //添加群到grouplist中
        groupStoreSqlite.addNewRelation(Group);

        //为group添加groupMember
        // groupStoreSqlite.initGroupMemberByGroupId("",[])

    }


    //通过GroupId获取当前群的member信息
    GetMembersByGroupId(groupId,callback){
        groupStoreSqlite.GetMembersByGroupId(groupId,callback);
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

    closeDB(){
        storeSqlite.closeAccountDb();
        groupStoreSqlite.closeAccountDb();
    }



    //Group.db


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
    //退群
    deleteFromGrroup(RelationId){
        groupStoreSqlite.deleteRelation(RelationId)
    }

}