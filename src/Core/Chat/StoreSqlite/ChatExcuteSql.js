/**
 * Created by apple on 2017/8/10.
 */

export const InitIMTable = {
    "createChatRecodeTable":"CREATE TABLE IF NOT EXISTS ChatRecode (Client varchar(255), Type varchar(255), LastMessage varchar(255),Time varchar(255),unReadMessageCount int)",
}

export const ExcuteIMSql = {
    "QueryChatIsExist":"select * from ChatRecode where client = ?",
    "GetChatList":"select * from ChatRecode",
    "InsertChatRecode":"insert into ChatRecode (Client,Type,unReadMessageCount) values (?,?,0)",
    "CreateChatTable"
        : "CREATE TABLE IF NOT EXISTS ? (Id INTEGER PRIMARY KEY AUTOINCREMENT,messageId varchar(255))",
    "InsertMessageToTalk":"insert into ? (messageId) values (?)",
    "DeleteChatFromChatList":"delete from ChatRecode where client = ?",
    "DeleteChatTableByName":"delete from ?",
    "QueryChatTypeFromChatList":"select Type from ChatRecode where client = ?",
    "DeleteMessageById":"delete from ? where Id = ?",
    "UpdateChatLastContent":"update ChatRecode set LastMessage = ?,Time = ? where Client = ?",
    "UpdateChatUnReadMessageaNumber":"update ChatRecode set unReadMessageCount = ? where Client = ?",
    "AddChatUnReadMessageaNumber":"update ChatRecode set unReadMessageCount = unReadMessageCount+1 where Client = ?",
    "QueryChatRecodeByClient":"select messageId from ? order by Id desc LIMIT ?,?",

}


// select * from MSG where messageId in (select messageId from LI order by Id desc LIMIT 20)