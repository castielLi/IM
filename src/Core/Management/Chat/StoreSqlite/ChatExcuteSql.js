/**
 * Created by apple on 2017/8/10.
 */

export const InitIMTable = {
    "createChatRecodeTable":"CREATE TABLE IF NOT EXISTS ChatRecode (ChatId varchar(255), Type varchar(255), LastMessage varchar(255),Time varchar(255),unReadMessageCount int , LastSender varchar(255))",
}

export const ExcuteIMSql = {
    "QueryChatIsExist":"select * from ChatRecode where ChatId = ?",
    "GetChatList":"select * from ChatRecode",
    "InsertChatRecode":"insert into ChatRecode (ChatId,Type,LastMessage,Time,LastSender,unReadMessageCount) values (?,?,?,?,?,0)",
    "CreateChatTable"
        : "CREATE TABLE IF NOT EXISTS ? (Id INTEGER PRIMARY KEY AUTOINCREMENT,messageId varchar(255), message varchar(500))",
    "InsertMessageToTalk":"insert into ? (messageId,message) values (?,?)",
    "DeleteChatFromChatList":"delete from ChatRecode where ChatId = ?",
    "DeleteChatTableByName":"delete from ?",
    "QueryChatTypeFromChatList":"select Type from ChatRecode where ChatId = ?",
    "DeleteMessageById":"delete from ? where Id = ?",
    "UpdateChatLastContent":"update ChatRecode set LastMessage = ?,Time = ? where ChatId = ? ,LastSender = ?",
    "UpdateChatUnReadMessageaNumber":"update ChatRecode set unReadMessageCount = ? where ChatId = ?",
    "AddChatUnReadMessageaNumber":"update ChatRecode set unReadMessageCount = unReadMessageCount+1 where ChatId = ?",
    "QueryChatRecodeByChatId":"select message from ? order by Id desc LIMIT ?,?",

}


// select * from MSG where messageId in (select messageId from LI order by Id desc LIMIT 20)