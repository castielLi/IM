/**
 * Created by apple on 2017/8/9.
 */
import {Platform, StyleSheet} from 'react-native';
let SQLite = require('react-native-sqlite-storage')
import * as sqls from './IMExcuteSql'

export function initIMDatabase() {
    FMDB.initIMDataBase();
}

var databaseObj = {
    name: "IM.db",//数据库文件
}
if (Platform.OS === 'ios') {
    databaseObj.createFromLocation = '1'
}

let FMDB = {};
FMDB.initIMDataBase = function () {
    var db = SQLite.openDatabase({
        ...databaseObj

    }, () => {
        db.transaction((tx) => {
            for (key in sqls.InitIMTable) {
                let sql = sqls.InitIMTable[key];
                tx.executeSql(sql, [], (tx, results) => {
                    console.log('create IM database success');
                }, (err) => {
                    errorDB('创建数据表', err)
                });
            }
        });
    }, (err) => {
        errorDB('初始化数据库', err)
    });
}

function errorDB(type,err) {
    console.log("SQL Error: " +type,err);
}

function successDB() {
    console.log("open database");
}