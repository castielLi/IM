/**
 * Created by apple on 2017/7/26.
 */

import * as storeSqlite from './StoreSqlite/index'
import RecentRecordDtoDto from './dto/RecentRecordDto';
import InitChatRecordConfig from './dto/InitChatRecordConfig';
import DeleteChatEnum from './dto/DeleteChatEnum'

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
    //初始化聊天记录,打开一个聊天窗口的时候
    getChatRecord(clientId,type,callback){
        if(ChatCache[clientId] == undefined){
            callback([])
        }else{
            if(ChatCache[clientId]['Record'].length == 0){
                currentObj.getRecentChatRecode(clientId,type,{start:0,limit:InitChatRecordConfig.INIT_CHAT_REDUX_NUMBER},(results)=>{
                    //返回messageId组成的数组
                    callback(deepCopy(results));
                    ChatCache[clientId]['Record'] = results;
                });
            }else{
                callback(deepCopy(ChatCache[clientId]['Record']));
            }
        }
    }
    //updateType修改类型，'send','receive','unread'，若为'unread'，参数message为undefined
    upDateChatCache(updateType,currentChat,message,callback){
        switch(updateType){
            case 'send':
                let clientId = message.Data.Data.Receiver;
                if(ChatCache[clientId]==undefined){//没有该会话
                    //新增一个会话
                    currentObj.addOneChat(clientId,message,(results)=>{
                        currentObj.getChatRecord(clientId,message.way,(ids)=>{
                            callback(ids,results);
                        })
                    })
                }else{
                    currentObj.updateLastMessageAndTime(clientId,extractMessage(message),message.Data.LocalTime,messageId,(results)=>{
                        currentObj.getChatRecord(clientId,message.way,(ids)=>{
                            callback(ids,results);
                        })
                    })
                }
                break;
            case 'receive':
                let clientId = message.Data.Data.Sender;
                if(clientId == currentChat){
                    currentObj.updateLastMessageAndTime(clientId,message,(results)=>{
                        //重新渲染聊天记录
                        currentObj.getChatRecord(clientId,message.way,(ids)=>{
                            callback(ids,results);
                        })
                    })
                }else{
                    //新增一个会话
                    currentObj.addOneChat(clientId,message,extractMessage(message),message.MSGID,()=>{
                        //未读消息+1
                        currentObj.addUnReadMsgNumber(clientId,(results)=>{
                            //重新渲染聊天记录
                            currentObj.getChatRecord(clientId,message.way,(ids)=>{
                                callback(ids,results);
                            })
                        })
                    })
                }
                break;
            case 'unread':
                currentObj.clearUnReadMsgNumber(currentChat,(results)=>{
                    callback(results)
                });
                break;
        }

    }

    //lizongjun
    AddChat(message,isCurrent,name,Type,isSend){
        if(ChatCache[name]){
            let records = ChatCache[name]["Record"];
            for(let item in records){
                if(records[item] == message.MSGID){
                    return;
                }
            }
            records.push[message.MSGID];
            addSqliteRecordInCondition(name,message,isCurrent,isSend);
        }else{
            let record = [];
            record.push(message.MSGID);
            let unread = isCurrent?0:1;
            ChatCache[name] = {"Client":name,"LastMessage":extractMessage(message),"Time":message.Data.LocalTime,"Type":Type,
                "unReadMessageCount":unread,"Record":record};
            addSqliteRecordInCondition(name,message,isCurrent,isSend)
        }
    }

    DeleteChat(deleteType,name,MSGID,chatType){
        switch(deleteType){
            case DeleteChatEnum.UniqueMessage:
                currentObj.deleteMessage({"MSGID":MSGID},chatType,name);
                break;
            case DeleteChatEnum.WholeMessages:
                currentObj.deleteCurrentChatMessage(name,chatType);
                break;
        }
    }









    //删除一个会话
    deleteOneChat(clientId,type,callback){
        delete ChatCache[clientId];
        callback(deepCopy(ChatCache));
        //删除chatRecord表中对应记录
        this.deleteCurrentChatMessage(clientId,type)

    }
    //添加一个会话
    addOneChat(clientId,message,callback){
        let recentObj = new RecentRecordDtoDto();
        recentObj.Client = clientId;
        recentObj.Type = message.way;
        recentObj.LastMessage = extractMessage(message);
        recentObj.Time = message.Data.LocalTime;
        recentObj.Record.unshift(message.MSGID);
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
        if(ChatCache[clientId] == undefined) return;
        ChatCache[clientId]['unReadMessageCount'] = 0;
        callback(deepCopy(ChatCache))
        currentObj.updateUnReadMessageNumber(clientId,0);
    }
    //收到或者发送消息,要修改最后一条消息内容
    updateLastMessageAndTime(clientId,message,callback){
        ChatCache[clientId].LastMessage = extractMessage(message);
        ChatCache[clientId].Time = message.Data.LocalTime;
        let needLength = ChatCache[clientId].Record.length;
        if(needLength>=InitChatRecordConfig.INIT_CHAT_REDUX_NUMBER){
            ChatCache[clientId].Record.pop();
        }
        ChatCache[clientId].Record.unshift(message.MSGID);
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
        //删除该用户聊天列表中的消息
        storeSqlite.deleteClientRecode(name,chatType);

        //删除最近聊天表中的记录
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

function addSqliteRecordInCondition(name,message,isCurrent,isSend){
    if(isSend){
        currentObj.sendMessage(message);
    }else{
        currentObj.receiveMessage(message);
    }

    if(!isCurrent){
        currentObj.addChatUnReadMessageaNumber(name);
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

//消息提取
function extractMessage(message){
    switch (message.type) {
        case 'text':
            return message.Data.Data.Data;
        case 'image':
            return '[图片]';
        case 'audio':
            return '[音频]';
        case 'video':
            return '[视频]';
        case 'information':
            return '[通知]'
        // return message.Data.Data.Data
        default:
            return '';
    }
}