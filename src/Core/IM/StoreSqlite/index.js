/**
 * Created by apple on 2017/8/9.
 */
import { Platform, StyleSheet } from 'react-native';
let SQLite = require('react-native-sqlite-storage')
import * as sqls from './IMExcuteSql'
import * as commonMethods from '../../Helper/formatQuerySql'
import ChatWayEnum from '../dto/ChatWayEnum'
import ResourceTypeEnum from '../dto/ResourceTypeEnum'
import ChatCommandEnum from '../dto/ChatCommandEnum'
import RNFS from 'react-native-fs';
import MessageType from '../dto/MessageType';

export function storeSendMessage(message){

    // if(message.type != "friend") {
        IMFMDB.InsertMessageWithCondition(message, message.Data.Data.Receiver)
    //申请好友消息不需要存数据库
    // }else{
    //     IMFMDB.InsertFriendMessage(message);
    // }
}

export function storeRecMessage(message){

    if(message.type != "friend") {
        IMFMDB.InsertMessageWithCondition(message,message.Data.Data.Sender)
    }else{
        IMFMDB.InsertFriendMessage(message);
    }
}

export function deleteClientRecode(name,chatType){
    IMFMDB.DeleteChatByClientId(name,chatType);
}

export function deleteMessage(message,chatType,client){
    IMFMDB.DeleteChatMessage(message,chatType,client);
}
//删除ChatRecode中某条记录
export function deleteChatRecode(name){
    IMFMDB.DeleteClientRecodeByName(name);
}
//修改某client的未读消息数量
export function updateUnReadMessageNumber(name,number){
    IMFMDB.updateUnReadMessageNumber(name,number);
}
export function InsertResource(messageId,localPath){
    IMFMDB.InsertResource(messageId,localPath);
}

export function DeleteResource(messageId,localPath){
   IMFMDB.DeleteResource(messageId,localPath);
}

//向消息列表中添加消息
export function addMessageToSendSqlite(message){
    IMFMDB.addSendMessage(message);
}

//删除消息列表中的message记录
export function popMessageInSendSqlite(messageId){
    IMFMDB.popMessageInSendMessageSqlite(messageId);
}

//获取所有消息列表中的消息记录
export function getAllCurrentSendMessage(callback){
    return IMFMDB.getAllCurrentSendMessages(callback)
}

//修改发送队列中的消息状态
export function updateSendMessageStatus(message) {
    IMFMDB.UpdateSendMessageStatues(message)
}
//修改消息列表中的消息状态
export function updateMessageStatus(message){
    IMFMDB.UpdateMessageStatues(message)
}

//获取range范围的消息
export function queryRecentMessage(account,way,range,callback){
    IMFMDB.getRangeMessages(account,way,range,callback)
}

export function getChatList(callback){
    IMFMDB.getAllChatClientList(callback)
}

export function getAllApplyFriendMessage(callback){
    IMFMDB.GetFriendMessage(callback);
}

export function updateApplyFriendMessage(message){
    IMFMDB.UpdateFriendMessage(message)
}

var databaseObj = {
    name :"IM.db",
}
if(Platform.OS === 'ios'){
    databaseObj.createFromLocation='1'
    databaseObj.location = "Documents"
}


export function initIMDatabase(AccountId,callback){
    if(Platform.OS === 'ios'){
        databaseObj.name =  AccountId + "/database/IM.db"
    }

    RNFS.mkdir(RNFS.DocumentDirectoryPath+"/"+AccountId+"/database",{
        NSURLIsExcludedFromBackupKey:true
    }).then((success) => {
        console.log('Create directory success!');
    })
        .catch((err) => {
            console.log(err.message);
        });

    IMFMDB.initIMDataBase(AccountId,callback);
}

export function closeImDb(){
    IMFMDB.closeImDb()
}

let IMFMDB = {};
IMFMDB.initIMDataBase = function(AccountId,callback){


    var db = SQLite.openDatabase({
        ...databaseObj

    }, () => {
        db.transaction((tx) => {
            for (key in sqls.InitIMTable) {
                let sql = sqls.InitIMTable[key];
                tx.executeSql(sql, [], (tx, results) => {
                    console.log('create IM database success');
                    callback();
                }, (err)=>{errorDB('创建数据表',err)});
            }
        });
    }, (err)=>{errorDB('初始化数据库',err)});
}

