/**
 * Created by apple on 2017/12/20.
 */
export default class SQLiteSql {
}
SQLiteSql.initIMSQLite = {
    //将主键设置为messageId来去重
    "CreateSendMessageTable": "CREATE TABLE IF NOT EXISTS SendMessageRecode (messageId varchar(255) PRIMARY KEY,message text,status varchar(255))",
    "CreateReceiveMessageTable": "CREATE TABLE IF NOT EXISTS ReceiveMessageRecode (messageId varchar(255) PRIMARY KEY,message varchar(500),status varchar(255))",
};
SQLiteSql.getMessage = "select * from SendMessageRecode where messageId = {messageId}";
SQLiteSql.addSendMessage = "insert or replace into SendMessageRecode (messageId,message,status) values ({messageId},{message},{status})";
SQLiteSql.updateSendStatus = "update SendMessageRecode set status = {status} where messageId = {messageId}";
SQLiteSql.addReceiveMessage = "insert or replace into ReceiveMessageRecode (messageId,message,status) values ({messageId},{message},{status})";
SQLiteSql.updateReceiveStatus = "update ReceiveMessageRecode set status = {status} where messageId = {messageId}";
SQLiteSql.getUnSendMessage = "select * from SendMessageRecode where status = 0";
SQLiteSql.getUnPushMessage = "select * from ReceiveMessageRecode where status = 3";
SQLiteSql.deleteSendMessage = "delete from SendMessageRecode where messageId = {messageId}";
SQLiteSql.deleteReceiveMessage = "delete from ReceiveMessageRecode where messageId = {messageId}";
SQLiteSql.clear = {
    "deleteAllSendMessage": "delete from SendMessageRecode",
    "deleteAllReceiveMessage": "delete from ReceiveMessageRecode",
};
//# sourceMappingURL=SQLiteSql.js.map