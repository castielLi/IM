/**
 * Created by apple on 2017/9/28.
 */

export const InitIMTable = {

    //群聊和单聊都放入一个表中， otherComment 群聊就是群信息，单聊就是性别
    "createRelationTable":"CREATE TABLE IF NOT EXISTS Relation (Id INTEGER PRIMARY KEY AUTOINCREMENT, RelationId varchar(255), OtherComment varchar(255),Nick varchar(255),Remark varchar(255) , BlackList Boolean, Type varchar(20))",
   //如果是群聊 那么setting就是消息提醒设置，单聊则是允许对方看朋友群等.
    "createRelationSettingTable":"CREATE TABLE IF NOT EXISTS RelationSetting (Id INTEGER PRIMARY KEY AUTOINCREMENT,RelationId varchar(255), Setting varchar(20))",
    "CreateRelationTableIndex":"CREATE INDEX index_id ON Relation(RelationId)",
}

export const ExcuteIMSql = {

    "GetAllRelation":"select * from Relation",
}