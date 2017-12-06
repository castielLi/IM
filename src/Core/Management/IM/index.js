/**
 * Created by apple on 2017/7/26.
 */

import Connect from './socket'
import * as storeSqlite from './StoreSqlite'
import UUIDGenerator from 'react-native-uuid-generator';
import MessageStatus from "../Common/dto/MessageStatus"
import SendStatus from './Common/dto/SendStatus'
import * as configs from './IMconfig'
import MessageCommandEnum from '../Common/dto/MessageBodyTypeEnum'
import * as DtoMethods from './Common/methods/SqliteMessageToDtoMessage'
import ResourceTypeEnum from '../Common/dto/ResourceTypeEnum'
import SendManager from './SendManager'
import FileManager from './FileManager'
import ReceiveManager from './ReceiveManager'
import UpdateMessageSqliteType from './Common/dto/UpdateMessageSqliteType'
import networkStatuesType from './Common/dto/networkStatuesType'
import * as cacheMethods from './action/createCacheMessage'
import {buildSendMessage} from './action/createMessage'
import ManagementMessageDto from '../Common/dto/ManagementMessageDto'



let _socket = new Connect();

//网络状态
let networkStatus = "";

//IM 内部缓存，用于sendManager，fileManager通过MSGID获取消息
let cacheMessage = [];

//Message缓存，用于外部通过MSGID获取完整消息内容
let storeMessage = [];


let heartBeatInterval;
let loopInterval;
let checkQueueInterval;
let checkNetEnvironmentInterval;

//loop对象
let sendMessageInterval = -1;
let recMessageInterval = -1;
let ackMessageInterval = -1;
//loop时间
let sendMessageIntervalTime = 0;
let recMessageIntervalTime = 0;
let ackMessageIntervalTime = 0;




let loopState;
let netState;

//假设账号token就是1
let ME = "";

let currentObj = undefined;


//上层应用IM的接口
//返回消息结果回调
let ControllerMessageResultHandle = undefined;
//function(success:boolean,data:{})
//返回修改消息状态回调
let ControllerMessageChangeStatusHandle = undefined;
//function(message:message);

//返回收到消息回调
let ControllerReceiveMessageHandle = undefined;

//踢出消息回调
let ControllerKickOutHandle = undefined;


let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

export default class IM {
    constructor(){
        if (__instance()) return __instance();

        __instance(this);
        this.socket = _socket;
        this.socket.onRecieveCallback(this.recMessage)

        this.startIM();
        currentObj = this;

        //依赖注入
        SendManager.Ioc(this);
        ReceiveManager.Ioc(this);
        FileManager.Ioc(this);
    }

    setSocket(account,device,deviceId,imToken){
        _socket.startConnect(account,device,deviceId,imToken,this.addAllUnsendMessageToSendQueue);
        ME = account;

        window.ME = account;
    }

    //初始化IM的数据库
    initIMDatabase(AccountId){
        storeSqlite.initIMDatabase(AccountId,function(){
            //获取之前没有发送出去的消息重新加入消息队列
        });
    }


    //赋值外部IM接口
    connectIM(getMessageResultHandle,changeMessageHandle,receiveMessageHandle,kickOutMessage){
        ControllerMessageResultHandle = getMessageResultHandle;
        ControllerMessageChangeStatusHandle = changeMessageHandle;
        ControllerReceiveMessageHandle = receiveMessageHandle;
        ControllerKickOutHandle = kickOutMessage;
    }

    startIM(){
        loopState = loopStateType.wait;
        //初始化timer间隔
        sendMessageIntervalTime = configs.SendMessageIntervalTime;
        ackMessageIntervalTime = configs.ackIntervalTime;
        recMessageIntervalTime =  configs.RecMessageIntervalTime;


        this.beginHeartBeat();
        this.beginRunLoop();

        //从后台进前台的时候，如果当前网络为none，程序是已经在执行checkEnvironment，否则直接丢给reconnectNet以防止断网的重连
        if(networkStatus != networkStatuesType.none){
            this.socket.reConnectNet();
        }

    }

    logout(){
        this.socket.logout();
    }

    stopIM(){
        this.checkQueue(this.stopIMRunCycle);
    }

    waitOneLoop(){

    }

    stopIMRunCycle(){
        clearInterval(heartBeatInterval)
        clearInterval(loopInterval)
        clearInterval(checkQueueInterval)
        clearInterval(sendMessageInterval)
        clearInterval(ackMessageInterval)
        clearInterval(recMessageInterval)

        sendMessageInterval = -1;
        recMessageInterval = -1;
        ackMessageInterval = -1;

        // currentObj.logout()
    }

