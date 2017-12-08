/**
 * Created by apple on 2017/8/10.
 */

export const InitIMTable = {
    "createMessageRecodeTable":"CREATE TABLE IF NOT EXISTS MessageRecode (Id INTEGER PRIMARY KEY AUTOINCREMENT,messageId varchar(255), messageBody varchar(500), sendTime varchar(255), status varchar(255))",
    "CreateSendMessageTable":"CREATE TABLE IF NOT EXISTS SendMessageRecode (Id INTEGER PRIMARY KEY AUTOINCREMENT,messageId varchar(255),status varchar(255),times varchar(255))",
    "CreateChatTableIndex":"CREATE INDEX index_id ON MessageRecode(messageId)",
    "CreateApplyFriendTable":"CREATE TABLE IF NOT EXISTS ApplyFriend (Id INTEGER PRIMARY KEY AUTOINCREMENT,send varchar(255), status varchar(255), comment varchar(255), time varchar(255),key varchar(255))",
    "CreateUploadFileResourceRecode":"CREATE TABLE IF NOT EXISTS ResourceRecode (Id INTEGER PRIMARY KEY AUTOINCREMENT, messageId varchar(255),localResource varchar(255))",
}

export const ExcuteIMSql = {
    "UpdateSendMessageStatusByMessageId":"update SendMessageRecode set status=? where messageId = ?",
    "UpdateMessageStatusByMessageId":"update MessageRecode set status = ? where messageId = ?",
    "AddSendMessage":"insert into SendMessageRecode (messageId,status,times) values (?,?,'0')",
    "GetAllSendMessages":"select messageId from SendMessageRecode",
    "GetMessagesInMessageTableByIds":"select * from MessageRecode where messageId in (?) order by Id desc",
    "DeleteAllSendMessages":"delete from SendMessageRecode",
    "DeleteSendMessageByMessageId":"delete from SendMessageRecode where messageId = ?",
    "InsertMessageToRecode":"insert into MessageRecode (messageId,messageBody,sendTime,status) values (?,?,?,?)",
    "InsertUploadFileRecode":"insert into ResourceRecode(messageId,localResource) values (?,?)",
    "DeleteUploadFileRecode":"Delete from ResourceRecode where messageId = ? and localResource = ?",
    "QueryMessageResourceExist":"select * from ResourceRecode where messageId = ? and localResource = ?",
    "AddNewMessageToApplyFriend":"insert or replace into ApplyFriend (send,status,comment,time,key) values(?,?,?,?,?,?)",
    "QueryApplyFriend":"SELECT * FROM (SELECT * FROM ApplyFriend ORDER BY time) GROUP BY send",
    "UpdateApplyFriend":"update ApplyFriend set status = ? where key = ?",
    "UpdateMessageLocalSource":"update MessageRecode set messageBody=? where messageId=?",
    "UpdateMessageByMessageId":"update MessageRecode set messageBody=? where messageId = ?",
    "GetMessageBodyById":"select messageBody from MessageRecode where messageId = ?"
}


// select * from MSG where messageId in (select messageId from LI order by Id desc LIMIT 20)