/**
 * Created by apple on 2017/8/9.
 */
import { Platform, StyleSheet } from 'react-native';
let SQLite = require('react-native-sqlite-storage')
import * as sqls from './ChatExcuteSql'
import * as commonMethods from '../../../Helper/formatQuerySql'
import ChatWayEnum from '../../Common/dto/ChatWayEnum'
import ResourceTypeEnum from '../../Common/dto/ResourceTypeEnum'
import ChatCommandEnum from '../../IM/dto/ChatCommandEnum'
import RNFS from 'react-native-fs';
import MessageType from '../../Common/dto/MessageType';
import MessageStatus from '../../Common/dto/MessageStatus'

export function storeSendMessage(message){

    CHATFMDB.InsertMessageWithCondition(message, message.Data.Data.Receiver)

}

export function storeRecMessage(message,callback){

    message.status = MessageStatus.SendSuccess;
    CHATFMDB.InsertMessageWithCondition(message,message.Data.Data.Sender,callback)

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



//todo：想办法进行批量操作
CHATFMDB.InsertMessageWithCondition = function(message,client,callback){

    let checkChatExist = sqls.ExcuteIMSql.QueryChatIsExist;

    let way = message.way;


    let tableName;
    if(message.way != "") {
        tableName = message.way == ChatWayEnum.Private ? "Private_" + client : "ChatRoom_" + client;
    }else{
        tableName = message.Data.Command == ChatCommandEnum.MSG_BODY_CHAT_C2C ?"Private_" + client : "ChatRoom_" + client;
    }

    let conetnt = getContentByMessage(message);
    let time = message.Data.LocalTime;


    let insertChatToSpecialRecodeSqlSql = sqls.ExcuteIMSql.InsertMessageToTalk;
    insertChatToSpecialRecodeSqlSql = commonMethods.sqlFormat(insertChatToSpecialRecodeSqlSql,[tableName,message.MSGID]);

    let createTableSql = sqls.ExcuteIMSql.CreateChatTable;
    createTableSql = commonMethods.sqlFormat(createTableSql,[tableName]);


    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(checkChatExist, [client], (tx, results) => {
                if(results.rows.length){
                    //如果当前聊天对象在数据库中存在有数据
                    //添加数据进数据库

                    updateChat(conetnt,time,client,tx);

                    insertChatToSpecialRecode(insertChatToSpecialRecodeSqlSql,tx);

                }else{
                    //如果当前聊天是新的聊天对象
                    tx.executeSql(createTableSql, [], (tx, results) => {

                        console.log("create chat table success");

                        insertClientRecode(client,way,tx);

                        updateChat(conetnt,time,client,tx);

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

            if(chatType =="chatroom"){

                deleteClientChatList("ChatRoom_" + name, tx);
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

    let tableName = chatType=="chatroom"? "ChatRoom_"+client : "Private"+client;

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






CHATFMDB.getRangeMessages = function(account,way,range,callback){

    let tabName = way  == ChatWayEnum.Private?"Private_" + account:"ChatRoom_" + account;

    let querySql = sqls.ExcuteIMSql.QueryChatRecodeByClient;

    querySql = commonMethods.sqlFormat(querySql,[tabName,range.start,range.limit]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(querySql, [], (tx, results) => {

                if(results.rows.length > 0){

                    let messageIds = results.rows.raw();

                    let ids = [];
                    messageIds.forEach(function(item){
                        ids.push(item.messageId);
                    })

                    let selectMessages = sqls.ExcuteIMSql.GetMessagesInMessageTableByIds;

                    selectMessages = commonMethods.sqlQueueFormat(selectMessages,ids);

                    tx.executeSql(selectMessages, [], (tx, results) => {
                        callback(results.rows.raw());
                    }, errorDB);
                }else{
                    callback(null);
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
function updateChat(content,time,client,tx){

    let updateSql = sqls.ExcuteIMSql.UpdateChatLastContent;

    updateSql = commonMethods.sqlFormat(updateSql,[content,time,client]);

    tx.executeSql(updateSql, [], (tx, results) => {

        console.log("更改最近一条消息记录为");

    }, (err)=>{errorDB('为'+client+"在会话列表中更新了最新的聊天记录",err)
    });
}

//添加会话记录
function insertClientRecode(client,way,tx){
    let insertSql = sqls.ExcuteIMSql.InsertChatRecode;

    insertSql = commonMethods.sqlFormat(insertSql,[client,way]);

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

function getContentByMessage(message){
    let content = "";
    if(message.Resource != null && message.Resource.length > 0 && message.Resource.length < 2){
        switch (message.Resource[0].FileType){
            case ResourceTypeEnum.image:
                content = "[图片]";
                break;
            case ResourceTypeEnum.audio:
                content = "[音频]";
                break;
            case ResourceTypeEnum.video:
                content = "[视频]";
                break;
        }

    }else if(message.Resource == null){
        if(message.type == MessageType.information){
            content = "[通知]"
        }else {
            content = message.Data.Data.Data
        }
    }else{
        content = "[图片]";
    }

    return content;
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





