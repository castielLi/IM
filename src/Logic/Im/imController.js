import IM from '../../Core/Management/IM/index'
import User from '../../Core/Management/UserGroup/index'
import Chat from '../../Core/Management/Chat/index'
import ControllerChatConversationDto from './dto/ControllerChatConversationDto';
import ControllerMessageDto from  './dto/ControllerMessageDto';
import ManagementChatConversationDto from './dto/ManagementChatConversationDto';
import ManagementMessageDto from '../../Core/Management/Common/dto/ManagementMessageDto'
import getContentOfControllerMessageDto from '../../Core/Management/Chat/Common/methods/GetContentOfControllerMessageDto'
import MessageCommandEnum from '../../Core/Management/Common/dto/MessageCommandEnum'
import MessageBodyTypeEnum from '../../Core/Management/Common/dto/MessageBodyTypeEnum'
import CommandErrorCodeEnum from '../../Core/Management/Common/dto/CommandErrorCodeEnum'
import AppCommandEnum from '../../Core/Management/Common/dto/AppCommandEnum'
import MessageStatus from '../../Core/Management/Common/dto/MessageStatus'
import TabTypeEnum from './dto/TabTypeEnum'
import DtoMessageTypeEnum from '../../Core/Management/Common/dto/DtoMessageTypeEnum'

import IMMessageToMessagementMessageDto from '../../Core/Management/Common/methods/IMMessageToManagementMessageDto';

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

//返回收到消息回调
let AppReceiveMessageHandle = undefined;

//踢出消息回调
let AppKickOutHandle = undefined;


