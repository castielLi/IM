import SQLiteHelper from '../../../../Tools/SQLite/SQLiteHelper';
import SQLiteFactory from '../../../../Tools/SQLite/SQLiteFactory';
import SQLiteSql from './ExecuteCommand/SQLiteSql';
import ApplyFriendCountDBDto from "./Dtos/ApplyFriendCountDBDto";
import ApplyFriendDBDto from "./Dtos/ApplyFriendDBDto";
import UnCheckApplyDto from './Dtos/UnCheckApplyDto';
export default class DBManager {
    constructor() {
        this.sql = SQLiteFactory.GetSQLite(DBManager.dbKey);
        if (this.sql)
            this.initDatabase();
    }
    initDatabase() {
        this.sql.ExecuteSQL(SQLiteSql.initApplyFriendSQLite);
        this.sql.ExecuteSQL(SQLiteSql.UnCheckApplyMessageCount);
    }
    getUncheckApplyMessageCount(callback) {
        this.sql.ExecuteSQLWithT(SQLiteSql.getUnCheckApplyMessageCount, (data) => {
            if (data.length == 0) {
                callback && callback(0);
            }
            else {
                callback && callback(data[0].Count);
            }
        }, ApplyFriendCountDBDto);
    }
    clearUncheckCount() {
        this.sql.ExecuteSQL(SQLiteSql.clearUnCheckApplyMessageCount);
    }
    addNewApply(message) {
        let dto = new ApplyFriendDBDto();
        dto.comment = message.comment;
        dto.key = message.key;
        dto.status = message.status;
        dto.sender = message.sender;
        dto.time = message.time;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.addNewApply, dto);
        this.sql.ExecuteSQL(sql);
        //todo：即使在apply页面也会加 1 未处理
        //更新未处理的消息条数
        this.sql.ExecuteSQLWithT(SQLiteSql.getUnCheckApplyMessageCount, (data) => {
            let unCheckCount;
            if (data.length == 0) {
                let unCheckApplyDto = new UnCheckApplyDto();
                unCheckApplyDto.Count = 1;
                unCheckCount = SQLiteHelper.sqlStringFormat(SQLiteSql.updateUnCheckApplyMessageCount, unCheckApplyDto);
            }
            else {
                let count = data[0].Count;
                let unCheckApplyDto = new UnCheckApplyDto();
                unCheckApplyDto.Count = count + 1;
                unCheckCount = SQLiteHelper.sqlStringFormat(SQLiteSql.updateUnCheckApplyMessageCount, unCheckApplyDto);
            }
            this.sql.ExecuteSQL(unCheckCount);
        }, ApplyFriendCountDBDto);
    }
    getAllApply(callback = null) {
        this.sql.ExecuteSQLWithT(SQLiteSql.getAllApply, (data) => {
            callback && callback(data);
        }, ApplyFriendDBDto);
    }
    getAllNotOpreatingApply(callback = null) {
        this.sql.ExecuteSQLWithT(SQLiteSql.getAllNotOpreatingApply, (data) => {
            callback && callback(data);
        }, ApplyFriendDBDto);
    }
    UpdateApplyStatus(status, key) {
        let dto = new ApplyFriendDBDto();
        dto.status = status;
        dto.key = key;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.UpdateApplyStatus, dto);
        this.sql.ExecuteSQL(sql);
    }
    clear() {
        this.sql.ExecuteSQL(SQLiteSql.clear);
    }
    //退出关闭数据库
    logout() {
        this.sql = null;
    }
}
DBManager.dbKey = "IM";
//# sourceMappingURL=DBManager.js.map