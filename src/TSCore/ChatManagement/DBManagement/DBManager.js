import SQLiteFactory from "../../Tools/SQLite/SQLiteFactory";
import SQLiteHelper from "../../Tools/SQLite/SQLiteHelper";
import ResourceType from "../../IM/Enums/ResourceType";
import SQLiteSql from "./ExecuteCommand/SQLiteSql";
import ChatManagerMessageDto from "../Dtos/ChatManagerMessageDto";
import ConverseDto from "../Dtos/ConverseDto";
import MessageType from "../Enums/MessageType";
import MessageSource from "../Enums/MessageSource";
import ChatRecordDBDto from './ExecuteCommand/Dtos/ChatRecordDBDto';
import ChatMessageDBFormatDto from "./ExecuteCommand/Dtos/ChatMessageDBFormatDto";
import ChatRecordSettingDto from "./ExecuteCommand/Dtos/ChatRecordSettingDto";
const messageNumber = 11;
export default class DBManager {
    constructor() {
        this.sql = SQLiteFactory.GetSQLite(DBManager.dbKey);
        if (this.sql)
            this.initDatabase();
    }
    initDatabase() {
        this.sql.ExecuteSQL(SQLiteSql.initChatRecode);
        this.sql.ExecuteSQL(SQLiteSql.initOffLine);
        this.sql.ExecuteSQL(SQLiteSql.initChatRecordSetting);
    }
    //todo：因异步创建 造成重复插入
    //添加消息
    addMessage(chatId, group, message, inConversation, callback) {
        if (this.sql == null)
            return;
        let chatRecordDto = new ChatRecordDBDto();
        chatRecordDto.ChatId = chatId;
        let checkChatExist = SQLiteHelper.sqlStringFormat(SQLiteSql.findConverse, chatRecordDto);
        let way = group ? 'group' : 'private';
        let tableName = this.buildTabName(chatId, group);
        let content = this.getLastMessage(message);
        let messageString = JSON.stringify(message.message);
        let dto = new ChatMessageDBFormatDto();
        dto.tableName = tableName;
        let createTableSql = SQLiteHelper.sqlStringFormat(SQLiteSql.createTable, dto);
        let sqlArray = [];
        sqlArray.push(checkChatExist);
        sqlArray.push(createTableSql);
        let updateConverseDto = new ChatRecordDBDto();
        updateConverseDto.LastMessage = content;
        updateConverseDto.Time = new Date().getTime();
        updateConverseDto.ChatId = chatId;
        updateConverseDto.LastSender = message.sender;
        let updateConverseSql = SQLiteHelper.sqlStringFormat(inConversation ? SQLiteSql.updateConverseInConversation : SQLiteSql.updateConverse, updateConverseDto);
        sqlArray.push(updateConverseSql);
        let insertConverseDto = new ChatRecordDBDto();
        insertConverseDto.LastMessage = content;
        insertConverseDto.Time = new Date().getTime();
        insertConverseDto.ChatId = chatId;
        insertConverseDto.LastSender = message.sender;
        insertConverseDto.Type = way;
        insertConverseDto.unReadMessageCount = inConversation ? 0 : 1;
        let insertConverseSql = SQLiteHelper.sqlStringFormat(SQLiteSql.insertConverse, insertConverseDto);
        sqlArray.push(insertConverseSql);
        let chatMessageDBFormatDto = new ChatMessageDBFormatDto();
        chatMessageDBFormatDto.tableName = tableName;
        chatMessageDBFormatDto.messageId = message.messageId;
        chatMessageDBFormatDto.sender = message.sender;
        chatMessageDBFormatDto.messageType = message.messageType;
        chatMessageDBFormatDto.messageSource = message.messageSource;
        chatMessageDBFormatDto.message = messageString;
        chatMessageDBFormatDto.messageTime = new Date().getTime();
        chatMessageDBFormatDto.status = message.status;
        let insertSql = SQLiteHelper.sqlStringFormat(SQLiteSql.addMessage, chatMessageDBFormatDto);
        sqlArray.push(insertSql);
        this.sql.ExecuteSQLSync(sqlArray);
        // this.sql.ExecuteSQL(checkChatExist, (data) => {
        //     if (data.length) {
        //         this.updateConverse(content, message.messageTime, chatId, message.sender,inConversation);
        //         this.insertMessageToRecode(tableName, message.messageId, message.sender, message.messageType, message.messageSource, messageString, message.messageTime, message.status,callback);
        //     } else {
        //         this.sql.ExecuteSQL(createTableSql, (data) => {
        //             this.insertConverse(chatId, way, content, message.messageTime, message.sender,inConversation);
        //             this.insertMessageToRecode(tableName, message.messageId, message.sender, message.messageType, message.messageSource, messageString, message.messageTime, message.status,callback);
        //         });
        //     }
        // });
    }
    //修改消息状态
    updateMessageStatus(chatId, group, messageId, status) {
        if (this.sql == null)
            return;
        let tabName = this.buildTabName(chatId, group);
        let dto = new ChatMessageDBFormatDto();
        dto.tableName = tabName;
        dto.messageId = messageId;
        dto.status = status;
        let updateSql = SQLiteHelper.sqlStringFormat(SQLiteSql.updateMessageStatus, dto);
        this.sql.ExecuteSQL(updateSql);
    }
    updateChatRecord(chatId, lastSender, lastTime, message) {
        if (this.sql == null)
            return;
        let dto = new ChatRecordDBDto();
        dto.Time = lastTime;
        dto.ChatId = chatId;
        dto.LastMessage = message;
        dto.LastSender = lastSender;
        let updateSql = SQLiteHelper.sqlStringFormat(SQLiteSql.updateChatRecordByDeleteMessage, dto);
        this.sql.ExecuteSQL(updateSql);
    }
    //获取聊天内容, 返回消息内容MessageDto[](maxId=0,返回最近消息)
    getMessages(chatId, group, maxId, callback) {
        if (this.sql == null)
            return;
        let tabName = this.buildTabName(chatId, group);
        let querySql;
        let dto = new ChatMessageDBFormatDto();
        dto.tableName = tabName;
        if (maxId == 0) {
            dto.limit = messageNumber;
            querySql = SQLiteHelper.sqlStringFormat(SQLiteSql.getRecentMessages, dto);
        }
        else {
            dto.Id = maxId;
            dto.limit = messageNumber;
            querySql = SQLiteHelper.sqlStringFormat(SQLiteSql.getMessages, dto);
        }
        this.sql.ExecuteSQLWithT(querySql, (data) => {
            if (data == null || data.length == 0) {
                callback([]);
            }
            else {
                let backMessages = [];
                for (let item in data) {
                    backMessages.push(this.sqliteMessageToMessageDto(data[item]));
                }
                callback && callback(backMessages);
            }
        }, ChatMessageDBFormatDto);
    }
    removeMessage(chatId, group, messageId) {
        if (this.sql == null)
            return;
        let tabName = this.buildTabName(chatId, group);
        let dto = new ChatMessageDBFormatDto();
        dto.tableName = tabName;
        dto.messageId = messageId;
        let deleteSql = SQLiteHelper.sqlStringFormat(SQLiteSql.removeMessage, dto);
        this.sql.ExecuteSQL(deleteSql);
    }
    //获取会话列表,返回ConverseDto[]
    getConverseList(callback) {
        if (this.sql == null)
            return;
        this.sql.ExecuteSQLWithT(SQLiteSql.getConverseList, (data) => {
            if (data == null || data.length == 0) {
                callback([]);
            }
            else {
                let backConverses = [];
                for (let item in data) {
                    backConverses.push(this.sqliteConverseToConverseDto(data[item]));
                }
                callback && callback(backConverses);
            }
        }, ChatRecordDBDto);
    }
    //删除整个聊天会话(先删除聊天记录, 再从会话表中删除)
    removeConverse(chatId, group) {
        if (this.sql == null)
            return;
        let tabName = this.buildTabName(chatId, group);
        let chatDto = new ChatMessageDBFormatDto();
        chatDto.tableName = tabName;
        let clearSql = SQLiteHelper.sqlStringFormat(SQLiteSql.clearTable, chatDto);
        let recordDto = new ChatRecordDBDto();
        recordDto.ChatId = chatId;
        let deleteSql = SQLiteHelper.sqlStringFormat(SQLiteSql.removeConverse, recordDto);
        this.sql.ExecuteSQL(clearSql);
        this.sql.ExecuteSQL(deleteSql);
    }
    //删除会话里所有消息
    removeAllMessage(chatId, group) {
        if (this.sql == null)
            return;
        let tabName = this.buildTabName(chatId, group);
        let chatDto = new ChatMessageDBFormatDto();
        chatDto.tableName = tabName;
        let clearSql = SQLiteHelper.sqlStringFormat(SQLiteSql.clearTable, chatDto);
        this.sql.ExecuteSQL(clearSql);
    }
    //修改未读数
    updateUnRead(chatId, group, number) {
        if (this.sql == null)
            return;
        let dto = new ChatRecordDBDto();
        dto.ChatId = chatId;
        dto.unReadMessageCount = number;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.updateUnRead, dto);
        this.sql.ExecuteSQL(sql);
    }
    markMessageRead(chatId) {
        if (this.sql == null)
            return;
        let dto = new ChatRecordDBDto();
        dto.ChatId = chatId;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.markMessageRead, dto);
        this.sql.ExecuteSQL(sql);
    }
    //修改消息资源路径 //todo:需不需要和修改消息信息结合
    updateMessageLocal(chatId, group, messageId, path) {
        if (this.sql == null)
            return;
        let tabName = this.buildTabName(chatId, group);
        let dto = new ChatMessageDBFormatDto();
        dto.tableName = tabName;
        dto.messageId = messageId;
        let getSql = SQLiteHelper.sqlStringFormat(SQLiteSql.getMessageByMessageId, dto);
        this.sql.ExecuteSQLWithT(getSql, (data) => {
            if (data.length) {
                let messageBody = JSON.parse(data[0].message);
                messageBody.LocalSource = path;
                let bodystring = JSON.stringify(messageBody);
                let newDto = new ChatMessageDBFormatDto();
                newDto.tableName = tabName;
                newDto.messageId = messageId;
                newDto.message = bodystring;
                let updateSql = SQLiteHelper.sqlStringFormat(SQLiteSql.updateMessage, newDto);
                this.sql.ExecuteSQL(updateSql);
            }
        }, ChatManagerMessageDto);
    }
    //修改消息资源远程路径 //todo:需不需要和修改消息信息结合
    updateMessageUrl(chatId, group, messageId, url) {
        if (this.sql == null)
            return;
        let tabName = this.buildTabName(chatId, group);
        let dto = new ChatMessageDBFormatDto();
        dto.tableName = tabName;
        dto.messageId = messageId;
        let getSql = SQLiteHelper.sqlStringFormat(SQLiteSql.getMessageByMessageId, dto);
        this.sql.ExecuteSQLWithT(getSql, (data) => {
            if (data.length) {
                let messageBody = JSON.parse(data[0].message);
                messageBody.RemoteSource = url;
                let bodystring = JSON.stringify(messageBody);
                let newDto = new ChatMessageDBFormatDto();
                newDto.tableName = tabName;
                newDto.messageId = messageId;
                newDto.message = bodystring;
                let updateSql = SQLiteHelper.sqlStringFormat(SQLiteSql.updateMessage, newDto);
                this.sql.ExecuteSQL(updateSql);
            }
        }, ChatManagerMessageDto);
    }
    //删除整个数据
    clear(callback) {
        if (this.sql == null)
            return;
        this.sql.ExecuteSQL(SQLiteSql.findAllTable, (data) => {
            for (let current of data) {
                let clearSql = SQLiteHelper.sqlFormat(SQLiteSql.clearTable, data[current]);
                this.sql.ExecuteSQL(clearSql, (data) => {
                    callback && callback('数据清除成功');
                });
            }
        });
    }
    //添加会话设置
    addChatSetting(chatId, group) {
        if (this.sql == null)
            return;
        let dto = new ChatRecordSettingDto();
        dto.NoDisturb = false;
        dto.StickToTheTop = false;
        dto.ChatId = chatId;
        dto.group = group;
        let executeSql = SQLiteHelper.sqlStringFormat(SQLiteSql.addChatSetting, dto);
        this.sql.ExecuteSQL(executeSql);
    }
    //修改置顶消息
    setStickToTheTop(chatId, group, value) {
        if (this.sql == null)
            return;
        let dto = new ChatRecordSettingDto();
        dto.StickToTheTop = value;
        dto.ChatId = chatId;
        dto.group = group;
        dto.BackgroundImagePath = '';
        let executeSql = SQLiteHelper.sqlStringFormat(SQLiteSql.updateChatStickTopSetting, dto);
        let conditionSql = SQLiteHelper.sqlStringFormat(SQLiteSql.getChatSetting, dto);
        let addSql = SQLiteHelper.sqlStringFormat(SQLiteSql.addChatSetting, dto);
        this.sql.ExecuteSQLCondition(conditionSql, [executeSql], [addSql]);
    }
    setChatBackGroundImage(chatId, group, path) {
        if (this.sql == null)
            return;
        let dto = new ChatRecordSettingDto();
        dto.ChatId = chatId;
        dto.group = group;
        dto.BackgroundImagePath = path;
        let executeSql = SQLiteHelper.sqlStringFormat(SQLiteSql.updateChatBackgroundImage, dto);
        let conditionSql = SQLiteHelper.sqlStringFormat(SQLiteSql.getChatSetting, dto);
        let addSql = SQLiteHelper.sqlStringFormat(SQLiteSql.addChatSetting, dto);
        this.sql.ExecuteSQLCondition(conditionSql, [executeSql], [addSql]);
    }
    //修改免打扰消息
    setNoDisturb(chatId, group, value) {
        if (this.sql == null)
            return;
        let dto = new ChatRecordSettingDto();
        dto.NoDisturb = value;
        dto.StickToTheTop = false;
        dto.ChatId = chatId;
        dto.group = group;
        dto.BackgroundImagePath = '';
        let executeSql = SQLiteHelper.sqlStringFormat(SQLiteSql.updateChatNoDisturbSetting, dto);
        let conditionSql = SQLiteHelper.sqlStringFormat(SQLiteSql.getChatSetting, dto);
        let addSql = SQLiteHelper.sqlStringFormat(SQLiteSql.addChatSetting, dto);
        this.sql.ExecuteSQLCondition(conditionSql, [executeSql], [addSql]);
    }
    getAllChatSetting(callback) {
        if (this.sql == null)
            return;
        this.sql.ExecuteSQLWithT(SQLiteSql.getAllChatSetting, (data) => {
            callback && callback(data);
        }, ChatRecordSettingDto);
    }
    //退出关闭数据库
    logout() {
        this.sql = null;
    }
    updateConverse(content, time, chatId, sender, inConversation) {
        let dto = new ChatRecordDBDto();
        dto.LastMessage = content;
        dto.Time = time;
        dto.ChatId = chatId;
        dto.LastSender = sender;
        let updateSql = SQLiteHelper.sqlStringFormat(inConversation ? SQLiteSql.updateConverseInConversation : SQLiteSql.updateConverse, dto);
        this.sql.ExecuteSQL(updateSql);
    }
    insertConverse(chatId, way, content, time, sender, inConversation) {
        let dto = new ChatRecordDBDto();
        dto.LastMessage = content;
        dto.Time = time;
        dto.ChatId = chatId;
        dto.LastSender = sender;
        dto.Type = way;
        dto.unReadMessageCount = inConversation ? 0 : 1;
        let insertSql = SQLiteHelper.sqlStringFormat(SQLiteSql.insertConverse, dto);
        this.sql.ExecuteSQL(insertSql);
    }
    //tableName,message.messageId,message.sender,message.messageType,message.messageSource,messageString,message.messageTime
    insertMessageToRecode(tableName, messageId, sender, messageType, messageSource, message, messageTime, status, callback) {
        let dto = new ChatMessageDBFormatDto();
        dto.tableName = tableName;
        dto.messageId = messageId;
        dto.sender = sender;
        dto.messageType = messageType;
        dto.messageSource = messageSource;
        dto.message = message;
        dto.messageTime = messageTime;
        dto.status = status;
        let insertSql = SQLiteHelper.sqlStringFormat(SQLiteSql.addMessage, dto);
        this.sql.ExecuteSQL(insertSql, () => {
            callback && callback();
        });
    }
    getLastMessage(message) {
        if (message.messageType == MessageType.TEXT) {
            if (message.messageSource == MessageSource.RECEIVE || message.messageSource == MessageSource.SEND) {
                return message.message;
            }
            else {
                return "[通知]";
            }
        }
        else {
            switch (message.message.Type) {
                case ResourceType.IMAGE:
                    return "[图片]";
                case ResourceType.VIDEO:
                    return "[视频]";
                case ResourceType.AUDIO:
                    return "[音频]";
            }
        }
    }
    sqliteMessageToMessageDto(message) {
        let messageDto = new ChatManagerMessageDto();
        messageDto.messageId = message.messageId;
        messageDto.id = message.Id;
        messageDto.status = message.status;
        messageDto.message = JSON.parse(message.message);
        messageDto.messageType = message.messageType;
        messageDto.messageSource = message.messageSource;
        messageDto.messageTime = message.messageTime;
        messageDto.sender = message.sender;
        return messageDto;
    }
    sqliteConverseToConverseDto(converses) {
        let converseDto = new ConverseDto();
        converseDto.group = converses.Type == 'group' ? true : false;
        converseDto.chatId = converses.ChatId;
        converseDto.lastMessage = converses.LastMessage;
        converseDto.unreadCount = converses.unReadMessageCount;
        converseDto.lastSender = converses.LastSender;
        converseDto.lastTime = converses.Time;
        return converseDto;
    }
    buildTabName(chatId, group) {
        return group ? "Group_" + chatId : "Private_" + chatId;
    }
}
DBManager.dbKey = "IM";
//# sourceMappingURL=DBManager.js.map