/**
 * Created by apple on 2018/1/18.
 */
export default class FSFactory {
    static InitClienType(type) {
        SQLiteFactory.clientType = type;
    }
    //type : rn/web
    static SQL(dbName) {
        return SQLiteFactory.SQLByPath(SQLiteFactory.dbPath, dbName, false);
    }
    static SQLCommon(dbName) {
        return SQLiteFactory.SQLByPath(SQLiteFactory.dbPath, dbName, true);
    }
    //type : rn/web
    static SQLByPath(path, dbName, common) {
        switch (SQLiteFactory.clientType) {
            case "rn":
                let db = new MobileSQLite(path, dbName, common);
                return db;
            case "web":
                break;
        }
        return null;
    }
}
//# sourceMappingURL=FSFactory.js.map