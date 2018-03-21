import RequestManager from './Request/RequestManager';
import GroupDBManager from './DBManagement/GroupDBManager';
import GroupInfoDto from './Dtos/GroupInfoDto';
import ResultError from '../Enums/ResultError';
import GroupConfig from './GroupConfig';
import RemoveGroupMemberDto from './Request/RequestParamsDto/RemoveGroupMemberDto';
import ModifyGroupNameDto from './Request/RequestParamsDto/ModifyGroupNameDto';
import ModifyGroupDescriptionDto from './Request/RequestParamsDto/ModifyGroupDescriptionDto';
import CreateGroupDto from './Request/RequestParamsDto/CreateGroupDto';
import ExitGroupDto from './Request/RequestParamsDto/ExitGroupDto';
import AddGroupMemberDto from './Request/RequestParamsDto/AddGroupMemberDto';
import GetGroupMemberListDto from './Request/RequestParamsDto/GetGroupMemberListDto';
import GetGroupsInfoDto from "./Request/RequestParamsDto/GetGroupsInfoDto";
export default class GroupManager {
    constructor(isDB) {
        this.cache = { "group": {}, "groupMember": {}, "groupSetting": {} };
        this.dbManager = null;
        this.httpManager = null;
        if (isDB) {
            this.dbManager = new GroupDBManager();
        }
        this.httpManager = new RequestManager(isDB);
    }
    static getSingleInstance(isDB) {
        if (GroupManager.SingleInstance == null) {
            GroupManager.SingleInstance = new GroupManager(isDB);
        }
        return GroupManager.SingleInstance;
    }
    //获取群信息
    getGroupInfo(id, refresh, callback) {
        if (refresh) {
            this.getGroupInfoByNet(id, (groupInfo) => {
                callback && callback(this.cache["group"][id]);
            });
            return;
        }
        //得到缓存数据
        if (this.cache["group"][id]) {
            callback && callback(this.cache["group"][id]);
            return;
        }
        //数据库加载
        if (this.dbManager != null) {
            this.dbManager.getGroupInfo(id, (group) => {
                if (group) {
                    this.cache["group"][id] = group;
                    callback && callback(group);
                }
                else {
                    this.getGroupInfoByNet(id, callback);
                }
            });
        }
        else {
            this.getGroupInfoByNet(id, callback);
        }
    }
    //批量获取群信息
    getGroupsInfo(ids, callback, once) {
        if (!ids || ids.length == 0) {
            callback && callback(null);
            return;
        }
        let backGroups = [];
        let lackGroupIds = [];
        for (let i = 0; i < ids.length; i++) {
            if (this.cache['group'][ids[i]] != undefined)
                backGroups.push(this.cache['group'][ids[i]]);
            else
                lackGroupIds.push(ids[i]);
        }
        //如果不是必须一次性全部返回完users的，就可以直接返回一部分到上层进行处理
        if (!once) {
            callback && callback(backGroups);
            backGroups = [];
        }
        else {
            if (lackGroupIds.length == 0) {
                callback && callback(backGroups);
            }
        }
        if (lackGroupIds.length == 0)
            return;
        if (this.dbManager) {
            this.dbManager.getGroups(ids, (groups) => {
                if (groups && groups.length > 0) {
                    for (let i in groups) {
                        let item = groups[i];
                        if (item) {
                            this.cache["group"][item.Id] = item;
                            backGroups.push(item);
                            let index = lackGroupIds.indexOf(item.Id);
                            if (index != -1) {
                                lackGroupIds.splice(index, 1);
                            }
                        }
                    }
                    if (!once) {
                        callback && callback(backGroups);
                        backGroups = [];
                    }
                    else {
                        if (lackGroupIds.length == 0) {
                            callback && callback(backGroups);
                        }
                        else {
                            backGroups = backGroups.concat(groups);
                        }
                    }
                }
                if (lackGroupIds.length == 0)
                    return;
                this.getGroupsInfoByNet(lackGroupIds, (result) => {
                    backGroups = backGroups.concat(result);
                    callback && callback(backGroups);
                });
            });
        }
        else {
            if (lackGroupIds.length == 0)
                return;
            this.getGroupsInfoByNet(lackGroupIds, (result) => {
                backGroups = backGroups.concat(result);
                callback && callback(backGroups);
            });
        }
    }
    //获取群成员id
    getGroupMember(id, refresh, callback) {
        if (refresh) {
            this.getGroupInfoByNet(id, (groupInfo) => {
                callback && callback(this.cache["groupMember"][id]);
            });
            return;
        }
        //获取缓存数据
        if (this.cache["groupMember"][id]) {
            callback && callback(this.cache["groupMember"][id]);
            return;
        }
        if (this.dbManager != null) {
            this.dbManager.getGroupMember(id, (members) => {
                if (members) {
                    members = members.map((current, index) => {
                        return current.GropuId;
                    });
                    this.cache["groupMember"][id] = members;
                    callback && callback(members);
                    return;
                }
                else {
                    this.getGroupInfoByNet(id, (groupInfo) => {
                        callback && callback(this.cache["groupMember"][id]);
                    });
                }
            });
        }
        else {
            this.getGroupInfoByNet(id, (groupInfo) => {
                callback && callback(this.cache["groupMember"][id]);
            });
        }
    }
    //添加群成员
    addGroupMember(id, members, callback) {
        if (members == null || members.length == 0)
            return;
        //网络请求
        let param = new AddGroupMemberDto();
        param.GroupId = id;
        param.Accounts = members;
        let membersArray = members.split(',');
        this.httpManager.addGroupMember(param, (response) => {
            if (response.success && response.data != null) {
                let result = response.data;
                if (result.Result == ResultError.Success) {
                    //添加成功才添加数据库
                    if (this.dbManager != null) {
                        this.dbManager.addGroupMember(id, membersArray);
                    }
                    let memberCache = this.cache['groupMember'][id];
                    if (!memberCache)
                        this.cache['groupMember'][id] = [];
                    for (let current of membersArray) {
                        this.cache['groupMember'][id].push(current);
                    }
                }
                callback && callback(result);
            }
        });
    }
    //移除群成员
    removeGroupMember(id, members, callback) {
        if (members == null || members.length == 0)
            return;
        //网络请求
        let param = new RemoveGroupMemberDto();
        param.GroupId = id;
        param.Accounts = members;
        let membersArray = members.split(',');
        this.httpManager.removeGroupMember(param, (response) => {
            if (response.success && response.data != null) {
                let result = response.data;
                if (result.Result == ResultError.Success) {
                    //删除数据库
                    if (this.dbManager != null) {
                        this.dbManager.removeGroupMember(id, membersArray);
                    }
                    //删除缓存
                    let array = this.cache['groupMember'][id];
                    if (array == null)
                        return;
                    for (let member of membersArray) {
                        let index = array.indexOf(member);
                        if (index !== -1) {
                            array.splice(index, 1);
                        }
                    }
                }
                callback && callback(result);
                return;
            }
            callback && callback(null);
        });
    }
    //添加/移除通讯录
    addOrRemoveContacts(id, save) {
        if (this.cache['group'][id]) {
            this.cache['group'][id].Save = save;
        }
        if (this.dbManager) {
            this.dbManager.addOrRemoveContacts(id, save);
        }
        //请求网络
        if (save) {
            this.httpManager.addGroupToContact(id, () => { });
        }
        else {
            this.httpManager.removeGroupFromContact(id, () => { });
        }
    }
    //修改群名称
    updateGroupName(id, name, request, callback) {
        if (name.length > GroupConfig.GroupNameLength)
            return;
        //网络请求
        let param = new ModifyGroupNameDto();
        param.GroupId = id;
        param.Name = name;
        if (request) {
            this.httpManager.modifyGroupName(param, (response) => {
                if (response.success && response.data != null) {
                    let result = response.data;
                    if (result.Result == ResultError.Success) {
                        if (this.dbManager != null) {
                            this.dbManager.updateGroupName(id, name);
                        }
                        if (this.cache['group'][id]) {
                            this.cache['group'][id].Name = name;
                        }
                    }
                    callback && callback(result);
                }
            });
        }
        else {
            if (this.dbManager != null) {
                this.dbManager.updateGroupName(id, name);
            }
            if (this.cache['group'][id]) {
                this.cache['group'][id].Name = name;
            }
        }
    }
    //修改群公告
    updateGroupBulletin(id, note, request, callback) {
        if (note.length > GroupConfig.GroupNoteLength)
            return;
        //网络请求
        let param = new ModifyGroupDescriptionDto();
        param.GroupId = id;
        param.Desc = note;
        if (request) {
            this.httpManager.modifyGroupDescription(param, (response) => {
                if (response.success && response.data != null) {
                    let result = response.data;
                    if (result.Result == ResultError.Success) {
                        if (this.dbManager != null) {
                            this.dbManager.updateGroupBulletin(id, note);
                        }
                        if (this.cache['group'][id]) {
                            this.cache['group'][id].Note = note;
                        }
                    }
                    callback && callback(result);
                }
            });
        }
        else {
            if (this.dbManager != null) {
                this.dbManager.updateGroupBulletin(id, note);
            }
            if (this.cache['group'][id]) {
                this.cache['group'][id].Note = note;
            }
        }
    }
    //创建群
    createGroup(account, name, members, callback) {
        if (!members || members.length == 0)
            return;
        //网络请求
        let param = new CreateGroupDto();
        param.Name = name;
        param.Accounts = members;
        let membersArray = members.split(',');
        this.httpManager.createGroup(param, (response) => {
            if (response.success && response.data != null) {
                let result = response.data;
                if (result.Result == ResultError.Success) {
                    let group = new GroupInfoDto();
                    group.Id = result.Data;
                    group.Name = name;
                    //TODO: 所有者  要把当前用户统一存放，便于整个manager调用
                    //group.Owner = this.Account;
                    group.Owner = account;
                    group.Save = false;
                    group.Exited = false;
                    if (this.dbManager != null) {
                        this.dbManager.createGroup(group, membersArray);
                    }
                    if (this.cache['groupMember'][group.Id] == undefined) {
                        this.cache['groupMember'][group.Id] = [];
                    }
                    this.cache['group'][group.Id] = group;
                    for (let current of membersArray) {
                        this.cache['groupMember'][group.Id].push(current);
                    }
                }
                callback && callback(result);
            }
        });
    }
    //退群
    removeGroup(id, callback) {
        if (this.dbManager != null) {
            this.dbManager.removeGroup(id);
        }
        delete this.cache['group'][id];
        delete this.cache['groupMember'][id];
        callback && callback();
        //网络请求
        let param = new ExitGroupDto();
        param.GroupId = id;
        this.httpManager.exitGroup(param, () => {
        });
    }
    //被踢出群
    setGroupExitSetting(id, value) {
        if (this.dbManager != null) {
            this.dbManager.setGroupExitSetting(id, value);
        }
        if (this.cache['group'][id]) {
            this.cache['group'][id].Exited = value;
        }
    }
    //获取通讯录列表
    getContactList(refresh, callback) {
        if (refresh) {
            this.getContactListByNet(callback);
            return;
        }
        if (this.dbManager != null) {
            this.dbManager.getAllGroup((groupList) => {
                callback && callback(groupList);
                groupList.forEach((v) => {
                    this.cache['group'][v.Id] = v;
                });
            });
        }
    }
    //修改群昵称设置
    modifyNicknameSetting(groupId, nicknameSetting) {
        if (this.cache['groupSetting'][groupId]) {
            this.cache['groupSetting'][groupId].Nickname = nicknameSetting;
        }
        if (this.dbManager != null) {
            this.dbManager.modifyNicknameSetting(groupId, nicknameSetting);
        }
        this.httpManager.modifyNicknameSetting(groupId);
    }
    //获取群设置
    getGroupSetting(groupId, callback) {
        //cache
        if (this.cache['groupSetting'][groupId]) {
            callback && callback(this.cache['groupSetting'][groupId]);
            return;
        }
        //db
        if (this.dbManager != null) {
            this.dbManager.getGroupSetting(groupId, (result) => {
                if (result) {
                    this.cache['groupSetting'][groupId] = result;
                    callback && callback(result);
                    return;
                }
            });
        }
        //http
        //todo:http请求待处理
        // this.httpManager.getGroupSetting(groupId,(response: ResponseDto)=>{
        //     if (response.success && response.data != null) {
        //         let result: ApiResponseDto<any> = response.data as ApiResponseDto<any>;
        //         if (result.Result == ResultError.Success && result.Data != null) {
        //             callback && callback(result.Data);
        //             return;
        //         }
        //     }
        //     callback && callback(null);
        // });
    }
    addGroupSetting(groupId) {
        //cache
        if (this.dbManager != null) {
            this.dbManager.addGroupSetting(groupId);
        }
    }
    destroyInstance() {
        // if(this.dbManager != null)
        //     this.dbManager.logout();
        GroupManager.SingleInstance = null;
    }
    getContactListByNet(callback) {
        this.httpManager.getContactList((response) => {
            if (response.success && response.data != null) {
                let result = response.data;
                if (result.Result == ResultError.Success && result.Data != null) {
                    result.Data.forEach((item) => {
                        let oldGroupInfo = this.cache['group'][item.ID];
                        let headImagePath = "";
                        if (oldGroupInfo != null && item.ProfilePicture == oldGroupInfo.HeadImageUrl) {
                            headImagePath = oldGroupInfo.HeadImagePath;
                        }
                        let group = new GroupInfoDto();
                        group.Id = item.ID;
                        group.Name = item.Name;
                        group.Note = item.Description ? item.Description : '';
                        group.HeadImageUrl = item.ProfilePicture ? item.ProfilePicture : '';
                        group.HeadImagePath = headImagePath;
                        group.Owner = item.Owner;
                        group.Save = true;
                        group.Exited = false;
                        //添加缓存
                        this.cache["group"][item.ID] = group;
                        this.cache["groupMember"][item.ID] = item.MemberList;
                        //添加或者更改群组到数据库
                        if (this.dbManager != null) {
                            this.dbManager.createGroup(group, item.MemberList);
                        }
                    });
                }
            }
            callback && callback(this.cache['group']);
        });
    }
    //网络获取群信息
    getGroupInfoByNet(id, callback) {
        let param = new GetGroupMemberListDto();
        param.GroupId = id;
        this.httpManager.getGroupInfo(param, (response) => {
            if (response.success && response.data != null) {
                let result = response.data;
                if (result.Result != ResultError.Success) {
                    callback && callback(null);
                    return;
                }
                let oldGroupInfo = this.cache['group'][result.Data.ID];
                let save = false;
                let headImagePath = "";
                if (oldGroupInfo != null) {
                    if (result.Data.ProfilePicture == oldGroupInfo.HeadImageUrl)
                        headImagePath = oldGroupInfo.HeadImagePath;
                    save = oldGroupInfo.Save;
                }
                let group = new GroupInfoDto();
                group.Id = result.Data.ID;
                group.Name = result.Data.Name;
                group.Note = result.Data.Description ? result.Data.Description : '';
                group.HeadImageUrl = result.Data.ProfilePicture ? result.Data.ProfilePicture : '';
                group.HeadImagePath = headImagePath;
                group.Owner = result.Data.Owner;
                group.Save = save;
                this.cache["group"][id] = group;
                this.cache["groupMember"][id] = result.Data.MemberList;
                if (this.dbManager != null) {
                    this.dbManager.createGroup(group, result.Data.MemberList);
                }
                callback && callback(group);
            }
        });
    }
    getGroupsInfoByNet(ids, callback) {
        let param = new GetGroupsInfoDto();
        param.GroupIds = ids;
        this.httpManager.getGroupsInfo(param, (response) => {
            if (response.success && response.data != null) {
                let result = response.data;
                if (result.Result != ResultError.Success) {
                    callback && callback(null);
                    return;
                }
                let groups = [];
                for (let item = 0; item < result.Data.length; item++) {
                    let oldGroupInfo = this.cache['group'][result.Data[item].ID];
                    let save = false;
                    let headImagePath = "";
                    if (oldGroupInfo != null) {
                        if (result.Data[item].ProfilePicture == oldGroupInfo.HeadImageUrl)
                            headImagePath = oldGroupInfo.HeadImagePath;
                        save = oldGroupInfo.Save;
                    }
                    let group = new GroupInfoDto();
                    group.Id = result.Data[item].ID;
                    group.Name = result.Data[item].Name;
                    group.Note = result.Data[item].Description ? result.Data[item].Description : '';
                    group.HeadImageUrl = result.Data[item].ProfilePicture ? result.Data[item].ProfilePicture : '';
                    group.HeadImagePath = headImagePath;
                    group.Owner = result.Data[item].Owner;
                    group.Save = save;
                    this.cache["group"][result.Data[item].ID] = group;
                    this.cache["groupMember"][result.Data[item].ID] = result.Data[item].MemberList;
                    if (this.dbManager != null) {
                        this.dbManager.createGroup(group, result.Data[item].MemberList);
                    }
                    groups.push(group);
                }
                callback && callback(groups);
            }
        });
    }
    addOrUpdateGroup(group) {
        if (this.dbManager != null)
            this.dbManager.addOrUpdateGroupInfo(group);
    }
    stringToBoolean(str) {
        if (str == 'true' || str == true) {
            return true;
        }
        else {
            return false;
        }
    }
    sqlToGroupInfoDto(obj) {
        let GroupInfo = new GroupInfoDto();
        GroupInfo.Exited = this.stringToBoolean(obj.Exited);
        GroupInfo.HeadImagePath = obj.HeadImagePath;
        GroupInfo.HeadImageUrl = obj.HeadImageUrl;
        GroupInfo.Id = obj.Id;
        GroupInfo.Name = obj.Name;
        GroupInfo.Note = obj.Note;
        GroupInfo.Owner = obj.Owner;
        GroupInfo.Save = this.stringToBoolean(obj.Save);
        return GroupInfo;
    }
}
//# sourceMappingURL=GroupManager.js.map