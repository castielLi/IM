/**
 * Created by apple on 2017/12/8.
 */

import { Platform, StyleSheet } from 'react-native';
let SQLite = require('react-native-sqlite-storage')
import * as sqls from './ApplyFriendExcuteSql'
import RNFS from 'react-native-fs';

export function storeApplyMessage(message){

}

export function getAllApplyMessage(){

}

export function updateApplyMessageStatus(messageId,status){

}



export function initIMDatabase(AccountId,callback){
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
                    console.log('create Chat database success');
                    callback();
                }, (err)=>{errorDB('创建数据表',err)});
            }
        });
    }, (err)=>{errorDB('初始化数据库',err)});
}

APPLYFRIENDFMDB.storeMessage = function(message){
    let insertSql = sqls.ExcuteIMSql.AddNewMessageToApplyFriend;


}

function errorDB(type,err) {
    console.log("SQL Error: " +type,err);
}

function successDB() {
    console.log("open database");
}





