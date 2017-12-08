/**
 * Created by apple on 2017/12/8.
 */

export const InitIMTable = {
   "CreateApplyFriendTable":"CREATE TABLE IF NOT EXISTS ApplyFriend (Id INTEGER PRIMARY KEY AUTOINCREMENT, comment varchar(255),key varchar(255),sender varchar(255),status varchar(255), time varchar(255))",
}

export const ExcuteIMSql = {
    "AddNewMessageToApplyFriend":"insert or replace into ApplyFriend (comment,key,sender,status,time) values(?,?,?,?,?)",
    "QueryApplyFriend":"SELECT * FROM ApplyFriend ORDER BY time",
    "UpdateApplyFriend":"update ApplyFriend set status = ? where key = ?",
}