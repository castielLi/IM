//import DBConfigDto = Common.DBConfigDto;
import HttpManager from '../../../HttpMangement/HttpManager';
import * as groupRequest from './RequestURL';
import RequestDto from '../../../HttpMangement/Dtos/RequestDto';
import ExitGroupDto from './RequestParamsDto/ExitGroupDto';
import WebApiConfig from '../../WebApiConfig';
import Config from "../../../../Config";
export default class RequestManager {
    constructor(isDB) {
        this.request = HttpManager.getSingleInstance(isDB);
    }
    joinGroup(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("joinGroup", "", param, groupRequest.joinGroupUrl, false, callback);
    }
    getContactList(callback) {
        this.requestInfo("getContactList", "", null, groupRequest.getGroupListUrl, false, callback);
    }
    //创建群
    createGroup(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("createGroup", "", param, groupRequest.createGroupUrl, false, callback);
    }
    //添加群成员
    addGroupMember(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("addGroupMember", param.GroupId, param, groupRequest.addGroupMemberUrl, false, callback);
    }
    //将群成员移出
    removeGroupMember(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("removeGroupMember", param.GroupId, param, groupRequest.removeGroupMemberUrl, false, callback);
    }
    //退出群
    exitGroup(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("exitGroup", param.GroupId, param, groupRequest.exitGroupUrl, true, callback);
    }
    //修改群名称
    modifyGroupName(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("modifyGroupName", param.GroupId, param, groupRequest.modifyGroupNameUrl, false, callback);
    }
    //修改群描述
    modifyGroupDescription(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("modifyGroupDescription", param.GroupId, param, groupRequest.modifyGroupDescriptionUrl, false, callback);
    }
    //更换群主
    changeGroupOwner(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("changeGroupOwner", param.GroupId, param, groupRequest.changeGroupOwnerUrl, false, callback);
    }
    //获取群成员账号列表
    getGroupInfo(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("getGroupInfo", param.GroupId, param, groupRequest.getGroupInfoUrl, false, callback);
    }
    getGroupsInfo(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfos("getGroupsInfo", param.GroupIds, param, groupRequest.getGroupsInfoUrl, false, callback);
    }
    //添加到通讯录
    addGroupToContact(id, callback) {
        let param = new ExitGroupDto();
        param.GroupId = id;
        this.requestInfo("addGroupToContact", id, param, groupRequest.addGroupToContactUrl, true, callback);
    }
    //从到通讯录删除
    removeGroupFromContact(id, callback) {
        let param = new ExitGroupDto();
        param.GroupId = id;
        this.requestInfo("removeGroupFromContact", id, param, groupRequest.removeGroupFromContactUrl, true, callback);
    }
    //修改群昵称设置
    modifyNicknameSetting(groupId) {
        let param = new ExitGroupDto();
        param.GroupId = groupId;
        this.requestInfo("modifyNicknameSetting", groupId, param, groupRequest.modifyNicknameSetting, true, null);
    }
    getGroupSetting(groupId, callback) {
        let param = new ExitGroupDto();
        param.GroupId = groupId;
        this.requestInfo("getGroupSetting", groupId, param, groupRequest.getGroupSetting, true, callback);
    }
    requestInfo(actionName, groupId, param, url, forceSuccess, callback = null) {
        let request = new RequestDto();
        request.forceSuccess = forceSuccess;
        request.requestId = "group_" + actionName + "_" + "GroupId_" + groupId;
        request.params = param;
        request.requestURL = Config.BaseUrl + url;
        request.header = { "Authorization": WebApiConfig.Authorization };
        this.request.request(request, function (key, result) {
            callback && callback(result);
        });
    }
    requestInfos(actionName, groupIds, param, url, forceSuccess, callback = null) {
        let request = new RequestDto();
        request.forceSuccess = forceSuccess;
        request.requestId = "groupsInfo_" + actionName;
        request.params = param;
        request.requestURL = Config.BaseUrl + url;
        request.header = { "Authorization": WebApiConfig.Authorization };
        this.request.request(request, function (key, result) {
            callback && callback(result);
        });
    }
}
//# sourceMappingURL=RequestManager.js.map