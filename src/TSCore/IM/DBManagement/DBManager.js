// import DBConfigDto = Common.DBConfigDto;
// import SQLiteHelper = Tools.SQLite.SQLiteHelper;
import SQLiteSql from "./ExecuteCommand/SQLiteSql";
import MessageStatus from "../Enums/MessageStatus";
import SQLiteHelper from "../../Tools/SQLite/SQLiteHelper";
import SQLiteFactory from "../../Tools/SQLite/SQLiteFactory";
import IMMessageRecordDto from "./Dtos/IMMessageRecordDto";
export default class DBManager {
    constructor() {
        //TODO: 客户端类型
        this.sql = null;
        this.sql = SQLiteFactory.GetSQLite(DBManager.dbKey);
        if (this.sql == null)
            throw new Error("IM.DBManager init error.");
        this.initDatabase();
    }
    //
    initDatabase() {
        for (let key in SQLiteSql.initIMSQLite) {
            let sql = SQLiteSql.initIMSQLite[key];
            this.sql.ExecuteSQL(sql);
        }
    }
    //添加发送消息
    addSendMessage(message) {
        if (this.sql == null)
            return;
        let dto = new IMMessageRecordDto();
        dto.messageId = message.messageId;
        dto.message = message.message;
        dto.status = MessageStatus.UN_SEND;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.addSendMessage, dto);
        this.sql.ExecuteSQL(sql);
    }
    //修改发送消息状态
    updateSendStatus(messageId, status) {
        if (this.sql == null)
            return;
        let dto = new IMMessageRecordDto();
        dto.messageId = messageId;
        dto.status = status;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.updateSendStatus, dto);
        this.sql.ExecuteSQL(sql);
    }
    //添加接收消息
    addReceiveMessage(message) {
        if (this.sql == null)
            return;
        let dto = new IMMessageRecordDto();
        dto.messageId = message.messageId;
        dto.message = message.message;
        dto.status = MessageStatus.RECEIVE;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.addReceiveMessage, dto);
        this.sql.ExecuteSQL(sql);
    }
    //修改接收消息状态
    updateReceiveStatus(messageId, status) {
        if (this.sql == null)
            return;
        let dto = new IMMessageRecordDto();
        dto.messageId = messageId;
        dto.status = status;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.updateReceiveStatus, dto);
        this.sql.ExecuteSQL(sql);
    }
    //获取消息
    getMessage(messageId, callBack) {
        if (this.sql == null)
            return;
        let dto = new IMMessageRecordDto();
        dto.messageId = messageId;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.getMessage, dto);
        this.sql.ExecuteSQLWithT(sql, (data) => {
            callBack(data);
        }, IMMessageRecordDto);
    }
    //获取未发送消息
    getUnSendMessage(callBack) {
        if (this.sql == null)
            return;
        this.sql.ExecuteSQLWithT(SQLiteSql.getUnSendMessage, (data) => {
            callBack && callBack(data);
        }, IMMessageRecordDto);
    }
    //获取接收消息没有推送到上层的消息
    getUnPushMessage(callBack) {
        if (this.sql == null)
            return;
        this.sql.ExecuteSQLWithT(SQLiteSql.getUnPushMessage, (data) => {
            callBack && callBack(data);
        }, IMMessageRecordDto);
    }
    //删除指定的发送消息
    deleteSendMessage(messageId) {
        if (this.sql == null)
            return;
        let dto = new IMMessageRecordDto();
        dto.messageId = messageId;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.deleteSendMessage, dto);
        this.sql.ExecuteSQL(sql);
    }
    //删除指定的收到消息
    deleteReceiveMessage(messageId) {
        if (this.sql == null)
            return;
        let dto = new IMMessageRecordDto();
        dto.messageId = messageId;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.deleteReceiveMessage, dto);
        this.sql.ExecuteSQL(sql);
    }
    //消除所有数据
    clear() {
        if (this.sql == null)
            return;
        for (let key in SQLiteSql.clear) {
            let sql = SQLiteSql.clear[key];
            this.sql.ExecuteSQL(sql);
        }
    }
    //退出关闭数据库
    logout() {
        this.sql = null;
    }
}
DBManager.dbKey = "IM";
//# sourceMappingURL=DBManager.js.map