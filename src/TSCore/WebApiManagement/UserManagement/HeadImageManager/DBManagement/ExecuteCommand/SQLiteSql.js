/**
 * Created by apple on 2018/2/11.
 */
export default class SQLiteSql {
}
SQLiteSql.initIMSQLite = {
    //将主键设置为messageId来去重
    "HeadImageTable": "CREATE TABLE IF NOT EXISTS HeadImageTable (userId varchar(255) PRIMARY KEY,HeadImageUrl text)",
    "UploadHeadImageTable": "CREATE TABLE IF NOT EXISTS UploadHeadImageTable (userId varchar(255) PRIMARY KEY,localPath varchar(255))"
};
SQLiteSql.addHeadImage = "insert or replace into HeadImageTable (userId,HeadImageUrl) values ({userId},{HeadImageUrl})";
SQLiteSql.getHeadImage = "select * from HeadImageTable where userId = {userId}";
SQLiteSql.clear = {
    "deleteAllForceSuccessDownload": "delete from ForceDownloadSuccess"
};
SQLiteSql.addUploadRecord = "insert or replace into UploadHeadImageTable (userId,localPath) values ({userId},{localPath})";
SQLiteSql.removeUploadRecord = "delete from UploadHeadImageTable where userId = {userId}";
SQLiteSql.getUploadRecord = "select * from UploadHeadImageTable where userId = {userId}";
//# sourceMappingURL=SQLiteSql.js.map