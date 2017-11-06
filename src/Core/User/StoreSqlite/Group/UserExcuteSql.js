/**
 * Created by apple on 2017/9/28.
 */

export const InitIMTable = {

    //群聊和单聊都放入一个表中， otherComment 群聊就是群信息，单聊就是性别
    "createGroupTable":"CREATE TABLE IF NOT EXISTS GroupList (RelationId varchar(255) PRIMARY KEY, OtherComment varchar(255),Nick varchar(255),Remark varchar(255) , BlackList Boolean,Type varchar(20),avator varchar(255),Email varchar(255), localImage varchar(255) , owner varchar(255),show Boolean)",


    //如果是群聊 那么setting就是消息提醒设置，单聊则是允许对方看朋友群等.
   //  "createRelationSettingTable":"CREATE TABLE IF NOT EXISTS RelationSetting (Id INTEGER PRIMARY KEY AUTOINCREMENT,RelationId varchar(255), setTop Boolean, disturb Boolean,saveContact Boolean,showNick Boolean,displayZoom Boolean,allowCheckZoom Boolean,starMark Boolean)",
    "CreateRelationTableIndex":"CREATE INDEX index_id ON GroupList(RelationId)",
    // "CreateSettingTableIndex":"CREATE INDEX index_id ON RelationSetting(RelationId)",
}

export const ExcuteIMSql = {

    "GetAllRelation":"select * from GroupList",
    "InitRelations":"insert into GroupList(RelationId,OtherComment,Nick,Remark,BlackList,Type,avator,Email,localImage,owner,show) values(?,?,?,?,?,?,?,?,'',?,?)",
    "AddtRelations":"insert or replace into GroupList(RelationId,OtherComment,Nick,Remark,BlackList,Type,avator,Email,localImage,owner,show) values(?,?,?,?,?,?,?,?,'',?,?)",

    "SetBlackList":"update GroupList set BlackList = ? where RelationId = ?",
    "DeleteRelation":"delete from GroupList where RelationId = ?",
    "UpdateRelationAvator":"update GroupList set localImage = ? where RelationId = ?",
    "UpdateGroupComment":"update GroupList set OtherComment = ? where RelationId =?",
    "UpdateRelation":"update GroupList set OtherComment = ?,Nick=?,Remark=?,BlackList=?,avator=?,Email=?,localImage=?,owner=? ,show = ? where RelationId=?",
    "GetAllRelationAvatorAndName":"select RelationId,avator,LocalImage,Nick from GroupList",
    "InsertRelationSetting":"insert into RelationSetting(RelationId,setTop,disturb,saveContact,showNick,displayZoom,allowCheckZoom,starMark) values(?,?,?,?,?,?,?,?)",
    "GetRelationSettingByRelationId":"select * from RelationSetting where RelationId=?",
    "UpdateRelationSetting":"update RelationSetting set setTop=?,disturb=?,saveContact=?,showNick=?,displayZoom=?,allowCheckZoom=?,starMark=? where RelationId=?",
    "UpdateRelationDisplayStatus":'update GroupList set show = ? where RelationId = ?',
    "UpdateGroupName":'update GroupList set Nick = ? where RelationId = ?',

}