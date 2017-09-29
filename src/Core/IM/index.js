/**
 * Created by apple on 2017/7/26.
 */

import Connect from './socket'
import * as methods from './Common'
import * as storeSqlite from './StoreSqlite'
import UUIDGenerator from 'react-native-uuid-generator';
import MessageStatus from "./dto/MessageStatus"
import SendStatus from './dto/SendStatus'
import * as configs from './IMconfig'
import MessageCommandEnum from './dto/MessageCommandEnum'
import * as DtoMethods from './dto/Common'
import * as Helper from '../Helper'
import MessageType from './dto/MessageType'
import netWorking from '../Networking/Network'
import RNFS from 'react-native-fs'



let _socket = new Connect();
let _network = new netWorking();

//网络状态
let networkStatus = "";

//发送消息队列
let sendMessageQueue = [];
let sendMessageQueueState;
//等待发送消息队列
let waitSendMessageQueue = [];
//收到消息队列
let recieveMessageQueue = [];
let recMessageQueueState;
let waitRecMessageQueue = [];
//存储sqlite队列
let handleSqliteQueueState;
let handleSqliteQueue = [];
let waitSqliteQueue = [];
//ack队列
let ackMessageQueue = [];
let waitAckMessageQueue = [];
let ackMessageQueueState;

//资源队列
let resourceQueueState;
let resourceQueue = [];
let waitResourceQueue = [];

let heartBeatInterval;
let loopInterval;
let checkQueueInterval;
let checkNetEnvironmentInterval;
let storeSqliteInterval;
let loopState;
let netState;

//假设账号token就是1
let ME = "";

let currentObj = undefined;


//上层应用IM的接口
//返回消息结果回调
let AppMessageResultHandle = undefined;
//function(success:boolean,data:{})
//返回修改消息状态回调
let AppMessageChangeStatusHandle = undefined;
//function(message:message);

