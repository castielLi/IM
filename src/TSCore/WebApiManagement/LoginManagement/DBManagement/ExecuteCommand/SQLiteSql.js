/**
 * Created by apple on 2018/1/2.
 */
export default class SQLiteSql {
}
SQLiteSql.initLoginDB = "CREATE TABLE IF NOT EXISTS Login (Account varchar(50) PRIMARY KEY,SessionToken nvarchar(255), IMToken nvarchar(255), Gender int" +
    ",Nickname varchar(255),Email nvarchar(60)," +
    "PhoneNumber varchar(50),FamilyName varchar(50),GivenName varchar(255),HeadImageUrl nvarchar(255),HeadImagePath nvarchar(255)," +
    "Logined boolean)";
// public static addUser = "insert or replace into Login (Id,Account,SessionToken,IMToken,Gender,Nickname,Email,PhoneNumber,FamilyName,GivenName,HeadImageUrl" +
//     ",HeadImagePath) values (1,?,?,?,?,?,?,?,?,?,?,?)";
SQLiteSql.addUser = "insert or replace into Login (Account,SessionToken,IMToken,Gender,Nickname,Email,PhoneNumber,FamilyName,GivenName,HeadImageUrl" +
    ",HeadImagePath,Logined) values ({Account},{SessionToken},{IMToken},{Gender},{Nickname},{Email},{PhoneNumber},{FamilyName},{GivenName},{HeadImageUrl},{HeadImagePath}," +
    "1)";
// public static removeUser = "delete from Login where Account = {Account}";
SQLiteSql.removeUser = "update Login set Logined = 0 where Account = {Account}";
SQLiteSql.getUser = "select * from Login where Logined = 1";
//# sourceMappingURL=SQLiteSql.js.map