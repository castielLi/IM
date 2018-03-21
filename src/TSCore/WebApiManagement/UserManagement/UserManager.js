/**
* Created by apple on 2017/12/21.
*/
import RequestManager from './Request/RequestManager';
import ApplyFriendManager from './ApplyFriendManagement/ApplyFriendManager';
import UserDBManager from './DBManagement/UserDBManager';
import UserInfoDto from './Dtos/UserInfoDto';
import ResultError from '../Enums/ResultError';
import ApplyMessageStatus from './ApplyFriendManagement/Enums/ApplyMessageStatus';
import ApplyFriendDto from "./ApplyFriendManagement/Dtos/ApplyFriendDto";
import SetBlackMemberDto from './Request/RequestParamsDto/SetBlackMemberDto';
import DeleteFriendDto from './Request/RequestParamsDto/DeleteFriendDto';
import AddFriendDto from './Request/RequestParamsDto/AddFriendDto';
import AcceptFriendDto from './Request/RequestParamsDto/AcceptFriendDto';
import SetUserRemarkDto from './Request/RequestParamsDto/SetUserRemarkDto';
import GetClientInfoDto from './Request/RequestParamsDto/GetClientInfoDto';
import GetClientsInfoDto from './Request/RequestParamsDto/GetClientsInfoDto';
import HeadImageManager from "./HeadImageManager/HeadImageManager";
import modifyHeadImageDto from "./Request/RequestParamsDto/modifyHeadImageDto";
import modifyNickNameDto from "./Request/RequestParamsDto/modifyNickNameDto";
import AccountDto from './Request/RequestParamsDto/AccountDto';
import QRCodeTool from "../../Tools/QRCode/QRCodeTool";
import QRCodeType from "../../../TSController/Enums/QRCodeType";
import ModifyGenderDto from './Request/RequestParamsDto/ModifyGenderDto';
import ModifySignatureDto from './Request/RequestParamsDto/ModifySignatureDto';
import ModifyPasswordDto from './Request/RequestParamsDto/ModifyPasswordDto';
export default class UserManager {
    constructor(isDB, Account) {
        this.cache = {
            'user': {},
            'apply': {},
            'updateUsers': {},
            'userSetting': {},
            'clearStartTime': 0
        }; //user:{} apply:{}
        this.codeTool = null;
        this.dbManager = null;
        this.httpManager = null;
        this.applyManager = null;
        this.headImageManager = null;
        this.clearTime = 12000; //清除时间为两分钟
        this.timerId = 0;
        this.gotContact = false;
        if (isDB) {
            this.dbManager = new UserDBManager();
        }
        this.httpManager = new RequestManager(isDB);
        this.applyManager = ApplyFriendManager.getSingleInstance(isDB);
        this.headImageManager = HeadImageManager.getSingleInstance(isDB, Account);
        this.codeTool = QRCodeTool.getSingleInstance();
        this.headImageManager.init(this);
    }
    static getSingleInstance(isDB, Account) {
        if (UserManager.SingleInstance == null) {
            UserManager.SingleInstance = new UserManager(isDB, Account);
        }
        return UserManager.SingleInstance;
    }
    clearCacheUpdateUsers() {
        let handleClearCacheTask = () => {
            let updateTimes = Object.keys(this.cache.updateUsers);
            if (updateTimes.length == 0)
                return;
            for (let item in updateTimes) {
                if (parseInt(updateTimes[item]) + this.clearTime > this.cache.clearStartTime)
                    delete this.cache.updateUsers[updateTimes[item]];
            }
            let updateTimesAfterClear = Object.keys(this.cache.updateUsers);
            if (updateTimesAfterClear.length > 0)
                this.timerId = setTimeout(handleClearCacheTask, this.clearTime);
        };
        this.cache.user["clearStartTime"] = new Date().getTime();
        this.timerId = setTimeout(handleClearCacheTask, this.clearTime);
    }
    //获取用户本地头像
    getAccountHeadImagePath(userId) {
        return this.headImageManager.getUserHeadImagePath(userId);
    }
    //获取用户主动更新的用户列表
    getUpdateUsers(updateTime) {
        let returnAccounts = [];
        let updateTimes = Object.keys(this.cache.updateUsers);
        for (let item in updateTimes) {
            if (parseInt(updateTimes[item]) >= updateTime)
                returnAccounts.push(this.cache.updateUsers[updateTimes[item]]);
        }
        return returnAccounts;
    }
    //修改当前用户的昵称
    modifyNickname(nickname) {
        let dto = new modifyNickNameDto();
        dto.Nickname = nickname;
        this.httpManager.modifyNickName(dto);
    }
    modifyGender(gender) {
        let dto = new ModifyGenderDto();
        dto.Gender = gender;
        this.httpManager.modifyGender(dto);
    }
    modifyPassword(oldPassword, newPassword, callback) {
        let dto = new ModifyPasswordDto();
        dto.OldPassword = oldPassword;
        dto.NewPassword = newPassword;
        this.httpManager.modifyPassword(dto, (response) => {
            if (response.success && response.data != null) {
                callback && callback(response.data);
                return;
            }
            callback && callback(null);
        });
    }
    modifySignature(signature) {
        let dto = new ModifySignatureDto();
        dto.Signature = signature;
        this.httpManager.modifySignature(dto);
    }
    //修改当前用户的头像地址
    modifyHeadImage(data, userId, callback) {
        this.headImageManager.addUploadHeadImageRequest(data, userId, callback);
    }
    //获取user信息
    getUserInfo(account, refresh, callback) {
        if (refresh) {
            this.getUserInfoByNet(account, (result) => {
                callback && callback(result);
            });
            return;
        }
        //得到缓存数据
        if (this.cache['user'][account]) {
            callback && callback(this.cache['user'][account]);
            return;
        }
        //数据库加载
        if (this.dbManager != null) {
            this.dbManager.getUser(account, (user) => {
                if (user) {
                    this.cache['user'][account] = user;
                    callback && callback(user);
                }
                else {
                    this.getUserInfoByNet(account, callback);
                }
            });
        }
        else {
            this.getUserInfoByNet(account, callback);
        }
    }
    //获取users信息
    getUsersInfo(accounts, refresh, callback, once) {
        if (!accounts || accounts.length == 0) {
            callback && callback(null);
            return;
        }
        if (refresh) {
            this.getUsersInfoByNet(accounts, (result) => {
                callback && callback(result);
            });
            return;
        }
        let backusers = [];
        let lackUserIds = [];
        for (let i = 0; i < accounts.length; i++) {
            if (this.cache['user'][accounts[i]] != undefined)
                backusers.push(this.cache['user'][accounts[i]]);
            else
                lackUserIds.push(accounts[i]);
            //如果不是必须一次性全部返回完users的，就可以直接返回一部分到上层进行处理
        }
        if (!once) {
            callback && callback(backusers);
            backusers = [];
        }
        else {
            if (lackUserIds.length == 0) {
                callback && callback(backusers);
            }
        }
        if (lackUserIds.length == 0)
            return;
        if (this.dbManager) {
            this.dbManager.getUsers(lackUserIds, (users) => {
                if (users && users.length > 0) {
                    for (let i in users) {
                        let user = users[i];
                        if (user) {
                            this.cache['user'][user.Account] = user;
                            backusers.push(user);
                            let index = lackUserIds.indexOf(user.Account);
                            if (index != -1) {
                                lackUserIds.splice(index, 1);
                            }
                        }
                    }
                    if (!once) {
                        callback && callback(backusers);
                        backusers = [];
                    }
                    else {
                        if (lackUserIds.length == 0) {
                            callback && callback(backusers);
                        }
                        else {
                            backusers = backusers.concat(users);
                        }
                    }
                }
                if (lackUserIds.length == 0)
                    return;
                this.getUsersInfoByNet(lackUserIds, (result) => {
                    backusers = backusers.concat(result);
                    callback && callback(backusers);
                });
            });
        }
        else {
            if (lackUserIds.length == 0)
                return;
            this.getUsersInfoByNet(lackUserIds, (result) => {
                backusers = backusers.concat(result);
                callback && callback(backusers);
            });
        }
    }
    //加入/移除黑名单
    setBlackList(account, blackList, callback) {
        if (this.cache['user'][account]) {
            this.cache['user'][account].BlackList = blackList;
        }
        if (this.dbManager != null) {
            this.dbManager.changeUserBlackList(account, blackList);
        }
        let params = new SetBlackMemberDto();
        params.Account = account;
        this.httpManager.setBlackList(params, blackList);
    }
    //删除好友
    removeFriend(account, callback) {
        if (this.cache['user'][account]) {
            this.cache['user'][account].Friend = false;
        }
        callback && callback(this.cache['user']);
        if (this.dbManager != null)
            this.dbManager.removeUser(account);
        let params = new DeleteFriendDto();
        params.Friend = account;
        this.httpManager.removeFriend(params);
    }
    //添加好友申请
    addFriend(Applicant, Respondent, message, callback) {
        //如果直接添加成功, 返回用户数据保存缓存和DB
        let params = new AddFriendDto();
        params.Applicant = Applicant;
        params.Respondent = Respondent;
        params.Message = message;
        this.httpManager.addFriend(params, (response) => {
            if (response.success && response.data != null) {
                let result = response.data;
                let cache = null;
                if (result.Result == ResultError.Success) {
                    if (result.Data instanceof Object) {
                        let Data = result.Data;
                        let user = Data.MemberInfo;
                        // user.Friend = true;
                        // user.BlackList = Data.IsInBlackList;
                        if (this.dbManager) {
                            this.dbManager.addUser(user);
                        }
                        this.cache['user'][user.Account] = user;
                        cache = Object.values(this.cache['user']);
                    }
                    else {
                        //todo:双方均不为好友的情况
                        let Data = result.Data;
                    }
                }
                callback && callback(result, cache);
                return;
            }
            callback && callback(null);
        });
    }
    //接受好友申请
    acceptFriend(key, callback) {
        let params = new AcceptFriendDto();
        params.Key = key;
        this.httpManager.acceptFriend(params, (response) => {
            if (response.success && response.data != null) {
                let result = response.data;
                let users = null;
                let apply = null;
                if (result.Result == ResultError.Success && result.Data != null) {
                    let user = this.rebuildUserDto(result.Data);
                    user.Friend = true;
                    user.BlackList = false;
                    this.cache['user'][user.Account] = user;
                    users = Object.values(this.cache['user']);
                    if (this.dbManager) {
                        this.dbManager.addUser(user);
                    }
                    if (this.cache['apply'][user.Account]) {
                        this.cache['apply'][user.Account].status = ApplyMessageStatus.ADDED;
                    }
                    apply = Object.values(this.cache['apply']);
                    this.UpdateApplyStatus(ApplyMessageStatus.ADDED, key);
                }
                callback && callback(result, users, apply);
                return;
            }
            callback && callback(null);
        });
    }
    //获取所有好友申请记录
    getAllApply(callback) {
        let applys = Object.values(this.cache['apply']);
        if (applys.length) {
            callback && callback(applys);
            return;
        }
        if (this.dbManager != null) {
            this.applyManager.getAllApply((applyList) => {
                let userArray = applyList.map(function (current, index, array) {
                    return current.sender;
                });
                //批量获取用户数据方法
                if (userArray.length == 0 || !userArray)
                    return;
                this.getUsersInfo(userArray, false, (users) => {
                    for (let i = 0; i < applyList.length; i++) {
                        for (let current of users) {
                            if (current.Account == applyList[i].sender) {
                                let applyFriendDto = new ApplyFriendDto();
                                applyFriendDto.time = applyList[i].time;
                                applyFriendDto.comment = applyList[i].comment;
                                applyFriendDto.key = applyList[i].key;
                                applyFriendDto.sender = applyList[i].sender;
                                applyFriendDto.status = applyList[i].status;
                                applyFriendDto.HeadImageUrl = current.HeadImageUrl;
                                applyFriendDto.HeadImagePath = current.HeadImagePath;
                                applyFriendDto.Nickname = current.Nickname;
                                this.cache['apply'][applyFriendDto.sender] = applyFriendDto;
                                break;
                            }
                        }
                    }
                    callback && callback(Object.values(this.cache['apply']));
                }, true);
            });
        }
    }
    //跟新申请记录状态
    UpdateApplyStatus(status, key) {
        this.applyManager.UpdateApplyStatus(status, key);
    }
    //添加新的申请记录
    addNewApply(message, callback) {
        this.getUserInfo(message.sender, true, (user) => {
            let applyFriendDto = new ApplyFriendDto();
            applyFriendDto.time = message.time;
            applyFriendDto.comment = message.comment;
            applyFriendDto.key = message.key;
            applyFriendDto.sender = message.sender;
            applyFriendDto.status = message.status;
            applyFriendDto.HeadImageUrl = user.HeadImageUrl;
            applyFriendDto.HeadImagePath = user.HeadImagePath;
            applyFriendDto.Nickname = user.Nickname;
            this.cache['apply'][applyFriendDto.sender] = applyFriendDto;
            callback && callback(Object.values(this.cache['apply']));
            this.headImageManager.addHeadImageRequest(message.sender, user.HeadImageUrl);
        });
        this.applyManager.addNewApply(message);
    }
    //得到所有未接收记录
    getAllNotOpreatingApply(callback) {
        this.applyManager.getAllNotOpreatingApply(callback);
    }
    ;
    //
    getUncheckApplyMessageCount(callback) {
        this.applyManager.getUncheckApplyMessageCount(callback);
    }
    //
    clearUnCheckCount() {
        this.applyManager.clearUnCheckCount();
    }
    //清空申请记录
    clearApply() {
        this.applyManager.clear();
    }
    //获取通讯录列表
    getContactList(refresh, callback) {
        if (Object.keys(this.cache['user']).length && !refresh && this.gotContact) {
            callback && callback(Object.values(this.cache['user']));
            return;
        }
        if (this.dbManager != null && !refresh) {
            this.dbManager.getAllUser((userList) => {
                callback && callback(userList);
                userList.forEach((v) => {
                    this.cache['user'][v.Account] = v;
                });
                this.gotContact = true;
            });
        }
        else {
            this.httpManager.getContactList((response) => {
                if (response.success && response.data != null) {
                    let result = response.data;
                    if (result.Result == ResultError.Success && result.Data != null) {
                        result.Data.FriendList.forEach((item, index) => {
                            let user = item;
                            user.BlackList = false;
                            user.Friend = true;
                            user.HeadImagePath = "";
                            this.cache['user'][user.Account] = user;
                            this.dbManager.addUser(user);
                        });
                        result.Data.BlackList.forEach((item, index) => {
                            try {
                                let user = item;
                                user.BlackList = true;
                                let Friend = false;
                                if (this.cache['user'][user.Account]) {
                                    Friend = this.cache['user'][user.Account].Friend;
                                }
                                user.Friend = Friend;
                                user.HeadImagePath = "";
                                this.cache['user'][user.Account] = user;
                                this.dbManager.addUser(user);
                            }
                            catch (error) {
                                console.log(error);
                                throw error;
                            }
                        });
                    }
                }
                //添加到头像管理模块进行判断是否需要进行下载新的头像
                let users = Object.values(this.cache['user']);
                if (users.length == 0)
                    return;
                for (let i = 0; i < users.length; i++) {
                    this.headImageManager.addHeadImageRequest(users[i].Account, users[i].HeadImageUrl);
                }
                callback && callback(users);
                this.gotContact = true;
            });
        }
    }
    //修改备注
    changeRemark(account, remark, callback) {
        if (this.cache['user'][account]) {
            this.cache['user'][account].Remark = remark;
        }
        if (this.dbManager != null) {
            this.dbManager.changeRemark(account, remark);
        }
        callback && callback();
        //TODO: 网络请求
        //目前后台没有这个api
        let params = new SetUserRemarkDto();
        params.Account = account;
        params.Remark = remark;
        this.httpManager.setUserRemark(params);
        this.addUpdateUserToCache(account);
    }
    //获取黑名单好友
    getBlackListUser(callback) {
        if (this.dbManager != null) {
            this.dbManager.getBlackListUser((userList) => {
                callback && callback(userList);
                userList.forEach((v) => {
                    this.cache['blacklist'][v.Id] = v;
                });
            });
        }
    }
    //对方接受好友申请
    beAcceptFriend(account, callback) {
        if (this.dbManager != null) {
            this.dbManager.updateUserFriendAttribute(account, true);
        }
        if (this.cache['user'][account]) {
            this.cache['user'][account].Friend = true;
            callback && callback(Object.values(this.cache['user']));
        }
        //刷新用户信息
        this.getUserInfoByNet(account, () => {
            callback && callback(Object.values(this.cache['user']));
        });
    }
    getGroupMemberInfo(groupId, callback) {
        this.httpManager.getGroupMemberInfo(groupId, (response) => {
            if (response.success && response.data != null) {
                let result = response.data;
                if (result.Result == ResultError.Success && result.Data != null) {
                    result.Data.forEach((item) => {
                        let user = this.rebuildUserDto(item);
                        this.dbManager.addUser(user);
                        this.cache['user'][user.Account] = user;
                    });
                    callback && callback(result.Data);
                    return;
                }
            }
            callback && callback(null);
        });
    }
    //黑名单设置
    modifyBlackList(account, blackList) {
        if (this.cache['userSetting'][account]) {
            this.cache['userSetting'][account].BlackList = blackList;
        }
        if (this.dbManager != null) {
            this.dbManager.modifyBlackList(account, blackList);
        }
        let params = new AccountDto();
        params.Account = account;
        this.httpManager.modifyBlackList(params, blackList);
    }
    //查看朋友圈设置
    modifyScanZoom(account, scanZoom) {
        if (this.cache['userSetting'][account]) {
            this.cache['userSetting'][account].ScanZoom = scanZoom;
        }
        if (this.dbManager != null) {
            this.dbManager.modifyScanZoom(account, scanZoom);
        }
        let params = new AccountDto();
        params.Account = account;
        this.httpManager.modifyScanZoom(params);
    }
    //被查看朋友圈设置
    modifyReScanZoom(account, reScanZoom) {
        if (this.cache['userSetting'][account]) {
            this.cache['userSetting'][account].ReScanZoom = reScanZoom;
        }
        if (this.dbManager != null) {
            this.dbManager.modifyReScanZoom(account, reScanZoom);
        }
        let params = new AccountDto();
        params.Account = account;
        this.httpManager.modifyReScanZoom(params);
    }
    //特别朋友设置
    modifySpecialFriend(account, specialFriend) {
        if (this.cache['userSetting'][account]) {
            this.cache['userSetting'][account].SpecialFriend = specialFriend;
        }
        if (this.dbManager != null) {
            this.dbManager.modifySpecialFriend(account, specialFriend);
        }
        let params = new AccountDto();
        params.Account = account;
        this.httpManager.modifySpecialFriend(params);
    }
    //获取用户设置
    getUserSetting(account, callback) {
        //cache
        if (this.cache['userSetting'][account]) {
            callback && callback(this.cache['userSetting'][account]);
            return;
        }
        //db
        if (this.dbManager != null) {
            this.dbManager.getUserSetting(account, (result) => {
                if (result) {
                    this.cache['userSetting'][account] = result;
                    callback && callback(result);
                    return;
                }
            });
        }
        //http
        let params = new AccountDto();
        params.Account = account;
        //todo:http请求待处理
        // this.httpManager.getUserSetting(params,(response: ResponseDto)=>{
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
    addUserSetting(account) {
        //cache
        if (this.dbManager != null) {
            this.dbManager.addUserSetting(account);
        }
    }
    //获取名片二维码数据
    getUserInfoCardQRCodeData(account) {
        return this.codeTool.getCode(QRCodeType.UserInfoCard, account);
    }
    //解析名片二维码
    analysisUserInfoCardQRCodeInfo(data) {
    }
    destroyInstance() {
        // if(this.dbManager != null)
        //     this.dbManager.logout();
        this.httpManager.destroyInstance();
        UserManager.SingleInstance = null;
        this.applyManager.destroyInstance();
    }
    //################  IHeadImageCallback ###################
    HeadImageUploadSuccess(headImageUrl) {
        let dto = new modifyHeadImageDto();
        dto.HeadImageUrl = headImageUrl;
        this.httpManager.modifyHeadImage(dto);
    }
    getUserInfoByNet(id, callback = null) {
        let params = new GetClientInfoDto();
        params.Keyword = id;
        this.httpManager.getUserInfo(params, (response) => {
            if (response.success && response.data != null) {
                let result = response.data;
                if (result.Result == ResultError.Success && result.Data != null) {
                    let user = this.rebuildUserDto(result.Data);
                    this.dbManager.addUser(user);
                    this.cache['user'][user.Account] = user;
                    this.headImageManager.addHeadImageRequest(user.Account, user.HeadImageUrl);
                    callback && callback(result.Data);
                    return;
                }
            }
            callback && callback(null);
        });
    }
    getUsersInfoByNet(array, callback = null) {
        let params = new GetClientsInfoDto();
        params.Accounts = array;
        this.httpManager.getUsersInfo(params, (response) => {
            if (response.success && response.data != null) {
                let result = response.data;
                if (result.Result == ResultError.Success && result.Data != null) {
                    result.Data.forEach((item) => {
                        let user = this.rebuildUserDto(item);
                        this.dbManager.addUser(user);
                        this.cache['user'][user.Account] = user;
                        this.headImageManager.addHeadImageRequest(user.Account, user.HeadImageUrl);
                    });
                    callback && callback(result.Data);
                    return;
                }
            }
            callback && callback(null);
        });
    }
    //将请求用户数据转换成用户数据Dto
    rebuildUserDto(UserInfoByNet) {
        let user = new UserInfoDto();
        user.Friend = UserInfoByNet.Friend;
        user.Account = UserInfoByNet.Account;
        user.HeadImageUrl = UserInfoByNet.HeadImageUrl;
        user.Remark = UserInfoByNet.Remark ? UserInfoByNet.Remark : '';
        user.BlackList = UserInfoByNet.BlackList;
        user.Gender = UserInfoByNet.Gender;
        user.Nickname = UserInfoByNet.Nickname;
        user.Email = UserInfoByNet.Email;
        user.HeadImagePath = UserInfoByNet.HeadImagePath;
        return user;
    }
    addUpdateUserToCache(account) {
        //将修改的用户id存放进修改缓存中
        let updateTimes = Object.keys(this.cache.updateUsers);
        if (updateTimes.length == 0)
            this.clearCacheUpdateUsers();
        let updateTime = new Date().getTime();
        this.cache.updateUsers[updateTime] = account;
    }
    stringToBoolean(str) {
        if (str == 'true' || str == true) {
            return true;
        }
        else {
            return false;
        }
    }
    //过滤掉非好友信息
    filterNotFriends(userArray) {
        if (userArray == null)
            return;
        let contacts = userArray.map((current, index) => {
            if (current.Friend == true || current.Friend == 'true') {
                return current;
            }
        });
        return contacts;
    }
}
//# sourceMappingURL=UserManager.js.map