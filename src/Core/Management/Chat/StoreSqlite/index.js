/**
 * Created by apple on 2017/8/9.
 */
import { Platform, StyleSheet } from 'react-native';
let SQLite = require('react-native-sqlite-storage')
import * as sqls from './ChatExcuteSql'
import * as commonMethods from '../../../Helper/formatQuerySql'
import ChatWayEnum from '../../Common/dto/ChatWayEnum'
import RNFS from 'react-native-fs';
import ManagementMessageDto from '../../Common/dto/ManagementMessageDto'
import getContentOfControllerMessageDto from './../Common/methods/GetContentOfControllerMessageDto'
import chatSqliteMessageToManagementMessageDto from '../Common/methods/ChatSqliteMessageToManagementMessageDto'

export function storeMessage(message){

    CHATFMDB.InsertMessageWithCondition(message, message.chatId)

}


export function deleteClientRecode(name,chatType){
    CHATFMDB.DeleteChatByClientId(name,chatType);
}

export function deleteMessage(message,chatType,client){
    CHATFMDB.DeleteChatMessage(message,chatType,client);
}
//删除ChatRecode中某条记录
export function deleteChatRecode(name){
    CHATFMDB.DeleteClientRecodeByName(name);
}

//修改某client的未读消息数量
export function updateUnReadMessageNumber(name,number){
    CHATFMDB.updateUnReadMessageNumber(name,number);
}
export function addChatUnReadMessageNumber(name){
    CHATFMDB.addChatUnReadMessageaNumber(name);
}

export function clearAllData(){
    CHATFMDB.clearAllDatabaseData();
}

export function UpdateMessage(message = new ManagementMessageDto()){
    CHATFMDB.UpdateMessageBody(message);
}

export function addOfflineMessage(message = new ManagementMessageDto()){
   CHATFMDB.insertOfflineMessageByMessage(message);
}

export function getOfflineMessages(callback){
    CHATFMDB.getAllOfflineMessages(callback);
}

export function deleteOfflineMessages(){
   CHATFMDB.deleteAllOfflineMessages();
}


//获取range范围的消息
export function queryRecentMessage(account,way,range,callback){
    CHATFMDB.getRangeMessages(account,way,range,callback)
}

export function getChatList(callback){
    CHATFMDB.getAllChatClientList(callback)
}



var databaseObj = {
    name :"Chat.db",
}
if(Platform.OS === 'ios'){
    databaseObj.createFromLocation='1'
    databaseObj.location = "Documents"
}


export function initIMDatabase(AccountId,callback){
    if(Platform.OS === 'ios'){
        databaseObj.name =  AccountId + "/database/Chat.db"
    }

    RNFS.mkdir(RNFS.DocumentDirectoryPath+"/"+AccountId+"/database",{
        NSURLIsExcludedFromBackupKey:true
    }).then((success) => {
        console.log('Create directory success!');
    })
        .catch((err) => {
            console.log(err.message);
        });

    CHATFMDB.initIMDataBase(AccountId,callback);
}

export function closeImDb(){
    CHATFMDB.closeImDb()
}

