import IM from '../../Core/Management/IM/index'
import User from '../../Core/Management/UserGroup/index'
import Chat from '../../Core/Management/Chat/index'
import ControllerChatConversationDto from './dto/ControllerChatConversationDto';
import ControllerMessageDto from  './dto/ControllerMessageDto';
import ManagementChatConversationDto from './dto/ManagementChatConversationDto';
import ManagementMessageDto from  './dto/ManagementMessageDto';



let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());


//标示当前正在聊天的对象
let currentChat = undefined
let  cache = [];
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

class IMController {
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
    }

    //获取会话列表
    updateConverseList() {
        this.chat.getConverseList((recentListObj) => {
            let snapArr = formateDataFromChatManageCache(recentListObj);
            this.user.GetBaseInfosByList(snapArr, (relationObj) => {
                let needArr = [];
                for (let key in relationObj) {
                    let itemChat = new ControllerChatConversationDto();
                    itemChat.group = recentListObj[key].group;
                    itemChat.chatId = recentListObj[key].chatId;
                    itemChat.lastSender = recentListObj[key].lastSender;
                    itemChat.lastMessage = recentListObj[key].lastMessage;
                    itemChat.unreadCount = recentListObj[key].unreadCount;
                    itemChat.name = relationObj[key].Nick;
                    itemChat.HeadImageUrl = relationObj[key].avator;
                    needArr.push = itemChat;
                }
                //渲染会话列表
                updateconverslisthandle(needArr);
            })
        })
    }

    //设置当前会话
    setCurrentConverse(chatId, group, callback) {
        currentChat = chatId;

        //初始化前10条聊天记录
        this.chat.getChatList(chatId, group = false, cache.length, (messageList) => {
            let snapArr = formateDataFromChatManageCacheRecord(messageList);
            this.user.GetBaseInfosByList(snapArr, (relationObj) => {
                for (let i = 0, length = messageList.length; i < length; i++) {
                    let itemMessage = new ControllerMessageDto();
                    itemMessage.group = messageList[i].group;
                    itemMessage.chatId = messageList[i].chatId;
                    itemMessage.message = {...messageList[i].message};
                    itemMessage.type = messageList[i].type;
                    itemMessage.status = messageList[i].status;
                    itemMessage.sendTime = messageList[i].sendTime;

                    let {RelationId, Nick, avator} = relationObj[messageList[i].sender];
                    itemMessage.sender = {account: RelationId, name: Nick, HeadImageUrl: avator};
                    cache.push(itemMessage);
                }
                //渲染聊天记录
                updateChatRecordhandle(cache);
            })
        })
    }

    //获取历史聊天记录
    getHistoryChatList(chatId, group, callback){
    this.chat.getChatList(chatId, group = false, cache.length, (messageList) => {
        let snapArr = formateDataFromChatManageCacheRecord(messageList);
        this.user.GetBaseInfosByList(snapArr, (relationObj) => {
            for (let i = 0, length = messageList.length; i < length; i++) {
                let itemMessage = new ControllerMessageDto();
                itemMessage.group = messageList[i].group;
                itemMessage.chatId = messageList[i].chatId;
                itemMessage.message = {...messageList[i].message};
                itemMessage.type = messageList[i].type;
                itemMessage.status = messageList[i].status;
                itemMessage.sendTime = messageList[i].sendTime;

                let {RelationId, Nick, avator} = relationObj[messageList[i].sender];
                itemMessage.sender = {account: RelationId, name: Nick, HeadImageUrl: avator};
                cache.push(itemMessage);
            }
            //渲染聊天记录
            updateChatRecordhandle(cache);
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
    sendMessage(chatId,message){
        let itemManagementMessage = new ManagementMessageDto();
        itemManagementMessage.group = message.group;
        itemManagementMessage.chatId = message.chatId;
        itemManagementMessage.sender = message.sender;
        itemManagementMessage.message = message.message;
        itemManagementMessage.type = message.type;
        itemManagementMessage.sendTime = Date.now();
        this.im.addMessage(itemManagementMessage,(managementMessage)=>{
            //managementMessage是带有status和消息id的完整ManagementMessageDto
            this.chat.addMessage(chatId,managementMessage);
            //cache添加

            this.user.getInformationByIdandType(message.sender,false,(relationObj) => {
                let itemMessage = new ControllerMessageDto();
                itemMessage.group = managementMessage.group;
                itemMessage.chatId = managementMessage.chatId;
                itemMessage.message = {...managementMessage.message};
                itemMessage.type = managementMessage.type;
                itemMessage.status = managementMessage.status;
                itemMessage.sendTime = managementMessage.sendTime;

                let {RelationId, Nick, avator} = relationObj[managementMessage.sender];
                itemMessage.sender = {account: RelationId, name: Nick, HeadImageUrl: avator};
                cache.push(itemMessage);
                //渲染聊天记录
                updateChatRecordhandle(cache);
            })
        },onprogress);
    }

    //删除消息
    removeMessage(chatId,group,messageId){
        //cache删除
        deleteItemFromCacheByMessageId(cache,messageId);
        this.chat.deleteChat(1,chatId,group,messageId);
    }

    //删除会话
    removeConverse(chatId,group){
        this.chat.deleteChat(2,chatId,group)
    }

    //清除未读数, 在会话列表处功能(标记为已读)
    clearUnReadNumber(chatId, group){
        //清空对应item未读消息
        currentObj.chat.clearUnReadNumber(chatId, group, (recentListObj) => {
            let snapArr = formateDataFromChatManageCache(recentListObj);
            this.user.GetBaseInfosByList(snapArr, (relationObj) => {
                let needArr = [];
                for (let key in relationObj) {
                    let itemChat = new ControllerChatConversationDto();
                    itemChat.group = recentListObj[key].group;
                    itemChat.chatId = recentListObj[key].chatId;
                    itemChat.lastSender = recentListObj[key].lastSender;
                    itemChat.lastMessage = recentListObj[key].lastMessage;
                    itemChat.unreadCount = recentListObj[key].unreadCount;
                    itemChat.name = relationObj[key].Nick;
                    itemChat.HeadImageUrl = relationObj[key].avator;
                    needArr.push = itemChat;
                }
                //渲染会话列表
                updateconverslisthandle(needArr);
            })
        })
    }
    //清除所有数据(清除缓存数据)
    clearAll(){
        cache = [];
    }




    //提取重复
    //ManagementChatConversationDto到ControllerChatConversationDto，对象变数组， 再渲染最近聊天
    updateChatCoversationList(recentListObj){
        let snapArr = formateDataFromChatManageCache(recentListObj);
        this.user.GetBaseInfosByList(snapArr, (relationObj) => {
            let needArr = [];
            for (let key in relationObj) {
                let itemChat = new ControllerChatConversationDto();
                itemChat.group = recentListObj[key].group;
                itemChat.chatId = recentListObj[key].chatId;
                itemChat.lastSender = recentListObj[key].lastSender;
                itemChat.lastMessage = recentListObj[key].lastMessage;
                itemChat.unreadCount = recentListObj[key].unreadCount;
                itemChat.name = relationObj[key].Nick;
                itemChat.HeadImageUrl = relationObj[key].avator;
                needArr.push = itemChat;
            }
            //渲染会话列表
            updateconverslisthandle(needArr);
        })
    }
    //ManagementMessageDto到ControllerMessageDto , 数组变数组 ,再渲染聊天记录
    updateChatRecord(messageList){
        let snapArr = formateDataFromChatManageCacheRecord(messageList);
        this.user.GetBaseInfosByList(snapArr, (relationObj) => {
            for (let i = 0, length = messageList.length; i < length; i++) {
                let itemMessage = new ControllerMessageDto();
                itemMessage.group = messageList[i].group;
                itemMessage.chatId = messageList[i].chatId;
                itemMessage.message = {...messageList[i].message};
                itemMessage.type = messageList[i].type;
                itemMessage.status = messageList[i].status;
                itemMessage.sendTime = messageList[i].sendTime;

                let {RelationId, Nick, avator} = relationObj[messageList[i].sender];
                itemMessage.sender = {account: RelationId, name: Nick, HeadImageUrl: avator};
                cache.push(itemMessage);
            }
            //渲染聊天记录
            updateChatRecordhandle(cache);
        })
    }
}

    reRenderRecentList(callback){
        updateconverslisthandle = callback;
    }
//message 消息体 协议
function receivemessage(message){

    //1 把message协议 转换成chatmanager的dto 存放到 chatmanager 的db中
    //2 把dto + usermanagment 的dto 构建成 IMcontoller的 dto 返回给界面

    //处理完成

    //[]
    updateconverslisthandle(reults)
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
        obj['chatId'] = v['chatId'];
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