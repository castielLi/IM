/**
 * Created by apple on 2017/9/28.
 */

let SQLite = require('react-native-sqlite-storage')
import * as sqls from './UserExcuteSql'
import { Platform, StyleSheet } from 'react-native';
import * as commonMethods from '../../Helper/formatQuerySql'

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


export function initRelations(friendList,blackList,GroupList,callback){
    USERFMDB.InitRelations(friendList,blackList,GroupList,callback)
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

USERFMDB.InitRelations = function(friendList,blackList,GroupList,callback){

    let relationsSqls = [];

    // (RelationId,OtherComment,Nick,Remark,BlackList,Type,avator,Email)

    for(let item in friendList){

        let sql = sqls.ExcuteIMSql.InitRelations;

        let friend = friendList[item];

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