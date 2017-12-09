/**
 * Created by apple on 2017/9/28.
 */

let SQLite = require('react-native-sqlite-storage')
import * as sqls from './GroupExcuteSql'
import { Platform, StyleSheet } from 'react-native';
import * as commonMethods from '../../../../Helper/formatQuerySql';




var databaseObj = {
    name: "Group.db",//数据库文件

}
if (Platform.OS === 'ios') {
    databaseObj.createFromLocation = '1'
    databaseObj.location = 'Documents'
}

export function initIMDatabase(AccountId,callback){
    if(Platform.OS === 'ios'){
        databaseObj.name =  AccountId + "/database/Group.db"
    }

    GROUPFMDB.initIMDataBase(AccountId,callback);
}

//获取所有群
export function GetRelationList(callback,show){
    GROUPFMDB.GetRelationList(callback,show);
}
//获取指定群
export function GetRelationByIdAndType(Id,type,callback){
    GROUPFMDB.GetRelationByIdAndType(Id,type,callback);
}

//初始化群列表（登录时，插入服务器返回的群列表，没有则插入，有则更新）
export function initRelations(GroupList,callback){
    GROUPFMDB.InitRelations(GroupList,callback)
}

//接收一个新群的时候，获取这个群的成员列表并保存到groupMember中
export function initGroupMemberByGroupId(GroupId,members){
    GROUPFMDB.InitGroupMemberByGroupId(GroupId,members);
}

//将群聊从通讯录中移除
export function RemoveGroupFromContact(groupId){
  GROUPFMDB.RemoveContact(groupId)
}

export function getRelationsByIds(Ids,callback){
    GROUPFMDB.getRelationsByRelationIds(Ids,callback)
}

//删除群成员
export function removeGroupMember(groupId,members){
    GROUPFMDB.removeGroupMember(groupId,members)
}

//根据groupId获取群组的成员列表
export function GetMembersByGroupId(groupId,callback){
    GROUPFMDB.GetMembersByGroupId(groupId,callback)
}

//通过GroupID查看是否存在该表
export function FindGroupTable(groupId,callback){
    GROUPFMDB.FindGroupTable(groupId,callback)
}


//删除关系
export function deleteRelation(RelationId){
    GROUPFMDB.DeleteRelation(RelationId)
}



//修改关系
export function updateRelation(Relation) {
    GROUPFMDB.updateRelation(Relation);
}


//更新relation显示状态
export function updateRelationDisplayStatus(relationId,bool){
    GROUPFMDB.UpdateRelationDisplayStatus(relationId,bool);
}

//更新群名
export function UpdateGroupName(relationId,name){
    GROUPFMDB.UpdateGroupName(relationId,name);
}
//添加新的关系
export function addNewRelation(Relation){
    GROUPFMDB.AddNewRelation(Relation)
}


export function closeAccountDb(){
    GROUPFMDB.closeAccountDb()
}


let GROUPFMDB = {};

GROUPFMDB.initIMDataBase = function(){
    var db = SQLite.openDatabase({
        ...databaseObj

    }, () => {
        db.transaction((tx) => {
            for (key in sqls.InitIMTable) {
                let sql = sqls.InitIMTable[key];
                tx.executeSql(sql, [], (tx, results) => {
                    console.log('create UserGroup database success');
                }, (err)=>{errorDB('创建数据表',err)});
            }
        });
    }, (err)=>{errorDB('初始化数据库',err)});
}

GROUPFMDB.removeGroupMember = function (groupId,members) {
    let deleteSqls = [];
    for(let current of members){
        let deleteSql = sqls.ExcuteIMSql.removeGroupMember;
        deleteSql = commonMethods.sqlFormat(deleteSql,[groupId,current]);
        deleteSqls.push(deleteSql)
    }

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            for(let deleteSql of deleteSqls){
                tx.executeSql(deleteSql, [], (tx, results) => {

                    console.log(results);

                    // callback(results.rows.raw())

                }, (err)=>{errorDB('删除群成员',err)});
            }

        }, errorDB);
    }, errorDB);
};

