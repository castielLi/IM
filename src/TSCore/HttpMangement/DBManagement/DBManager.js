import SQLiteFactory from "../../Tools/SQLite/SQLiteFactory";
import SQLiteHelper from "../../Tools/SQLite/SQLiteHelper";
import SQLiteSql from "./SQLiteSql";
import HttpRequestDBDto from "./Dtos/HttpRequestDBDto";
export default class DBManager {
    constructor() {
        this.sql = null;
        this.sql = SQLiteFactory.GetSQLite(DBManager.dbKey);
        if (this.sql)
            this.initDatabase();
    }
    initDatabase() {
        this.sql.ExecuteSQL(SQLiteSql.initRequestDB);
    }
    addRequest(request) {
        if (this.sql == null)
            return;
        let requestString = JSON.stringify(request);
        let dto = new HttpRequestDBDto();
        dto.request = requestString;
        dto.requestId = request.requestId;
        dto.requestTime = request.requestTime;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.addRequest, dto);
        this.sql.ExecuteSQL(sql);
    }
    updateRequest(request) {
        if (this.sql == null)
            return;
        let requestString = JSON.stringify(request);
        let dto = new HttpRequestDBDto();
        dto.request = requestString;
        dto.requestId = request.requestId;
        dto.requestTime = request.requestTime;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.replaceRequest, dto);
        this.sql.ExecuteSQL(sql);
    }
    deleteRequest(requestId) {
        if (this.sql == null)
            return;
        let dto = new HttpRequestDBDto();
        dto.requestId = requestId;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.deleteRequest, dto);
        this.sql.ExecuteSQL(sql);
    }
    getAllRequest(callback) {
        if (this.sql == null)
            return;
        this.sql.ExecuteSQLWithT(SQLiteSql.getAllRequest, (data) => {
            callback && callback(data);
        }, HttpRequestDBDto);
    }
    //退出关闭数据库
    logout() {
        this.sql = null;
    }
}
DBManager.dbKey = "IM";
//# sourceMappingURL=DBManager.js.map