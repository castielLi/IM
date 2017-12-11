/**
 * Created by apple on 2017/8/10.
 */

export const InitIMTable = {
    "createChatRecodeTable":"CREATE TABLE IF NOT EXISTS ChatRecode (ChatId varchar(255), Type varchar(255), LastMessage varchar(255),Time varchar(255),unReadMessageCount int , LastSender varchar(255))",
    "createOfflineChatTable":"CREATE TABLE IF NOT EXISTS OffLineRecode (messageId varchar(255), message varchar(500))"
}

export const ExcuteIMSql = {
    "QueryChatIsExist":"select * from ChatRecode where ChatId = ?",
    "GetChatList":"select * from ChatRecode order by Time desc",
    "InsertChatRecode":"insert into ChatRecode (ChatId,Type,LastMessage,Time,LastSender,unReadMessageCount) values (?,?,?,?,?,0)",
    "CreateChatTable"
        : "CREATE TABLE ? (Id INTEGER PRIMARY KEY AUTOINCREMENT,messageId varchar(255), message varchar(500),status varchar(255))",
    "InsertMessageToTalk":"insert into ? (messageId,message,status) values (?,?,?)",
    "DeleteChatFromChatList":"delete from ChatRecode where ChatId = ?",
    "DeleteChatTableByName":"delete from ?",
    "QueryChatTypeFromChatList":"select Type from ChatRecode where ChatId = ?",
    "DeleteMessageById":"delete from ? where Id = ?",
    "UpdateChatLastContent":"update ChatRecode set LastMessage = ?,Time = ?,LastSender = ? where ChatId = ?",
    "UpdateChatUnReadMessageaNumber":"update ChatRecode set unReadMessageCount = ? where ChatId = ?",
    "AddChatUnReadMessageaNumber":"update ChatRecode set unReadMessageCount = unReadMessageCount+1 where ChatId = ?",
    "QueryChatRecodeByChatId":"select * from ? order by id desc LIMIT ?,?",
    "QueryChatRecodeByChatIdAndMaxId":"select * from ? where Id<? order by id desc limit ?",
    "ClearChatRecode":"Delete from ChatRecode",
    "UpdateMessage":"update ? set message = ?,status = ? where messageId = ?",
    "UpdateMessageStatusByMessageId":"update ? set status = ? where messageId = ?",
    "GetMessageById":"select message from ? where messageId = ?",
    "InsertMessageIntoOfflineTable":"insert into OffLineRecode (messageId,message) values(?,?)",
    "DeleteAllOfflineMessage":"delete from OffLineRecode",
    "GetAllOfflineMessage":"select message from OffLineRecode"

}


// select * from MSG where messageId in (select messageId from LI order by Id desc LIMIT 20)