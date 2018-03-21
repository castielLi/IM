import SQLiteHelper from '../../../Tools/SQLite/SQLiteHelper';
import SQLiteFactory from '../../../Tools/SQLite/SQLiteFactory';
import SQLiteSql from './ExecuteCommand/SQLiteSql';
import LoginUserInfoDto from '../Dtos/LoginUserInfoDto';
export default class LoginDBManager {
    constructor() {
        this.sql = SQLiteFactory.GetSQLite(LoginDBManager.dbKey);
        if (this.sql == null) {
            throw new Error("LoginDBManager sql is null, config is error");
        }
        else {
            this.sql.ExecuteSQL(SQLiteSql.initLoginDB);
        }
    }
    addUser(user) {
        if (this.sql == null)
            return;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.addUser, user);
        this.sql.ExecuteSQL(sql);
    }
    //退出登录, 删除用户信息
    removeUser(user) {
        if (this.sql == null)
            return;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.removeUser, user);
        this.sql.ExecuteSQL(sql);
    }
    getUser(callback) {
        if (this.sql == null)
            return;
        this.sql.ExecuteSQLWithT(SQLiteSql.getUser, (data) => {
            if (data != null && data.length > 0) {
                callback && callback(data[0]);
            }
            else {
                callback && callback(null);
            }
        }, LoginUserInfoDto);
    }
}
LoginDBManager.dbKey = "login";
//# sourceMappingURL=LoginDBManager.js.map