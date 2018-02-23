/**
 * Created by apple on 2018/2/11.
 */
/**
 * Created by apple on 2018/2/11.
 */
// import DBConfigDto = Common.DBConfigDto;
// import SQLiteHelper = Tools.SQLite.SQLiteHelper;
import SQLiteSql from "./ExecuteCommand/SQLiteSql";
import SQLiteHelper from "../../../../Tools/SQLite/SQLiteHelper";
import SQLiteFactory from "../../../../Tools/SQLite/SQLiteFactory";
import HeadImageDBDto from "./Dtos/HeadImageDBDto";
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
    //添加头像
    addHeadImage(userId, url) {
        if (this.sql == null)
            return;
        let dto = new HeadImageDBDto();
        dto.HeadImageUrl = url;
        dto.userId = userId;
        let querySql = SQLiteHelper.sqlStringFormat(SQLiteSql.addHeadImage, dto);
        this.sql.ExecuteSQL(querySql);
    }
    getHeadImageById(userId, callback) {
        if (this.sql == null)
            return;
        let dto = new HeadImageDBDto();
        dto.userId = userId;
        let querySql = SQLiteHelper.sqlStringFormat(SQLiteSql.getHeadImage, dto);
        this.sql.ExecuteSQLWithT(querySql, (data) => {
            callback && callback(data);
        }, HeadImageDBDto);
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