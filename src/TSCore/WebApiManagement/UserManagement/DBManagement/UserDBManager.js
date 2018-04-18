import SQLiteHelper from '../../../Tools/SQLite/SQLiteHelper';
import SQLiteFactory from '../../../Tools/SQLite/SQLiteFactory';
import UserInfoDto from '../Dtos/UserInfoDto';
import SQLiteSql from './ExecuteCommand/SQLiteSql';
import AccountDto from '../Dtos/AccountDto';
import SetBlackListDto from '../Dtos/SetBlackListDto';
import SetRemarkDto from '../Dtos/SetRemarkDto';
import AccountsDto from '../Dtos/AccountsDto';
import SetFriendDto from '../Dtos/SetFriendDto';
import ModifySingleDto from '../Dtos/ModifySingleDto';
import UserSettingDto from '../Dtos/UserSettingDto';
//TODO: 缺少更新用户资料 (WebApi返回最新数据, 保存到数据库)
export default class UserDBManager {
    constructor() {
        this.sql = SQLiteFactory.GetSQLite(UserDBManager.dbKey);
        if (this.sql == null) {
            throw new Error("UserDBManager sql is null, config is error");
        }
        for (let item in SQLiteSql.initDatabase) {
            this.sql.ExecuteSQL(SQLiteSql.initDatabase[item]);
        }
    }
    //添加好友
    addUser(user) {
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.addUser, user);
        this.sql.ExecuteSQL(sql);
    }
    //删除好友
    removeUser(account) {
        let accountDto = new AccountDto();
        accountDto.Account = account;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.removeUser, accountDto);
        this.sql.ExecuteSQL(sql);
    }
    //修改用户黑名单
    changeUserBlackList(account, blackList) {
        let setBlackListDto = new SetBlackListDto();
        setBlackListDto.BlackList = blackList;
        setBlackListDto.Account = account;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.changeUserBlackList, setBlackListDto);
        this.sql.ExecuteSQL(sql);
    }
    //获取指定好友
    getUser(account, callback) {
        let accountDto = new AccountDto();
        accountDto.Account = account;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.getUser, accountDto);
        this.sql.ExecuteSQLWithT(sql, (data) => {
            if (data.length != 0) {
                callback && callback(data[0]);
            }
            else {
                callback && callback(null);
            }
        }, UserInfoDto);
    }
    //获取所有好友
    getAllUser(callback) {
        this.sql.ExecuteSQLWithT(SQLiteSql.getAllUser, (data) => {
            callback && callback(data);
        }, UserInfoDto);
    }
    //修改备注
    changeRemark(account, remark) {
        let setRemarkDto = new SetRemarkDto();
        setRemarkDto.Remark = remark;
        setRemarkDto.Account = account;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.changeRemark, setRemarkDto);
        this.sql.ExecuteSQL(sql);
    }
    //获取黑名单好友
    getBlackListUser(callback) {
        this.sql.ExecuteSQLWithT(SQLiteSql.getBlackList, (data) => {
            callback && callback(data);
        }, UserInfoDto);
    }
    //获取好友
    getContactList(callback) {
        this.sql.ExecuteSQLWithT(SQLiteSql.getContactList, (data) => {
            callback && callback(data);
        }, UserInfoDto);
    }
    //批量获取用户
    getUsers(accounts, callback) {
        let accountsDto = new AccountsDto();
        accountsDto.Accounts = accounts;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.getUsers, accountsDto);
        this.sql.ExecuteSQLWithT(sql, (users) => {
            callback && callback(users);
        }, UserInfoDto);
    }
    //修改user Friend字段的值
    updateUserFriendAttribute(account, value) {
        let setFriendDto = new SetFriendDto();
        setFriendDto.Friend = value;
        setFriendDto.Account = account;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.updateUserFriend, setFriendDto);
        this.sql.ExecuteSQL(sql);
    }
    //黑名单设置
    modifyBlackList(account, blackList) {
        let modifySingleDto = new ModifySingleDto();
        modifySingleDto.Value = blackList;
        modifySingleDto.Account = account;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.modifyBlackList, modifySingleDto);
        this.sql.ExecuteSQL(sql);
    }
    //查看朋友圈设置
    modifyScanZoom(account, scanZoom) {
        let modifySingleDto = new ModifySingleDto();
        modifySingleDto.Value = scanZoom;
        modifySingleDto.Account = account;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.modifyScanZoom, modifySingleDto);
        this.sql.ExecuteSQL(sql);
    }
    //被查看朋友圈设置
    modifyReScanZoom(account, reScanZoom) {
        let modifySingleDto = new ModifySingleDto();
        modifySingleDto.Value = reScanZoom;
        modifySingleDto.Account = account;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.modifyReScanZoom, modifySingleDto);
        this.sql.ExecuteSQL(sql);
    }
    //特别朋友设置
    modifySpecialFriend(account, specialFriend) {
        let modifySingleDto = new ModifySingleDto();
        modifySingleDto.Value = specialFriend;
        modifySingleDto.Account = account;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.modifySpecialFriend, modifySingleDto);
        this.sql.ExecuteSQL(sql);
    }
    //获取用户设置
    getUserSetting(account, callback) {
        let accountDto = new AccountDto();
        accountDto.Account = account;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.getUserSetting, accountDto);
        this.sql.ExecuteSQLWithT(sql, (data) => {
            if (data.length != 0) {
                callback && callback(data[0]);
            }
            else {
                callback && callback(null);
            }
        }, UserSettingDto);
    }
    addUserSetting(account) {
        // let addSettingDto = new AddSettingDto();
        // let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.addUserSetting, addSettingDto);
        // this.sql.ExecuteSQL(sql);
    }
    //退出关闭数据库
    logout() {
        this.sql = null;
    }
}
UserDBManager.dbKey = "IM";
//# sourceMappingURL=UserDBManager.js.map