/**
* Created by apple on 2017/12/25.
*/
//import DBConfigDto = Common.DBConfigDto;
import HttpManager from '../../../HttpMangement/HttpManager';
import * as userRequest from './RequestURL';
import RequestDto from '../../../HttpMangement/Dtos/RequestDto';
import WebApiConfig from '../../WebApiConfig';
import Config from "../../../../Config";
export default class RequestManager {
    constructor(isDB) {
        this.request = HttpManager.getSingleInstance(isDB);
    }
    modifyNickName(param) {
        if (param == null) {
            return;
        }
        this.requestInfo("modifyNickName", "", param, userRequest.modifyNickNameUrl, true, null);
    }
    modifyGender(param) {
        if (param == null) {
            return;
        }
        this.requestInfo("modifyGender", "", param, userRequest.modifyGenderUrl, true, null);
    }
    modifyPassword(param, callback) {
        if (param == null) {
            return;
        }
        this.requestInfo("modifyPassword", "", param, userRequest.modifyPasswordUrl, true, callback);
    }
    modifySignature(param) {
        if (param == null) {
            return;
        }
        this.requestInfo("modifySignature", "", param, userRequest.modifySignatureUrl, true, null);
    }
    modifyHeadImage(param) {
        if (param == null) {
            return;
        }
        this.requestInfo("modifyHeadImage", "", param, userRequest.modifyHeadImageUrl, true, null);
    }
    //获取群成员账号列表
    getUserInfo(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("getUserInfo", param.Keyword, param, userRequest.getClientInfoUrl, false, callback);
    }
    getUsersInfo(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("getUserInfo", "accounts", param, userRequest.GetCLientsInfoUrl, false, callback);
    }
    setBlackList(param, value) {
        if (param == null) {
            return;
        }
        this.requestInfo("setBlackList", param.Applicant, param, value ? userRequest.addBlackMemberUrl : userRequest.removeBlackMemberUrl, true, null);
    }
    removeFriend(param) {
        if (param == null) {
            return;
        }
        this.requestInfo("removeFriend", param.Friend, param, userRequest.deleteFriendUrl, true);
    }
    addFriend(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("addFriend", param.Applicant, param, userRequest.applyFriend, true, callback);
    }
    acceptFriend(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("acceptFriend", param.Key, param, userRequest.addFriendUrl, true, callback);
    }
    setUserRemark(param) {
        if (param == null) {
            return;
        }
        this.requestInfo("setUserRemark", param.Account, param, userRequest.setUserRemarkUrl, true, null);
    }
    getContactList(callback) {
        this.requestInfo("getContactList", "", null, userRequest.getContactListUrl, true, callback);
    }
    getGroupMemberInfo(groupId, callback) {
        this.requestInfo("getGroupMemberInfo", groupId, { GroupId: groupId }, userRequest.getGroupMemberInfoUrl, true, callback);
    }
    //getBlackListUser
    //changeRemark
    //黑名单设置
    modifyBlackList(param, value) {
        if (param == null) {
            return;
        }
        this.requestInfo("modifyBlackList", '', param, value ? userRequest.addBlackMemberUrl : userRequest.removeBlackMemberUrl, true, null);
    }
    //查看朋友圈设置
    modifyScanZoom(param) {
        if (param == null) {
            return;
        }
        this.requestInfo("modifyScanZoom", '', param, userRequest.modifyScanZoom, true, null);
    }
    //被查看朋友圈设置
    modifyReScanZoom(param) {
        if (param == null) {
            return;
        }
        this.requestInfo("modifyReScanZoom", '', param, userRequest.modifyReScanZoom, true, null);
    }
    //特别朋友设置
    modifySpecialFriend(param) {
        if (param == null) {
            return;
        }
        this.requestInfo("modifySpecialFriend", '', param, userRequest.modifySpecialFriend, true, null);
    }
    getUserSetting(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("getUserSetting", '', param, userRequest.getUserSetting, true, callback);
    }
    destroyInstance() {
        this.request.destroyInstance();
    }
    requestInfo(actionName, userId, param, url, forceSuccess, callback = null) {
        let request = new RequestDto();
        request.forceSuccess = forceSuccess;
        request.requestId = "user_" + actionName + "_" + "UserId" + userId;
        request.params = param;
        request.requestURL = Config.BaseUrl + url;
        request.header = { "Authorization": WebApiConfig.Authorization };
        this.request.request(request, function (key, result) {
            callback && callback(result);
        });
    }
}
//# sourceMappingURL=RequestManager.js.map