/**
* Created by apple on 2017/12/20.
*/
export default class SQLiteSql {
}
SQLiteSql.initChatRecode = "CREATE TABLE IF NOT EXISTS ChatRecode (ChatId varchar(255), Type varchar(255), LastMessage varchar(255),Time varchar(255),unReadMessageCount int , LastSender varchar(255))";
SQLiteSql.initOffLine = "CREATE TABLE IF NOT EXISTS OffLineRecode (messageId varchar(255), message varchar(500))";
SQLiteSql.initChatRecordSetting = "CREATE TABLE IF NOT EXISTS ChatRecordSetting (ChatId varchar(255) PRIMARY KEY, [group] boolean,StickToTheTop boolean,NoDisturb boolean,BackgroundImagePath text)";
//获取所有的会话设置
SQLiteSql.getAllChatSetting = "select * from ChatRecordSetting";
//查看是否存在会话设置
SQLiteSql.getChatSetting = "select * from ChatRecordSetting where ChatId = {ChatId}";
//添加会话设置
SQLiteSql.addChatSetting = "insert into ChatRecordSetting (ChatId,[group],StickToTheTop,NoDisturb,BackgroundImagePath) values({ChatId},{group},{StickToTheTop},{NoDisturb},{BackgroundImagePath})";
//修改会话置顶
SQLiteSql.updateChatStickTopSetting = "update ChatRecordSetting set StickToTheTop = {StickToTheTop} where ChatId={ChatId}";
//修改会话免打扰
SQLiteSql.updateChatNoDisturbSetting = "update ChatRecordSetting set NoDisturb = {NoDisturb} where ChatId={ChatId}";
//修改会话背景图片
SQLiteSql.updateChatBackgroundImage = "update ChatRecordSetting set BackgroundImagePath = {BackgroundImagePath} where ChatId={ChatId}";
//添加消息处理
SQLiteSql.addMessage = "insert into {tableName} (messageId,sender,messageType,messageSource,message,messageTime,status) values ({messageId},{sender},{messageType},{messageSource},{message},{messageTime},{status})";
//创建会话表
SQLiteSql.createTable = "CREATE TABLE IF NOT EXISTS {tableName} (Id INTEGER PRIMARY KEY AUTOINCREMENT,messageId varchar(255),sender varchar(255),messageType int,messageSource int, message text,messageTime bigint,status int)";
//会话是否存在
SQLiteSql.findConverse = "select * from ChatRecode where ChatId = {ChatId}";
//更新会话
SQLiteSql.updateConverse = "update ChatRecode set LastMessage = {LastMessage},Time = {Time},LastSender = {LastSender}, unReadMessageCount = unReadMessageCount + 1 where ChatId = {ChatId}";
//添加新会话
SQLiteSql.updateConverseInConversation = "update ChatRecode set LastMessage = {LastMessage},Time = {Time},LastSender = {LastSender} where ChatId = {ChatId}";
SQLiteSql.insertConverse = "insert into ChatRecode (ChatId,Type,LastMessage,Time,LastSender,unReadMessageCount) values ({ChatId},{Type},{LastMessage},{Time},{LastSender},{unReadMessageCount})";
//更新消息状态
SQLiteSql.updateMessageStatus = "update {tableName} set status = {status} where messageId = {messageId}";
//删除消息更新会话
SQLiteSql.updateChatRecordByDeleteMessage = "update ChatRecode set LastMessage = {LastMessage},Time = {Time},LastSender = {LastSender} where ChatId = {ChatId}";
//获取历史记录
SQLiteSql.getMessages = "select * from {tableName} where Id<{Id} order by id desc limit {limit}";
//获取最近n条历史记录(进入聊天界面使用)
SQLiteSql.getRecentMessages = "select * from {tableName} order by id desc limit {limit}";
//删除指定消息
SQLiteSql.removeMessage = "delete from {tableName} where messageId = {messageId}";
//获取最近会话列表
SQLiteSql.getConverseList = "select * from ChatRecode order by Time desc";
//删除指定会话
SQLiteSql.removeConverse = "delete from ChatRecode where ChatId = {ChatId}";
//删除会话表
SQLiteSql.removeTable = "drop table {tableName}";
//更新未读消息数
SQLiteSql.updateUnRead = "update ChatRecode set unReadMessageCount = {unReadMessageCount} where ChatId = {ChatId}";
SQLiteSql.markMessageRead = "update ChatRecode set unReadMessageCount = case when unReadMessageCount > 0 then unReadMessageCount - 1 else unReadMessageCount = 0 end where ChatId = {ChatId}";
//跟新消息资源路径
SQLiteSql.updateMessage = "update {tableName} set message = {message} where messageId = {messageId}";
//获取指定消息
SQLiteSql.getMessageByMessageId = "select * from {tableName} where messageId = {messageId}";
//todo：其他会话内容表 怎么处理
SQLiteSql.clearChatRecode = "delete from ChatRecode";
SQLiteSql.clearOffLineRecode = "delete from OffLineRecode";
//获取本数据库中所有的表
SQLiteSql.findAllTable = "select name from sqlite_master WHERE NOT name in ('android_metadata','sqlite_sequence')";
//删除表中数据
// public static readonly clearTable = "truncate from ?";
SQLiteSql.clearTable = "delete from {tableName}";
//# sourceMappingURL=SQLiteSql.js.map