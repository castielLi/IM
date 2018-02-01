import MobileSQLite from "./MobileSQLite";
export default class SQLiteFactory {
    /*
     * 创建SQLite
     * @dbKey: 数据库存储Key, 用于获取数据对象
     * @clientType: 客户端数据
     * @path: 数据库路径
     * @dbName: 数据库名字
     */
    static CreateSQLite(dbKey, clientType, path, dbName, callback) {
        if (SQLiteFactory.sqliteList[dbKey] == undefined) {
            let sqlite = SQLiteFactory.SQLByPath(clientType, path, dbName);
            SQLiteFactory.sqliteList[dbKey] = sqlite;
        }
        callback && callback();
        // return SQLiteFactory.sqliteList[dbKey];
    }
    /*
     * 销毁数据库
     * @dbKey: 数据库存储Key
     */
    static DestroySQLite(dbKey) {
        delete SQLiteFactory.sqliteList[dbKey];
    }
    /*
     * 获取数据库
     * @dbKey: 数据库存储Key
     */
    static GetSQLite(dbKey) {
        return SQLiteFactory.sqliteList[dbKey];
    }
    //type : rn/web
    static SQLByPath(clientType, path, dbName) {
        switch (clientType) {
            case "rn":
                let db = new MobileSQLite(path, dbName);
                return db;
            case "web":
                break;
        }
        return null;
    }
}
SQLiteFactory.sqliteList = {};
//# sourceMappingURL=SQLiteFactory.js.map