let CHATFMDB = {};
CHATFMDB.initIMDataBase = function(AccountId,callback){


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

CHATFMDB.getAllOfflineMessages = function(callback){
    var db = SQLite.openDatabase({
        ...databaseObj

    }, () => {
        db.transaction((tx) => {

            tx.executeSql(sqls.ExcuteIMSql.GetAllOfflineMessage, [], (tx, results) => {

                callback(results.rows.raw());

            }, (err)=>{errorDB('获取所有offline消息',err)});

        });
    }, (err)=>{errorDB('初始化数据库',err)});
}

CHATFMDB.deleteAllOfflineMessages = function(){
    var db = SQLite.openDatabase({
        ...databaseObj

    }, () => {
        db.transaction((tx) => {

            tx.executeSql(sqls.ExcuteIMSql.DeleteAllOfflineMessage, [], (tx, results) => {

                console.log("删除所有offline消息成功")

            }, (err)=>{errorDB('删除所有offline消息',err)});

        });
    }, (err)=>{errorDB('初始化数据库',err)});
}

CHATFMDB.insertOfflineMessageByMessage = function(message = new ManagementMessageDto()){

    let sql = sqls.ExcuteIMSql.InsertMessageIntoOfflineTable;

    let messageBody = JSON.stringify(message);

    sql = commonMethods.sqlFormat(sql,[message.messageId,messageBody])

    var db = SQLite.openDatabase({
        ...databaseObj

    }, () => {
        db.transaction((tx) => {

            tx.executeSql(sql, [], (tx, results) => {

                console.log("添加offline消息成功")

            }, (err)=>{errorDB('添加offline消息',err)});

        });
    }, (err)=>{errorDB('初始化数据库',err)});
}

CHATFMDB.clearAllDatabaseData = function(){
    var db = SQLite.openDatabase({
        ...databaseObj

    }, () => {
        db.transaction((tx) => {

            tx.executeSql(sqls.ExcuteIMSql.ClearChatRecode, [], (tx, results) => {
                console.log('clear all chatrecode success');
            }, (err)=>{errorDB('清空聊天列表',err)});

        });
    }, (err)=>{errorDB('初始化数据库',err)});
}


//todo：想办法进行批量操作
CHATFMDB.InsertMessageWithCondition = function(message = new ManagementMessageDto(),chatId,callback){

    let checkChatExist = sqls.ExcuteIMSql.QueryChatIsExist;

    let way = message.group?ChatWayEnum.Group:ChatWayEnum.Private;


    let tableName;

    tableName = way == ChatWayEnum.Private ? "Private_" + chatId : "Group_" + chatId;


    var conetnt = getContentOfControllerMessageDto(message);
    let time = message.sendTime;


    let insertChatToSpecialRecodeSqlSql = sqls.ExcuteIMSql.InsertMessageToTalk;
    let messageString = JSON.stringify(message);
    insertChatToSpecialRecodeSqlSql = commonMethods.sqlFormat(insertChatToSpecialRecodeSqlSql,[tableName,message.messageId,messageString,message.status]);

    let createTableSql = sqls.ExcuteIMSql.CreateChatTable;
    createTableSql = commonMethods.sqlFormat(createTableSql,[tableName]);


    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(checkChatExist, [chatId], (tx, results) => {
                if(results.rows.length){
                    //如果当前聊天对象在数据库中存在有数据
                    //添加数据进数据库

                    updateChat(conetnt,time,chatId,message.sender,tx);

                    insertChatToSpecialRecode(insertChatToSpecialRecodeSqlSql,tx);


                }else{
                    //如果当前聊天是新的聊天对象
                    tx.executeSql(createTableSql, [], (tx, results) => {

                        console.log("create chat table success");

                        insertClientRecode(chatId,way,conetnt,message.sendTime,message.sender,tx);

                        insertChatToSpecialRecode(insertChatToSpecialRecodeSqlSql,tx);

                    }, (err)=>{errorDB('创建新聊天对象表',err)});
                }
            }, (err)=>{errorDB('查询所有聊天对象',err)});

        });
    }, (err)=>{errorDB('初始化数据库',err)});
}


//删除当前用户的聊天记录
CHATFMDB.DeleteChatByClientId = function(name,chatType){
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            if(chatType == ChatWayEnum.Group){

                deleteClientChatList("Group_" + name, tx);
            }else {
                deleteClientChatList("Private_" + name, tx);
            }

        });
    }, errorDB);
}



//删除聊天室聊天记录
CHATFMDB.DeleteChatByChatRoomId = function(chatRoom){
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(sqls.ExcuteIMSql.QueryChatTypeFromChatList, [chatRoom], (tx, results) => {

                console.log(results);
                // chatList = results;
                if(results.rows.length) {

                    deleteClientRecodeByName(chatRoom);
                    deleteClientChatList("ChatRoom_" + chatRoom);
                }
            }, errorDB);

        });
    }, errorDB);
}

//删除具体消息
CHATFMDB.DeleteChatMessage = function(message,chatType,client){

    let tableName = chatType==ChatWayEnum.Group? "Group_"+client : "Private"+client;

    let deleteSql = sqls.ExcuteIMSql.DeleteMessageById;

    deleteSql = commonMethods.sqlFormat(deleteSql,[tableName,message.MSGID]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(deleteSql, [], (tx, results) => {

                console.log("delete current message success");

            }, errorDB);

        });
    }, errorDB);
}

//获取所有聊天用户
CHATFMDB.getAllChatClientList = function(callback){
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(sqls.ExcuteIMSql.GetChatList, [], (tx, results) => {

                console.log(results);
                callback(results.rows.raw());

            }, (err)=>{errorDB('获取聊天列表失败',err)});

        });
    }, errorDB);
}


CHATFMDB.UpdateMessageBody = function(message = new ManagementMessageDto()){

    let updateSql = sqls.ExcuteIMSql.UpdateMessage;

    let tabName = !message.group?"Private_" + message.chatId:"Group_" + message.chatId;

    let messageBody = JSON.stringify(message);

    updateSql = commonMethods.sqlFormat(updateSql,[tabName,messageBody,message.status,message.messageId])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(updateSql, [], (tx, results) => {

                console.log("更新chat 数据库 messagebody 成功");
                console.log("更新chat 数据库 messagebody 成功");
                console.log("更新chat 数据库 messagebody 成功");

            }, (err)=>{errorDB('更新messageBody',err)});

        });
    }, errorDB);
}

// CHATFMDB.getMessageById = function(messageId,callback){
//     let getSql = sqls.ExcuteIMSql.GetMessageById;
//     getSql = commonMethods.sqlFormat(getSql,[tabName,messageId])
//     var db = SQLite.openDatabase({
//         ...databaseObj
//     }, () => {
//         db.transaction((tx) => {
//             tx.executeSql(getSql, [], (tx, results) => {
//
//                 callback(results.rows.raw())
//
//             }, (err)=>{errorDB('获取消息体',err)});
//         });
//     }, errorDB);
// }

