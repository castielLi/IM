/**
 * Created by apple on 2017/10/11.
 */
import * as Helper from '../Helper'
import UpdateMessageSqliteType from './UpdateMessageSqliteType'
import MessageType from './dto/MessageType'
import {isApplyFriendMessageType,blackListMessage} from './action/createMessage'
import CommandErrorCodeEnum from './dto/CommandErrorCodeEnum'
import MessageCommandEnum from './dto/MessageCommandEnum'
import ChatWayEnum from './dto/ChatWayEnum'
import MessageBodyTypeEnum from './dto/MessageBodyTypeEnum'
import AppCommandEnum from './dto/AppCommandEnum'


let ReceiveManager = {};
let currentObj = undefined;
let currentAccount = undefined;

let recieveMessageQueue = [];

ReceiveManager.Ioc = function(im){
    currentObj = im;
}

ReceiveManager.GetCurrentAccount = function(account){
    currentAccount = account;
}

ReceiveManager.checkQueueLength = function(){
    return recieveMessageQueue.length;
}

ReceiveManager.handleRecieveMessageQueue = function(){

    if(recieveMessageQueue.length > 0){

        let copyRecQueue = Helper.cloneArray(recieveMessageQueue);
        recieveMessageQueue = [];

        for(let item in copyRecQueue){
            currentObj.receiveMessageOpreator(copyRecQueue[item])
            // recieveMessageQueue.shift();
        }

        copyRecQueue = [];
    }
}

ReceiveManager.addReceiveMessage = function(message){
    recieveMessageQueue.push(message);
    console.log("message 加入接受队列")
}

ReceiveManager.receiveMessageOpreator = function(message){

    //todo:lizongjun  这里收到了消息之后，如果是错误消息，需要数据库查询之前发送消息的msgid 获取到isack属性，如果需要ack则进行发送


    //part 1:

    //错误消息
    if(message.Command == MessageCommandEnum.MSG_ERROR){
        if(message.Data.ErrorCode == CommandErrorCodeEnum.Blacklisted || message.Data.ErrorCode == CommandErrorCodeEnum.NotFriend){
            let sender = message.Data.SourceMSGID.split("_")[0];
            let blackMessage = blackListMessage(sender,message.MSGID);
            currentObj.storeRecMessage(blackMessage);

            //收到新的消息界面响应
             currentObj.ReceiveMessageHandle(blackMessage);

            //标记发送消息发送结果为失败
            currentObj.MessageResultHandle(false, message.Data.SourceMSGID);

            let updateMessage = {};

            updateMessage.status = MessageStatus.SendFailed;
            updateMessage.MSGID = message.Data.SourceMSGID

            currentObj.addUpdateSqliteQueue(updateMessage, UpdateMessageSqliteType.storeMessage)

            currentObj.sendReceiveAckMessage(blackMessage.MSGID)
        }
        return;
    }




    //part 2:

    //接收到通知消息
    if(message.Data.Command == MessageBodyTypeEnum.MSG_BODY_APP){

        message.Command = MessageCommandEnum.MSG_INFO;
        message.type = MessageType.information;

        if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_CREATEGROUP ||
            message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_ADDGROUPMEMBER
            || message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_DELETEGROUPMEMBER ||
            message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_EXITGROUP){
            let sender = message.Data.Data.Sender
            message.Data.Data.Sender = message.Data.Data.Receiver;
            message.Data.Data.Receiver = sender;
            message.way = "chatroom"
            currentObj.storeRecMessage(message)
            //回调App上层发送成功
            currentObj.ReceiveMessageHandle(message);
        }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_APPLYFRIEND){
            message.type = MessageType.friend
            message.way = "private"
            currentObj.storeRecMessage(message)
            //回调App上层发送成功
            currentObj.ReceiveMessageHandle(message);
        }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_ADDFRIEND){
            message.type = MessageType.friend
            message.way = "private"
            currentObj.storeRecMessage(message)
            currentObj.updateRelation(message.Data.Data.Sender)
        }

        currentObj.sendReceiveAckMessage(message.MSGID)
        return;
    }




    //part 3:

    //正常的收发消息
    //群消息需要把sender 和 receiver 交换,因为后台不会对message进行处理，而发送的时候sender是用户而不是群
    if(message.way == ChatWayEnum.ChatRoom){
        let sender = message.Data.Data.Sender
        message.Data.Data.Sender = message.Data.Data.Receiver;
        message.Data.Data.Receiver = sender;
    }

    if(message.type == MessageType.text)
    {
        currentObj.storeRecMessage(message)
        //回调App上层发送成功
        currentObj.ReceiveMessageHandle(message);
    }
    else{

        currentObj.addDownloadResource(message,function (message) {
            currentObj.storeRecMessage(message)

            currentObj.ReceiveMessageHandle(message);
        })
    }

    currentObj.sendReceiveAckMessage(message.MSGID)
}

export default ReceiveManager;