//todo：想办法进行批量操作
IMFMDB.InsertMessageWithCondition = function(message,client){

    let checkChatExist = sqls.ExcuteIMSql.QueryChatIsExist;

    let way;

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(checkChatExist, [client], (tx, results) => {
                if(results.rows.length){
                    //如果当前聊天对象在数据库中存在有数据
                    //添加数据进数据库

                    let tableName;
                    if(message.way != "") {
                        tableName = message.way == ChatWayEnum.Private ? "Private_" + client : "ChatRoom_" + client;
                    }else{
                        tableName = message.Data.Command == ChatCommandEnum.MSG_BODY_CHAT_C2C ?"Private_" + client : "ChatRoom_" + client;
                    }

                    let conetnt = getContentByMessage(message);
                    let time = message.Data.LocalTime;

                    updateChat(conetnt,time,client,tx);

                    insertChat(message,tx);

                    insertChatToSpecialRecode(message,tableName,tx);

                }else{
                    //如果当前聊天是新的聊天对象
                    let createTableSql = sqls.ExcuteIMSql.CreateChatTable;

                    let tableName;
                    if(message.way != "") {
                        tableName = message.way == ChatWayEnum.Private ? "Private_" + client : "ChatRoom_" + client;
                    }else{
                        tableName = message.Data.Command == ChatCommandEnum.MSG_BODY_CHAT_C2C ?"Private_" + client : "ChatRoom_" + client;
                    }


                    createTableSql = commonMethods.sqlFormat(createTableSql,[tableName]);

                    tx.executeSql(createTableSql, [], (tx, results) => {

                        console.log("create chat table success");

                        //添加数据进数据库

                        let conetnt = getContentByMessage(message);
                        let time = message.Data.LocalTime;

                        insertClientRecode(client,message.way,tx);
                        updateChat(conetnt,time,client,tx);



                        insertChat(message,tx);

                        insertChatToSpecialRecode(message,tableName,tx);

                        // insertIndexForTable(tableName,tx);

                    }, (err)=>{errorDB('创建新聊天对象表',err)});
                }
            }, (err)=>{errorDB('查询所有聊天对象',err)});

        });
    }, (err)=>{errorDB('初始化数据库',err)});
}

//添加申请好友和收到好友申请的消息
IMFMDB.InsertFriendMessage = function(message){
    let insertSql = sqls.ExcuteIMSql.AddNewMessageToApplyFriend;

    let status = 'wait';
    let time = new Date().getTime();
    let {comment , key, nick, avator} = message.Data.Data.Data;
    insertSql = commonMethods.sqlFormat(insertSql,[message.Data.Data.Sender,message.Data.Data.Receiver,status,comment,time,key,nick,avator])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {
            tx.executeSql(insertSql, [], (tx, results) => {
               console.log("添加好友申请消息成功");
            }, (err)=>{errorDB('添加好友申请消息',err)});
        });
    }, errorDB);
}

//获取所有好友申请表中的数据
IMFMDB.GetFriendMessage = function(callback){
    let querySql = sqls.ExcuteIMSql.QueryApplyFriend;

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {
            tx.executeSql(querySql, [], (tx, results) => {

                console.log(results)
                callback(results.rows.raw());

            }, (err)=>{errorDB('获取好友申请消息',err)});
        });
    }, errorDB);
}


//更新好友申请表
IMFMDB.UpdateFriendMessage = function(message){
    let updateSql = sqls.ExcuteIMSql.UpdateApplyFriend;

    updateSql = commonMethods.sqlFormat(updateSql,[message.status,message.key])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {
            tx.executeSql(updateSql, [], (tx, results) => {

                console.log("修改好友申请表成功")

            }, (err)=>{errorDB('修改好友申请消息',err)});
        });
    }, errorDB);
}


//删除当前用户的聊天记录
IMFMDB.DeleteChatByClientId = function(name,chatType){
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

//更新发送消息队列消息的状态
IMFMDB.UpdateSendMessageStatues = function(message){

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {
            let updateSql = "";


            updateSql = sqls.ExcuteIMSql.UpdateSendMessageStatusByMessageId;
            updateSql = commonMethods.sqlFormat(updateSql,[message.status,message.MSGID]);


            tx.executeSql(updateSql, [], (tx, results) => {
                console.log("update sendmessage sqlite " + message.MSGID + "is send statues:" + message.status);
            }, (err)=>{errorDB('更新消息状态',err)});

        });
    }, (err)=>{errorDB('初始化数据库',err)});
}

//更新消息状态
IMFMDB.UpdateMessageStatues = function(message){

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {
            let updateSql = "";

            updateSql = sqls.ExcuteIMSql.UpdateMessageStatusByMessageId;
            updateSql = commonMethods.sqlFormat(updateSql,[message.status,message.MSGID]);

            tx.executeSql(updateSql, [], (tx, results) => {
                console.log("update message sqlite " + message.MSGID + "is send statues:" + message.status);
            }, (err)=>{errorDB('更新消息状态',err)});

        });
    }, (err)=>{errorDB('初始化数据库',err)});
}


//删除聊天室聊天记录
IMFMDB.DeleteChatByChatRoomId = function(chatRoom){
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(sqls.ExcuteIMSql.QueryChatTypeFromChatList, [client], (tx, results) => {

                console.log(results);
                // chatList = results;
                if(results.rows.length) {

                    deleteClientRecode(chatRoom);
                    deleteClientChatList("ChatRoom_" + chatRoom);
                }
            }, errorDB);

        });
    }, errorDB);
}

//删除具体消息
IMFMDB.DeleteChatMessage = function(message,chatType,client){

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
IMFMDB.getAllChatClientList = function(callback){
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(sqls.ExcuteIMSql.GetChatList, [], (tx, results) => {

                console.log(results);
                callback(results.rows.raw());

            }, errorDB);

        });
    }, errorDB);
}

