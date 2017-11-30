/**
 * Created by apple on 2017/9/29.
 */
import * as storeSqlite from './StoreSqlite/User/index'

import * as groupStoreSqlite from './StoreSqlite/Group'

import ApiBridge from '../../Controller/ApiBridge/index'
import RelationModel from './dto/RelationModel'
import MessageCommandEnum from '../../Core/IM/dto/MessageCommandEnum'
import AppCommandEnum from '../../Core/IM/dto/AppCommandEnum'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());


let _apiBridge = new ApiBridge();
let currentObj = undefined;

//缓存数据
let cache = {"private":{},"chatroom":{},"groupMember":{}};

    // cache = {"private":{
    //     a:{},b:{}
    // },"chatroom":{
    //     a:{},b:{}
    // },"groupMember":{
    //     a:[],b:[]
    // }}


//在登录账号之后，返回账号id，通过id找到对应的文件夹来进行sqlite的选择
export default class User {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);

        this.apiBridge = _apiBridge;

        currentObj = this;
    }


    //todo:lizongjun 把所有的用户，包括没有添加为好友的用户全部放到user表中，user表中group和user 分开，单独管理,groupMemberList用来管理群成员


    //todo:lizongjun 用户管理模块里面包含了所有数据，1 从缓存找 2从数据库找 3请求获取，暴露给外界接口
    //新方法：

    //通过id和类型获取群或者好友的信息
    getInformationByIdandType(Id,type,callback,messageCommand=undefined,contentCommand=undefined){
        console.log(cache);

        //当消息为向群组添加新人的时候必须重新获取数据库表
        //当缓存中没有该群或者好友信息
        if(cache[type].length == 0 || cache[type][Id] == undefined){

            //向数据库查找好友信息
            if(type == 'private'){
                    storeSqlite.getRelation(Id,type,(relations)=>{
                        //如果数据库也没有这条消息
                        if(relations.length == 0){
                            //请求http获取信息
                            currentObj.apiBridge.request.SearchUser({"Keyword":Id},(response)=>{
                                if(response.success) {
                                    let results = response.data.Data;
                                    let relation = new RelationModel();
                                    relation.RelationId = results.Account;
                                    relation.Nick = results.Nickname;
                                    relation.Type = 'private';
                                    relation.show = 'false';
                                    relation.avator = results.HeadImageUrl == null?"":results.HeadImageUrl;
                                    cache[type][Id] = relation;

                                    //把这个user添加到数据库里面，将show设置为false 代表这个用户不是好友

                                    currentObj.AddNewRelation(relation,function(){
                                        callback(relation);
                                    });

                                }else{
                                    let errMsg = response.errorMessage;
                                    alert("获取群消息失败，原因："+errMsg)
                                }
                            })
                        }else{

                            cache[type][Id] = relations[0];
                            callback(relations[0])
                        }
                    })

            }else if(type == 'chatroom'){

                let groupMembers = [];
                let groupMembersInfo = [];

                    groupStoreSqlite.getRelation(Id,type,(relations)=>{
                        //如果数据库也没有这条消息

                        if(relations.length == 0){
                            currentObj.apiBridge.request.GetGroupInfo({"GroupId":Id},(response)=>{
                                if(response.success) {
                                    currentObj.setCacheAndSql(type,Id,response,callback)

                                }else{
                                    let errMsg = response.errorMessage;
                                    alert("获取群消息失败，原因："+errMsg)
                                }
                            })
                        }else{

                            cache[type][Id] = relations[0];

                            //从数据库中获取成员列表，添加进cache中
                            currentObj.GetGroupMemberIdsByGroupId(Id,function(results){

                                //代表数据库里面并没有groupMembers的对应关系，需要进行下载
                                if(results.length == 0){

                                    currentObj.apiBridge.request.GetGroupInfo({"GroupId":Id},(response)=>{
                                        if(response.success) {
                                            currentObj.setCacheAndSql(type,Id,response,callback,relations[0])

                                        }else{
                                            let errMsg = response.errorMessage;
                                            alert("获取群消息失败，原因："+errMsg)
                                        }
                                    })

                                }else{

                                    for(let i = 0;i<results.length;i++){
                                        //因为数据库的结构就是relationModel的结构
                                        cache["private"][results[i].RelationId] = results[i];
                                        groupMembers.push(results[i].RelationId)
                                        groupMembersInfo.push(results[i])
                                    }
                                    cache["groupMember"][Id] = groupMembers;
                                    callback(relations[0],groupMembersInfo)
                                }
                            });
                        }
                    })
            }
        }else{
            //从cache中取出group和groupMember
            if(type == "chatroom"){
                let groupMembers = [];
                let groupMembersInfo = [];
                //先判断当前的消息命令是不是向群组里面添加成员，如果是则直接需要从http里面更新新的列表存如数据库
                if(contentCommand == AppCommandEnum.MSG_BODY_APP_ADDGROUPMEMBER||contentCommand == AppCommandEnum.MSG_BODY_APP_MODIFYGROUPINFO){
                    currentObj.apiBridge.request.GetGroupInfo({"GroupId":Id},(response)=>{
                        if(response.success) {
                            currentObj.setCacheAndSql(type,Id,response,callback)

                        }else{
                            let errMsg = response.errorMessage;
                            alert("获取群消息失败，原因："+errMsg)
                        }
                    })
                }else{
                    let list = cache["groupMember"][Id]
                    if(list == undefined || list == 'undefined'){
                        callback(cache[type][Id],groupMembers);
                    }
                    for(let i = 0;i<list.length;i++){
                        let target = list[i];
                        groupMembers.push(cache["private"][target])
                    }

                    callback(cache[type][Id],groupMembers);
                }

            }else{
                callback(cache[type][Id])
            }
        }
    }

    setCacheAndSql(type,Id,response,callback,relations = undefined){
        if(type == 'private'){
            return;
        }
        else if(type == 'chatroom'){
            let results = response.data.Data;
            let groupMembers = [];
            let groupMembersInfo = [];
            let relation;
            if(!relations){
                relation = new RelationModel();
                relation.RelationId = results.ID;
                relation.owner = results.Owner;
                relation.Nick = results.Name;
                relation.Type = 'chatroom';
                relation.show = 'false';
                relation.avator = results.ProfilePicture == null?"":results.ProfilePicture;
                relation.MemberList = results.MemberList;

                cache[type][Id] = relation;
            }
            else{
                relation = relations;
            }
            for(let i = 0;i<results.MemberList.length;i++){
                let accountId = results.MemberList[i].Account;
                let model = new RelationModel();
                model.avator = results.MemberList[i].HeadImageUrl;
                model.Nick = results.MemberList[i].Nickname;
                model.RelationId = results.MemberList[i].Account;
                if(cache["private"][accountId] == undefined){
                    cache["private"][accountId] = model;
                }
                groupMembers.push(model);
                groupMembersInfo.push(accountId)
            }

            callback(relation,groupMembers)
            //数据库也没有这条group的记录，那么就需要添加进groupList中
            //并且添加groupMember表，存储group和user关系
            //存储新的群user到account表中
            currentObj.AddGroupAndMember(relation,results.MemberList);
            currentObj.AddGroupMember(results.MemberList);
            cache["groupMember"][Id] = groupMembersInfo;
        }
    }


    //从cache里面取出用户名
    getUserInfoById(accountId){
        return cache["private"][accountId]["Nick"]
    }

    //通过id组成的数组从数据库批量查询user信息,返回数组
    GetRelationsByRelationIds(ids,callback){
        storeSqlite.GetRelationsByRelationIds(ids,function(results){
            callback(results);
        })
    }
    //初始化数据库
    initIMDatabase(AccountId){
        storeSqlite.initIMDatabase(AccountId,function(){

        });
        groupStoreSqlite.initIMDatabase(AccountId,function(){

        })
    }

    //todo:替代redux中RelationStore操作
    //初始化关系缓存
    initUserGroupCache(relations){
        if(relations == undefined || relations == 'undefined' || !relations){
            return;
        }
        let length = relations.length;
        for(let i=0;i<length;i++){
            let {Type,RelationId} = relations[i];
            cache[Type][RelationId] = relations[i];
        }
    }
    //清空缓存
    clearUserGroupCache(){
        //关闭app缓存自动清空
    }
    //更改缓存信息
    changeUserGroupCacheOfShow(id,type){
        let Obj = cache[type][id];
        if(Obj == undefined || Obj == 'undefined' || !Obj){
            return;
        }
        if(Obj.show === 'true'){
            Obj.show = 'false';
        }else if(Obj.show === 'false'){
            Obj.show = 'true';
        }
    }
    changeUserGroupCacheOfNick(id,type,nick){
        let Obj = cache[type][id];
        if(Obj == undefined || Obj == 'undefined' || !Obj){
            return;
        }
        Obj.Nick = nick;
    }
    changeUserGroupCacheOfBlackList(id,type,value){
        let Obj = cache[type][id];
        if(Obj == undefined || Obj == 'undefined' || !Obj){
            return;
        }
        Obj.BlackList = value;
    }
    //添加新的关系进缓存
    addUserGroupCache(relation){
        let {Type,RelationId} = relation;
        let Obj = cache[Type][RelationId];
        if(Obj != undefined || Obj != 'undefined' || Obj){
            return;
        }
        cache[Type][RelationId] = relation;
    }
    //删除关系
    deleteUserGroupCache(id,type){
        let Obj = cache[type][id];
        if(Obj == undefined || Obj == 'undefined' || !Obj){
            return;
        }
        delete cache[type][id];
    }




    //UserGroup part:


    getAllRelation(callback){
        return storeSqlite.GetRelationList(callback)
    }

    getRelation(Id,type,callback){

    }


    //添加group成员到account表中，便于group聊天时显示
    AddGroupMember(members){
        storeSqlite.addGroupMember(members)
    }




    //初始化好友列表
    initRelations(friendList,blackList,callback){
        storeSqlite.initRelations(friendList,blackList,callback);
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
    AddNewRelation(Relation,callback){
        storeSqlite.addNewRelation(Relation,callback)
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











    //Group part:
    //添加一个新的group
    AddNewGroup(Relation){
        groupStoreSqlite.addNewRelation(Relation)
    }

    //添加Group到GourpList中去,添加group与user关系表GroupMember
    AddGroupAndMember(Group,members){

        //添加群到grouplist中
        groupStoreSqlite.addNewRelation(Group);

        //为group添加groupMember
        groupStoreSqlite.initGroupMemberByGroupId(Group.RelationId,members)

    }


    //通过GroupId获取当前群的member信息
    GetMembersByGroupId(groupId,callback){
        groupStoreSqlite.GetMembersByGroupId(groupId,callback);
    }


    //获取所有的group
    getAllGroupFromGroup(callback,show=undefined){
        return groupStoreSqlite.GetRelationList(callback,show)
    }


    //添加群进Group
    AddNewGroupToGroup(Relation,members){
        groupStoreSqlite.addNewRelation(Relation)

        groupStoreSqlite.initGroupMemberByGroupId(Relation.RelationId,members)
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

    //将群移除通讯录
    RemoveGroupFromContact(groupId){
        groupStoreSqlite.RemoveGroupFromContact(groupId);
    }

    GetGroupMemberIdsByGroupId(groupId,callback){
       groupStoreSqlite.GetMembersByGroupId(groupId,function(results){
           if(results.length > 0){

               let ids = [];

               for(let i = 0;i<results.length;i++){
                   ids.push(results[i].RelationId);
               }

               storeSqlite.GetRelationsByRelationIds(ids,function(results){
                    callback(results);
               })
           }else{
               callback(results);
           }
       })
    }


    closeDB(){
        storeSqlite.closeAccountDb();
        groupStoreSqlite.closeAccountDb();
    }


    //添加缓存
    //群拉人，添加到cache["groupMember"]缓存
    groupAddMemberChangeCash(groupId,memberId){
        cache["groupMember"][groupId].push(memberId);
    }
    //添加到cache["private"]
    privateAddMemberChangeCash(memberId,memberObj){
        cache["private"][memberId] = memberObj;
    }

}