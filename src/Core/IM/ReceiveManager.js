/**
 * Created by apple on 2017/10/11.
 */
import * as Helper from '../Helper'
import UpdateMessageSqliteType from './UpdateMessageSqliteType'
import MessageType from './dto/MessageType'
import {isApplyFriendMessageType,blackListMessage} from './action/createMessage'
import CommandErrorCodeEnum from './dto/CommandErrorCodeEnum'
import MessageCommandEnum from './dto/MessageCommandEnum'

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

    if(message.Command == MessageCommandEnum.MSG_ERROR){
        if(message.Data.ErrorCode == CommandErrorCodeEnum.Blacklisted){
            let sender = message.Data.SourceMSGID.split("_")[0];
            let blackMessage = blackListMessage(sender,message.Data.SourceMSGID);
            currentObj.storeRecMessage(blackMessage);
            currentObj.ReceiveMessageHandle(blackMessage);
            currentObj.popAckMessage(blackMessage.Data.SourceMSGID);
            currentObj.sendReceiveAckMessage(message.MSGID)
        }
        return;
    }


    if(message.type == MessageType.text || message.type == MessageType.friend)
    {
        if(message.type == MessageType.friend){
            if(isApplyFriendMessageType(message)){
                currentObj.storeRecMessage(message)
                //回调App上层发送成功
                currentObj.ReceiveMessageHandle(message);
            }else{
                currentObj.updateRelation(message.Data.Data.Sender)
            }
        }else{
            currentObj.storeRecMessage(message)
            //回调App上层发送成功
            currentObj.ReceiveMessageHandle(message);
        }
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