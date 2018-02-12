/**
 * Created by apple on 2018/2/11.
 */
/**
 * Created by apple on 2018/2/11.
 */ export default class SQLiteSql {
}
SQLiteSql.initIMSQLite = {
    //将主键设置为messageId来去重
    "CreateForceSuccessDownloadTable": "CREATE TABLE IF NOT EXISTS ForceDownloadSuccess (userId varchar(255) PRIMARY KEY,HeadImageUrl text)"
};
SQLiteSql.addTask = "insert or replace into ForceDownloadSuccess (userId,HeadImageUrl) values ({userId},{HeadImageUrl})";
SQLiteSql.removeTask = "delete from ForceDownloadSuccess where userId={userId}";
SQLiteSql.getAllTask = "select * from ForceDownloadSuccess";
SQLiteSql.clear = {
    "deleteAllForceSuccessDownload": "delete from ForceDownloadSuccess"
};
//# sourceMappingURL=SQLiteSql.js.map