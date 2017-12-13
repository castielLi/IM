/**
 * Created by apple on 2017/8/9.
 */
import { Platform, StyleSheet } from 'react-native';
let SQLite = require('react-native-sqlite-storage')
import * as sqls from './IMExcuteSql'
import * as commonMethods from '../../../Helper/formatQuerySql'
import RNFS from 'react-native-fs';
import MessageStatus from '../../Common/dto/MessageStatus'
import MessageBodyTypeEnum from '../../Common/dto/MessageBodyTypeEnum'
import AppCommandEnum from '../../Common/dto/AppCommandEnum'

export function storeSendMessage(message){
    IMFMDB.InsertMessageWithCondition(message, message.Data.Data.Receiver)
}

export function storeRecMessage(message){

    if(message.Data.Command == MessageBodyTypeEnum.MSG_BODY_APP && message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_APPLYFRIEND) {
        IMFMDB.InsertFriendMessage(message);
    }else{
        message.status = MessageStatus.SendSuccess;
        IMFMDB.InsertMessageWithCondition(message,message.Data.Data.Sender)
    }
}

export function selectMessagesByIds(ids,callback) {
    IMFMDB.selectMessagesByIds(ids,callback);

}
//删除ChatRecode中某条记录


export function InsertResource(messageId,localPath){
    IMFMDB.InsertResource(messageId,localPath);
}

export function DeleteResource(messageId,localPath){
   IMFMDB.DeleteResource(messageId,localPath);
}

export function UpdateMessageContentByMSGID(content,MSGID){
    IMFMDB.getMessageById(messageId,function(results){
        if(results.length > 0){
            let message = JSON.parse(results[0]);
            message.Data.Data.Data = content;
            IMFMDB.updateMessageByMessageId(message);
        }
    })
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
//更改资源文件的本地路径
export function updateMessageLocalSource(messageId,url){

    IMFMDB.getMessageById(messageId,function(results){
        if(results.length > 0){
            let message = JSON.parse(results[0]);
            message.Resource[0].LocalSource = url;
            IMFMDB.updateMessageByMessageId(message);
        }
    })
}
//更改资源文件的远程路径
export function updateMessageRemoteSource(messageId,url){
    IMFMDB.getMessageById(messageId,function(results){
        if(results.length > 0){
            let message = JSON.parse(results[0]);
            message.Resource[0].RemoteSource = url;
            IMFMDB.updateMessageByMessageId(message);
        }
    })
}

//修改发送队列中的消息状态
export function updateSendMessageStatus(message) {
    IMFMDB.UpdateSendMessageStatues(message)
}
//修改消息列表中的消息状态
export function updateMessageStatus(message){
    IMFMDB.UpdateMessageStatues(message)
}

export function getMessagesByIds(Ids,callback){
    IMFMDB.getMessagesByIds(Ids,callback);
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

    let messageBody = JSON.stringify(message);

    let insertChatSql = sqls.ExcuteIMSql.InsertMessageToRecode;
    insertChatSql = commonMethods.sqlFormat(insertChatSql,[message.MSGID,messageBody,message.Data.LocalTime,message.status]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            insertChat(insertChatSql, tx);
        });

    }, (err)=>{errorDB('初始化数据库',err)});
}

IMFMDB.getMessageById = function(MSGID,callback){
    let querySql = sqls.ExcuteIMSql.GetMessageBodyById;

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {
            tx.executeSql(querySql, [], (tx, results) => {

                callback(results.rows.raw())

            }, (err)=>{errorDB('获取好友申请消息',err)});
        });
    }, errorDB);
}

IMFMDB.selectMessagesByIds = function(ids,callback){
    let selectMessages = sqls.ExcuteIMSql.GetMessagesInMessageTableByIds;
    selectMessages = commonMethods.sqlQueueFormat(selectMessages,ids);
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {
            tx.executeSql(selectMessages, [], (tx, results) => {
                callback(results.rows.raw());
                console.log("根据ids从IM批量获取message成功");
            }, (err)=>{errorDB('根据ids从IM批量获取message失败',err)});
        });
    }, errorDB);
}

