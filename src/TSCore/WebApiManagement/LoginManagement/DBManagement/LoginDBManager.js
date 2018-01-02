import SQLiteHelper from '../../../Tools/SQLite/SQLiteHelper';
import SQLiteFactory from '../../../Tools/SQLite/SQLiteFactory';
import SQLiteSql from './ExecuteCommand/SQLiteSql';
export default class LoginDBManager {
    constructor() {
        this.sql = SQLiteFactory.SQL(LoginDBManager.dbName);
        if (this.sql == null) {
            throw new Error("LoginDBManager sql is null, config is error");
        }
        for (let item in SQLiteSql.initDatabase) {
            this.sql.ExecuteSQL(SQLiteSql.initDatabase[item]);
        }
    }
    addUser(user) {
        if (this.sql == null)
            return;
        let sql = SQLiteHelper.sqlFormat(SQLiteSql.addUser, [user.Account, user.SessionToken, user.IMToken, user.Gender, user.Nickname, user.Email,
            user.PhoneNumber, user.FamilyName, user.GivenName, user.HeadImageUrl, user.HeadImagePath]);
        this.sql.ExecuteSQL(sql);
    }
    //退出登录, 删除用户信息
    removeUser() {
        if (this.sql == null)
            return;
        this.sql.ExecuteSQL(SQLiteSql.removeUser);
    }
    //获取用户信息
    getUser(callback) {
        if (this.sql == null)
            return;
        this.sql.ExecuteSQL(SQLiteSql.removeUser);
    }
}
LoginDBManager.dbName = "Login.db";
//# sourceMappingURL=LoginDBManager.js.map