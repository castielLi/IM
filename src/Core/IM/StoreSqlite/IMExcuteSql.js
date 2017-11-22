/**
 * Created by apple on 2017/8/10.
 */

export const InitIMTable = {
    "createChatRecodeTable":"CREATE TABLE IF NOT EXISTS ChatRecode (Client varchar(255), Type varchar(255), LastMessage varchar(255),Time varchar(255),unReadMessageCount int)",
    "createMessageRecodeTable":"CREATE TABLE IF NOT EXISTS MessageRecode (Id INTEGER PRIMARY KEY AUTOINCREMENT,messageId varchar(255),Command varchar(255),send varchar(255), rec varchar(255) , time varchar(255), content varchar(255), type varchar(255), localPath varchar(255), resourceTime varchar(255), url varchar(255) , status varchar(255))",
    "CreateSendMessageTable":"CREATE TABLE IF NOT EXISTS SendMessageRecode (Id INTEGER PRIMARY KEY AUTOINCREMENT,messageId varchar(255),status varchar(255),times varchar(255))",
    "CreateChatTableIndex":"CREATE INDEX index_id ON MessageRecode(messageId)",
    "CreateApplyFriendTable":"CREATE TABLE IF NOT EXISTS ApplyFriend (Id INTEGER PRIMARY KEY AUTOINCREMENT,send varchar(255), rec varchar(255) , status varchar(255), comment varchar(255), time varchar(255),key varchar(255),Nick varchar(255),avator varchar(255))",
    "CreateUploadFileResourceRecode":"CREATE TABLE IF NOT EXISTS ResourceRecode (Id INTEGER PRIMARY KEY AUTOINCREMENT, messageId varchar(255),localResource varchar(255))",
}

export const ExcuteIMSql = {
    "QueryChatIsExist":"select * from ChatRecode where client = ?",
    "GetChatList":"select * from ChatRecode",
    "InsertChatRecode":"insert into ChatRecode (Client,Type) values (?,?)",
    "CreateChatTable"
        : "CREATE TABLE IF NOT EXISTS ? (Id INTEGER PRIMARY KEY AUTOINCREMENT,messageId varchar(255))",
    "InsertMessageToTalk":"insert into ? (messageId) values (?)",
    "DeleteChatFromChatList":"delete from ChatRecode where client = ?",
    "DeleteChatTableByName":"delete from ?",
    "QueryChatTypeFromChatList":"select Type from ChatRecode where client = ?",
    "DeleteMessageById":"delete from ? where Id = ?",
    "UpdateSendMessageStatusByMessageId":"update SendMessageRecode set status=? where messageId = ?",
    "UpdateMessageStatusByMessageId":"update MessageRecode set status = ? where messageId = ?",
    "AddSendMessage":"insert into SendMessageRecode (messageId,status,times) values (?,?,'0')",
    "GetAllSendMessages":"select messageId from SendMessageRecode",
    "GetMessagesInMessageTableByIds":"select * from MessageRecode where messageId in (?) order by Id desc",
    "DeleteAllSendMessages":"delete from SendMessageRecode",
    "DeleteSendMessageByMessageId":"delete from SendMessageRecode where messageId = ?",
    "UpdateChatLastContent":"update ChatRecode set LastMessage = ?,Time = ? where Client = ?",
    "UpdateChatUnReadMessageaNumber":"update ChatRecode set unReadMessageCount = ? where Client = ?",
    "AddChatUnReadMessageaNumber":"update ChatRecode set unReadMessageCount = unReadMessageCount+1 where Client = ?",
    "InsertMessageToRecode":"insert into MessageRecode (messageId,Command,send,rec,time,content,type,localPath,resourceTime,url,status) values (?,?,?,?,?,?,?,?,?,?,?)",
    "InsertUploadFileRecode":"insert into ResourceRecode(messageId,localResource) values (?,?)",
    "DeleteUploadFileRecode":"Delete from ResourceRecode where messageId = ? and localResource = ?",
    "QueryChatRecodeByClient":"select messageId from ? order by Id desc LIMIT ?,?",
    "QueryMessageResourceExist":"select * from ResourceRecode where messageId = ? and localResource = ?",
    "AddNewMessageToApplyFriend":"insert or replace into ApplyFriend (send,rec,status,comment,time,key,Nick,avator) values(?,?,?,?,?,?,?,?)",
    "QueryApplyFriend":"SELECT * FROM (SELECT * FROM ApplyFriend ORDER BY time) GROUP BY send",
    "UpdateApplyFriend":"update ApplyFriend set status = ? where key = ?",
    "UpdateMessageLocalSource":"update MessageRecode set localPath=? where messageId=?",
    "UpdateMessageRemoteSource":"update MessageRecode set url=? where messageId=?"
}


// select * from MSG where messageId in (select messageId from LI order by Id desc LIMIT 20)