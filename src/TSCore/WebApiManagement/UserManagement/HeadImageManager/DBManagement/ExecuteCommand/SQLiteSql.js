/**
 * Created by apple on 2018/2/11.
 */
export default class SQLiteSql {
}
SQLiteSql.initIMSQLite = {
    //将主键设置为messageId来去重
    "HeadImageTable": "CREATE TABLE IF NOT EXISTS HeadImageTable (userId varchar(255) PRIMARY KEY,HeadImageUrl text)"
};
SQLiteSql.addHeadImage = "insert or replace into HeadImageTable (userId,HeadImageUrl) values ({userId},{HeadImageUrl})";
SQLiteSql.getHeadImage = "select * from HeadImageTable where userId = {userId}";
SQLiteSql.clear = {
    "deleteAllForceSuccessDownload": "delete from ForceDownloadSuccess"
};
//# sourceMappingURL=SQLiteSql.js.map