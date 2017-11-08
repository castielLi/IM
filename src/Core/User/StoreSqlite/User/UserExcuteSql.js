/**
 * Created by apple on 2017/9/28.
 */

export const InitIMTable = {

    //群聊和单聊都放入一个表中， otherComment 群聊就是群信息，单聊就是性别
    "createRelationTable":"CREATE TABLE IF NOT EXISTS Relation (RelationId varchar(255) PRIMARY KEY, OtherComment varchar(255),Nick varchar(255),Remark varchar(255) , BlackList Boolean,Type varchar(20),avator varchar(255),Email varchar(255), localImage varchar(255) , owner varchar(255),show Boolean)",

    "CreateRelationTableIndex":"CREATE INDEX index_id ON Relation(RelationId)",
}

export const ExcuteIMSql = {

    "GetAllRelation":"select * from Relation where show='true'",
    "InitRelations":"insert or replace into Relation(RelationId,OtherComment,Nick,Remark,BlackList,Type,avator,Email,localImage,owner,show) values(?,?,?,?,?,?,?,?,'',?,?)",
    "AddtRelations":"insert or replace into Relation(RelationId,OtherComment,Nick,Remark,BlackList,Type,avator,Email,localImage,owner,show) values(?,?,?,?,?,?,?,?,'',?,?)",
    "AddMembers":"insert or ignore into Relation(RelationId,OtherComment,Nick,Remark,BlackList,Type,avator,Email,localImage,owner,show) values(?,?,?,?,?,?,?,?,'',?,?)",
    "SetBlackList":"update Relation set BlackList = ? where RelationId = ?",
    "DeleteRelation":"delete from Relation where RelationId = ?",
    "UpdateRelationAvator":"update Relation set localImage = ? where RelationId = ?",
    "UpdateGroupComment":"update Relation set OtherComment = ? where RelationId =?",
    "UpdateRelation":"update Relation set OtherComment = ?,Nick=?,Remark=?,BlackList=?,avator=?,Email=?,localImage=?,owner=? ,show = ? where RelationId=?",
    "GetAllRelationAvatorAndName":"select RelationId,avator,LocalImage,Nick from Relation",
    "InsertRelationSetting":"insert into RelationSetting(RelationId,setTop,disturb,saveContact,showNick,displayZoom,allowCheckZoom,starMark) values(?,?,?,?,?,?,?,?)",
    "GetRelationSettingByRelationId":"select * from RelationSetting where RelationId=?",
    "UpdateRelationSetting":"update RelationSetting set setTop=?,disturb=?,saveContact=?,showNick=?,displayZoom=?,allowCheckZoom=?,starMark=? where RelationId=?",
    "UpdateRelationDisplayStatus":'update Relation set show = ? where RelationId = ?',
    "SelectRelationByIdAndType":"select * from Relation where RelationId = ? and Type = 'private' "
}