CHATFMDB.getRangeMessages = function(account,way,range,callback){

    let tabName = way  == ChatWayEnum.Private?"Private_" + account:"Group_" + account;

    let querySql = "";

    if(range.start == 0){
        querySql = sqls.ExcuteIMSql.QueryChatRecodeByChatId;
    }else{
        querySql = sqls.ExcuteIMSql.QueryChatRecodeByChatIdAndMaxId;
    }


    querySql = commonMethods.sqlFormat(querySql,[tabName,range.start,range.limit]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(querySql, [], (tx, results) => {

                if(results.rows.raw().length == 0){
                    callback([]);
                }else{
                    let messages = results.rows.raw();
                    let backMessages = [];
                    for(let item in messages){
                       backMessages.push(chatSqliteMessageToManagementMessageDto(messages[item]));
                    }
                    callback(backMessages);
                }
            }, errorDB);

        });
    }, errorDB);
}





CHATFMDB.DeleteClientRecodeByName = function(name){

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            deleteClientRecodeByName(name,tx)

        });

    }, errorDB);
}

CHATFMDB.updateUnReadMessageNumber = function(name,number){
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {
            updateUnReadMessage(name,number,tx)
        });

    }, (err)=>{errorDB('修改ChatRecorde数据表未读消息数量失败',err)});
}

CHATFMDB.addChatUnReadMessageaNumber = function(name){
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {
            addChatUnReadMessageaNumber(name,tx)
        });

    }, (err)=>{errorDB('修改ChatRecorde数据表未读消息数量失败',err)});
}





CHATFMDB.closeImDb = function(){
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.close();

    });
}



//添加messageId到个人消息表
function insertChatToSpecialRecode(insertSql,tx){


    tx.executeSql(insertSql, [], (tx, results) => {

        console.log("insert meesage success");


    }, (err)=>{errorDB('向聊天对象插入详细聊天',err)});
}


//修改chat列表中最近的聊天记录
function updateChat(content,time,chatId,sender,tx){

    let updateSql = sqls.ExcuteIMSql.UpdateChatLastContent;

    updateSql = commonMethods.sqlFormat(updateSql,[content,time,sender,chatId]);

    tx.executeSql(updateSql, [], (tx, results) => {

        console.log("更改最近一条消息记录为");

    }, (err)=>{errorDB('为'+chatId+"在会话列表中更新了最新的聊天记录",err)
    });
}

//添加会话记录
function insertClientRecode(chatId,way,content,time,sender,tx){
    let insertSql = sqls.ExcuteIMSql.InsertChatRecode;

    insertSql = commonMethods.sqlFormat(insertSql,[chatId,way,content,time,sender]);

    tx.executeSql(insertSql, [], (tx, results) => {

        console.log("insert recode success");

    }, errorDB);
}

function deleteClientRecodeByName(name,tx){
    let deleteSql = sqls.ExcuteIMSql.DeleteChatFromChatList;

    deleteSql = commonMethods.sqlFormat(deleteSql,[name]);

    tx.executeSql(deleteSql, [], (tx, results) => {

        console.log("delete recode success");

    }, errorDB);
}

function updateUnReadMessage(name,number,tx){
    let updateSql = sqls.ExcuteIMSql.UpdateChatUnReadMessageaNumber;
    updateSql = commonMethods.sqlFormat(updateSql,[number,name]);
    tx.executeSql(updateSql, [], (tx, results) => {

        console.log("update unReadMessageNumber success");

    }, (err)=>{errorDB('update unReadMessageNumber',err)});
}

function addChatUnReadMessageaNumber(name,tx){
    let updateSql = sqls.ExcuteIMSql.AddChatUnReadMessageaNumber;
    updateSql = commonMethods.sqlFormat(updateSql,[name]);
    tx.executeSql(updateSql, [], (tx, results) => {

        console.log("add unReadMessageNumber success");
        console.log("add unReadMessageNumber success");
    }, (err)=>{errorDB('add unReadMessageNumber',err)});
}

function deleteClientChatList(tableName,tx){
    let deleteSql = sqls.ExcuteIMSql.DeleteChatTableByName;

    deleteSql = commonMethods.sqlFormat(deleteSql,[tableName]);

    tx.executeSql(deleteSql, [], (tx, results) => {

        console.log("delete chat list success");

    }, errorDB);
}

//从id截取用户名
function InterceptionClientFromId(str){
    let client = '';
    client = str.slice(0,str.indexOf('_'));
    return client;
}
//从表名截取用户名
function InterceptionClientFromTable(str){
    let client = '';
    client = str.slice(str.indexOf('_')+1);
    return client;
}

function errorDB(type,err) {
    console.log("SQL Error: " +type,err);
}

function successDB() {
    console.log("open database");
}





