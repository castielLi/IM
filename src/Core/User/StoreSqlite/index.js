/**
 * Created by apple on 2017/9/28.
 */

let SQLite = require('react-native-sqlite-storage')
import * as sqls from './UserExcuteSql'
import { Platform, StyleSheet } from 'react-native';
import * as commonMethods from '../../Helper/formatQuerySql'
import ChatWayEnum from '../dto/ChatWayEnum'

export function GetRelationList(callback){
    USERFMDB.GetRelationList(callback);
}

var databaseObj = {
    name: "Account.db",//数据库文件

}
if (Platform.OS === 'ios') {
    databaseObj.createFromLocation = '1'
    databaseObj.location = 'Documents'
}

export function initIMDatabase(AccountId,callback){
    if(Platform.OS === 'ios'){
        databaseObj.name =  AccountId + "/database/Account.db"
    }

    USERFMDB.initIMDataBase(AccountId,callback);
}

//初始化好友列表
export function initRelations(friendList,blackList,GroupList,callback){
    USERFMDB.InitRelations(friendList,blackList,GroupList,callback)
}

//更改好友黑名单设置
export function changeRelationBliackList(isBlackList,RelationId){
    USERFMDB.UpdateBlackListByRelation(isBlackList,RelationId)
}


//删除关系
export function deleteRelation(Relation){
    USERFMDB.DeleteRelation(Relation)
}

//更新关系头像
export function updateRelationAvator(RelationId,LocalImage,AvatorUrl){
    USERFMDB.updateRelationAvator(RelationId,LocalImage,AvatorUrl);
}

//修改关系
export function updateRelation(Relation) {
    USERFMDB.updateRelation(Relation);
}

//获取所有关系的头像和名字
export function getAllRelationAvatorAndName(callback){
    USERFMDB.GetAllRelationAvatorAndName(callback);
}

//添加新的关系
export function addNewRelation(Relation){

}

export function closeAccountDb(){
    USERFMDB.closeAccountDb()
}


let USERFMDB = {};

USERFMDB.initIMDataBase = function(){
    var db = SQLite.openDatabase({
        ...databaseObj

    }, () => {
        db.transaction((tx) => {
            for (key in sqls.InitIMTable) {
                let sql = sqls.InitIMTable[key];
                tx.executeSql(sql, [], (tx, results) => {
                    console.log('create User database success');
                }, (err)=>{errorDB('创建数据表',err)});
            }
        });
    }, (err)=>{errorDB('初始化数据库',err)});
}

//获取好友列表
USERFMDB.GetRelationList = function(callback){

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(sqls.ExcuteIMSql.GetAllRelation, [], (tx, results) => {

                callback(results.rows.raw());

            }, errorDB);

        }, errorDB);
    }, errorDB);
}

//初始化好友列表
USERFMDB.InitRelations = function(friendList,blackList,GroupList,callback){

    let relationsSqls = [];

    // (RelationId,OtherComment,Nick,Remark,BlackList,Type,avator,Email)

    for(let item in friendList){

        let sql = sqls.ExcuteIMSql.InitRelations;

        let friend = friendList[item];

        //判断是否当前好友同样在黑名单中
        for(let i in blackList) {
            if(blackList[i].Account == friend.Account){
                continue;
            }
        }

        sql = commonMethods.sqlFormat(sql,[friend.Account,friend.Gender,friend.Nickname," ",false,"private",friend.HeadImageUrl,friend.Email]);
        relationsSqls.push(sql);
    }

    for(let item in blackList){

        let sql = sqls.ExcuteIMSql.InitRelations;

        let friend = blackList[item];

        sql = commonMethods.sqlFormat(sql,[friend.Account,friend.Gender,friend.Nickname," ",true,"private",friend.HeadImageUrl,friend.Email]);
        relationsSqls.push(sql);
    }

    for(let item in GroupList){

        let sql = sqls.ExcuteIMSql.InitRelations;

        let group = GroupList[item];

        sql = commonMethods.sqlFormat(sql,[group.GroupId," ",group.Name," ",false,"chatroom"," "," "]);
        relationsSqls.push(sql);
    }


    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            for(let item in relationsSqls){
                let executeSql = relationsSqls[item];
                tx.executeSql(executeSql, [], (tx, results) => {

                   console.log("添加关系成功")

                }, errorDB);
            }

            callback();

        }, errorDB);
    }, errorDB);
}

//添加新关系
USERFMDB.AddNewRelation = function(Relation){
    let sql = sqls.ExcuteIMSql.InitRelations;

    sql = commonMethods.sqlFormat(sql,[Relation.RelationId,Relation.OtherComment,Relation.Nick,Relation.Remark,Relation.BlackList,Relation.type,Relation.avator,Relation.Email]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {


                tx.executeSql(sql, [], (tx, results) => {

                    console.log("添加关系成功")

                }, errorDB);


            callback();

        }, errorDB);
    }, errorDB);
}


//拉入或移除黑名单
USERFMDB.UpdateBlackListByRelation = function(isBlackList,RelationId){
    let updateSql = sqls.ExcuteIMSql.SetBlackList;

    updateSql = commonMethods.sqlFormat(updateSql,[isBlackList,RelationId]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(updateSql, [], (tx, results) => {

                console.log("修改黑名单关系成功")

            }, errorDB);



        }, errorDB);
    }, errorDB);

}

//删除关系
USERFMDB.DeleteRelation = function(Relation){
    let deleteSql = sqls.ExcuteIMSql.DeleteRelation;

    deleteSql = commonMethods.sqlFormat(deleteSql,[Relation.RelationId]);

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

//更新关系头像
USERFMDB.updateRelationAvator = function(RelationId,LocalImage,AvatorUrl){

    let updateSql = sqls.ExcuteIMSql.UpdateRelationAvator;

    updateSql = commonMethods.sqlFormat(updateSql,[AvatorUrl,LocalImage,RelationId])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(updateSql, [], (tx, results) => {

                console.log("更新头像成功")

            }, errorDB);

        }, errorDB);
    }, errorDB);
}


//修改关系
USERFMDB.updateRelation =function(Relation){
    let updateSql = sqls.ExcuteIMSql.UpdateRelation;

    updateSql = commonMethods.sqlFormat(updateSql,[Relation.OtherComment,Relation.Nick,Relation.Remark,Relation.BlackList,Relation.avator,Relation.Email,Relation.LocalImage])

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

//获取所有关系的头像和名字
USERFMDB.GetAllRelationAvatorAndName = function(callback){
   let sql = sqls.ExcuteIMSql.GetAllRelationAvatorAndName;

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(sql, [], (tx, results) => {

                callback(results.rows.raw());

            }, (err)=>{errorDB('查找',err)});

        });
    }, (err)=>{errorDB('打开数据',err)});
}

USERFMDB.closeAccountDb = function(){
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