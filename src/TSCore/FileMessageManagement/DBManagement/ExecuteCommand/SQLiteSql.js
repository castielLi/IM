/**
 * Created by apple on 2017/12/20.
 */
export default class SQLiteSql {
}
//资源
//group 是关键字故换成isgroup
SQLiteSql.initResourceSQLite = {
    createUploadTable: "CREATE TABLE IF NOT EXISTS uploadTable (Id INTEGER PRIMARY KEY AUTOINCREMENT, chatId varchar(255),[group] Boolean, messageId varchar(255), data text,fileUrl nvarchar(255))",
    createDownloadTable: "CREATE TABLE IF NOT EXISTS downloadTable (Id INTEGER PRIMARY KEY AUTOINCREMENT, chatId varchar(255),[group] Boolean, messageId varchar(255),fileUrl nvarchar(255),type int)"
};
SQLiteSql.addUploadData = "insert or replace into uploadTable(chatId,[group],messageId,data,fileUrl) values ({chatId},{group},{messageId},{data},{fileUrl})";
SQLiteSql.addDownloadData = "insert or replace into downloadTable(chatId,[group],messageId,fileUrl,type) values ({chatId},{group},{messageId},{fileUrl},{type})";
SQLiteSql.deleteUploadData = "Delete from uploadTable where  chatId = {chatId} and  [group] = {group} and messageId = {messageId}";
SQLiteSql.deleteDownloadData = "Delete from downloadTable where  chatId = {chatId} and  [group] = {group} and messageId = {messageId}";
SQLiteSql.getUploadData = "select * from uploadTable";
SQLiteSql.getDownloadData = "select * from downloadTable";
SQLiteSql.clearResource = {
    clearUploadData: "delete from uploadTable",
    clearDownloadData: "delete from downloadTable"
};
//# sourceMappingURL=SQLiteSql.js.map