//返回收到消息回调
let AppReceiveMessageHandle = undefined;

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
    }

    setSocket(account){
        _socket.startConnect(account);
        ME = account;
    }

    //初始化IM的数据库
    initIMDatabase(AccountId){
        storeSqlite.initIMDatabase(AccountId,function(){

            //获取之前没有发送出去的消息重新加入消息队列
            currentObj.addAllUnsendMessageToSendQueue();
        });
    }


    //赋值外部IM接口
    connectIM(getMessageResultHandle,changeMessageHandle,receiveMessageHandle){
        AppMessageResultHandle = getMessageResultHandle;
        AppMessageChangeStatusHandle = changeMessageHandle;
        AppReceiveMessageHandle = receiveMessageHandle;
    }

    startIM(){
        loopState = loopStateType.wait;
        sendMessageQueueState = sendMessageQueueType.empty;
        handleSqliteQueueState = handleSqliteQueueType.empty;
        recMessageQueueState = recMessageQueueType.empty;
        ackMessageQueueState = ackQueueType.empty;
        resourceQueueState = resourceQueueType.empty;
        this.beginHeartBeat();
        this.beginRunLoop();


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
    }

    //网络状态变换回调
    handleNetEnvironment(connectionInfo){
        netState = connectionInfo;

        if(netState.type == "NONE" || netState.type == "none"){

            networkStatus = networkStatuesType.none;

            _socket.setNetWorkStatus(networkStatuesType.none);

            checkNetEnvironmentInterval = setInterval(function () {

                if(netState.type != 'NONE' && netState.type != 'none'){
                    clearInterval(checkNetEnvironmentInterval);

                    //todo:恢复网络了后要重新发送消息

                    _socket.setNetWorkStatus(networkStatuesType.normal);
                    _socket.reConnectNet();

                    //获取之前没有发送出去的消息重新加入消息队列
                    currentObj.addAllUnsendMessageToSendQueue();

                }
            },200);
        }else{
            networkStatus = networkStatuesType.normal;
        }
    }


    //检查send 和 rec队列执行回调
    checkQueue(emptyCallBack,inEmptyCallBack){
        checkQueueInterval = setInterval(function () {
            if(sendMessageQueue.length == 0 && recieveMessageQueue.length == 0){

                emptyCallBack || emptyCallBack();
            }else{
                inEmptyCallBack || inEmptyCallBack();
            }
        }, 1000);
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


    //获取当前用户或者群组的聊天记录
    getRecentChatRecode(account,way,range = {start:0,limit:10},callback){
        storeSqlite.queryRecentMessage(account,way,range,callback);
    }

    //获取聊天列表
    getChatList(callback){
        storeSqlite.getChatList(callback);
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

                    if(message.status == SendStatus.PrepareToUpload) {
                        resourceQueue.push({onprogress: null, message: message})
                        console.log("加入资源队列" + message.MSGID);
                    }else{
                        sendMessage.push(message);
                    }
                }
            })

            sendMessageQueue = sendMessage.reduce(function(prev, curr){ prev.push(curr); return prev; },sendMessageQueue);
        });
    }


    //外部接口，添加消息
    addMessage(message,callback=function(success,content){},onprogess="undefined") {

        let messageUUID = "";

        if (message.type == "undefined") {
            callback(false, "message type error");
        }

        //先生成唯一的messageID并且添加message进sqlite保存
        UUIDGenerator.getRandomUUID().then((uuid) => {
            messageId = message.Data.Data.Receiver + "_" +uuid;
            message.MSGID = messageId;
            messageUUID = messageId;

            //把消息存入消息sqlite中
            message.status = MessageStatus.WaitOpreator;

            this.storeSendMessage(message);

            //把消息存入发送队列sqlite中
            storeSqlite.addMessageToSendSqlite(message);


            switch (message.type) {
                case MessageType.text:
                    this.addMessageQueue(message);
                    callback(true,message.MSGID);
                    break;
                case MessageType.image:

                    // let copyMessage = Object.assign({}, message);
                    //
                    // copyMessage.status = SendStatus.PrepareToUpload;
                    // currentObj.addUpdateSqliteQueue(copyMessage,UpdateMessageSqliteType.changeSendMessage)

                    resourceQueue.push({onprogress:onprogess,message:message})
                    callback(true,message.MSGID);
                    break;
                case MessageType.audio:

                    let copyMessage = Object.assign({}, message);

                    copyMessage.status = SendStatus.PrepareToUpload;
                    currentObj.addUpdateSqliteQueue(copyMessage,UpdateMessageSqliteType.changeSendMessage)

                    resourceQueue.push({onprogress:onprogess,message:message})
                    callback(true,message.MSGID);
                    break;
                default:
                    break;
            }

            return messageUUID;
        });
    }


    //向resource队列中添加对象
    addResourceQueue(object){

        resourceQueue.push(object);
        console.log("message 加入资源队列")
    }

    //执行resource队列
    handleResourceQueue(obj){

        if(resourceQueue.length > 0){

            resourceQueueState = resourceQueueType.excuting;

            let copyResourceQueue = Helper.cloneArray(resourceQueue);

            //cloneArry 方法不能拷贝方法
            for(let item in resourceQueue){
                copyResourceQueue[item].onprogress = resourceQueue[item].onprogress;
            }

            resourceQueue = [];

            for(let item in copyResourceQueue){
                obj.uploadResource(copyResourceQueue[item]);
            }
            copyResourceQueue=[];

            resourceQueueState = resourceQueueType.empty;

        }
    }

    //执行upload函数体
    uploadResource(obj){

        let message = obj["message"];

        let copyMessage = Object.assign({}, message);

        let progressHandles = obj["onprogress"] != null?obj["onprogress"]:null;
        let callback = obj["callback"];

        if(networkStatus == networkStatuesType.normal) {

            //把资源存入数据库
            for(let item in message.Resource){
                storeSqlite.InsertResource(message.MSGID,message.Resource[item].LocalSource);
            }


            let uploadQueue = [];
            for(let item in message.Resource) {

                //整合audio下文件路径
                let resource;
                if(message.type == MessageType.audio){
                   resource = message.Resource[item].LocalSource.split("_")[0] + ".aac";
                }else{
                    resource = message.Resource[item].LocalSource;
                }

                uploadQueue.push(methods.getUploadPathFromServer(resource,item,function (progress,index) {
                    if(progressHandles != null) {
                        let onprogess = progressHandles[index * 1];
                        onprogess("第" + (index * 1 + 1) + "张图片上传进度：" + progress.loaded / progress.total * 100);
                    }
                },function (result) {
                    console.log("上传成功" + result);
                    message.Resource[item].RemoteSource = result.url;

                    //pop上传成功的资源
                    storeSqlite.DeleteResource(message.MSGID,message.Resource[item].LocalSource);
                },function(index){
                    console.log("上传失败" + index);
                }));
            }

            Promise.all(uploadQueue).then(function(values){
                console.log(values + "已经上传成功了" + message.MSGID);

                let copyMessage = Object.assign({}, message);

                copyMessage.status = SendStatus.PrepareToSend;
                currentObj.addUpdateSqliteQueue(copyMessage,UpdateMessageSqliteType.changeSendMessage)

                currentObj.addMessageQueue(message);

                //App上层修改message细节
                AppMessageChangeStatusHandle(message);

            }).catch(function (values) {
                console.log('上传失败的内容是',values);
            })
        }else{
            copyMessage.status = SendStatus.PrepareToSend;
            this.addUpdateSqliteQueue(copyMessage,UpdateMessageSqliteType.changeSendMessage)
        }
    }




    //添加消息至消息队列
    addMessageQueue(message){

        sendMessageQueue.push(message);
        console.log("message 加入发送队列",message)

    }

    //处理消息队列
    handleSendMessageQueue(obj){
        if(sendMessageQueue.length > 0){

            sendMessageQueueState = sendMessageQueueType.excuting;
            console.log(sendMessageQueueState);

            let copyMessageQueue = Helper.cloneArray(sendMessageQueue);
            sendMessageQueue = [];

            for(let item in copyMessageQueue){
                obj.sendMessage(copyMessageQueue[item],obj);

                // sendMessageQueue.shift();
            }
            copyMessageQueue = [];

            sendMessageQueueState = sendMessageQueueType.empty;
            console.log(sendMessageQueueState);
        }
    }

    //发送消息
    sendMessage(message,obj){
        //发送websocket
        console.log("开始发送消息了")


        let copyMessage = Object.assign({}, message);

        if(networkStatus == networkStatuesType.normal) {
            let success = this.socket.sendMessage(copyMessage);


            //心跳包不需要进行存储
            if(message.Command != MessageCommandEnum.MSG_HEART) {
                console.log("添加" + copyMessage.MSGID + "进队列");
                //初始加入ack队列，发送次数默认为1次
                obj.addAckQueue(copyMessage, 1);
                console.log("ack copyMessage 长度" + ackMessageQueue.length);

                copyMessage.status = SendStatus.WaitAck;
                this.addUpdateSqliteQueue(copyMessage,UpdateMessageSqliteType.changeSendMessage)
            }
        }else{
            copyMessage.status = SendStatus.PrepareToSend;
            this.addUpdateSqliteQueue(copyMessage,UpdateMessageSqliteType.changeSendMessage)
        }
    }

    //存储消息
    storeSendMessage(message){
        if(message.Data.Data.Receiver != ME){
            storeSqlite.storeSendMessage(message);
        }else{
            storeSqlite.storeRecMessage(message);
        }
    }


    //向sqlite队列中push元素
    addUpdateSqliteQueue(message,type){
        handleSqliteQueue.push({message:message,type:type});
    }


    //处理更新sqlite队列
    handleUpdateSqlite(obj){
        if(handleSqliteQueue.length > 0){

            handleSqliteQueueState = handleSqliteQueueType.excuting;
            console.log(handleSqliteQueueState);



            let copySqliteQueue = Helper.cloneArray(handleSqliteQueue);
            handleSqliteQueue = [];

            for(let item in copySqliteQueue){

                obj.updateSqliteMessage(copySqliteQueue[item].message,copySqliteQueue[item].type);
                // handleSqliteQueue.shift();
            }

            copySqliteQueue = [];

            handleSqliteQueueState = handleSqliteQueueType.empty;
            console.log(handleSqliteQueueState);
        }
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

    //删除数据库中发送队列的message
    popCurrentMessageSqlite(messageId){
        storeSqlite.popMessageInSendSqlite(messageId);
    }





    //websocket接口,添加接受消息队列
    addRecMessage(message){

        recieveMessageQueue.push(message);
        console.log("message 加入接受队列")

    }

    handleRecieveMessageQueue(obj){

        if(recieveMessageQueue.length > 0){

            recMessageQueueState = recMessageQueueType.excuting;

            let copyRecQueue = Helper.cloneArray(recieveMessageQueue);
            recieveMessageQueue = [];

            for(let item in copyRecQueue){
                obj.receiveMessageOpreator(copyRecQueue[item])
                // recieveMessageQueue.shift();
            }

            copyRecQueue = [];

            recMessageQueueState = recMessageQueueType.empty;

        }
    }


    receiveMessageOpreator(message){

        //判断如果是ack消息
        if(message.Command == undefined) {
            let updateMessage = {};
            for (let item in ackMessageQueue) {
                if (ackMessageQueue[item].message.MSGID == message) {

                    currentObj.popCurrentMessageSqlite(message)


                    updateMessage = ackMessageQueue[item].message;
                    ackMessageQueue.splice(item, 1);

                    console.log("ack队列pop出：" + message)
                    console.log(ackMessageQueue.length);
                    break;
                }
            }

            //回调App上层发送成功
            AppMessageResultHandle(true, message);

            updateMessage.status = MessageStatus.SendSuccess;
            currentObj.addUpdateSqliteQueue(updateMessage, UpdateMessageSqliteType.storeMessage)

        //判断如果是他人发送的消息
        }else if(message.Command == MessageCommandEnum.MSG_BODY){
            //存入数据库

            console.log('改变前=============================:  ',message)

            if(message.type == 'text')
            {
                storeSqlite.storeRecMessage(message)
            }
            else{

                message.Resource[0].LocalSource = null;

                console.log('下载前=============================:  ',message)

                let fromUrl = message.Resource[0].RemoteSource,
                    sender = message.Data.Data.Sender,
                    type = message.type,
                    way = message.way,
                    format = fromUrl.slice(fromUrl.lastIndexOf('.')),
                    toFile = `${RNFS.DocumentDirectoryPath}/${type}/${way}-${sender}/${new Date().getTime()}${format}`;

                updateMessage = (result) => {
                    message.Resource[0].LocalSource = 'file://' + toFile
                    console.log('下载成功后=============================:  ',message)
                    storeSqlite.storeRecMessage(message)
                }

                _network.methodDownload(fromUrl,toFile,updateMessage)

                console.log('receiveMessageOpreator:  ',message)
            }

            //todo : 添加非文字类型的消息的下载程序

            AppReceiveMessageHandle(message);
        }}



    recMessage(message,type=null) {

        //处理收到消息的逻辑
        console.log("IM Core:消息内容"+message + " 开始执行pop程序");

        if(type == MessageCommandEnum.MSG_HEART){
            // message.Command = MessageCommandEnum.MSG_HEART;
            console.log("心跳包压入发送队列")
            sendMessageQueue.push(message);
            return;
        }

        recieveMessageQueue.push(message);
    }



    //添加消息至ack队列
    addAckQueue(message,times){
        let time = new Date().getTime();
        ackMessageQueue.push({"message":message,"time":time,"hasSend":times});
        console.log("message 加入发送队列")
    }

    //处理ack队列
    handAckQueue(obj){

        if(ackMessageQueue.length < 1){
            return;
        }

        console.log("开始执行ack队列超时处理")
        let time = new Date().getTime();
        for(let item in ackMessageQueue){
            if(time - ackMessageQueue[item].time > configs.timeOutResend){

                if(ackMessageQueue[item].hasSend > 3) {

                    //回调App上层发送失败
                    // AppMessageResultHandle(false,ackMessageQueue[item].message);

                    ackMessageQueue[item].message.status = MessageStatus.SendFailed;
                    obj.addUpdateSqliteQueue(ackMessageQueue[item].message,UpdateMessageSqliteType.storeMessage)

                    obj.popCurrentMessageSqlite(ackMessageQueue[item].message.MSGID)
                    ackMessageQueue.splice(item, 1);
                }else {
                    obj.socket.sendMessage(ackMessageQueue[item].message);
                    console.log("重新发送" + ackMessageQueue[item].message.MSGID);
                    ackMessageQueue[item].time = time;
                    ackMessageQueue[item].hasSend += 1;
                }
            }
        }
    }





    //心跳包
    beginHeartBeat(){
        heartBeatInterval = setInterval(function () {
        }, 10000);
    }

    //runloop循环
    beginRunLoop(){
        let handleSend = this.handleSendMessageQueue;
        let handleRec = this.handleRecieveMessageQueue;
        let handleUpdateSqlite = this.handleUpdateSqlite;
        let handleAckQueue = this.handAckQueue;
        let handleResource = this.handleResourceQueue;
        let obj = this;
        loopInterval = setInterval(function () {

            if(sendMessageQueueState == sendMessageQueueType.empty) {

                handleSend(obj);
            }

            if(handleSqliteQueueState == handleSqliteQueueType.empty){
                handleUpdateSqlite(obj);
            }

            if(resourceQueueState == resourceQueueType.empty){
                handleResource(obj)
            }

            if(recMessageQueueState == recMessageQueueType.empty){
                handleRec(obj)
            }

            handleAckQueue(obj);

        }, configs.RunloopIntervalTime);
    }
}


function reInitMessage(sqliteMessage){


    return message;
}



let loopStateType = {
    normal : "normal",
    noNet : "noNet",
    wait : "wait"
};

let sendMessageQueueType = {
    excuting : "excuting",
    empty : "empty"
}

let recMessageQueueType = {
    excuting : "excuting",
    empty : "empty"
}

let handleSqliteQueueType = {
    excuting : "excuting",
    empty : "empty"
}

let resourceQueueType = {
    excuting : "excuting",
    empty : "empty"
}

let ackQueueType = {
    excuting : "excuting",
    empty : "empty"
}

let networkStatuesType = {
    none : "none",
    normal : "normal"
}

let UpdateMessageSqliteType = {
    storeMessage:"storeMessage",
    changeSendMessage:"changeSendMessage"
}