//添加发送失败的消息进数据库
IMFMDB.addSendMessage = function(message){


    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            let addSql = sqls.ExcuteIMSql.AddSendMessage;

            addSql = commonMethods.sqlFormat(addSql,[message.MSGID]);

            tx.executeSql(addSql, [], (tx, results) => {

                console.log("add current send message success");

            }, errorDB);

        });
    }, errorDB);


}

IMFMDB.popMessageInSendMessageSqlite = function(messageId){
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            let deleteSql = sqls.ExcuteIMSql.DeleteSendMessageByMessageId;

            deleteSql = commonMethods.sqlFormat(deleteSql,[messageId]);

            tx.executeSql(deleteSql, [], (tx, results) => {

                console.log("已经删除current send message")

            }, errorDB);

        });
    }, errorDB);
}

//获取所有发送失败的消息
IMFMDB.getAllCurrentSendMessages = function(callback){
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            let querySql = sqls.ExcuteIMSql.GetAllSendMessages;

            tx.executeSql(querySql, [], (tx, results) => {

                if(results.rows.length <= 0){
                    callback(null);
                }

                let messageIds = results.rows.raw();

                let ids = [];
                messageIds.forEach(function(item){
                    ids.push(item.messageId);
                })

                let selectFailMessageSql = sqls.ExcuteIMSql.GetMessagesInMessageTableByIds;

                selectFailMessageSql = commonMethods.sqlQueueFormat(selectFailMessageSql,ids);

                tx.executeSql(selectFailMessageSql, [], (tx, results) => {

                    callback(results.rows.raw());
                }, errorDB);

            }, errorDB);

        });
    }, errorDB);
}

IMFMDB.getRangeMessages = function(account,way,range,callback){

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            let tabName = way  == ChatWayEnum.Private?"Private_" + account:"ChatRoom_" + account;

            let querySql = sqls.ExcuteIMSql.QueryChatRecodeByClient;

            querySql = commonMethods.sqlFormat(querySql,[tabName,range.start,range.limit]);

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

IMFMDB.InsertResource = function(messageId,localPath){

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            let querySql = sqls.ExcuteIMSql.QueryMessageResourceExist;

            querySql = commonMethods.sqlFormat(querySql,[messageId,localPath]);

            tx.executeSql(querySql, [], (tx, results) => {

                if(results.rows.length <= 0){

                    let insertSql = sqls.ExcuteIMSql.InsertUploadFileRecode

                    insertSql = commonMethods.sqlFormat(insertSql,[messageId,localPath])

                    tx.executeSql(insertSql, [], (tx, results) => {

                        console.log("insert resource success")

                    }, errorDB);
                }

            }, errorDB);

        });

    }, errorDB);
}

IMFMDB.DeleteResource = function(messageId,localPath){

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            let deleteSql = sqls.ExcuteIMSql.DeleteUploadFileRecode;

            deleteSql = commonMethods.sqlFormat(deleteSql,[messageId,localPath]);


            tx.executeSql(deleteSql, [], (tx, results) => {

                console.log("delete resource success")

            }, errorDB);
        });

    }, errorDB);
}

IMFMDB.DeleteClientRecodeByName = function(name){

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            deleteClientRecodeByName(name,tx)

        });

    }, errorDB);
}

IMFMDB.updateUnReadMessageNumber = function(name,number){
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {
            updateUnReadMessage(name,number,tx)
        });

    }, (err)=>{errorDB('修改ChatRecorde数据表未读消息数量失败',err)});
}

IMFMDB.closeImDb = function(){
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.close();

    });
}

//添加消息进总消息表
function insertChat(message,tx){
    let insertSql = sqls.ExcuteIMSql.InsertMessageToRecode;

    let localPath = "";
    if(message.Resource!= null && message.Resource.length > 0) {
        for (let item in message.Resource) {
            localPath += message.Resource[item].LocalSource + ",";
        }
    }else{
        localPath = " ";
    }
    let sourceTime = " ";
    //音频视频才有时间
    if(message.type === 'audio'||message.type === 'video'){
        //默认一条消息只能有一条音频或者视频
        sourceTime = message.Resource[0].Time;
    }
    let url = " ";

    insertSql = commonMethods.sqlFormat(insertSql,[message.MSGID,message.Command,message.Data.Data.Sender,message.Data.Data.Receiver,message.Data.LocalTime,message.Data.Data.Data,message.type,localPath,sourceTime,url,message.status]);

    tx.executeSql(insertSql, [], (tx, results) => {

        console.log("insert meesage success");

    }, (err)=>{errorDB('向聊天对象插入详细聊天',err)});
}

//添加messageId到个人消息表
function insertChatToSpecialRecode(message,tableName,tx){
    let insertSql = sqls.ExcuteIMSql.InsertMessageToTalk;

    insertSql = commonMethods.sqlFormat(insertSql,[tableName,message.MSGID]);

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





