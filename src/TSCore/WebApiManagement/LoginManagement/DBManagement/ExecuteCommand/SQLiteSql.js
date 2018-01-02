/**
 * Created by apple on 2018/1/2.
 */
export default class SQLiteSql {
}
SQLiteSql.initDatabase = {
    initLoginDB: "CREATE TABLE IF NOT EXISTS Login (Account varchar(50) PRIMARY KEY,SessionToken nvarchar(255), IMToken nvarchar(255), Gender int" +
        ",Nickname varchar(255),Email nvarchar(60)," +
        "PhoneNumber varchar(50),FamilyName varchar(50),GivenName varchar(255),HeadImageUrl:nvarchar(255),HeadImagePath:nvarchar(255))",
};
SQLiteSql.addUser = "insert or replace into Login (Account,SessionToken,IMToken,Gender,Nickname,Email,PhoneNumber,FamilyName,GivenName,HeadImageUrl" +
    "HeadImagePath) values (?,?,?,?,?,?,?,?,?,?,?)";
SQLiteSql.removeUser = "delete * from Login";
SQLiteSql.getUser = "select * from Login";
//# sourceMappingURL=SQLiteSql.js.map