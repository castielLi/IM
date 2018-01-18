import SQLiteFactory from "./TSCore/Tools/SQLite/SQLiteFactory";
export default class Config {
    static Init() {
        if (Config.DBType == "sqlite") {
            SQLiteFactory.InitClienType(Config.ClientType);
        }
    }
    static SetLoginSuccess(account) {
        if (Config.DBType == "sqlite") {
            SQLiteFactory.InitClienType(Config.ClientType);
            SQLiteFactory.InitDBPath(account);
        }
    }
}
Config.Version = "1.0.1";
//是否使用DB
Config.IsDB = true;
//客户端类型
Config.ClientType = "rn";
//DB类型
Config.DBType = "sqlite";
//# sourceMappingURL=Config.js.map