GROUPFMDB.getRelationsByRelationIds = function(Ids,callback){

    let sql = sqls.ExcuteIMSql.GetRelationsByIds;

    sql = commonMethods.sqlQueueFormat(sql,Ids);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {
                callback(results.rows.raw())

            }, errorDB);
        }, errorDB);
    }, errorDB);
}



//接收一个新群的时候，获取这个群的成员列表并保存到groupMember中
GROUPFMDB.InitGroupMemberByGroupId = function(GroupId,members){

    let createTablesql = sqls.ExcuteIMSql.CreateGroupMemberTable;

    createTablesql = commonMethods.sqlFormat(createTablesql,[GroupId])

    let insertSqls = [];

    for(let i = 0;i<members.length;i++){
        let insertSql = sqls.ExcuteIMSql.InsertGroupMember;

        let member = members[i];

        insertSql = commonMethods.sqlFormat(insertSql,[GroupId,member.Account]);

        insertSqls.push(insertSql);
    }


    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(createTablesql, [], (tx, results) => {

                console.log("创建" + GroupId + ":Group Member表成功");

                for(let i = 0; i< insertSqls.length;i++){

                    tx.executeSql(insertSqls[i], [], (tx, results) => {

                        console.log("添加" + members[i] + ":Member到 "+ GroupId +"表成功");
                    }, (err)=>{errorDB('添加Member',err)});
                }

            }, (err)=>{errorDB('创建GroupMember表',err)});

        }, errorDB);
    }, errorDB);
}

//通过GroupI获取members
GROUPFMDB.GetMembersByGroupId = function(groupId,callback){
    let selectSql = sqls.ExcuteIMSql.GetGroupMembersByGroupId;

    selectSql = commonMethods.sqlFormat(selectSql,[groupId]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(selectSql, [], (tx, results) => {

                // console.log(results);

                callback(results.rows.raw())

            }, (err)=>{errorDB('通过groupId获取成员',err)});

        }, errorDB);
    }, errorDB);
}

//通过GroupID查看是否存在该表
GROUPFMDB.FindGroupTable = function(groupId,callback){
    let selectSql = sqls.ExcuteIMSql.FindGroupTable;

    selectSql = commonMethods.sqlFormat(selectSql,[groupId]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(selectSql, [], (tx, results) => {

                console.log(results);

                callback(results.rows.raw())

            }, (err)=>{errorDB('通过GroupID查看是否存在该表',err)});

        }, errorDB);
    }, errorDB);
}

//更新群名称
GROUPFMDB.UpdateGroupName = function(relationId,name){

    let sql = sqls.ExcuteIMSql.UpdateGroupName;

    sql = commonMethods.sqlFormat(sql,[name,relationId])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(sql, [], (tx, results) => {

                console.log("更新状态成功")

            }, (err)=>{errorDB('更新好友',err)});

        }, errorDB);
    }, errorDB);
}


//通过type和ID获取relation
GROUPFMDB.GetRelationByIdAndType = function(Id,type,callback){

    let selectSql = sqls.ExcuteIMSql.SelectRelationByIdAndType;

    selectSql = commonMethods.sqlFormat(selectSql,[Id,type])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(selectSql, [], (tx, results) => {

                callback(results.rows.raw());

            }, (err)=>{errorDB('获取特定关系',err)});

        }, errorDB);
    }, errorDB);
}


//获取好友列表
GROUPFMDB.GetRelationList = function(callback,show){

    let sql = show == undefined? sqls.ExcuteIMSql.GetAllRelation:sqls.ExcuteIMSql.GetAllShowRelation;

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(sql, [], (tx, results) => {

                callback(results.rows.raw());

            }, (err)=>{errorDB('获取好友列表',err)});

        }, errorDB);
    }, errorDB);
}

