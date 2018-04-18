export default class SQLiteSql {
}
SQLiteSql.initApplyFriendSQLite = "CREATE TABLE IF NOT EXISTS ApplyFriend (sender varchar(255) PRIMARY KEY ,comment varchar(255),key varchar(255),status int, time bigint)";
SQLiteSql.UnCheckApplyMessageCount = "CREATE TABLE IF NOT EXISTS UnCheckCount (Id INTEGER PRIMARY KEY,Count int)";
SQLiteSql.updateUnCheckApplyMessageCount = "insert or replace into UnCheckCount (Id,Count) values(1,{Count})";
SQLiteSql.getUnCheckApplyMessageCount = "select Count from UnCheckCount";
SQLiteSql.clearUnCheckApplyMessageCount = "update UnCheckCount set Count=0";
SQLiteSql.addNewApply = "insert or replace into ApplyFriend (comment,key,sender,status,time) values({comment},{key},{sender},{status},{time})";
SQLiteSql.getAllApply = "SELECT * FROM ApplyFriend GROUP BY sender";
SQLiteSql.getAllNotOpreatingApply = "SELECT * FROM ApplyFriend where status = 0 ORDER BY time";
SQLiteSql.UpdateApplyStatus = "update ApplyFriend set status = {status} where key = {key}";
SQLiteSql.clear = "delete from ApplyFriend";
//# sourceMappingURL=SQLiteSql.js.map