    setNetEnvironment(connecttionInfo){
        networkStatus = connecttionInfo?networkStatuesType.normal:networkStatuesType.none;
        window.networkStatus = networkStatus;
    }

    //网络状态变换回调
    handleNetEnvironment(connectionInfo){
        netState = connectionInfo;

        if(netState.type == "NONE" || netState.type == "none"){

            networkStatus = networkStatuesType.none;

            window.networkStatus = networkStatus;

            this.stopIMRunCycle()

            _socket.setNetWorkStatus(networkStatuesType.none);

            checkNetEnvironmentInterval = setInterval(function () {

                if(netState.type != 'NONE' && netState.type != 'none'){
                    clearInterval(checkNetEnvironmentInterval);

                    //todo:恢复网络了后要重新发送消息

                    _socket.setNetWorkStatus(networkStatuesType.normal);


                    //回调获取之前没有发送出去的消息重新加入消息队列
                    currentObj.startIM();

                }
            },200);
        }else{
            networkStatus = networkStatuesType.normal;

            window.networkStatus = networkStatus;
        }
    }


    //检查send 和 rec队列执行回调
    checkQueue(emptyCallBack,inEmptyCallBack){
        checkQueueInterval = setInterval(function () {

            let sendQueueLength = SendManager.checkQueueLength();
            let recQueueLength = ReceiveManager.checkQueueLength();

            if(sendQueueLength == 0 && recQueueLength == 0){

                emptyCallBack && emptyCallBack();
            }else{
                inEmptyCallBack && inEmptyCallBack();
            }
        }, 1000);
    }



    //操作Cache
    getStoreMessagesByMSGIDs(ids){
        let cache = [];
        for(let item in storeMessage){
            for(let i in ids){
                if(storeMessage[item].MSGID == ids[i]){
                    cache.push(storeMessage[item].message)
                    break;
                }
            }
        }
        return cache;
    }

    //通过MSGID来获取cache中的message数据
    getCacheFromCacheByMSGID(messageId){
        for(let i = 0;i<cacheMessage.length;i++){
            if(messageId == cacheMessage[i].MSGID){
                return cacheMessage[i];
            }
        }
        return null;
    }

    //用cache中删除数据
    popMessageFromCache(messageId){
        for(let i = 0;i<cacheMessage.length;i++){
            if(messageId == cacheMessage[i].MSGID){
                cacheMessage.splice(i,1);
            }
        }
    }





    //发送消息
    //外部接口，添加消息
    addMessage(messageDto = new ManagementMessageDto(),callback=function(success,content){},onprogess="undefined") {

        let message = buildSendMessage(messageDto);

        //先生成唯一的messageID并且添加message进sqlite保存
        UUIDGenerator.getRandomUUID().then((uuid) => {
            messageId = message.Data.Data.Receiver + "_" +uuid;
            message.MSGID = messageId;
            messageDto.messageId = messageId;
            messageDto.sendTime = message.Data.LocalTime;

            cacheMessage.push(cacheMethods.createCacheMessage(message,callback,onprogess));
            storeMessage.push({"MSGID":message.MSGID,"message":message});


            //把消息存入消息sqlite中
            message.status = MessageStatus.WaitOpreator;
            messageDto.status = MessageStatus.WaitOpreator;

            this.storeSendMessage(message);

            storeSqlite.addMessageToSendSqlite(message);

            if(message.Resource == null){
                SendManager.addSendMessage(message.MSGID);
            }else{
                switch (message.Resource[0].FileType) {
                    case ResourceTypeEnum.image:
                        FileManager.addResource(message.MSGID);
                        break;
                    case ResourceTypeEnum.audio:
                        FileManager.addResource(message.MSGID);
                        break;
                    case ResourceTypeEnum.video:
                        FileManager.addResource(message.MSGID)
                        break;
                    default:
                        SendManager.addSendMessage(message.MSGID);
                        break;
                }
            }

            return messageDto;
        });
    }

    //IM logic添加message 到 SendManager发送队列中
    addSendMessageQueue(messageId){
        SendManager.addSendMessage(messageId)
    }

