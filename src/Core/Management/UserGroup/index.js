/**
 * Created by apple on 2017/9/29.
 */

import ApiBridge from '../../../Logic/ApiBridge/index'
import RelationModel from './Common/dto/RelationModel'
import AppCommandEnum from '../Common/dto/AppCommandEnum'
import UserManager from '../UserGroup/UserManager'
import GroupManager from '../UserGroup/GroupManager'
import dtoChange from './Common/mehod/method'

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
let cache = {"user":{},"group":{},"groupMember":{}};

    // cache = {"user":{
    //     a:{},b:{}
    // },"group":{
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

    init(chatList,callback){
        let userIds =[];
        let groupIds = [];
        for(let item in chatList){
            if(!ChatList[item].group){
                userIds.push(ChatList[item].chatId);
            }else{
                groupIds.push(ChatList[item].chatId);
            }
        }

        UserManager.GetRelationsByRelationIds(userIds,function(users){
            let backData = [];
            GroupManager.GetRelationsByRelationIds(groupIds,function(groups){

                for(let item in users){
                    let relationId= users[item].RelationId;
                    backData.push( { relationId:{ "Account":relationId,"NickName":users[item].Nick,"Remark":users[item].Remark,"Friend":users[item].show } } )
                }

                for(let item in groups){
                    let relationId= groups[item].RelationId;
                    backData.push( { relationId:{ "Account":relationId,"NickName":groups[item].Nick,"Remark":groups[item].Remark,"Friend":groups[item].show } } )
                }

                callback(backData);
            })
        })
    }

    getUserGroupInfo(groupId,callback){
        this.getUserInfoByIdandType(groupId,"group",callback)
    }



    //获取所有show = true的user
    getUserRelationsOfShow(callback){
            this.getAllRelationSQL((relations)=>{
                callback(relations);
                relations.forEach((v)=>{
                    cache['user'][v.RelationId] = v;
                })
            })
    }


    //获取所有show = true的Group
    getGroupRelationsOfShow(callback){

        this.getAllGroupFromGroupSQL((relations)=>{
            callback(relations);
            relations.forEach((v)=>{
                cache['group'][v.RelationId] = v;
            })
        },true)

    }

    //先去对应表中找到成员ID 再去Account中找对应信息
    GetGroupMemberIdsByGroupId(groupId,callback){
        GroupManager.GetMembersByGroupId(groupId,function(results){
            if(results.length > 0){

                let ids = [];

                for(let i = 0;i<results.length;i++){
                    ids.push(results[i].RelationId);
                }

                UserManager.GetRelationsByRelationIds(ids,function(results){
                    callback(results);
                })
            }else{
                callback(results);
            }
        })
    }

    requestInfomation(Id,type,callback){
        switch(type){
            case "group":
                currentObj.apiBridge.GetGroupInfo({"GroupId":Id},(response)=>{
                    callback(response)
                });
                break;
            default:
                currentObj.apiBridge.request.SearchUser({"Keyword":Id},(response)=>{
                    callback(response);
                });
                break;

        }
    }

    readInformation(Id,type,callback){
        switch (type){
            case "group":
                GroupManager.GetRelationByIdAndType(Id,type,(relations)=>{
                    callback(relations);
                });
                break;
            default:
                UserManager.GetRelationByIdAndType(Id,type,(relations)=>{
                    callback(relations);
                });
                break;
        }
    }

    getCacheInformation(Id,type,callback,contentCommand){
        switch (type){
            case "group":

            default:
                callback(cache[type][Id])
                break;
        }
    }

    //从缓存判断指定clientId是否是黑名单
    getIsBlackListFromCache(clienId){
        return cache.user[clientId].BlackList;
    }

    getHttpGroupInfo(Id,type,callback,Relation = undefined){
        let groupMembers = [];
        let groupMembersInfo = [];
        this.apiBridge.request.GetGroupInfo({"GroupId":Id},(result)=>{
            if(result.success) {
                let data = result.data.Data;
                let relation = new RelationModel();
                if(!Relation){
                    relation.RelationId = data.ID;
                    relation.owner = data.Owner;
                    relation.Nick = data.Name;
                    relation.Type = 'group';
                    relation.show = 'false';
                    relation.avator = data.ProfilePicture == null?"":data.ProfilePicture;
                    relation.MemberList = data.MemberList;
                    cache[type][Id] = relation;
                }
                else{
                    relation = Relation;
                }
                let members = relation.MemberList;
                for(let i = 0;i<members.length;i++){
                    let accountId = members[i].Account;
                    let model = new RelationModel();
                    model.avator = members[i].HeadImageUrl;
                    model.Nick = members[i].Nickname;
                    model.RelationId = members[i].Account;
                    if(cache["user"][accountId] == undefined){
                        cache["user"][accountId] = model;
                    }
                    groupMembers.push(model);
                    groupMembersInfo.push(accountId)
                }
                callback(relation,groupMembers);
                currentObj.AddGroupAndMemberSQL(relation,members);
                currentObj.AddGroupMemberSQL(members);
                cache["groupMember"][Id] = groupMembersInfo;
            }else{
                console.log(result.errorMessage)
            }
        });
    }

    getMembersIdByGroupId(Id,type,callback,relation){
        let groupMembers = [];
        let groupMembersInfo = [];
        currentObj.GetGroupMemberIdsByGroupId(Id,function(results){
            if(results.length == 0){
                currentObj.getHttpGroupInfo(Id,type,callback,relations[0]);
            }else{
                //todo:考虑要是private里面没有对应 d 的信息
                for(let i = 0;i<results.length;i++){
                    //因为数据库的结构就是relationModel的结构
                    if(cache["user"][results[i].RelationId] == undefined){
                        cache["user"][results[i].RelationId] = results[i];
                    }
                    groupMembers.push(results[i].RelationId)
                    groupMembersInfo.push(results[i])
                }
                cache["groupMember"][Id] = groupMembers;
                callback(relation,groupMembersInfo)
            }
        });
    }

    getUserInfoByIdandType(Id,type,callback){
        if(cache[type].length == 0 || cache[type][Id] == undefined){
            this.readInformation(Id,type,function (relations) {
                if(relations.length == 0){
                    currentObj.requestInfomation(Id,type,function (result) {
                        if(result.success){
                            let data = result.data.Data;
                            let relation = new RelationModel();
                            relation.RelationId = data.Account;
                            relation.Nick = data.Nickname;
                            relation.Type = 'user';
                            relation.show = 'false';
                            relation.avator = data.HeadImageUrl == null?"":data.HeadImageUrl;
                            cache[type][Id] = relation;
                            currentObj.AddNewRelation(relation,function(){
                                callback(relation);
                            });
                        }else{
                            console.log(result.errorMessage)
                        }
                    })
                }
                else{
                    cache[type][Id] = relations[0];
                    callback(relations[0])
                }
            })
        }
        else{
            callback(cache[type][Id])
        }
    }

    getGroupInfoByIdandType(Id,type,callback){
        let groupMembers = [];
        let groupMembersInfo = [];
        if(cache[type].length == 0 || cache[type][Id] == undefined){
            this.readInformation(Id,type,function (relations) {
                if(relations.length == 0){
                    currentObj.getHttpGroupInfo(Id,type,callback);
                }
                else{
                    cache[type][Id] = relations[0];
                    currentObj.getMembersIdByGroupId(Id,type,callback,relations[0]);
                }
            })
        }
        else{
            let relation = cache[type][Id];
            //先判断当前的消息命令是不是向群组里面添加成员，如果是则直接需要从http里面更新新的列表存如数据库

            if(!cache["groupMember"][Id] || !cache["groupMember"][Id].length){
                currentObj.getMembersIdByGroupId(Id,type,callback,relation);
            }
            else{
                let list = cache["groupMember"][Id]
                if(list == undefined || list == 'undefined'){
                    callback(cache[type][Id],groupMembers);
                }
                for(let i = 0;i<list.length;i++){
                    let target = list[i];
                    groupMembers.push(cache["user"][target])
                }

                callback(cache[type][Id],groupMembers);
            }
        }
    }

    getUserInfoById(accountId){
        return cache["user"][accountId]["Nick"]
    }

    getNickAndAvatorById(accountId,type,callback){
        let needObj = {};
        this.getInformationByIdandType(accountId,type,(realtion)=>{
            needObj.Nick =  realtion["Nick"];
            needObj.avator = realtion["avator"];
            callback(needObj);
        })
    }

    getCacheInfo(type){
        let concat = Object.values(cache[type]) //将对象的value 组成数组
        return concat;
    }









    //Manager操作
    //初始化数据库
    initIMDatabase(AccountId){

        UserManager.initDatabase(AccountId);

        GroupManager.initDatabase(AccountId);
    }

    //User:
    getAllRelationSQL(callback){
        return UserManager.getAllUsers(callback);
    }

    //添加group成员到account表中，便于group聊天时显示
    AddGroupMemberSQL(members){
        UserManager.addGroupMembers(members)
    }

    //初始化好友列表  根据http请求结果初始化account中的表 有改无加
    initRelationsSQL(friendList,blackList,callback){
        UserManager.initRelations(friendList,blackList,callback);
    }

    //更改好友黑名单设置
    changeRelationBlackListSQL(isBlackList,RelationId){
        UserManager.changeRelationBliackList(isBlackList,RelationId);
    }

    //删除好友 将好友信息show设为false
    deleteRelationSQL(RelationId){
        UserManager.deleteRelation(RelationId)
    }

    //修改关系 发现关系信息更新时改变信息
    updateRelationSQL(Relation){
        UserManager.updateRelation(Relation)
    }

    //更新好友显示状态 show 目前用于接收到添加好友信息
    updateDisplayOfRelationSQL(relationId,bool){
        UserManager.updateRelationDisplayStatus(relationId,bool);
    }

    //获取所有关系的名字和头像
    getAllRelationNameAndAvatorSQL(callback){
        UserManager.getAllRelationAvatorAndName(callback);
    }


    //添加新关系 有改无加
    AddNewRelationSQL(Relation,callback){
        UserManager.addNewRelation(Relation,callback)
    }

    //获取关系设置
    GetRelationSettingSQL(RelationId,callback){
        UserManager.getRelationSetting(RelationId,callback);
    }


    //修改关系设置
    ChangeRelationSettingSQL(RelationSetting){
        UserManager.updateRelationSetting(RelationSetting);
    }

    //添加关系设置
    AddNewRelationSettingSQL(RelationSetting){
        UserManager.addNewRelationSetting(RelationSetting);
    }

    //通过id组成的数组从数据库批量查询user信息,返回数组
    GetRelationsByRelationIdsSQL(ids,callback){
        UserManager.GetRelationsByRelationIds(ids,function(results){
            callback(results);
        })
    }

    //Group:
    AddNewGroupSQL(Relation){
        GroupManager.addNewRelation(Relation)
    }

    //添加Group到GourpList中去,添加group与user关系表GroupMember
    AddGroupAndMemberSQL(Group,members){

        //添加群到grouplist中
        GroupManager.addNewRelation(Group);

        //为group添加groupMember
        GroupManager.initGroupMemberByGroupId(Group.RelationId,members)

    }

    //通过GroupId获取当前群的member信息
    GetMembersByGroupIdSQL(groupId,callback){
        GroupManager.GetMembersByGroupId(groupId,callback);
    }

    //删除群成员
    removeGroupMemberSQL(groupId,members){
        GroupManager.removeGroupMember(groupId,members)
    }

    //获取所有的group
    getAllGroupFromGroupSQL(callback,show=undefined){
        return GroupManager.GetRelationList(callback,show)
    }

    //初始化群关系信息  有改无加
    initGroupSQL(GroupList,callback){
        GroupManager.initRelations(GroupList,callback);
    }
    //更新群名
    updateGroupNameSQL(relationId,name){
        GroupManager.UpdateGroupName(relationId,name);
    }
    //退群
    deleteFromGrroupSQL(RelationId){
        GroupManager.deleteRelation(RelationId)
    }

    //将群移除通讯录
    RemoveGroupFromContactSQL(groupId){
        GroupManager.RemoveGroupFromContact(groupId);
    }

    closeDB(){
        UserManager.closeDB();
        GroupManager.closeDB();
    }


    //todo:controller调用方法
    //添加群到通讯录
    addGroupToContact(groupObj){
        let group = dtoChange(groupObj);
        this.AddNewGroupSQL(group);
        cache['group'][group.RelationId] = group;
    }
    //将群移除通讯录
    removeGroupFromContact(groupId){
        this.RemoveGroupFromContactSQL(groupId);
        cache['group'][groupId].show = false;
    }
    //移除群成员
    removeGroupMember(groupId,members){
        this.removeGroupMemberSQL(groupId,members);
            let array = cache['groupMember'][groupId];
            for(let member of members){
                let index = array.indexOf(member);
                array.splice(index,1)
            }
    }
    //加入/移除黑名单 shield屏蔽（true/false）
    setBlackMember(shield,userId){
        this.changeRelationBlackListSQL(shield, userId);
        cache['user'][userId].isBlackList = shield;
    }
    //删除好友
    removeFriend(userId){
        this.deleteRelationSQL(userId);
        cache['user'][userId].show = false;
    }
    //添加好友
    applyFriend(userObj){
        let user = dtoChange(userObj);
        this.AddNewRelationSQL(user);
        cache["user"][user.RelationId] = user;
    }
    //接受好友申请
    acceptFriend(userObj){
        let user = dtoChange(userObj);
        this.AddNewRelationSQL(user);
        cache["user"][user.RelationId] = user;
    }
    //todo:好友详情页面的信息更新方法没写
    //创建群
    createGroup(groupObj,members){
        let group = dtoChange(groupObj);
        this.AddGroupAndMemberSQL(group, members);
        cache["group"][group.RelationId] = group;
        for (let current of members) {
            cache['groupMember'][group.RelationId].push(current);
        }
    }
    //添加群成员
    addGroupMember(groupObj,members){
        let group = dtoChange(groupObj);
        this.AddGroupAndMemberSQL(group, members);
        if(!cache["group"][group.RelationId]){
            cache["group"][group.RelationId] = group;
        }
        for (let current of members) {
            cache['groupMember'][group.RelationId].push(current);
        }
    }
    //修改群名称
    updateGroupName(groupId,name){
        this.updateGroupNameSQL(groupId,name);
        cache['group'][groupId].Nick = name;
    }
    //退群/解散群
    removeGroup(groupId){
        this.deleteFromGrroupSQL(groupId);
        delete cache['group'][groupId];
        delete cache['groupMember'][groupId];
    }
    //修改群公告
    updataGroupDiscription(groupId,content){
        cache['group'][groupId].OtherComment = content;
    }
    //修改用户信息
    updateUserInfo(userObj){
        let user = dtoChange(userObj)
        this.updateRelationSQL(user);
        cache['user'][user.RelationId] = user;
    }

}