//标示当前正在聊天的对象
let currentChat = undefined;
// todo 登录时修改myAccount
let myAccount = undefined;
let  cache = {messageCache:[],conversationCache:{},allUnreadCount:0};
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

    connectApp(receiveMessageHandle,kickOutMessage){
        AppReceiveMessageHandle = receiveMessageHandle;
        AppKickOutHandle = kickOutMessage;
        connectIM();
    }

    setMyAccount(accountObj){
        myAccount = accountObj;
    }

    //获取会话列表
    updateConverseList() {
        // this.chat.getConverseList((recentListObj) => {
        //     let snapArr = formateDataFromChatManageCache(recentListObj);
        //     this.user.init(snapArr, (relationObj) => {
        //         let needObj = {};
        //         for (let key in relationObj) {
        //             let itemChat = new ControllerChatConversationDto();
        //             itemChat.group = recentListObj[key].group;
        //             itemChat.chatId = recentListObj[key].chatId;
        //             itemChat.lastSender = recentListObj[key].lastSender;
        //             itemChat.lastMessage = recentListObj[key].lastMessage;
        //             itemChat.unreadCount = recentListObj[key].unreadCount;
        //
        //             cache.allUnreadCount+=itemChat.unreadCount;
        //
        //             itemChat.name = relationObj[key].Nick;
        //             itemChat.HeadImageUrl = relationObj[key].avator;
        //             needObj[recentListObj[key].chatId] = itemChat;
        //         }
        //         cache.conversationCache = needObj;
        //
        //         //渲染会话列表
        //
        //         let tempArr = formatOjbToneedArr(cache.conversationCache);
        //         AppReceiveMessageHandle(cache.allUnreadCount,TabTypeEnum.RecentList)
        //         updateconverslisthandle(tempArr);
        //     })
        // })

        //测试代码
        //this.chat.getConverseList((recentListObj) => {
        let recentListObj = {
            'wg003722':{
                group: false,
                chatId: "wg003722",//chatId={account/groupId}
                lastSender: null,
                lastMessage: "11111",
                lastTime: null,
                unreadCount: 1, //未读条数
            },
            'wg003724':{
                group: false,
                chatId: "wg003724",//chatId={account/groupId}
                lastSender: null,
                lastMessage: "22222",
                lastTime: null,
                unreadCount: 2, //未读条数
            },
            'wesdgfdg':{
                group: true,
                chatId: "wesdgfdg",//chatId={account/groupId}
                lastSender: null,
                lastMessage: "3333",
                lastTime: null,
                unreadCount: 0, //未读条数
            }
        }
            let snapArr = formateDataFromChatManageCache(recentListObj);
            //this.user.init(snapArr, (relationObj) => {
                let relationObj = {
                    'wg003722':{
                        Nick:'李四',
                        RelationId:'wg003722',
                        avator:''
                    },
                    'wg003724':{
                        Nick:'张三',
                        RelationId:'wg003724',
                        avator:''
                    },
                    'wesdgfdg':{
                        Nick:'这是一个群聊',
                        RelationId:'wesdgfdg',
                        avator:''
                    }
                }
                let needObj = {};
                for (let key in relationObj) {
                    let itemChat = new ControllerChatConversationDto();
                    itemChat.group = recentListObj[key].group;
                    itemChat.chatId = recentListObj[key].chatId;
                    itemChat.lastSender = recentListObj[key].lastSender;
                    itemChat.lastMessage = recentListObj[key].lastMessage;
                    itemChat.unreadCount = recentListObj[key].unreadCount;

                    cache.allUnreadCount+=itemChat.unreadCount;

                    itemChat.name = relationObj[key].Nick;
                    itemChat.HeadImageUrl = relationObj[key].avator;
                    needObj[recentListObj[key].chatId] = itemChat;
                }
                cache.conversationCache = needObj;

                //渲染会话列表

                let tempArr = formatOjbToneedArr(cache.conversationCache);
                AppReceiveMessageHandle(cache.allUnreadCount,TabTypeEnum.RecentList)
                updateconverslisthandle(tempArr);
            //})
        //})
    }

    //设置当前会话
    setCurrentConverse(chatId, group, callback) {
        // currentChat = {chatId,group}
        // updateChatRecordhandle = callback;
        // //未读消息清零
        // if(cache.conversationCache[chatId]!=undefined&&cache.conversationCache[chatId]['unreadCount']>0){
        //     this.clearUnReadMsgNumber(chatId);
        //     this.chat.clearUnReadNumber(chatId, group);
        //     AppReceiveMessageHandle(cache.allUnreadCount,TabTypeEnum.RecentList)
        //     //渲染会话列表
        //     let tempArr = formatOjbToneedArr(cache.conversationCache);
        //     updateconverslisthandle(tempArr);
        // }
        // //初始化前10条聊天记录
        // this.chat.getChatList(chatId, group, maxId, (messageList) => {
        //
        //     if(messageList.length == 0){
        //         updateChatRecordhandle([]);
        //         return;
        //     }
        //
        //
        //
        //     maxId = messageList[messageList.length - 1].id;
        //
        //     let snapArr = formateDataFromChatManageCacheRecord(messageList);
        //     this.user.init(snapArr, (relationObj) => {
        //         for (let i = 0, length = messageList.length; i < length; i++) {
        //             let itemMessage = new ControllerMessageDto();
        //             itemMessage.group = messageList[i].group;
        //             itemMessage.chatId = messageList[i].chatId;
        //             itemMessage.message = messageList[i].message;
        //             itemMessage.messageId = messageList[i].messageId;
        //             itemMessage.type = messageList[i].type;
        //             itemMessage.status = messageList[i].status;
        //             itemMessage.sendTime = messageList[i].sendTime;
        //
        //             let {RelationId, Nick, avator} = relationObj[messageList[i].sender];
        //             itemMessage.sender = {account: RelationId, name: Nick, HeadImageUrl: avator};
        //             cache.messageCache.push(itemMessage);
        //         }
        //         //渲染聊天记录
        //         updateChatRecordhandle(cache.messageCache);
        //     })
        // })



        //测试代码
        currentChat = {chatId,group}
        updateChatRecordhandle = callback;
        //未读消息清零
        if(cache.conversationCache[chatId]!=undefined&&cache.conversationCache[chatId]['unreadCount']>0){
            this.clearUnReadMsgNumber(chatId);
            this.chat.clearUnReadMsgNumber(chatId);
            AppReceiveMessageHandle(cache.allUnreadCount,TabTypeEnum.RecentList)
            //渲染会话列表
            let tempArr = formatOjbToneedArr(cache.conversationCache);
            updateconverslisthandle(tempArr);
        }
        //初始化前10条聊天记录
        //this.chat.getChatList(chatId, group, maxId, (messageList) => {
        let messageList = [{
            group: false,
            chatId: "wg003722",//chatId={account/groupId},
            id:0 ,//自增
            sender: "wg003722" ,//"wg003722"
            messageId: "1",//消息编号
            message: '11111',//消息内容，
            type:'text',//消息类型
            status:'WaitOpreator',
            sendTime : ""
        },
            {group: false,
            chatId: "wg003722",//chatId={account/groupId},
            id:1 ,//自增
            sender: "wg003722" ,//"wg003722"
            messageId: "2",//消息编号
            message: '22222',//消息内容，
            type:'text',//消息类型
            status:'WaitOpreator',
            sendTime : ""
        },
            {group: false,
            chatId: "wg003722",//chatId={account/groupId},
            id:2 ,//自增
            sender: "wg003723" ,//"wg003722"
            messageId: "3",//消息编号
            message: '33333',//消息内容，
            type:'text',//消息类型
            status:'WaitOpreator',
            sendTime : ""
        }]
            if(messageList.length == 0){
                updateChatRecordhandle([]);
                return;
            }



            maxId = messageList[messageList.length - 1].id;

            let snapArr = formateDataFromChatManageCacheRecord(messageList);
            //this.user.init(snapArr, (relationObj) => {
                let relationObj = {
                    'wg003722':{
                        Nick:'李四',
                        RelationId:'wg003722',
                        avator:''
                    },
                    'wg003723':{
                        Nick:'黄',
                        RelationId:'wg003723',
                        avator:''
                    }
                }
                for (let i = 0, length = messageList.length; i < length; i++) {
                    let itemMessage = new ControllerMessageDto();
                    itemMessage.group = messageList[i].group;
                    itemMessage.chatId = messageList[i].chatId;
                    itemMessage.message = messageList[i].message;
                    itemMessage.messageId = messageList[i].messageId;
                    itemMessage.type = messageList[i].type;
                    itemMessage.status = messageList[i].status;
                    itemMessage.sendTime = messageList[i].sendTime;

                    let {RelationId, Nick, avator} = relationObj[messageList[i].sender];
                    itemMessage.sender = {account: RelationId, name: Nick, HeadImageUrl: avator};
                    cache.messageCache.push(itemMessage);
                }
                //渲染聊天记录
                updateChatRecordhandle(cache.messageCache);
            //})
        //})
    }
    //退出聊天窗口
    setOutCurrentConverse(){
        currentChat = {};
        cache.messageCache = [];
        maxId = 0;
    }
    //获取历史聊天记录
    getHistoryChatList(chatId, group){

     //    //messageList 每个item 拿上来就是ManagementMessageDto
     //    this.chat.getChatList(chatId, group = false, maxId, (messageList) => {
     //
     //    if(messageList.length == 0){
     //        return;
     //    }
     //
     //    maxId = messageList[messageList.length - 1].id;
     //    let snapArr = formateDataFromChatManageCacheRecord(messageList);
     //    this.user.init(snapArr, (relationObj) => {
     //        for (let i = 0, length = messageList.length; i < length; i++) {
     //            let itemMessage = new ControllerMessageDto();
     //            itemMessage.group = messageList[i].group;
     //            itemMessage.chatId = messageList[i].chatId;
     //            itemMessage.message = messageList[i].message;
        //           itemMessage.messageId = messageList[i].messageId;
     //            itemMessage.type = messageList[i].type;
     //            itemMessage.status = messageList[i].status;
     //            itemMessage.sendTime = messageList[i].sendTime;
     //
     //            let {RelationId, Nick, avator} = relationObj[messageList[i].sender];
     //            itemMessage.sender = {account: RelationId, name: Nick, HeadImageUrl: avator};
     //            cache.messageCache.unshift(itemMessage);
     //        }
     //        //渲染聊天记录
     //        updateChatRecordhandle(cache.messageCache);
     //
     //    })
     // })

    //测试代码
        //messageList 每个item 拿上来就是ManagementMessageDto
        //this.chat.getChatList(chatId, group = false, maxId, (messageList) => {
        let messageList = [{
            group: false,
            chatId: "wg003722",//chatId={account/groupId},
            id:3 ,//自增
            sender: "wg003722" ,//"wg003722"
            messageId: "4",//消息编号
            message: '4444',//消息内容，
            type:'text',//消息类型
            status:'WaitOpreator',
            sendTime : ""
        },
            {group: false,
                chatId: "wg003722",//chatId={account/groupId},
                id:4 ,//自增
                sender: "wg003722" ,//"wg003722"
                messageId: "5",//消息编号
                message: '55555',//消息内容，
                type:'text',//消息类型
                status:'WaitOpreator',
                sendTime : ""
            },
            {group: false,
                chatId: "wg003722",//chatId={account/groupId},
                id:5 ,//自增
                sender: "wg003723" ,//"wg003722"
                messageId: "6",//消息编号
                message: '66666',//消息内容，
                type:'text',//消息类型
                status:'WaitOpreator',
                sendTime : ""
            }]
            if(messageList.length == 0){
                return;
            }

            maxId = messageList[messageList.length - 1].id;
            let snapArr = formateDataFromChatManageCacheRecord(messageList);
            //this.user.init(snapArr, (relationObj) => {
            let relationObj = {
                'wg003722':{
                    Nick:'李四',
                    RelationId:'wg003722',
                    avator:''
                },
                'wg003723':{
                    Nick:'黄',
                    RelationId:'wg003723',
                    avator:''
                }
            }
                for (let i = 0, length = messageList.length; i < length; i++) {
                    let itemMessage = new ControllerMessageDto();
                    itemMessage.group = messageList[i].group;
                    itemMessage.chatId = messageList[i].chatId;
                    itemMessage.message = messageList[i].message;
                    itemMessage.messageId = messageList[i].messageId;
                    itemMessage.type = messageList[i].type;
                    itemMessage.status = messageList[i].status;
                    itemMessage.sendTime = messageList[i].sendTime;

                    let {RelationId, Nick, avator} = relationObj[messageList[i].sender];
                    itemMessage.sender = {account: RelationId, name: Nick, HeadImageUrl: avator};
                    cache.messageCache.unshift(itemMessage);
                }
                //渲染聊天记录
                updateChatRecordhandle(cache.messageCache);

            //})
        //})
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
        // let itemManagementMessage = new ManagementMessageDto();
        // itemManagementMessage.group = message.group;
        // itemManagementMessage.chatId = message.chatId;
        // itemManagementMessage.sender = message.sender;
        // itemManagementMessage.message = message.message;
        // itemManagementMessage.type = message.type;
        // itemManagementMessage.sendTime = Date.now();
        // this.im.addMessage(itemManagementMessage,(managementMessage)=>{
        //
        // //managementMessage是带有status和消息id的完整ManagementMessageDto
        //     this.chat.addMessage(message.chatId,managementMessage);
        //
        //     //修改cache.conversationCache
        //     if(cache.conversationCache[managementMessage.chatId]!=undefined){
        //         this.updateOneChat(managementMessage.chatId,managementMessage);
        //     }else{
        //         this.addOneChat(managementMessage.chatId,managementMessage);
        //     }
        //
        //
        //     maxId = maxId+1;
        //     //cache添加
        //
        //     AddCache(managementMessage)
        //
        //     updateChatRecordhandle(cache.messageCache);
        //
        // });



        //测试代码
        let itemManagementMessage = new ManagementMessageDto();
        itemManagementMessage.group = message.group;
        itemManagementMessage.chatId = message.chatId;
        itemManagementMessage.sender = message.sender;
        itemManagementMessage.message = message.message;
        itemManagementMessage.type = message.type;
        itemManagementMessage.sendTime = Date.now();
        //this.im.addMessage(itemManagementMessage,(managementMessage)=>{
        let managementMessage = {
            group: false,
            chatId: "wg003722",//chatId={account/groupId}
            sender: "",//发送者
            messageId: Date.now(),//消息编号
            message: 'eeeeeeeeee',//消息内容，
            type:'text',//消息类型
            status:'SendSuccess',
            sendTime : ""
        }
            //managementMessage是带有status和消息id的完整ManagementMessageDto
            //this.chat.addMessage(message.chatId,managementMessage);

            //修改cache.conversationCache
            if(cache.conversationCache[managementMessage.chatId]!=undefined){
                this.updateOneChat(managementMessage.chatId,managementMessage);
            }else{
                this.addOneChat(managementMessage.chatId,managementMessage);
            }


            maxId = maxId+1;
            //cache添加

            AddCache(managementMessage)

            updateChatRecordhandle(cache.messageCache);

        //});



    }

    //删除消息
    removeMessage(messageId){

        //如果删除的是最后一条消息，还需要改变cache.conversationCache[chatId]
        // if(cache.messageCache[cache.messageCache.length-1].messageId == messageId){
        //     if(cache.messageCache.length == 1){
        //         let recentObj = cache.conversationCache[currentChat.chatId];
        //         recentObj.lastSender = '';
        //         recentObj.lastMessage = '';
        //         recentObj.lastTime = '';
        //     }else{
        //         this.updateOneChat(currentChat.chatId,cache.messageCache[cache.messageCache.length-2])
        //     }
        // }
        maxId = maxId-1;
        //cache.messageCache删除
        deleteItemFromCacheByMessageId(cache.messageCache,messageId);
        //渲染聊天记录
        updateChatRecordhandle(cache.messageCache);

        

        this.chat.removeMessage(currentChat.chatId,currentChat.group,messageId);

    }

    //删除会话
    removeConverse(chatId,group){
        cache.allUnreadCount-=cache.conversationCache[chatId]['unreadCount'];
        delete cache.conversationCache[chatId];
        AppReceiveMessageHandle(cache.allUnreadCount,TabTypeEnum.RecentList)
        //渲染会话列表
        let tempArr = formatOjbToneedArr(cache.conversationCache);
        updateconverslisthandle(tempArr);
        this.chat.removeConverse(chatId,group);
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
    //修改一个会话 //message是完整的managementMessageDto
    updateOneChat(chatId,message){
        let recentObj = cache.conversationCache[chatId];
        recentObj.lastSender = message.sender;
        recentObj.lastMessage = getContentOfControllerMessageDto(message);
        recentObj.lastTime = message.sendTime;
        let tempArr = formatOjbToneedArr(cache.conversationCache);
        updateconverslisthandle(tempArr);
    }

    updateCacheMessage(message){
        for(let item in cache.messageCache){
            if(cache.messageCache[item].messageId == message.messageId){
                cache.messageCache[item] = message;
            }
        }
    }

    //message是完整的managementMessageDto
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
            itemChat.lastSender = message.sender;
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
        cache.allUnreadCount+=1;
        cache.conversationCache[clientId]['unreadCount'] +=1;
    }
    //未读消息清0
    clearUnReadMsgNumber(clientId){
        if(cache.conversationCache[clientId] == undefined) return;
        cache.allUnreadCount-=cache.conversationCache[clientId]['unreadCount'];
        cache.conversationCache[clientId]['unreadCount'] = 0;
    }

    clearAllUnReadMsgNumber(){
        for(let item in cache.conversationCache){
            cache.conversationCache[item]['unReadMessageCount'] = 0;
        }
        cache.allUnreadCount = 0;
    }




}

