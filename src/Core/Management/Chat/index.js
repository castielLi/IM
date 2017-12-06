/**
 * Created by apple on 2017/7/26.
 */

import * as storeSqlite from './StoreSqlite/index'
import RecentRecordDto from './Common/dto/RecentRecordDto';
import InitChatRecordConfig from './Common/dto/InitChatRecordConfig';
import DeleteChatEnum from './Common/dto/DeleteChatEnum'
import ClearUnReadEnum from './Common/dto/ClearUnReadEnum'
import existIdInArray from './Common/methods/existIdInArray';
import formatArrToObjById from './Common/methods/formatArrToObjById';
import getContentOfControllerMessageDto from './Common/methods/GetContentOfControllerMessageDto'
import ChatWayEnum from '../Common/dto/ChatWayEnum'
import ManagementChatRecordDto from './Common/dto/ManagementChatRecordDto'
let currentObj = undefined;

//会话缓存
//格式 []
let ChatCache = {}
// var ManagementchatRecordDto={
//     group: false,
//     chatId: "",//chatId={account/groupId}
//     lastSender: null,
//     lastMessage: "",
//     lastTime: null,
//     unreadCount: 0, //未读条数
// }



// var ManagementMessageDto={
//     group: false,
//     chatId: "",//chatId={account/groupId},
//     id:0 ,//自增
//     sender: "" ,//"wg003722"
//     messageId: "",//消息编号
//     message: {data:"",time:""},//消息内容，
//     type:enum，//消息类型
// status:enum，
// sendTime : ""
// }



let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

export default class Chat {
    constructor(){
        if (__instance()) return __instance();

        __instance(this);

        currentObj = this;
    }







    //获取所有聊天会话列表，只有每次登陆后才会获取所有列表
    getConverseList(callback){
        currentObj.getRecentChatList((results)=>{
            let records = [];
            for(let item in results){
                let record = new ManagementChatRecordDto();
                record.group = results[item].Type == ChatWayEnum.Group?true:false;
                record.chatId = results[item].ChatId;
                record.lastMessage = results[item].LastMessage;
                record.lastSender = results[item].LastSender;
                record.lastTime = results[item].Time;
                record.unreadCount = results[item].unReadMessageCount;
                record.Record = [];
                records.push(record);
            }

            let cache = formatArrToObjById(records);
            callback(cache);
            ChatCache = cache;
        });
    }
    //初始化聊天记录,打开一个聊天窗口的时候
    getChatList(chatId, group = false, length, callback){
        if(ChatCache[chatId] == undefined){
            callback([])
        }else{
            if(ChatCache[chatId]['Record'].length == 0 || ChatCache[chatId]['Record'].length < length - InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
                currentObj.getRecentChatRecode(chatId,group,{start:length,limit:InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER},(results)=>{
                    let messages = ChatCache[chatId]['Record'];
                    messages = results.reduce(function(prev, curr){ prev.push(curr); return prev; },messages);
                    ChatCache[chatId]['Record'] = messages;
                    callback(messages);
                });
            }else{
                callback(ChatCache[chatId]['Record']);
            }
        }
    }


    deleteChat(deleteType,chatId,group = false,messageId=""){
        switch(deleteType){
            //删除单条消息
            case DeleteChatEnum.UniqueMessage:
                if(existIdInArray(ChatCache[chatId]['Record'],messageId)){
                    let index = ChatCache[chatId]['Record'].indexOf(messageId);
                    ChatCache[chatId]['Record'].splice(index,1)
                }
                currentObj.deleteMessage({"MSGID":messageId},group,chatId);
                break;
            //删除该用户最近消息和聊天记录
            case DeleteChatEnum.WholeMessages:
                delete ChatCache[chatId];
                currentObj.deleteCurrentChatMessage(chatId,group);
                break;
        }
    }


    clearUnRead(clearType,chatId="",group=false){
       switch (clearType){
           case ClearUnReadEnum.All:
               this.clearAllUnReadMsgNumber()
               break;
           case ClearUnReadEnum.Unique:
               this.clearUnReadMsgNumber(chatId)
               break;
       }
    }


