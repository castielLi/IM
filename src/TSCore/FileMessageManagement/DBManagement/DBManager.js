import SQLiteFactory from "../../Tools/SQLite/SQLiteFactory";
import SQLiteHelper from "../../Tools/SQLite/SQLiteHelper";
import SQLiteSql from "./ExecuteCommand/SQLiteSql";
import DownloadRecordDto from "../Dtos/DownloadRecordDto";
import UploadRecordDto from "../Dtos/UploadRecordDto";
import RemoveRecordDto from '../Dtos/RemoveRecordDto';
export default class DBManager {
    constructor() {
        //TODO: 客户端类型
        this.sql = null;
        this.sql = SQLiteFactory.GetSQLite(DBManager.dbKey);
        if (this.sql)
            this.initDatabase();
    }
    //初始化数据库表
    initDatabase() {
        for (let key in SQLiteSql.initResourceSQLite) {
            let sql = SQLiteSql.initResourceSQLite[key];
            this.sql.ExecuteSQL(sql);
        }
    }
    //添加资源文件
    addUploadData(data) {
        if (this.sql == null)
            return;
        // insert or replace into uploadTable(chatId,isGroup,messageId,fileUrl) values (?,?,?,?)
        let querySql = SQLiteHelper.sqlStringFormat(SQLiteSql.addUploadData, data);
        this.sql.ExecuteSQL(querySql);
    }
    addDownloadData(data) {
        if (this.sql == null)
            return;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.addDownloadData, data);
        this.sql.ExecuteSQL(sql);
    }
    //加载所有上传数据
    loadUploadData(hander) {
        if (this.sql == null)
            return;
        // let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.getUploadData, []);
        this.sql.ExecuteSQLWithT(SQLiteSql.getUploadData, (data) => {
            if (data.length > 0) {
                let rebuildData = [];
                for (let i = 0; i < data.length; i++) {
                    // let dto = this.rebuildFileDtoFromSql(data[i])
                    rebuildData.push(data[i]);
                }
                hander(rebuildData);
            }
            else {
                hander([]);
            }
        }, UploadRecordDto);
    }
    //加载所有下载数据
    loadDownloadData(hander) {
        if (this.sql == null)
            return;
        // let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.getDownloadData, []);
        this.sql.ExecuteSQLWithT(SQLiteSql.getDownloadData, (data) => {
            if (data.length > 0) {
                let rebuildData = [];
                for (let i = 0; i < data.length; i++) {
                    // let dto = this.rebuildFileDtoFromSql(data[i])
                    rebuildData.push(data[i]);
                }
                hander(rebuildData);
            }
            else {
                hander([]);
            }
        }, DownloadRecordDto);
    }
    //上传成功后删除任务
    removeUploadData(chatId, group, messageId) {
        if (this.sql == null)
            return;
        let RemoveDto = new RemoveRecordDto();
        RemoveDto.chatId = chatId;
        RemoveDto.group = group;
        RemoveDto.messageId = messageId;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.deleteUploadData, RemoveDto);
        this.sql.ExecuteSQL(sql);
    }
    //下载成功后删除任务
    removeDownloadData(chatId, group, messageId) {
        if (this.sql == null)
            return;
        let RemoveDto = new RemoveRecordDto();
        RemoveDto.chatId = chatId;
        RemoveDto.group = group;
        RemoveDto.messageId = messageId;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.deleteDownloadData, RemoveDto);
        this.sql.ExecuteSQL(sql);
    }
    //消除所有数据
    clear() {
        if (this.sql == null)
            return;
        for (let key in SQLiteSql.clearResource) {
            let sql = SQLiteSql.clearResource[key];
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