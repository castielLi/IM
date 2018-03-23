export default class SQLiteSql {
}
SQLiteSql.initDatabase = {
    initGroupDB: "CREATE TABLE IF NOT EXISTS GroupList (Id varchar(50) PRIMARY KEY,Name nvarchar(255),Note text,HeadImageUrl varchar(255),HeadImagePath varchar(255),Owner varchar(50),Save Boolean,Exited boolean)",
    initGroupSettingDB: "CREATE TABLE IF NOT EXISTS GroupSetting (Id varchar(50) PRIMARY KEY,Nickname Boolean)",
    initGroupIndexDB: "CREATE INDEX index_id ON GroupList(Id)"
};
//添加群
SQLiteSql.addGroup = "insert or replace into GroupList(Id,Name,Note,HeadImageUrl,HeadImagePath,Owner,Save,Exited) values({Id},{Name},{Note},{HeadImageUrl},{HeadImagePath},{Owner},{Save},{Exited})";
//群移除/添加通讯录
SQLiteSql.addOrRemoveContacts = "update GroupList set Save={Save} where Id={Id}";
//移除群成员
SQLiteSql.removeGroupMember = "delete from {tableName} where GropuId in ({members})";
//删除群成员表
SQLiteSql.removeGroupMemberTable = "drop table {tableName}";
//添加群成员
SQLiteSql.addGroupMember = "insert or replace into {tableName} (GropuId) values({member})";
//更改群名称
SQLiteSql.updateGroupName = "update GroupList set Name = {Name} where Id = {Id}";
//更改群公告
SQLiteSql.updateGroupBulletin = "update GroupList set OtherComment = {OtherComment} where Id = {Id}";
//更改置顶
// public static updateGroupStickToTheTop = "update GroupList set StickToTheTop = {StickToTheTop} where Id = {Id}"
//删除群
SQLiteSql.removeGroup = "delete from GroupList where Id = {Id}";
//退出/被提出群
SQLiteSql.setGroupExitSetting = "update GroupList set Exited = {Exited} where Id = {Id}";
//获取指定群
SQLiteSql.getGroup = "select * from GroupList where Id = {Id}";
//获取所有通讯录中的群
SQLiteSql.getAllGroup = "select * from GroupList where Save= 1";
//创建群成员表
SQLiteSql.createGroupMemberTable = "CREATE TABLE IF NOT EXISTS {tableName} (GropuId varchar(50) PRIMARY KEY)";
SQLiteSql.clearGroupMembers = "delete from {tableName}";
//获取群成员
SQLiteSql.getGroupMember = "select * from {tableName}";
//批量获取群信息
SQLiteSql.getGroups = "select * from GroupList where Id in ({groups})";
//修改群昵称设置
SQLiteSql.modifyNicknameSetting = "insert or replace into GroupSetting(Id,Nickname) values({Id},{Nickname})"; //"update GroupSetting set Nickname = {Nickname} where Id = {Id}";
//获取群设置
SQLiteSql.getGroupSetting = "select * from GroupSetting where Id = {Id}";
SQLiteSql.addGroupSetting = "insert or replace into GroupSetting(Id,Nickname) values({Id},{Nickname})";
//# sourceMappingURL=SQLiteSql.js.map