//添加申请好友和收到好友申请的消息
IMFMDB.InsertFriendMessage = function(message){
    let insertSql = sqls.ExcuteIMSql.AddNewMessageToApplyFriend;

    let status = 'wait';
    let time = new Date().getTime();
    insertSql = commonMethods.sqlFormat(insertSql,[message.Data.Data.Sender,status,'',time,message.Data.Data.Data])

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


//更新发送消息队列消息的状态
IMFMDB.UpdateSendMessageStatues = function(message){

    let updateSql = sqls.ExcuteIMSql.UpdateSendMessageStatusByMessageId;
    updateSql = commonMethods.sqlFormat(updateSql,[message.status,message.MSGID]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(updateSql, [], (tx, results) => {
                console.log("update sendmessage sqlite " + message.MSGID + "is send statues:" + message.status);
            }, (err)=>{errorDB('更新消息状态',err)});

        });
    }, (err)=>{errorDB('初始化数据库',err)});
}

//更新消息状态
IMFMDB.UpdateMessageStatues = function(message){

    let MSGID = message.MSGID;
    let status = message.status;

    let updateSql = sqls.ExcuteIMSql.UpdateMessageStatusByMessageId;
    updateSql = commonMethods.sqlFormat(updateSql,[message.status,message.MSGID]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {


            tx.executeSql(updateSql, [], (tx, results) => {
                console.log("update message sqlite " + MSGID + "is send statues:" + status);
            }, (err)=>{errorDB('更新消息状态',err)});

        });
    }, (err)=>{errorDB('初始化数据库',err)});
}


//添加发送失败的消息进数据库
IMFMDB.addSendMessage = function(message){

    let addSql = sqls.ExcuteIMSql.AddSendMessage;

    addSql = commonMethods.sqlFormat(addSql,[message.MSGID]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(addSql, [], (tx, results) => {

                console.log("add current send message success");

            }, errorDB);

        });
    }, errorDB);


}

IMFMDB.popMessageInSendMessageSqlite = function(messageId){

    let deleteSql = sqls.ExcuteIMSql.DeleteSendMessageByMessageId;

    deleteSql = commonMethods.sqlFormat(deleteSql,[messageId]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

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

IMFMDB.getMessagesByIds = function(Ids,callback){

    let selectFailMessageSql = sqls.ExcuteIMSql.GetMessagesInMessageTableByIds;

    selectFailMessageSql = commonMethods.sqlQueueFormat(selectFailMessageSql,Ids);
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

            tx.executeSql(selectFailMessageSql, [], (tx, results) => {

                callback(results.rows.raw());
            }, errorDB);

        });
    }, errorDB);
}

IMFMDB.InsertResource = function(messageId,localPath){

    let querySql = sqls.ExcuteIMSql.QueryMessageResourceExist;

    querySql = commonMethods.sqlFormat(querySql,[messageId,localPath]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {
        db.transaction((tx) => {

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

    let deleteSql = sqls.ExcuteIMSql.DeleteUploadFileRecode;

    deleteSql = commonMethods.sqlFormat(deleteSql,[messageId,localPath]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {
            tx.executeSql(deleteSql, [], (tx, results) => {

                console.log("delete resource success")

            }, errorDB);
        });

    }, errorDB);
}

IMFMDB.updateMessageByMessageId = function(message){
    let sql = sqls.ExcuteIMSql.UpdateMessageByMessageId

    let messageBody = JSON.parse(message);

    sql = commonMethods.sqlFormat(sql,[messageBody,message.MSGID]);
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {

                console.log("修改消息内容成功");

            }, (err)=>{errorDB('修改消息内容',err)});
        });

    }, (err)=>{errorDB('修改消息内容',err)});
}

IMFMDB.closeImDb = function(){
    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.close();

    });
}

//添加消息进总消息表
function insertChat(insertSql,tx){

    tx.executeSql(insertSql, [], (tx, results) => {
        console.log("insert meesage success");

    }, (err)=>{errorDB('向聊天对象插入详细聊天',err)});
}

//添加messageId到个人消息表
function insertChatToSpecialRecode(insertSql,tx){


    tx.executeSql(insertSql, [], (tx, results) => {

        console.log("insert meesage success");

    }, (err)=>{errorDB('向聊天对象插入详细聊天',err)});
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




