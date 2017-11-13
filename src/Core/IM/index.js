/**
 * Created by apple on 2017/7/26.
 */

import Connect from './socket'
import * as storeSqlite from './StoreSqlite'
import UUIDGenerator from 'react-native-uuid-generator';
import MessageStatus from "./dto/MessageStatus"
import SendStatus from './dto/SendStatus'
import * as configs from './IMconfig'
import MessageCommandEnum from './dto/MessageCommandEnum'
import * as DtoMethods from './dto/Common'
import MessageType from './dto/MessageType'
import netWorking from '../Networking/Network'
import SendManager from './SendManager'
import AckManager from './AckManager'
import FileManager from './FileManager'
import ReceiveManager from './ReceiveManager'
import UpdateMessageSqliteType from './UpdateMessageSqliteType'
import networkStatuesType from './networkStatuesType'



let _socket = new Connect();
let _network = new netWorking();

//网络状态
let networkStatus = "";

//缓存消息
let cacheMessage = [];

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
let AppMessageResultHandle = undefined;
//function(success:boolean,data:{})
//返回修改消息状态回调
let AppMessageChangeStatusHandle = undefined;
//function(message:message);

//返回收到消息回调
let AppReceiveMessageHandle = undefined;

//踢出消息回调
let AppKickOutHandle = undefined;

