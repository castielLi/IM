/**
 * Created by apple on 2017/7/26.
 */

import * as storeSqlite from './StoreSqlite'

let currentObj = undefined;

//会话缓存
//格式 []
let ChatCash = {}
// let ChatCash = {
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
            let cash = fomateArrToObjById(results);
            callback(cash);
            ChatCash = cash;
        });
    }
    //获取单个会话,打开一个聊天窗口的时候
    getOneChat(clientId,type,callback){
        if(ChatCash[clientId] == undefined){
            callback([])
        }else{
            if(ChatCash[clientId][Record].length == 0){
                currentObj.getRecentChatRecode(clientId,type,{start:0,limit:10},(results)=>{
                    callback(results);
                    ChatCash[clientId][Record] = results;
                });
            }else{
                callback(ChatCash[clientId][Record]);
            }
        }
    }
    //删除一个会话
    deleteOneChat(clientId,type,callback){
        delete ChatCash[clientId];
        callback(ChatCash);
        //删除chatRecord表中对应记录
        this.deleteChatRecode(clientId);
        //删除与该client的所有聊天记录
        this.deleteCurrentChatMessage(clientId,type)
    }
    //添加一个会话
    addOneChat(clientId,newChatObj,callback){
        ChatCash[clientId] = newChatObj;
        callback(ChatCash)
    }
    //未读消息+1
    addUnReadMsgNumber(clientId,callback){
        ChatCash[clientId][unReadMessageCount] +=1;
        callback(ChatCash)
        currentObj.addChatUnReadMessageaNumber(clientId);
    }
    //未读消息清0
    clearUnReadMsgNumber(clientId,callback){
        ChatCash[clientId][unReadMessageCount] = 0;
        callback(ChatCash)
        currentObj.updateUnReadMessageNumber(clientId,0);
    }
    //修改最后一条消息内容
    updateLastMessageAndTime(){
        
    }
    //初始化Chat数据库
    initIMDatabase(AccountId){
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
    getRecentChatRecode(account,way,range = {start:0,limit:10},callback){
        storeSqlite.queryRecentMessage(account,way,range,callback);
    }

    //关闭数据库
    closeImDb(){
        storeSqlite.closeImDb();
    }

}

//私有方法
//数组转对象
function fomateArrToObjById(arr){
    return arr.reduce((o, m, i) => { //(previousValue, currentValue, currentIndex, array1)

                o[m.Client] = {
                    ...m,
                    Record:[]
                };
                return o;
            }, {})
}
