/**
 * Created by apple on 2017/9/28.
 */

export const InitIMTable = {

    "createGroupTable":"CREATE TABLE IF NOT EXISTS GroupList (RelationId varchar(255) PRIMARY KEY, OtherComment varchar(255),Nick varchar(255),Remark varchar(255) , BlackList Boolean,Type varchar(20),avator varchar(255),Email varchar(255), localImage varchar(255) , owner varchar(255),show Boolean)",
    "CreateRelationTableIndex":"CREATE INDEX index_id ON GroupList(RelationId)",

}

export const ExcuteIMSql = {

    "GetAllRelation":"select * from GroupList",
    "GetAllShowRelation":"select * from GroupList where show='true'",
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
    "SelectRelationByIdAndType":"select * from GroupList where RelationId = ? and Type = 'chatroom' ",
    "CreateGroupMemberTable":"CREATE TABLE IF NOT EXISTS ? (RelationId varchar(255))",
    "InsertGroupMember":"insert or replace into ? (RelationId) values(?)",
    "GetGroupMembersByGroupId":"select * from ?",
    "RemoveGroupFromContact":"update GroupList set show='false' where RelationId=?",
    "FindGroupTable":"select count(*)  from sqlite_master where type='table' and name=?"

}