let handleRecieveAddFriendMessage = undefined;


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
        AckManager.Ioc(this);
        FileManager.Ioc(this);
    }

    setSocket(account,device,deviceId,imToken){
        _socket.startConnect(account,device,deviceId,imToken);
        ME = account;

        window.ME = account;
    }

    //初始化IM的数据库
    initIMDatabase(AccountId){
        storeSqlite.initIMDatabase(AccountId,function(){
            //获取之前没有发送出去的消息重新加入消息队列
            currentObj.addAllUnsendMessageToSendQueue();
        });
    }


    //赋值外部IM接口
    connectIM(getMessageResultHandle,changeMessageHandle,receiveMessageHandle,kickOutMessage,recieveAddFriendMessage){
        AppMessageResultHandle = getMessageResultHandle;
        AppMessageChangeStatusHandle = changeMessageHandle;
        AppReceiveMessageHandle = receiveMessageHandle;
        AppKickOutHandle = kickOutMessage;
        handleRecieveAddFriendMessage = recieveAddFriendMessage;
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

                    if(message.status == SendStatus.PrepareToUpload || message.status == MessageStatus.WaitOpreator) {

                        FileManager.addResource(message,null);

                        console.log("加入资源队列" + message.MSGID);
                    }else{
                        sendMessage.push(message);
                    }
                }
            })

            // sendMessageQueue = sendMessage.reduce(function(prev, curr){ prev.push(curr); return prev; },sendMessageQueue);
            for(let item in sendMessage){
                SendManager.addSendMessage(sendMessage[item]);
            }
        });
    }


    //获取所有好友申请消息
    getAllApplyFriendMessage(callback){
        storeSqlite.getAllApplyFriendMessage(callback);
    }

    //修改好友申请消息
    updateApplyFriendMessage(message){
        storeSqlite.updateApplyFriendMessage(message);
    }


    //外部接口，添加消息
    addMessage(message,callback=function(success,content){},onprogess="undefined") {


        if (message.type == "undefined") {
            callback(false, "message type error");
        }


        //先生成唯一的messageID并且添加message进sqlite保存
        UUIDGenerator.getRandomUUID().then((uuid) => {
            messageId = message.Data.Data.Receiver + "_" +uuid;
            message.MSGID = messageId;

            //把消息存入消息sqlite中
            message.status = MessageStatus.WaitOpreator;

            if(message.type != MessageType.friend) {

                if(message.type == MessageType.information){
                    //todo:lizongjun 把消息sqlite 全部改成先生成sql语句再执行的形势就可以避免所有参数传递的时候都需要创建新的拷贝
                    let copyMessage = Object.assign({},message);
                    copyMessage.Command = MessageCommandEnum.MSG_INFO;
                    this.storeSendMessage(copyMessage);
                }else{
                    this.storeSendMessage(message);
                }
            }

            //添加cache缓存
            // cacheMessage.push(message);



            storeSqlite.addMessageToSendSqlite(message);

            switch (message.type) {
                case MessageType.text:
                    SendManager.addSendMessage(message,callback);
                    break;
                case MessageType.image:
                    FileManager.addResource(message,onprogess,callback);
                    break;
                case MessageType.audio:
                    FileManager.addResource(message,onprogess,callback);
                    break;
                case MessageType.friend:
                    SendManager.addSendMessage(message,callback);
                    break;
                case MessageType.video:
                    FileManager.addResource(message,onprogess,callback)
                    break;
                default:
                    SendManager.addSendMessage(message,callback);
                    break;
            }

        });
    }

    //IM logic添加message 到 SendManager发送队列中
    addSendMessageQueue(message){
        SendManager.addSendMessage(message)
    }

    //发送消息
    sendMessage(message){
        //发送websocket
        console.log("开始发送消息了")


        let copyMessage = Object.assign({}, message);

        if(networkStatus == networkStatuesType.normal) {
            let success = this.socket.sendMessage(copyMessage);


            //心跳包不需要进行存储
            if(message.Command != MessageCommandEnum.MSG_HEART && message.Command != MessageCommandEnum.MSG_REV_ACK) {
                console.log("添加" + copyMessage.MSGID + "进队列");
                //初始加入ack队列，发送次数默认为1次
                AckManager.addAckQueue(copyMessage, 1);

                copyMessage.status = SendStatus.WaitAck;
                this.addUpdateSqliteQueue(copyMessage,UpdateMessageSqliteType.changeSendMessage)
            }
        }else{
            copyMessage.status = SendStatus.PrepareToSend;
            this.addUpdateSqliteQueue(copyMessage,UpdateMessageSqliteType.changeSendMessage)
        }
    }

    reSendMessage(message){
        console.log("开始发送消息了")

        if(networkStatus == networkStatuesType.normal) {
            let success = this.socket.sendMessage(message);

        }else{
            message.status = SendStatus.PrepareToSend;
            this.addUpdateSqliteQueue(message,UpdateMessageSqliteType.changeSendMessage)
        }
    }



    //存储发送消息
    storeSendMessage(message){
        storeSqlite.storeSendMessage(message);
    }

    //存储接收消息
    storeRecMessage(message,callback){
        storeSqlite.storeRecMessage(message,callback);
    }

    //操作好友管理模块,申请好友通过，设置关系显示状态
    updateRelation(relationId){
        handleRecieveAddFriendMessage(relationId);
    }


    //向sqlite队列中push元素
    addUpdateSqliteQueue(message,type){
        // handleSqliteQueue.push({message:message,type:type});
        this.updateSqliteMessage(message,type);
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

    //更改video消息下载完成时的资源路径
    updateMessageRemoteUrl(messageId,url){
       storeSqlite.updateMessageRemoteUrl(messageId,url);
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


    receiveMessageOpreator(message){
        if(message.Command == undefined) {
            AckManager.receiveMessageOpreator(message);
        }else if(message.Command == MessageCommandEnum.MSG_BODY || message.Command == MessageCommandEnum.MSG_ERROR){
            ReceiveManager.receiveMessageOpreator(message);
        }
    }

    recMessage(message,type=null) {

        //处理收到消息的逻辑
        console.log("IM Core:消息内容"+message + " 开始执行pop程序");

        if(type == MessageCommandEnum.MSG_HEART){
            // message.Command = MessageCommandEnum.MSG_HEART;
            console.log("心跳包压入发送队列")
            SendManager.addSendMessage(message)
            return;
        }else if(type == MessageCommandEnum.MSG_KICKOUT){
            console.log("设备被踢出消息")
            AppKickOutHandle();
            return;
        }

        currentObj.receiveMessageOpreator(message)
    }


    addDownloadResource(message,callback){
        FileManager.downloadResource(message,callback);
    }

    popAckMessage(messageId,success){
        AckManager.receiveMessageOpreator(messageId,success);
    }

    ReceiveMessageHandle(message){
        AppReceiveMessageHandle(message);
    }

    MessageResultHandle(success,message){
        AppMessageResultHandle(success,message)
    }


    MessageChangeStatusHandle(message){
        AppMessageChangeStatusHandle(message)
    }


    sendReceiveAckMessage(messageId){
        UUIDGenerator.getRandomUUID().then((uuid) => {
            let receiveAckMessage = {"Command":MessageCommandEnum.MSG_REV_ACK,"MSGID":ME + "_" +uuid,"Data":messageId};
            SendManager.addSendMessage(receiveAckMessage);
        })
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

            if(ackMessageInterval == -1) {
                ackMessageInterval = setInterval(function () {
                    AckManager.handAckQueue();
                }, ackMessageIntervalTime)
            }


            FileManager.handleResourceQueue();

        }, configs.RunloopIntervalTime);
    }


}

let loopStateType = {
    normal : "normal",
    noNet : "noNet",
    wait : "wait"
};