function connectIM(){
    currentObj.im.connectIM(controllerMessageResult,controllerReceiveMessage,controllerKickOutMessage)
}

function controllerKickOutMessage(){
   AppKickOutHandle();
}


function controllerMessageResult(success,message){

    let messageDto = IMMessageToMessagementMessageDto(message);
    messageDto.status = success?MessageStatus.SendSuccess:MessageStatus.SendFailed;

    currentObj.chat.updateChatMessage(messageDto)

    if(chatId == currentChat.chatId){
        currentObj.updateCacheMessage(messageDto)
        updateChatRecordhandle(cache.messageCache);
    }
}

//message 消息体 协议
function controllerReceiveMessage(message){

    //1 根据消息类型进行消息扩展及数据库和缓存扩展
    if(message.Command == MessageCommandEnum.MSG_ERROR){

        switch (message.Data.ErrorCode){
            case CommandErrorCodeEnum.NotBelongToGroup:
                message.Description = "您已经被管理员踢了群聊";
                break;
            case CommandErrorCodeEnum.AlreadyFriend:
                message.Description = "你们已经是好友了";
                break;
            default:
                message.Description = "你们已经不再是好友了,请重新添加";
                break;
        }

        storeChatMessageAndCache(message);

    }else if(message.Command == MessageCommandEnum.MSG_BODY){
        if(message.Data.Command == MessageBodyTypeEnum.MSG_BODY_APP){
            switch (message.Data.Data.Command){
                case AppCommandEnum.MSG_BODY_APP_ADDGROUPMEMBER:

                    var senderId = message.Data.Data.Receiver;

                    currentObj.user.forceUpdateRelation(senderId,true,function(){
                        var accounts = message.Data.Data.Data.split(',');

                        var name = currentObj.user.getUserInfoById(accounts[0])

                        var inviter = currentObj.user.getUserInfoById(accounts[1]);

                        message.Data.Data.Data = inviter + "邀请" + name + "加入群聊";

                        storeChatMessageAndCache(message);
                    })
                    break;
                case AppCommandEnum.MSG_BODY_APP_ADDFRIEND:

                    //更新contact

                    var senderId = message.Data.Data.Sender;

                    currentObj.user.getUserInfoByIdandType(senderId,"user",function(){
                        currentObj.user.acceptFriendInCache(senderId);
                    });

                    break;
                case AppCommandEnum.MSG_BODY_APP_APPLYFRIEND:

                    var senderId = message.Data.Data.Sender;

                    currentObj.user.forceUpdateRelation(senderId,false,function(){

                        AppReceiveMessageHandle(1,TabTypeEnum.Contact)
                    })

                    break;
                case AppCommandEnum.MSG_BODY_APP_CREATEGROUP:
                    currentObj.user.forceUpdateRelation(senderId,true,function(){
                        var accounts = message.Data.Data.Data.split(',');
                        let Nicks = "";
                        for(let i = 0; i<accounts.length;i++){
                            if(accounts[i] == message.Data.Data.Receiver){
                                accounts.splice(i,1);
                            }
                        }

                        for(let i = 0; i<accounts.length;i++){
                            if(i != accounts.length - 1){
                                Nicks += currentObj.user.getUserInfoById(accounts[i]) + ",";
                            }else{
                                Nicks += currentObj.user.getUserInfoById(accounts[i]);
                            }
                        }

                        var inviter = currentObj.user.getUserInfoById(message.Data.Data.Receiver);
                        message.Data.Data.Data = inviter + "邀请" + Nicks + "加入群聊";

                        storeChatMessageAndCache(message);
                    });

                    break;
                case AppCommandEnum.MSG_BODY_APP_DELETEGROUPMEMBER:
                    var accounts = message.Data.Data.Data.split(',');
                    //默认收到被踢消息的人不是被踢人
                    let isKickedClient = false;
                    for(let i = 0; i<accounts.length;i++){
                        if(accounts[i] == myAccount.accountId){
                            isKickedClient = true;
                            break;
                        }
                    }
                    if(isKickedClient){
                        message.Data.Data.Data =  "你被群主踢出了该群聊";
                        //处理来自界面的回调方法，隐藏群设置按钮
                    }else{
                        let Nicks = "";
                        for(let i = 0; i<accounts.length;i++){
                            if(i != accounts.length - 1){
                                Nicks += currentObj.user.getUserInfoById(accounts[i]) + ",";
                            }else{
                                Nicks += currentObj.user.getUserInfoById(accounts[i]);
                            }
                        }

                        var name = currentObj.user.getUserInfoById(message.Data.Data.Data);
                        var inviter = '';
                        if(message.Data.Data.Receiver == myAccount.accountId){
                            inviter = myAccount.accountId;
                        }else{
                            inviter = currentObj.user.getUserInfoById(message.Data.Data.Receiver);
                        }
                        message.Data.Data.Data =  Nicks + "被"+ inviter+"踢出了群聊";
                    }

                    storeChatMessageAndCache(message);

                    break;
                case AppCommandEnum.MSG_BODY_APP_DISSOLUTIONGROUP:
                    break;
                case AppCommandEnum.MSG_BODY_APP_EXITGROUP:
                    var accounts = message.Data.Data.Data.split(',');

                    var name = currentObj.user.getUserInfoById(accounts[0])

                    message.Data.Data.Data =  name + "退出了群聊";

                    storeChatMessageAndCache(message);
                    break;
                case AppCommandEnum.MSG_BODY_APP_MODIFYGROUPINFO:
                    var name = currentObj.user.getUserInfoById(message.Data.Data.Receiver);

                    message.Data.Data.Data =  name+"修改了群昵称";

                    let groupName = relation.Nick;

                    let groupId = message.Data.Data.Sender;

                    currentObj.user.updateGroupName(groupId,groupName);

                    storeChatMessageAndCache(message);
                    break;
            }
        }
        // else if(message.Data.Command == MessageBodyTypeEnum.MSG_BODY_CHAT){}
    }
}

