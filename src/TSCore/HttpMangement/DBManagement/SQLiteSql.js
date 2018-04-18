/**
 * Created by apple on 2017/12/20.
 */
export default class SQLiteSql {
}
SQLiteSql.initRequestDB = "CREATE TABLE IF NOT EXISTS RequestRecord (requestId varchar(255),request varchar(500),requestTime bigint)";
SQLiteSql.addRequest = "insert into RequestRecord (requestId,request,requestTime) values ({requestId},{request},{requestTime})";
SQLiteSql.deleteRequest = "delete from RequestRecord where requestId = {requestId}";
SQLiteSql.getAllRequest = "select request from RequestRecord";
SQLiteSql.replaceRequest = "update RequestRecord set request = {request},requestTime={requestTime} where requestId = {requestId} and requestTime<{requestTime}";
//# sourceMappingURL=SQLiteSql.js.map