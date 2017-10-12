/**
 * Created by apple on 2017/9/28.
 */

let SQLite = require('react-native-sqlite-storage')
import * as sqls from './UserExcuteSql'
import { Platform, StyleSheet } from 'react-native';

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