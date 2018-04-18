/**
* Created by apple on 2017/12/26.
*/
import UserManager from './UserManagement/UserManager';
import GroupManager from './GroupManagement/GroupManager';
import LoginManager from './LoginManagement/LoginManager';
export default class CommonManager {
    constructor(isDB) {
        this.userManager = null;
        this.groupManager = null;
        this.loginManager = null;
        this.isDB = isDB;
        this.loginManager = LoginManager.getSingleInstance(isDB);
    }
    static getSingleInstance(isDB) {
        if (CommonManager.SingleInstance == null) {
            CommonManager.SingleInstance = new CommonManager(isDB);
        }
        return CommonManager.SingleInstance;
    }
    getGroupAndUserInfoByList(userList, groupList, callback) {
        this.userManager.getUsersInfo(userList, false, (users) => {
            this.groupManager.getGroupsInfo(groupList, function (groups) {
                callback && callback(users, groups);
            }, true);
        }, true);
    }
    onLoginSuccess() {
        let Account = this.getCurrentAccount();
        this.userManager = UserManager.getSingleInstance(this.isDB, Account);
        this.groupManager = GroupManager.getSingleInstance(this.isDB);
    }
    // ----User----
    //账号登陆
    login(Account, Password, callback) {
        this.loginManager.login(Account, Password, callback);
    }
    //token登陆
    loginWithToken(callback) {
        this.loginManager.loginWithToken(callback);
    }
    //检查是否有处于登录状态的用户
    checkLoginToken(callback) {
        this.loginManager.checkLoginToken(callback);
    }
    //获取注册验证码
    GetCaptcha(phoneNumber, callback) {
        this.loginManager.GetCaptcha(phoneNumber, callback);
    }
    //注册账号
    Registered(phoneNumber, password, nickname, captcha, callback) {
        this.loginManager.Registered(phoneNumber, password, nickname, captcha, callback);
    }
    getCurrentAccount() {
        return this.loginManager.getCurrentUser();
    }
    // logOut():void{
    //     let currentObj = this;
    //     currentObj.loginManager.logOut();
    // }
    modifyNickname(nickname) {
        this.userManager.modifyNickname(nickname);
        let account = this.getCurrentAccount();
        account.Nickname = nickname;
        this.loginManager.modifyLoginUser(account);
    }
    modifyGender(gender) {
        this.userManager.modifyGender(gender);
        let account = this.getCurrentAccount();
        account.Gender = gender;
        this.loginManager.modifyLoginUser(account);
    }
    modifyPassword(oldPassword, newPassword, callback) {
        this.userManager.modifyPassword(oldPassword, newPassword, callback);
    }
    modifySignature(signature) {
        // this.userManager.modifySignature(signature);
        // let account = this.getCurrentAccount();
        // account.Signature = signature;
        // this.loginManager.modifyLoginUser(account);
    }
    getUpdateUsers(updateTime) {
        return this.userManager.getUpdateUsers(updateTime);
    }
    modifyHeadImage(data, userId, callback) {
        this.userManager.modifyHeadImage(data, userId, (path, saveSuccess) => {
            let account = this.getCurrentAccount();
            account.HeadImagePath = path;
            this.loginManager.modifyLoginUser(account);
            callback && callback(path, saveSuccess);
        });
    }
    //获取用户二维码数据
    getUserQRCode(account) {
        return this.userManager.getUserInfoCardQRCodeData(account);
    }
    //获取用户头像路径
    getUserHeadImagePath(userId) {
        return this.userManager.getAccountHeadImagePath(userId);
    }
    //获取user信息
    getUserInfo(account, refresh, callback) {
        this.userManager.getUserInfo(account, refresh, callback);
    }
    //获取多个user信息
    getUsersInfo(accounts, refresh, callback, once = false) {
        this.userManager.getUsersInfo(accounts, refresh, callback, once);
    }
    //加入/移除黑名单
    setBlackList(account, blackList, callback) {
        this.userManager.setBlackList(account, blackList, callback);
    }
    //删除好友
    removeFriend(account, callback) {
        this.userManager.removeFriend(account, callback);
    }
    //添加好友申请
    addFriend(Applicant, Respondent, message, callback) {
        this.userManager.addFriend(Applicant, Respondent, message, callback);
    }
    //接受好友申请
    acceptFriend(key, callback) {
        this.userManager.acceptFriend(key, callback);
    }
    //对方接受好友申请
    beAcceptFriend(account, callback) {
        this.userManager.beAcceptFriend(account, callback);
    }
    //获取通讯录列表
    getUserContactList(refresh, callback) {
        this.userManager.getContactList(refresh, callback);
    }
    //修改备注
    changeRemark(account, remark, callback) {
        this.userManager.changeRemark(account, remark, callback);
    }
    //获取黑名单好友
    getBlackListUser(callback) {
        this.userManager.getBlackListUser(callback);
    }
    //获取群成员信息
    getGroupMemberInfo(groupId, callback) {
        this.userManager.getGroupMemberInfo(groupId, callback);
    }
    //user中申请记录部分
    //添加新的申请
    addNewApply(message, callback) {
        this.userManager.addNewApply(message, callback);
    }
    getUncheckApplyMessageCount(callback) {
        this.userManager.getUncheckApplyMessageCount(callback);
    }
    //获取所有申请
    getAllApply(callback) {
        this.userManager.getAllApply(callback);
    }
    getAllNotOpreatingApply(callback) {
        this.userManager.getAllNotOpreatingApply(callback);
    }
    //跟新申请状态
    UpdateApplyStatus(status, key) {
        this.userManager.UpdateApplyStatus(status, key);
    }
    clearUnCheckCount() {
        this.userManager.clearUnCheckCount();
    }
    //黑名单设置
    modifyBlackList(account, blackList) {
        this.userManager.modifyBlackList(account, blackList);
    }
    //查看朋友圈设置
    modifyScanZoom(account, scanFriends) {
        this.userManager.modifyScanZoom(account, scanFriends);
    }
    //被查看朋友圈设置
    modifyReScanZoom(account, reScanZoom) {
        this.userManager.modifyReScanZoom(account, reScanZoom);
    }
    //特别朋友设置
    modifySpecialFriend(account, specialFriend) {
        this.userManager.modifySpecialFriend(account, specialFriend);
    }
    //获取用户设置
    getUserSetting(account, callback) {
        this.userManager.getUserSetting(account, callback);
    }
    addUserSetting(account) {
        this.userManager.addUserSetting(account);
    }
    //清除所有申请记录
    clearApply() {
        this.userManager.clearApply();
    }
    // ----Group----
    //群昵称设置
    modifyNicknameSetting(groupId, nicknameSetting) {
        this.groupManager.modifyNicknameSetting(groupId, nicknameSetting);
    }
    //获取群设置
    getGroupSetting(groupId, callback) {
        this.groupManager.getGroupSetting(groupId, callback);
    }
    addGroupSetting(groupId) {
        this.groupManager.addGroupSetting(groupId);
    }
    //获取群信息
    getGroupInfo(id, refresh, callback) {
        this.groupManager.getGroupInfo(id, refresh, callback);
    }
    //获取多个群信息
    getGroupsInfo(ids, callback, once = false) {
        this.groupManager.getGroupsInfo(ids, callback, once);
    }
    //获取群成员id, refresh: 强制更新
    getGroupMember(id, refresh, callback) {
        this.groupManager.getGroupMember(id, refresh, callback);
    }
    //添加群成员
    addGroupMember(id, members, callback) {
        this.groupManager.addGroupMember(id, members, callback);
    }
    //移除群成员
    removeGroupMember(id, members, callback) {
        this.groupManager.removeGroupMember(id, members, callback);
    }
    //添加/移除通讯录
    addOrRemoveContacts(id, save) {
        this.groupManager.addOrRemoveContacts(id, save);
    }
    //修改群名称
    updateGroupName(id, name, request, callback) {
        this.groupManager.updateGroupName(id, name, request, callback);
    }
    //修改群公告
    updateGroupBulletin(id, note, request, callback) {
        this.groupManager.updateGroupBulletin(id, note, request, callback);
    }
    //创建群
    createGroup(account, name, members, callback) {
        this.groupManager.createGroup(account, name, members, callback);
    }
    //退群/解散群
    removeGroup(id, callback) {
        this.groupManager.removeGroup(id, callback);
    }
    //被踢出群
    setGroupExitSetting(id, value) {
        this.groupManager.setGroupExitSetting(id, value);
    }
    //获取通讯录列表
    getGroupContactList(refresh, callback) {
        this.groupManager.getContactList(refresh, callback);
    }
    // --------
    destroyInstance() {
        this.userManager.destroyInstance();
        this.groupManager.destroyInstance();
        this.loginManager.destroyInstance();
    }
}
//# sourceMappingURL=WebApiManager.js.map