    addMessage(chatId,message,callback){
       if(ChatCache[chatId] != undefined){
           currentObj.updateOneChat(chatId,message);
       }else{
           //缓存中添加
           currentObj.addOneChat(chatId,message);
       }
    }


    updateMessage(chatId,message,callback){
        this.updateMessageByChatIdAndMessage(chatId,message);
    }

    //关闭数据库
    closeDB(){
        currentObj.closeDB();
    }










    //修改message的status状态或者 message资源文件路径
    updateMessageByChatIdAndMessage(chat,message){
        let recentObj = ChatCache[chatId];
        let messages = recentObj.Record;
        for(let item in messages){
            if(messages[item].messageId == message.messageId){
                messages[item] = message;
                break;
            }
        }
    }

    updateOneChat(chatId,message){
       let recentObj = ChatCache[chatId];
        recentObj.Type = message.group?ChatWayEnum.Group:ChatWayEnum.Private;
        recentObj.LastMessage = getContentOfControllerMessageDto(message);
        recentObj.Time = message.sendTime;
        recentObj.Record.unshift(message);
    }

    //添加一个会话
    addOneChat(chatId,message){
        let recentObj = new RecentRecordDto();
        recentObj.Client = chatId;
        recentObj.Type = message.group?ChatWayEnum.Group:ChatWayEnum.Private;
        recentObj.LastMessage = getContentOfControllerMessageDto(message);
        recentObj.Time = message.sendTime;
        recentObj.Record.unshift(message);
        ChatCache[chatId] = recentObj;
    }
    //未读消息+1
    addUnReadMsgNumber(clientId,callback){
        ChatCache[clientId]['unReadMessageCount'] +=1;
        currentObj.addChatUnReadMessageaNumber(clientId);
    }
    //未读消息清0
    clearUnReadMsgNumber(clientId){
        if(ChatCache[clientId] == undefined) return;
        ChatCache[clientId]['unReadMessageCount'] = 0;
        currentObj.updateUnReadMessageNumber(clientId,0);
    }

    clearAllUnReadMsgNumber(){
        for(let item in ChatCache){
            ChatCache[item]['unReadMessageCount'] = 0;
            currentObj.updateUnReadMessageNumber(item,0);
        }
    }






    //初始化Chat数据库
    initChatDatabase(AccountId){
        storeSqlite.initIMDatabase(AccountId,function(){
            //获取之前没有发送出去的消息重新加入消息队列
        });
    }

    addMessage(message){
        storeSqlite.storeMessage(message)
    }

    //获取聊天列表
    getRecentChatList(callback){
        storeSqlite.getChatList(callback);
    }


    //删除当前聊天所有消息
    deleteCurrentChatMessage(name,group){

        let chatType = group?"chatroom":"private";

        //删除该用户聊天列表中的消息
        storeSqlite.deleteClientRecode(name,chatType);

        //删除最近聊天表中的记录
        storeSqlite.deleteChatRecode(name);
    }


    //删除当条消息
    deleteMessage(message,group,client){
        let chatType = group?"chatroom":"private";
        storeSqlite.deleteMessage(message,chatType,client);
    }

    //修改某client的未读消息数量
    updateUnReadMessageNumber(name,number){
        storeSqlite.updateUnReadMessageNumber(name,number)
    }
    //某client的未读消息数量加一
    addChatUnReadMessageaNumber(name){
        storeSqlite.addChatUnReadMessageNumber(name)
    }
    //获取当前用户或者群组的聊天记录
    getRecentChatRecode(account,group,range = {start:0,limit:InitChatRecordConfig.INIT_CHAT_REDUX_NUMBER},callback){
        let way = group?ChatWayEnum.Group:ChatWayEnum.Private;
        storeSqlite.queryRecentMessage(account,way,range,callback);
    }

    //关闭数据库
    closeDB(){
        storeSqlite.closeImDb();
    }





}




//私有方法





