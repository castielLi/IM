/**
 * Created by apple on 2017/7/26.
 */

import * as storeSqlite from './StoreSqlite/index'
import RecentRecordDtoDto from './dto/RecentRecordDto';
import InitChatRecordConfig from './dto/InitChatRecordConfig';

let currentObj = undefined;

//会话缓存
//格式 []
let ChatCache = {}
// let ChatCache = {
//     'wg003722':{
//         Client: "wg003722",
//         LastMessage: "4444",
//         Time: "1511925305221",
//         Type: "private",
//         unReadMessageCount: 0,
//         Record:[msgId1,msgId2...]},
//     }


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
    getAllChatList(callback){
        currentObj.getChatList((results)=>{
            let cache = formatArrToObjById(results);
            callback(deepCopy(cache));
            ChatCache = cache;
        });
    }
    //获取单个会话聊天记录,打开一个聊天窗口的时候
    getOneChat(clientId,type,callback){
        if(ChatCache[clientId] == undefined){
            callback([])
        }else{
            if(ChatCache[clientId]['Record'].length < InitChatRecordConfig.INIT_CHAT_REDUX_NUMBER){
                let needLength = InitChatRecordConfig.INIT_CHAT_REDUX_NUMBER - ChatCache[clientId]['Record'].length;
                currentObj.getRecentChatRecode(clientId,type,{start:0,limit:needLength},(results)=>{
                    callback(deepCopy(results));
                    ChatCache[clientId]['Record'] = results;
                });
            }else{
                callback(deepCopy(ChatCache[clientId]['Record']));
            }
        }
    }
    //删除一个会话
    deleteOneChat(clientId,type,callback){
        delete ChatCache[clientId];
        callback(deepCopy(ChatCache));
        //删除chatRecord表中对应记录
        this.deleteChatRecode(clientId);
        //删除与该client的所有聊天记录
        this.deleteCurrentChatMessage(clientId,type)
    }
    //添加一个会话
    addOneChat(clientId,newChatObj,messageId,callback){
        let recentObj = new RecentRecordDtoDto();
        recentObj.Client = newChatObj.Data.Data.Receiver;
        recentObj.LastMessage = newChatObj.Data.Data.Data;
        recentObj.Time = newChatObj.Data.LocalTime;
        recentObj.Record.unshift(messageId);
        ChatCache[clientId] = recentObj;
        callback(deepCopy(ChatCache))
    }
    //未读消息+1
    addUnReadMsgNumber(clientId,callback){
        ChatCache[clientId]['unReadMessageCount'] +=1;
        callback(deepCopy(ChatCache))
        currentObj.addChatUnReadMessageaNumber(clientId);
    }
    //未读消息清0
    clearUnReadMsgNumber(clientId,callback){
        ChatCache[clientId]['unReadMessageCount'] = 0;
        callback(deepCopy(ChatCache))
        currentObj.updateUnReadMessageNumber(clientId,0);
    }
    //收到或者发送消息,要修改最后一条消息内容
    updateLastMessageAndTime(clientId,messageContent,time,messageId){
        ChatCache[clientId].LastMessage = messageContent;
        ChatCache[clientId].Time = time;
        let needLength = ChatCache[clientId].Record.length;
        if(needLength>=InitChatRecordConfig.INIT_CHAT_REDUX_NUMBER){
            ChatCache[clientId].Record.pop();
        }
        ChatCache[clientId].Record.unshift(messageId);
        callback(deepCopy(ChatCache));
    }





    //初始化Chat数据库
    initChatDatabase(AccountId){
        storeSqlite.initIMDatabase(AccountId,function(){
            //获取之前没有发送出去的消息重新加入消息队列
        });
    }

    sendMessage(message){
        storeSqlite.storeSendMessage(message)
    }

    receiveMessage(message,callback){
        storeSqlite.storeRecMessage(message,callback)
    }

    //获取聊天列表
    getChatList(callback){
        storeSqlite.getChatList(callback);
    }
    //删除当前聊天所有消息
    deleteCurrentChatMessage(name,chatType){
        storeSqlite.deleteClientRecode(name,chatType);
    }

    //删除ChatRecode中某条记录
    deleteChatRecode(name){
        storeSqlite.deleteChatRecode(name);
    }
    //删除当条消息
    deleteMessage(message,chatType,client){
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
    getRecentChatRecode(account,way,range = {start:0,limit:InitChatRecordConfig.INIT_CHAT_REDUX_NUMBER},callback){
        storeSqlite.queryRecentMessage(account,way,range,callback);
    }

    //关闭数据库
    closeDB(){
        storeSqlite.closeImDb();
    }


}

//私有方法
//数组转对象
function formatArrToObjById(arr){
    return arr.reduce((o, m, i) => { //(previousValue, currentValue, currentIndex, array1)

                o[m.Client] = {
                    ...m,
                    Record:[]
                };
                return o;
            }, {})
}
//深拷贝方法
function deepCopy(obj){
    return JSON.parse(JSON.stringify(obj))
}