    //发送消息
    sendMessage(messageId){
        //发送websocket
        console.log("开始发送消息了")


        console.log(messageId)

        let cache = this.getCacheFromCacheByMSGID(messageId);
        let message = cache.message;


        if(networkStatus == networkStatuesType.normal) {

            let success = this.socket.sendMessage(message);

            //心跳包和收到消息ack不需要进行存储
            if(message.Command != MessageCommandEnum.MSG_HEART && message.Command != MessageCommandEnum.MSG_REV_ACK) {
                console.log("添加" + message.MSGID + "进队列");
                message.status = SendStatus.WaitAck;
                SendManager.changeSendInfoByMSGID(messageId);
                this.addUpdateSqliteQueue(message,UpdateMessageSqliteType.changeSendMessage)
            }else{
                //心跳包发送消息之后直接从cache里面删除
                this.popMessageFromCache(messageId);
            }
        }else{
            message.status = SendStatus.PrepareToSend;
            this.addUpdateSqliteQueue(message,UpdateMessageSqliteType.changeSendMessage)
        }
    }

    sendReceiveAckMessage(messageId){
        UUIDGenerator.getRandomUUID().then((uuid) => {
            let receiveAckMessage = {"Command":MessageCommandEnum.MSG_REV_ACK,"MSGID":ME + "_" +uuid,"Data":messageId};
            //把收到消息ack回执添加到cache中，便于send时获取
            cacheMessage.push(cacheMethods.createCacheMessage(receiveAckMessage));
            SendManager.addSendMessage(receiveAckMessage.MSGID,false);
        })
    }

    sendOverMaxTimesHandle(messageId){
        let cache = this.getCacheFromCacheByMSGID(messageId);
        let message = cache["message"];

        //回调App上层发送失败
        currentObj.MessageResultHandle(false, messageId);

        message.status = MessageStatus.SendFailed;
        currentObj.addUpdateSqliteQueue(message,UpdateMessageSqliteType.storeMessage)

        currentObj.popCurrentMessageSqlite(message.MSGID)


    }



    //接收消息
    recMessage(message,type=null) {

        //处理收到消息的逻辑
        console.log("IM Core:收到消息,开始执行分类程序");

        if(message == null){
            return;
        }

        switch(type){
            case MessageCommandEnum.MSG_HEART:
                console.log("心跳包压入发送队列")
                //将心跳包消息存入cache，便于send消息
                cacheMessage.push(cacheMethods.createCacheMessage(message));
                SendManager.addSendMessage(message.MSGID,false)
                break;
            case MessageCommandEnum.MSG_KICKOUT:
                console.log("设备被踢出消息")
                currentObj.socket.logout();
                ControllerKickOutHandle();
                break;
            case MessageCommandEnum.MSG_SEND_ACK:
                currentObj.ackBackMessageHandle(message.Data);
                break;
            default:
                ReceiveManager.receiveBodyMessage(message);
                break;
        }

    }

    ackBackMessageHandle(messageId){

        for(let item in cacheMessage) {
            if (cacheMessage[item].MSGID == messageId) {

                currentObj.MessageResultHandle(true, messageId);

                currentObj.popCurrentMessageSqlite(messageId)

                let updateMessage = cacheMessage[item].message;

                console.log("ack队列pop出：" + messageId)

                updateMessage.status = MessageStatus.SendSuccess;

                currentObj.addUpdateSqliteQueue(updateMessage, UpdateMessageSqliteType.storeMessage)

                SendManager.receieveAckHandle(messageId);

                this.popMessageFromCache(messageId);

                break;
            }
        }
    }



    //资源
    addDownloadResource(message,callback){
        FileManager.downloadResource(message,callback);
    }

    manualDownloadResource(remoteURL,filePath,callback,onprogress){
        FileManager.manualDownloadResource(remoteURL,filePath,callback,onprogress);
    }




    //向sqlite队列中push元素
    addUpdateSqliteQueue(message,type){
        // handleSqliteQueue.push({message:message,type:type});
        this.updateSqliteMessage(message,type);
    }

    //向message缓存中添加消息
    storeMessageCache(obj){
        storeMessage.push(obj);
    }


    //心跳包
    beginHeartBeat(){
        heartBeatInterval = setInterval(function () {
        }, 10000);
    }

    //runloop循环
    beginRunLoop(){
        loopInterval = setInterval(function () {

            //todo: 做多个timer分别来处理send rec 和 资源队列，做优先级。

            if(sendMessageInterval == -1) {
                sendMessageInterval = setInterval(function () {

                    SendManager.handleSendMessageQueue();

                }, sendMessageIntervalTime);
            }

            if(recMessageInterval == -1) {
                recMessageInterval = setInterval(function () {

                    ReceiveManager.handleRecieveMessageQueue();

                }, recMessageIntervalTime)
            }

            FileManager.handleResourceQueue();

        }, configs.RunloopIntervalTime);
    }


