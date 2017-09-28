/**
 * Created by apple on 2017/9/28.
 */

let SQLite = require('react-native-sqlite-storage')
import * as sqls from '../../IM/StoreSqlite/IMExcuteSql'

export function GetChatList(callback){
    USERFMDB.getChatList(callback);
}

var databaseObj = {
    name: "IM.db",//数据库文件
}
if (Platform.OS === 'ios') {
    databaseObj.createFromLocation = '1'
}

let USERFMDB = {};

USERFMDB.getChatList = function(callback){

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {


        }, errorDB);
    }, errorDB);
}

function errorDB(type,err) {
    console.log("SQL Error: " +type,err);
}

function successDB() {
    console.log("open database");
}