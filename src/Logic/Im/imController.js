import IM from '../../Core/Management/IM/index'
import User from '../../Core/Management/UserGroup/index'
import Chat from '../../Core/Management/Chat/index'
import ControllerChatConversationDto from './dto/ControllerChatConversationDto';
import ControllerMessageDto from  './dto/ControllerMessageDto';
import ManagementChatConversationDto from './dto/ManagementChatConversationDto';
import ManagementMessageDto from '../../Core/Management/Common/dto/ManagementMessageDto'
import getContentOfControllerMessageDto from '../../Core/Management/Chat/Common/methods/GetContentOfControllerMessageDto'

import IMMessageToMessagementMessageDto from '../../Core/Management/Common/methods/IMMessageToManagementMessageDto';

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());


//标示当前正在聊天的对象
let currentChat = undefined;
let myAccount = undefined;
let  cache = {messageCache:[],conversationCache:{}};
// [{ group: false,
// chatId: "",//chatId={account/groupId}
// sender: { account: "", name: "", HeadImageUrl: "" },//发送者
// messageId: "",//消息编号
// message: {data:"",time:""},//消息内容，
// type:enum,//消息类型
// status:enum,
// sendTime : ""},...]

let currentObj = undefined;
let updateconverslisthandle = undefined;
let updateChatRecordhandle = undefined;
let maxId = 0;
export default class IMController {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);
        this.im = new IM();
        this.user = new User();
        this.chat = new Chat();
        currentObj = this;
    }

    //param = { serverUrl: "", appId: 0, account: "", token: "",  deviceType: 0, deviceId: "", db: true,
    // "updateConverseList": function() { }, ----->chatRecordDto
    // "updateConverseTabnumber": function(){},
    // "onConnect":function(){},
    // "onDisconnect":function(){},
    // "onResetconnect":function(){},"other": function() { } } other是没有确定的其它回调方法, 可能是一个,也可能是多个，
    // App的回调方法

    //updateconverslisthandle = updateConverseList;

    init(param) {
        // 登录之后调用的init，他就是为了初始化IM management的socket，和注入的回调

        updateconverslisthandle = param.updateConverseList;
        this.updateConverseList()
    }

    //获取会话列表
    updateConverseList() {
        this.chat.getConverseList((recentListObj) => {
            let snapArr = formateDataFromChatManageCache(recentListObj);
            this.user.init(snapArr, (relationObj) => {
                let needObj = {};
                for (let key in relationObj) {
                    let itemChat = new ControllerChatConversationDto();
                    itemChat.group = recentListObj[key].group;
                    itemChat.chatId = recentListObj[key].chatId;
                    itemChat.lastSender = recentListObj[key].lastSender;
                    itemChat.lastMessage = recentListObj[key].lastMessage;
                    itemChat.unreadCount = recentListObj[key].unreadCount;
                    itemChat.name = relationObj[key].Nick;
                    itemChat.HeadImageUrl = relationObj[key].avator;
                    needObj[recentListObj[key].chatId] = itemChat;
                }
                cache.conversationCache = needObj;

                //渲染会话列表

                let tempArr = formatOjbToneedArr(cache.conversationCache);
                updateconverslisthandle(tempArr);
            })
        })


    }

    //设置当前会话
    setCurrentConverse(chatId, group, callback) {
        currentChat = {chatId,group}
        updateChatRecordhandle = callback;
        //未读消息清零
        if(cache.conversationCache[chatId]!=undefined&&cache.conversationCache[chatId]['unreadCount']>0){
            this.clearUnReadMsgNumber(chatId);
            this.chat.clearUnReadNumber(chatId, group);
            //渲染会话列表
            let tempArr = formatOjbToneedArr(cache.conversationCache);
            updateconverslisthandle(tempArr);
        }
        //初始化前10条聊天记录
        this.chat.getChatList(chatId, group, maxId, (messageList) => {

            if(messageList.length == 0){
                updateChatRecordhandle([]);
                return;
            }



            maxId = messageList[messageList.length - 1].id;

            let snapArr = formateDataFromChatManageCacheRecord(messageList);
            this.user.init(snapArr, (relationObj) => {
                for (let i = 0, length = messageList.length; i < length; i++) {
                    let itemMessage = new ControllerMessageDto();
                    itemMessage.group = messageList[i].group;
                    itemMessage.chatId = messageList[i].chatId;
                    itemMessage.message = messageList[i].message;
                    itemMessage.type = messageList[i].type;
                    itemMessage.status = messageList[i].status;
                    itemMessage.sendTime = messageList[i].sendTime;

                    let {RelationId, Nick, avator} = relationObj[messageList[i].sender];
                    itemMessage.sender = {account: RelationId, name: Nick, HeadImageUrl: avator};
                    cache.messageCache.push(itemMessage);
                }
                //渲染聊天记录
                updateChatRecordhandle(cache.messageCache);
            })
        })


    }
    //退出聊天窗口
    setOutCurrentConverse(){
        currentChat = {};
        cache.messageCache = [];
        maxId = 0;
    }
    //获取历史聊天记录
    getHistoryChatList(chatId, group){
        //messageList 每个item 拿上来就是ManagementMessageDto
        this.chat.getChatList(chatId, group = false, maxId, (messageList) => {

        if(messageList.length == 0){
            return;
        }

        maxId = messageList[messageList.length - 1].id;
        let snapArr = formateDataFromChatManageCacheRecord(messageList);
        this.user.init(snapArr, (relationObj) => {
            for (let i = 0, length = messageList.length; i < length; i++) {
                let itemMessage = new ControllerMessageDto();
                itemMessage.group = messageList[i].group;
                itemMessage.chatId = messageList[i].chatId;
                itemMessage.message = messageList[i].message;
                itemMessage.type = messageList[i].type;
                itemMessage.status = messageList[i].status;
                itemMessage.sendTime = messageList[i].sendTime;

                let {RelationId, Nick, avator} = relationObj[messageList[i].sender];
                itemMessage.sender = {account: RelationId, name: Nick, HeadImageUrl: avator};
                cache.messageCache.push(itemMessage);
            }
            //渲染聊天记录
            updateChatRecordhandle(cache.messageCache);

        })
     })


    }
    //发送消息
    // UI传过来的消息体
    // {group: false,
    //  chatId :  "",//chatId={account/groupId}
    //  sender :  "",//发送者
    //  message :  {data:"",time:""},//消息内容，
    //  type : enum,//消息类型
    //   }
    sendMessage(message){
        let itemManagementMessage = new ManagementMessageDto();
        itemManagementMessage.group = message.group;
        itemManagementMessage.chatId = message.chatId;
        itemManagementMessage.sender = message.sender;
        itemManagementMessage.message = message.message;
        itemManagementMessage.type = message.type;
        itemManagementMessage.sendTime = Date.now();
        this.im.addMessage(itemManagementMessage,(managementMessage)=>{
            //managementMessage是带有status和消息id的完整ManagementMessageDto
            this.chat.addMessage(message.chatId,managementMessage);

            //修改cache.conversationCache
            if(cache.conversationCache[managementMessage.chatId]!=undefined){
                this.updateOneChat(managementMessage.chatId,managementMessage);
            }else{
                this.addOneChat(managementMessage.chatId,managementMessage);
            }


            maxId = maxId+1;
            //cache添加
            this.user.getInformationByIdandType(message.sender,message.group,(relationObj) => {
                let itemMessage = new ControllerMessageDto();
                itemMessage.group = managementMessage.group;
                itemMessage.chatId = managementMessage.chatId;
                itemMessage.message = managementMessage.message;
                itemMessage.type = managementMessage.type;
                itemMessage.status = managementMessage.status;
                itemMessage.sendTime = managementMessage.sendTime;

                let {RelationId, Nick, avator} = relationObj;
                itemMessage.sender = {account: RelationId, name: Nick, HeadImageUrl: avator};

                cache.messageCache.push(itemMessage);

                //渲染聊天记录
                updateChatRecordhandle(cache.messageCache);
            })
        },onprogress);



    }

    //删除消息
    removeMessage(messageId){

        //如果删除的是最后一条消息，还需要改变cache.conversationCache[chatId]
        if(cache.messageCache[cache.messageCache.length-1].messageId == messageId){
            if(cache.messageCache.length == 1){
                let recentObj = cache.conversationCache[currentChat.chatId];
                recentObj.lastSender = '';
                recentObj.lastMessage = '';
                recentObj.lastTime = '';
            }else{
                this.updateOneChat(currentChat.chatId,cache.messageCache[cache.messageCache.length-2])
            }
        }
        maxId = maxId-1;
        //cache.messageCache删除
        deleteItemFromCacheByMessageId(cache.messageCache,messageId);
        //渲染聊天记录
        updateChatRecordhandle(cache.messageCache);

        this.chat.deleteChat(1,currentChat.chatId,currentChat.group,messageId);
    }

    //删除会话
    removeConverse(chatId,group){
        delete cache.conversationCache[chatId];

        //渲染会话列表
        let tempArr = formatOjbToneedArr(cache.conversationCache);
        updateconverslisthandle(tempArr);
        this.chat.deleteChat(2,chatId,group);
    }

    //清除未读数, 在会话列表处功能(标记为已读)
    clearUnReadNumber(chatId, group){
        //清空对应item未读消息

        this.clearUnReadMsgNumber(chatId);
        this.chat.clearUnReadNumber(chatId, group);
    }
    //清除所有数据(清除缓存数据)
    clearAll(){
        cache = [];
    }



    //cache 操作方法
    //修改message的status状态或者 message资源文件路径,这里message是完整的controllerMessageDto
    updateMessageByChatIdAndMessage(message){
        let tempArr = cache.messageCache;
        for(let i=0,length = tempArr.length;i<length;i++){
            if(tempArr[i].messageId == message.messageId){
                tempArr[i] = message;
                break;
            }
        }

    }
    //修改一个会话
    updateOneChat(chatId,message){
        let recentObj = cache.conversationCache[chatId];
        recentObj.lastSender = message.sender;
        recentObj.lastMessage = getContentOfControllerMessageDto(message);
        recentObj.lastTime = message.sendTime;
        let tempArr = formatOjbToneedArr(cache.conversationCache);
        updateconverslisthandle(tempArr);
    }

    //message是完整的controllerMessageDto
    addOneChat(chatId,message){
        // let chatId;//会话id
        // if(message.group){
        //     chatId = message.chatId;
        // }else{
        //     if(message.sender.account == myAccount){
        //         chatId = message.message.chatId;
        //     }else{
        //         chatId = message.sender.account;
        //     }
        // }

        this.user.getInformationByIdandType(chatId,message.group,(relationObj) => {
            let itemChat = new ControllerChatConversationDto();
            itemChat.group = message.group;
            itemChat.chatId = chatId;
            itemChat.lastSender = message.sender.account;
            itemChat.lastMessage = getContentOfControllerMessageDto(message);
            itemChat.lastTime = message.sendTime;
            let {Nick, avator} = relationObj;
            itemChat.name = Nick;
            itemChat.HeadImageUrl = avator;
            cache.conversationCache[chatId] = itemChat;
            let tempArr = formatOjbToneedArr(cache.conversationCache);
            updateconverslisthandle(tempArr);
        })
    }
    //未读消息+1
    addUnReadMsgNumber(clientId){
        cache.conversationCache[clientId]['unreadCount'] +=1;
    }
    //未读消息清0
    clearUnReadMsgNumber(clientId){
        if(cache.conversationCache[clientId] == undefined) return;
        cache.conversationCache[clientId]['unreadCount'] = 0;
    }

    clearAllUnReadMsgNumber(){
        for(let item in cache.conversationCache){
            cache.conversationCache[item]['unReadMessageCount'] = 0;
        }
    }




}