function storeChatMessageAndCache(message){
    //2 把message协议 转换成chatmanager的dto 存放到 chatmanager 的db中
    let managementMessageObj = IMMessageToMessagementMessageDto(message);
    this.chat.addMessage(managementMessageObj.chatId,managementMessageObj)
    //3 把dto + usermanagment 的dto 构建成 IMcontoller的 dto 返回给界面

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
    maxId = maxId+1;
    AddCache(managementMessageObj);

    PushNotificationToApp(managementMessageObj);

}

function AddCache(managementMessageObj){

        // this.user.getInformationByIdandType(managementMessageObj.sender,managementMessageObj.group,(relationObj) => {
        //     let itemMessage = new ControllerMessageDto();
        //     itemMessage.group = managementMessageObj.group;
        //     itemMessage.chatId = managementMessageObj.chatId;
        //     itemMessage.message = managementMessageObj.message;
        //     itemMessage.type = managementMessageObj.type;
        //     itemMessage.status = managementMessageObj.status;
        //     itemMessage.sendTime = managementMessageObj.sendTime;
        //
        //     let {RelationId, Nick, avator} = relationObj;
        //     itemMessage.sender = {account: RelationId, name: Nick, HeadImageUrl: avator};
        //
        //     cache.messageCache.push(itemMessage);
        //
        //     //渲染聊天记录
        //     updateChatRecordhandle(cache.messageCache);
        // })

    //测试代码
    //this.user.getInformationByIdandType(managementMessageObj.sender,managementMessageObj.group,(relationObj) => {
    let relationObj = {
        RelationId:'wg003723',
        Nick:'黄',
        avator:''
    }
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
    //})
}


function PushNotificationToApp(managementMessageObj){
    //只有打开了聊天窗口并且收到来自该窗口的消息才会重新渲染聊天页面
    if(chatId == currentChat.chatId){
        updateChatRecordhandle(cache.messageCache);
    }else{
        if(managementMessageObj.type != DtoMessageTypeEnum.error){
            currentObj.addUnReadMsgNumber(chatId);
            AppReceiveMessageHandle(cache.allUnreadCount,TabTypeEnum.RecentList)
        }
        let tempArr = formatOjbToneedArr(cache.conversationCache);
        updateconverslisthandle(tempArr);
    }
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