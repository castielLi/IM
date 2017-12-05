/**
 * Created by apple on 2017/9/29.
 */

import ApiBridge from '../../../Logic/ApiBridge/index'
import RelationModel from './Common/dto/RelationModel'
import AppCommandEnum from '../Common/dto/AppCommandEnum'
import UserManager from '../UserGroup/UserManager'
import GroupManager from '../UserGroup/GroupManager'

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

    //Manager操作

    //初始化数据库
    initIMDatabase(AccountId){

        UserManager.initDatabase(AccountId);

        GroupManager.initDatabase(AccountId);
    }

    //User:
    getAllRelation(callback){
        return UserManager.getAllUsers(callback);
    }

    //添加group成员到account表中，便于group聊天时显示
    AddGroupMember(members){
        UserManager.addGroupMembers(members)
    }

    //初始化好友列表  根据http请求结果初始化account中的表 有改无加
    initRelations(friendList,blackList,callback){
        UserManager.initRelations(friendList,blackList,callback);
    }

    //更改好友黑名单设置
    changeRelationBlackList(isBlackList,RelationId){
        UserManager.changeRelationBliackList(isBlackList,RelationId);
    }

    //删除好友 将好友信息show设为false
    deleteRelation(RelationId){
        UserManager.deleteRelation(RelationId)
    }

    //修改关系 发现关系信息更新时改变信息
    updateRelation(Relation){
        UserManager.updateRelation(Relation)
    }

    //更新好友显示状态 show 目前用于接收到添加好友信息
    updateDisplayOfRelation(relationId,bool){
        UserManager.updateRelationDisplayStatus(relationId,bool);
    }

    //获取所有关系的名字和头像
    getAllRelationNameAndAvator(callback){
        UserManager.getAllRelationAvatorAndName(callback);
    }


    //添加新关系 有改无加
    AddNewRelation(Relation,callback){
        UserManager.addNewRelation(Relation,callback)
    }

    //获取关系设置
    GetRelationSetting(RelationId,callback){
        UserManager.getRelationSetting(RelationId,callback);
    }


    //修改关系设置
    ChangeRelationSetting(RelationSetting){
        UserManager.updateRelationSetting(RelationSetting);
    }

    //添加关系设置
    AddNewRelationSetting(RelationSetting){
        UserManager.addNewRelationSetting(RelationSetting);
    }

    //通过id组成的数组从数据库批量查询user信息,返回数组
    GetRelationsByRelationIds(ids,callback){
        UserManager.GetRelationsByRelationIds(ids,function(results){
            callback(results);
        })
    }

    //Group:
    AddNewGroup(Relation){
        GroupManager.addNewRelation(Relation)
    }

    //添加Group到GourpList中去,添加group与user关系表GroupMember
    AddGroupAndMember(Group,members){

        //添加群到grouplist中
        GroupManager.addNewRelation(Group);

        //为group添加groupMember
        GroupManager.initGroupMemberByGroupId(Group.RelationId,members)

    }

    //通过GroupId获取当前群的member信息
    GetMembersByGroupId(groupId,callback){
        GroupManager.GetMembersByGroupId(groupId,callback);
    }

    //删除群成员
    removeGroupMember(groupId,members){
        GroupManager.removeGroupMember(groupId,members)
    }

    //获取所有的group
    getAllGroupFromGroup(callback,show=undefined){
        return GroupManager.GetRelationList(callback,show)
    }

    //初始化群关系信息  有改无加
    initGroup(GroupList,callback){
        GroupManager.initRelations(GroupList,callback);
    }
    //更新群名
    updateGroupName(relationId,name){
        GroupManager.UpdateGroupName(relationId,name);
    }
    //退群
    deleteFromGrroup(RelationId){
        GroupManager.deleteRelation(RelationId)
    }

    //将群移除通讯录
    RemoveGroupFromContact(groupId){
        GroupManager.RemoveGroupFromContact(groupId);
    }

    closeDB(){
        UserManager.closeDB();
        GroupManager.closeDB();
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

    //todo:lizongjun 把所有的用户，包括没有添加为好友的用户全部放到user表中，user表中group和user 分开，单独管理,groupMemberList用来管理群成员


    //todo:lizongjun 用户管理模块里面包含了所有数据，1 从缓存找 2从数据库找 3请求获取，暴露给外界接口
    //新方法：


    requestInfomation(Id,type,callback){
        switch(type){
            case "chatroom":
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
            case "chatroom":
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
            case "chatroom":

            default:
                callback(cache[type][Id])
                break;
        }
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
                    relation.Type = 'chatroom';
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
                    if(cache["private"][accountId] == undefined){
                        cache["private"][accountId] = model;
                    }
                    groupMembers.push(model);
                    groupMembersInfo.push(accountId)
                }
                callback(relation,groupMembers);
                currentObj.AddGroupAndMember(relation,members);
                currentObj.AddGroupMember(members);
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
                    if(cache["private"][results[i].RelationId] == undefined){
                        cache["private"][results[i].RelationId] = results[i];
                    }
                    groupMembers.push(results[i].RelationId)
                    groupMembersInfo.push(results[i])
                }
                cache["groupMember"][Id] = groupMembers;
                callback(relation,groupMembersInfo)
            }
        });
    }

    //todo:拆分通过id和类型获取群或者好友的信息的方法
    getUserInfoByIdandType(Id,type,callback,messageCommand,contentCommand){
        if(cache[type].length == 0 || cache[type][Id] == undefined){
            this.readInformation(Id,type,function (relations) {
                if(relations.length == 0){
                    currentObj.requestInfomation(Id,type,function (result) {
                        if(result.success){
                            let data = result.data.Data;
                            let relation = new RelationModel();
                            relation.RelationId = data.Account;
                            relation.Nick = data.Nickname;
                            relation.Type = 'private';
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
    getGroupInfoByIdandType(Id,type,callback,messageCommand,contentCommand){
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
            if(contentCommand == AppCommandEnum.MSG_BODY_APP_ADDGROUPMEMBER||contentCommand == AppCommandEnum.MSG_BODY_APP_MODIFYGROUPINFO){
                currentObj.getHttpGroupInfo(Id,type,callback,relation);
            }
            else if(!cache["groupMember"][Id] || !cache["groupMember"][Id].length){
                currentObj.getMembersIdByGroupId(Id,type,callback,relation);
            }
            else{
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
        }
    }

    getInformationByIdandType(Id,type,callback,messageCommand=undefined,contentCommand=undefined){
        if(type == 'chatroom'){
            this.getGroupInfoByIdandType(Id,type,callback,messageCommand,contentCommand)
        }
        else if(type == 'private'){
            this.getUserInfoByIdandType(Id,type,callback,messageCommand,contentCommand)
        }
    }

    //todo：缓存（cache）的操作
    //从cache里面取出用户名
    getUserInfoById(accountId){
        return cache["private"][accountId]["Nick"]
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

    //todo：方法整合
    //获取关系信息
    getUserGroupCache(enumerate,data){
        switch (enumerate){
            case 'single':
                var {Id,type,callback} = data;
                currentObj.getInformationByIdandType(Id,type,callback);
                break;
            case 'list':
                var {type} = data;
                currentObj.getCacheInfo(type);
                break;
            default:
                break;
        }
    }
    //初始化关系
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
    //改变关系
    changeUserGroupShow(enumerate,data,callback){
        switch (enumerate){
            case 'removeFriend'://data:{enumerate,params}
                var {params} = data;
                var {Friend} = params;
                this.apiBridge.request.DeleteFriend(params,function(result){
                    if(result.success){
                        currentObj.deleteRelation(Friend);
                        cache['private'][Friend].show = false;
                    }else{
                        console.log(result.errorMessage)
                    }
                });
                break;
            case 'addGroupToContact'://data:{enumerate,params,relation}
                var {params,relation} = data;
                this.apiBridge.request.AddGroupToContact(params,function(result){
                    if(result.success && result.data.Result){
                        let obj = {
                            RelationId:relation.ID,
                            OtherComment:relation.Description,
                            Nick:relation.Name,
                            BlackList:false,
                            Type:'chatroom',
                            avator:relation.ProfilePicture==null?"":relation.ProfilePicture,
                            owner:relation.Owner,
                            show:true
                        };
                        currentObj.AddNewGroup(obj);
                        cache[obj.Type][obj.RelationId].show = true;
                    }else{
                        console.log(result.errorMessage)
                    }
                    callback(result);
                });
                break;
            case 'removeGroupFromContact'://data:{enumerate,params,Id}
                var {params,Id} = data;
                this.apiBridge.request.RemoveGroupFromContact(params,function(result){
                    if(result.success && result.data.Result){
                        currentObj.RemoveGroupFromContact(Id);
                        cache['chatroom'][Id].show = false;
                    }else{
                        console.log(result.errorMessage)
                    }
                });
                break;
            default:
                break;
        }
    }

    changeUserGroup(enumerate,data){
        switch (enumerate){
            case "show":
                var {enumerate} = data;
                this.changeUserGroupShow(enumerate,data);
                break;
            case "nick":
                var {params,groupId,name} = data;
                this.apiBridge.request.ModifyGroupName(params,function(result){
                    if(result.success){
                        if(result.data.Data){
                            currentObj.updateGroupName(groupId,name);
                            cache['chatroom'][groupId].Nick = name;
                        }
                    }else{
                        console.log(result.errorMessage)
                    }
                });
                break;
            case "BlackList":
                var {params,value} = data;
                if(value == 'remove'){
                    this.apiBridge.request.RemoveBlackMember(params,function(result){
                        if(result.success){
                            currentObj.changeRelationBlackList(false, params.Account);
                        }else{
                            console.log(result.errorMessage)
                        }
                    })
                }
                else if(value == 'add'){
                    this.apiBridge.request.AddBlackMember(params,function(result){
                        if(result.success){
                            currentObj.changeRelationBlackList(true, params.Account);
                        }else{
                            console.log(result.errorMessage)
                        }
                    })
                }
                break;
            default:
                break;
        }
    }
    //新增关系
    addUserGroup(enumerate,data){
        switch (enumerate){
            case "addFriend":
                var {params,relation} = data;
                var {Type,RelationId} = relation;
                this.apiBridge.request.ApplyFriend(params,function(result){
                    if(result.success && result.data.Data instanceof Object){
                        var {Account,HeadImageUrl,Nickname,Email} = result.data.Data.MemberInfo;
                        var IsInBlackList =result.data.Data.IsInBlackList;
                        var relationObj = {RelationId:Account,avator:HeadImageUrl,Nick:Nickname,Type:'private',OtherComment:'',Remark:'',Email,owner:'',BlackList:IsInBlackList,show:'true'}
                        currentObj.AddNewRelation(relationObj);
                        cache[Type][RelationId] = relation;
                    }else{
                        console.log(result.errorMessage)
                    }
                });
                break;
            case "acceptFriend":
                var {params,relation} = data;
                var {Type,RelationId} = relation;
                this.apiBridge.request.AcceptFriend(params,function(result){
                    if(result.success){
                        var {Account,HeadImageUrl,Nickname,Email} = result.data.Data;
                        var relationObj = {RelationId:Account,avator:HeadImageUrl,localImage:'',Nick:Nickname,Type:'private',OtherComment:'',Remark:'',Email,owner:'',BlackList:'false',show:'true'}
                        currentObj.AddNewRelation(relationObj);
                        cache[Type][RelationId] = relation;
                    }else{
                        console.log(result.errorMessage)
                    }
                });
                break;
            case "createGroup": //创建群
                var {params,group,members} = data;
                var {Type,RelationId} = group;
                this.apiBridge.request.CreateGroup(params,function(result){
                    if(result.success){
                        if(result.data.Data){
                            currentObj.AddGroupAndMember(group,members);
                            cache[Type][RelationId] = group;
                            for(let current of members){
                                cache['groupMember'][RelationId].push(current);
                            }
                        }
                    }else{
                        console.log(result.errorMessage)
                    }
                });
                break;
            case "addMember": //添加群成员
                var {params,groupId,members,relations} = data;
                this.apiBridge.request.AddGroupMember(params,function(result){
                    if(result.success){
                        if(result.data.Data){
                            currentObj.AddGroupAndMember(groupId,members);
                            for(let current of relations){
                                let {Type,RelationId} = current;
                                cache[Type][RelationId] = current;
                            }
                            for(let current of members){
                                cache['groupMember'][groupId].push(current);
                            }
                        }
                    }else{
                        console.log(result.errorMessage)
                    }
                });
                break;
            default:
                break;
        }
    }
    //删除关系
    removeUserGroup(enumerate,data){
        switch (enumerate){
            case 'removeGroupMember':
                var {params,close,members} = data;
                var {GroupId} = params;
                this.apiBridge.request.RemoveGroupMember(params,function(result){
                    if(result.success && result.data.Data){
                        currentObj.removeGroupMember(GroupId,members);
                        let array = cache['groupMember'][GroupId];
                        for(let member of members){
                            let index = array.indexOf(member);
                            array.splice(index,1)
                        }
                        if(close){
                            currentObj.deleteFromGrroup(GroupId);
                            delete cache['chatroom'][GroupId];
                            delete cache['groupMember'][GroupId];
                        }
                    }else{
                        console.log(result.errorMessage)
                    }
                });
                break;
            case 'removeGroup':
                var {params} = data;
                var {GroupId} = params;
                this.apiBridge.request.ExitGroup(params,function(result){
                    if(result.success){
                        currentObj.deleteFromGrroup(GroupId);
                        delete cache['chatroom'][GroupId];
                        delete cache['groupMember'][GroupId];
                    }else{
                        console.log(result.errorMessage)
                    }
                });
                break;
            default:
                break;
        }
    }

}