//message 消息体 协议
function receivemessage(message){

    //1 把message协议 转换成chatmanager的dto 存放到 chatmanager 的db中
    let managementMessageObj = IMMessageToMessagementMessageDto(message);
    this.chat.addMessage(managementMessageObj.chatId,managementMessageObj)
    //2 把dto + usermanagment 的dto 构建成 IMcontoller的 dto 返回给界面

    let chatId;
    if(!managementMessageObj.group){
        chatId = managementMessageObj.sender;
    }else{
        chatId = managementMessageObj.chatId;
    }
    //修改或增加会话缓存
    if(cache.conversationCache[chatId]!=undefined){
        currentObj.updateOneChat(chatId,managementMessageObj)
    }else{
        currentObj.addOneChat(chatId,managementMessageObj);
    }


    //只有打开了聊天窗口并且收到来自该窗口的消息才会重新渲染聊天页面
    if(chatId == currentChat.chatId){
        maxId = maxId+1;
        //cache添加
        currentObj.user.getInformationByIdandType(managementMessageObj.sender,managementMessageObj.group,(relationObj) => {
            let itemMessage = new ControllerMessageDto();
            itemMessage.group = managementMessageObj.group;
            itemMessage.chatId = managementMessageObj.chatId;
            itemMessage.message = managementMessageObj.message;
            itemMessage.type = managementMessageObj.type;
            itemMessage.status = managementMessageObj.status;
            itemMessage.sendTime = managementMessageObj.sendTime;

            let {RelationId, Nick, avator} = relationObj;
            itemMessage.sender = {account: RelationId, name: Nick, HeadImageUrl: avator};

            cache.messageCache.push(itemMessage);
            //渲染聊天记录
            updateChatRecordhandle(cache.messageCache);
        })
    }else{
        currentObj.addUnReadMsgNumber(chatId);
    }



    //处理完成

    //[]

}



//私有方法
//ChatManageCache --->[{chatId:'',group:false},{}]
function formateDataFromChatManageCache(ChatManageCacheObj){
    let needArr = [];
    for(let key in ChatManageCacheObj){
        let obj = {};
        obj['chatId'] = key;
        obj['group'] = ChatManageCacheObj[key]['group'];
        needArr.push(obj);
    }
    return needArr;
}
//ChatManageCache的record消息数组--->[{chatId:'',group:false},{}]
function formateDataFromChatManageCacheRecord(ChatManageCacheRecordArr){
    let needArr = ChatManageCacheRecordArr.map((v,i)=>{
        let obj = {};
        obj['chatId'] = v['sender'];
        obj['group'] = v['group'];
        return obj;
    })
    return needArr;
}
//从cache删除指定id的message
function deleteItemFromCacheByMessageId(cache,messageId){
    let index;
    for(let i = 0,length = cache.length;i<length;i++){
        if(cache[i].messageId == messageId){
            index = i;
            break
        }
    }
    cache.splice(index,1);
    return cache;
}
//coversation对象转为ui所需数组
function formatOjbToneedArr(obj){
    let needArr = [];
    for(let key in obj){
        needArr.push(obj[key]);
    }
    return needArr;
}