//初始化好友列表
GROUPFMDB.InitRelations = function(GroupList,callback){

    let relationsSqls = [];

    // (RelationId,OtherComment,Nick,Remark,BlackList,Type,avator,Email)



    for(let item in GroupList){

        let sql = sqls.ExcuteIMSql.AddtRelations;

        let group = GroupList[item];

        group.Name = group.Name == null?"未命名":group.Name;
        group.Description = group.Description == null?"":group.Description;
        group.ProfilePicture = group.ProfilePicture == null?"":group.ProfilePicture;

        sql = commonMethods.sqlFormat(sql,[group.GroupId,group.Description,group.Name,"",false,"group",group.ProfilePicture,"",group.Owner,true]);
        relationsSqls.push({"sql":sql,"Id":group.GroupId});
    }


    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            for(let item in relationsSqls){
                let executeSql = relationsSqls[item].sql;
                tx.executeSql(executeSql, [], (tx, results) => {

                   console.log("添加关系成功")

                    let querySql = sqls.ExcuteIMSql.FindGroupTable;

                    querySql = commonMethods.sqlFormat(querySql,[relationsSqls[item].Id])

                    tx.executeSql(executeSql, [], (tx, results) => {

                        if(results.rows.length == 0){
                            let insertSql = sqls.ExcuteIMSql.CreateGroupMemberTable;

                            insertSql = commonMethods.sqlFormat(insertSql,[relationsSqls[item].Id])

                            tx.executeSql(insertSql, [], (tx, results) => {

                                console.log("add group member table success")

                            }, (err)=>{errorDB('add group member table',err)});
                        }

                    }, (err)=>{errorDB('query if group member table is not exist',err)});

                }, (err)=>{errorDB('初始化关系表内容',err)});
            }

            callback&&callback();

        }, errorDB);
    }, errorDB);
}

//添加新关系
GROUPFMDB.AddNewRelation = function(Relation){
    //todo 检查数据表中是否已经存在，存在才添加

    let sql = sqls.ExcuteIMSql.AddtRelations;

    sql = commonMethods.sqlFormat(sql,[Relation.RelationId,Relation.OtherComment,Relation.Nick,Relation.Remark,Relation.BlackList,Relation.Type,Relation.avator,Relation.Email,Relation.owner,Relation.show]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {


                tx.executeSql(sql, [], (tx, results) => {

                    console.log("添加关系成功")

                }, errorDB);


            // callback();

        }, errorDB);
    }, errorDB);
}

//将群聊从通讯录中移除
GROUPFMDB.RemoveContact = function(groupId){
    let sql = sqls.ExcuteIMSql.RemoveGroupFromContact;

    sql = commonMethods.sqlFormat(sql,[groupId]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {


            tx.executeSql(sql, [], (tx, results) => {

                console.log("移除群聊成功")

            }, errorDB);


            // callback();

        }, errorDB);
    }, errorDB);
}


//删除关系
GROUPFMDB.DeleteRelation = function(RelationId){
    let deleteSql = sqls.ExcuteIMSql.DeleteRelation;

    deleteSql = commonMethods.sqlFormat(deleteSql,[RelationId]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(deleteSql, [], (tx, results) => {

                console.log("删除关系成功")

            }, errorDB);

        }, errorDB);
    }, errorDB);
}




//修改关系
GROUPFMDB.updateRelation =function(Relation){
    let updateSql = sqls.ExcuteIMSql.UpdateRelation;

    updateSql = commonMethods.sqlFormat(updateSql,[Relation.OtherComment,Relation.Nick,Relation.Remark,Relation.BlackList,Relation.avator,Relation.Email,Relation.LocalImage,Relation.owner,Relation.show])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(updateSql, [], (tx, results) => {

                console.log("更新关系成功")

            }, errorDB);

        }, errorDB);
    }, errorDB);
}





GROUPFMDB.closeAccountDb = function(){
     var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.close();

    });
}

function errorDB(type,err) {
    console.log("SQL Error: " +type,err);
}

function successDB() {
    console.log("open database");
}