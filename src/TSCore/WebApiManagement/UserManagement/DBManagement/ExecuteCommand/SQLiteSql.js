export default class SQLiteSql {
}
SQLiteSql.initDatabase = {
    initUserDB: "CREATE TABLE IF NOT EXISTS Users (Account varchar(50) PRIMARY KEY,Nickname nvarchar(255),Gender tinyint,Remark nvarchar(255),BlackList Boolean,HeadImageUrl varchar(255),HeadImagePath varchar(255),Email varchar(255),Friend Boolean)",
    initUserSettingDB: "CREATE TABLE IF NOT EXISTS UsersSetting (Account varchar(50) PRIMARY KEY,BlackList Boolean,ScanZoom Boolean,ReScanZoom Boolean,SpecialFriend Boolean)",
    initUserIndexDB: "CREATE INDEX index_id ON Users(Account)"
};
//添加用户
SQLiteSql.addUser = "insert or replace into Users(Account,Nickname,Gender,Remark,BlackList,HeadImageUrl,HeadImagePath,Email,Friend) values({Account},{Nickname},{Gender},{Remark},{BlackList},{HeadImageUrl},{HeadImagePath},{Email},{Friend})";
//删除用户
SQLiteSql.removeUser = "update Users set Friend = 0 where Account = {Account}";
//改变用户黑名单测试
SQLiteSql.changeUserBlackList = "update Users set BlackList = {BlackList} where Account = {Account}";
//获取指定用户
SQLiteSql.getUser = "select * from Users where Account = {Account}";
//获取所有好友
SQLiteSql.getAllUser = "select * from Users where Friend = 1";
//修改备注
SQLiteSql.changeRemark = "update Users set Remark = {Remark} where Account = {Account}";
//获取黑名单
SQLiteSql.getBlackList = "select * from Users where BlackList = 1";
//获取通讯录
SQLiteSql.getContactList = "select * from Users where Friend = 1 and BlackList= 0 ";
//批量获取用户
SQLiteSql.getUsers = "select * from Users where Account in ({Accounts})";
SQLiteSql.updateUserFriend = "update Users set Friend = {Friend} where Account = {Account}";
//黑名单设置
SQLiteSql.modifyBlackList = "update UsersSetting set BlackList = {Value} where Account = {Account}";
//查看朋友圈设置
SQLiteSql.modifyScanZoom = "update UsersSetting set ScanZoom = {Value} where Account = {Account}";
//被查看朋友圈设置
SQLiteSql.modifyReScanZoom = "update UsersSetting set ReScanZoom = {Value} where Account = {Account}";
//特别朋友设置
SQLiteSql.modifySpecialFriend = "update UsersSetting set SpecialFriend = {Value} where Account = {Account}";
//获取用户设置
SQLiteSql.getUserSetting = "select * from UsersSetting where Account = {Account}";
SQLiteSql.addUserSetting = "insert or replace into UsersSetting(Account,BlackList,ScanZoom,ReScanZoom,SpecialFriend) values({Account},{BlackList},{ScanZoom},{ReScanZoom},{SpecialFriend})";
//# sourceMappingURL=SQLiteSql.js.map