    //上层注入的MessageHandler
    ReceiveMessageHandle(message){
        ControllerReceiveMessageHandle(message);
    }

    MessageResultHandle(success,message){
        ControllerMessageResultHandle(success,message)
    }


    MessageChangeStatusHandle(message){
        ControllerMessageChangeStatusHandle(message)
    }

    // //操作好友管理模块,申请好友通过，设置关系显示状态
    // updateRelation(relationId){
    //     console.log("执行了IM")
    //     ControllerHandleRecieveAddFriendMessage(relationId);
    // }






    //IM 数据库操作

    //通过MSGIDS获取消息
    getMessagesByIds(Ids,callback){
        storeSqlite.getMessagesByIds(Ids,callback)
    }

    //获取所有好友申请消息
    getAllApplyFriendMessage(callback){
        storeSqlite.getAllApplyFriendMessage(callback);
    }

    //修改好友申请消息
    updateApplyFriendMessage(message){
        storeSqlite.updateApplyFriendMessage(message);
    }

    //获取当前所有未发出去的消息添加入消息队列
    addAllUnsendMessageToSendQueue(){
        storeSqlite.getAllCurrentSendMessage(function(currentSendMessages){
            console.log("复制未发送的消息进入发送队列");
            if(currentSendMessages == null){
                return;
            }

            let messages = [];
            let sendMessage = [];

            currentSendMessages.forEach(function (item) {
                let message = DtoMethods.sqliteMessageToMessage(item);

                //根据消息类型加入队列
                if(message.type == "text"){
                    sendMessage.push(message);
                }else{

                    if(message.status == SendStatus.PrepareToUpload || message.status == MessageStatus.WaitOpreator) {

                        cacheMessage.push(cacheMethods.createCacheMessage(message));
                        FileManager.addResource(message.MSGID);

                        console.log("加入资源队列" + message.MSGID);
                    }else{
                        sendMessage.push(message);
                    }
                }
            })

            // sendMessageQueue = sendMessage.reduce(function(prev, curr){ prev.push(curr); return prev; },sendMessageQueue);
            for(let item in sendMessage){
                cacheMessage.push(cacheMethods.createCacheMessage(sendMessage[item]));
                SendManager.addSendMessage(sendMessage[item].MSGID);
            }
        });
    }

    //存储发送消息
    storeSendMessage(message){
        storeSqlite.storeSendMessage(message);
    }

    //存储接收消息
    storeRecMessage(message,callback){
        storeSqlite.storeRecMessage(message,callback);
    }
    //根据ids从IM批量获取message
    selectMessagesByIds(ids,callback){
        storeSqlite.selectMessagesByIds(ids,(messages)=>{
            let messageList = messages.map((message)=>{
                return DtoMethods.sqliteMessageToMessage(message);
            })
            callback(messageList);
        });
    }
    //更改消息状态
    updateSqliteMessage(message,way){
        //根据类别修改消息结果或者是发送消息的消息状态
        if(way == UpdateMessageSqliteType.storeMessage){
            //修改message表中message状态
            storeSqlite.updateMessageStatus(message);
        }else{
            //修改发送队列中message状态
            storeSqlite.updateSendMessageStatus(message);
        }

    }

    //更改消息本地资源路径
    updateMessageLocalSource(messageId,url){
        storeSqlite.updateMessageLocalSource(messageId,url);
    }
    //更改消息远程资源路径

    updateMessageRemoteSource(messageId,url){
        storeSqlite.updateMessageRemoteSource(messageId,url);
    }

    //删除数据库中发送队列的message
    popCurrentMessageSqlite(messageId){
        storeSqlite.popMessageInSendSqlite(messageId);
    }

    //添加资源文件到数据库
    addResourceSqlite(message,item){
        storeSqlite.InsertResource(message.MSGID,message.Resource[item].LocalSource);
    }

    //从数据库删除资源文件
    deleteResourceSqlite(message,item){
        storeSqlite.DeleteResource(message.MSGID,message.Resource[item].LocalSource);
    }

    updateReceiveMessageContentById(content,MSGID){
        storeSqlite.UpdateMessageContentByMSGID(content,MSGID);
    }

    //关闭数据库
    closeImDb(){
        storeSqlite.closeImDb();
    }

}

let loopStateType = {
    normal : "normal",
    noNet : "noNet",
    wait : "wait"
};
