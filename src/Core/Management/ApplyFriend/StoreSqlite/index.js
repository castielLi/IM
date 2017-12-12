/**
 * Created by apple on 2017/12/8.
 */

import { Platform, StyleSheet } from 'react-native';
let SQLite = require('react-native-sqlite-storage')
import * as sqls from './ApplyFriendExcuteSql'
import RNFS from 'react-native-fs';
import ManagementApplyMessageDto from '../Common/dto/ManagementApplyMessageDto'
import * as commonMethods from '../../../Helper/formatQuerySql'

export function storeApplyMessage(message = new ManagementApplyMessageDto()){
    APPLYFRIENDFMDB.storeMessage(message);
}

export function getAllApplyMessage(callback){
    APPLYFRIENDFMDB.getAllApplyMessages(callback);
}

export function updateApplyMessageStatus(key,status){
    APPLYFRIENDFMDB.updateMessageStatus(key,status);
}


var databaseObj = {
    name :"ApplyFriend.db",
}

if(Platform.OS === 'ios'){
    databaseObj.createFromLocation='1'
    databaseObj.location = "Documents"
}

export function initApplyFriendDatabase(AccountId,callback){
    if(Platform.OS === 'ios'){
        databaseObj.name =  AccountId + "/database/ApplyFriend.db"
    }

    RNFS.mkdir(RNFS.DocumentDirectoryPath+"/"+AccountId+"/database",{
        NSURLIsExcludedFromBackupKey:true
    }).then((success) => {
        console.log('Create directory success!');
    })
        .catch((err) => {
            console.log(err.message);
        });

    APPLYFRIENDFMDB.initIMDataBase(AccountId,callback);
}

export function closeImDb(){
    APPLYFRIENDFMDB.closeImDb()
}

let APPLYFRIENDFMDB = {};
APPLYFRIENDFMDB.initIMDataBase = function(AccountId,callback){

    var db = SQLite.openDatabase({
        ...databaseObj

    }, () => {
        db.transaction((tx) => {
            for (key in sqls.InitIMTable) {
                let sql = sqls.InitIMTable[key];
                tx.executeSql(sql, [], (tx, results) => {
                    console.log('create apply database success');
                    callback();
                }, (err)=>{errorDB('创建数据表',err)});
            }
        });
    }, (err)=>{errorDB('初始化数据库',err)});
}

APPLYFRIENDFMDB.storeMessage = function(message = new ManagementApplyMessageDto()){
    let insertSql = sqls.ExcuteIMSql.AddNewMessageToApplyFriend;
    // comment,key,sender,status,time
    insertSql = commonMethods.sqlFormat(insertSql,[message.comment,message.key,message.sender,message.status,message.time]);

    var db = SQLite.openDatabase({
        ...databaseObj

    }, () => {
        db.transaction((tx) => {

            tx.executeSql(insertSql, [], (tx, results) => {

                console.log("添加applymessage success")
            }, (err)=>{errorDB('添加applymessage',err)});

        });
    }, (err)=>{errorDB('初始化数据库',err)});
}


APPLYFRIENDFMDB.getAllApplyMessages = function(callback){
    let sql = sqls.ExcuteIMSql.QueryApplyFriend

    var db = SQLite.openDatabase({
        ...databaseObj

    }, () => {
        db.transaction((tx) => {

            tx.executeSql(sql, [], (tx, results) => {

                callback(results.rows.raw());
            }, (err)=>{errorDB('获取数据表',err)});

        });
    }, (err)=>{errorDB('初始化数据库',err)});
}


APPLYFRIENDFMDB.updateMessageStatus = function(key,status){
    let sql = sqls.ExcuteIMSql.UpdateApplyFriend

    sql = commonMethods.sqlFormat(sql,[status,key]);

    var db = SQLite.openDatabase({
        ...databaseObj

    }, () => {
        db.transaction((tx) => {

            tx.executeSql(sql, [], (tx, results) => {

                console.log("修改 applymessage status success")
            }, (err)=>{errorDB('修改数据表',err)});

        });
    }, (err)=>{errorDB('初始化数据库',err)});
}

function errorDB(type,err) {
    console.log("SQL Error: " +type,err);
}

function successDB() {
    console.log("open database");
}





