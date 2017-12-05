/**
 * Created by apple on 2017/10/11.
 */
import * as Helper from '../../Helper'
import UpdateMessageSqliteType from './UpdateMessageSqliteType'
import MessageType from '../Common/dto/MessageType'
import {blackListMessage,NotGroupMemberMessage} from './action/createMessage'
import CommandErrorCodeEnum from './dto/CommandErrorCodeEnum'
import MessageCommandEnum from './dto/MessageCommandEnum'
import ChatWayEnum from '../Common/dto/ChatWayEnum'
import MessageBodyTypeEnum from '../Common/dto/MessageBodyTypeEnum'
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

        for(let item in recieveMessageQueue){
            currentObj.receiveMessageOpreator(recieveMessageQueue[item])
        }

        recieveMessageQueue = [];
    }
}

ReceiveManager.addReceiveMessage = function(message){
    recieveMessageQueue.push(message);
    console.log("message 加入接受队列")
}


// ReceiveManager.receiveErrorMessage = function(message){
//
//         if(message.Data.ErrorCode == CommandErrorCodeEnum.Blacklisted || message.Data.ErrorCode == CommandErrorCodeEnum.NotFriend
//             || message.Data.ErrorCode == CommandErrorCodeEnum.NotBelongToGroup){
//             let sender = message.Data.SourceMSGID.split("_")[0];
//             let blackMessage = undefined;
//             if(message.Data.ErrorCode != CommandErrorCodeEnum.NotBelongToGroup){
//                 blackMessage = blackListMessage(sender,message.MSGID);;
//             }else{
//                 blackMessage = NotGroupMemberMessage(sender,message.MSGID);
//             }
//
//             currentObj.storeRecMessage(blackMessage);
//
//             currentObj.storeMessageCache({"MSGID":message.MSGID,"message":message});
//
//             //收到新的消息界面响应
//             currentObj.ReceiveMessageHandle(blackMessage);
//
//             //标记发送消息发送结果为失败
//             currentObj.MessageResultHandle(false, message.Data.SourceMSGID);
//
//             let updateMessage = {};
//
//             updateMessage.status = MessageStatus.SendFailed;
//             updateMessage.MSGID = message.Data.SourceMSGID
//
//             currentObj.addUpdateSqliteQueue(updateMessage, UpdateMessageSqliteType.storeMessage)
//
//             currentObj.sendReceiveAckMessage(blackMessage.MSGID)
//         }else{
//             // let sender = message.Data.SourceMSGID.split("_")[0];
//             let blackMessage = blackListMessage(sender,message.MSGID);
//
//             currentObj.sendReceiveAckMessage(blackMessage.MSGID)
//             // currentObj.storeMessageCache({"MSGID":message.MSGID,"message":message});
//         }
// }


ReceiveManager.receiveBodyMessage = function(message){

    //todo:lizongjun  这里收到了消息之后，如果是错误消息，需要数据库查询之前发送消息的msgid 获取到isack属性，如果需要ack则进行发送

    // //接收到通知消息
    // if(message.Data.Command == MessageBodyTypeEnum.MSG_BODY_APP){
    //     InfoMessageHandle(message);
    // }else{
    //     //正常的收发消息
    //     //群消息需要把sender 和 receiver 交换,因为后台不会对message进行处理，而发送的时候sender是用户而不是群
    //     ChatMessageHandle(message);
    // }

    if(message.type == MessageType.text || message.type == MessageType.video)
    {
        currentObj.storeRecMessage(message,()=>{
            //回调App上层发送成功
            currentObj.ReceiveMessageHandle(message);
        })

    }
    else{

        currentObj.addDownloadResource(message,function (message) {
            currentObj.storeRecMessage(message)

            currentObj.ReceiveMessageHandle(message);
        })
    }

    currentObj.storeMessageCache({"MSGID":message.MSGID,"message":message});
    currentObj.sendReceiveAckMessage(message.MSGID)
}

export default ReceiveManager;


// function InfoMessageHandle(message){
//     message.Command = MessageCommandEnum.MSG_INFO;
//     message.type = MessageType.information;
//
//     if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_CREATEGROUP ||
//         message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_ADDGROUPMEMBER
//         || message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_DELETEGROUPMEMBER ||
//         message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_EXITGROUP ||
//         message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_DISSOLUTIONGROUP ||
//         message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_MODIFYGROUPINFO){
//         let sender = message.Data.Data.Sender
//         message.Data.Data.Sender = message.Data.Data.Receiver;
//         message.Data.Data.Receiver = sender;
//         message.way = "chatroom"
//         currentObj.storeRecMessage(message)
//         //回调App上层发送成功
//         currentObj.ReceiveMessageHandle(message);
//
//         currentObj.storeMessageCache({"MSGID":message.MSGID,"message":message});
//
//     }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_APPLYFRIEND){
//         message.type = MessageType.friend
//         message.way = "private"
//         currentObj.storeRecMessage(message)
//         //回调App上层发送成功
//         currentObj.ReceiveMessageHandle(message);
//     }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_ADDFRIEND){
//         // message.type = MessageType.friend
//         // message.way = "private"
//         // currentObj.storeRecMessage(message)
//         console.log("执行了receivermanager")
//         currentObj.updateRelation(message.Data.Data.Sender)
//     }
//
//     currentObj.sendReceiveAckMessage(message.MSGID)
// }


// function ChatMessageHandle(message){
//     if(message.way == ChatWayEnum.ChatRoom){
//         let sender = message.Data.Data.Sender
//         message.Data.Data.Sender = message.Data.Data.Receiver;
//         message.Data.Data.Receiver = sender;
//     }
//
//     if(message.type == MessageType.text || message.type == MessageType.video)
//     {
//         currentObj.storeRecMessage(message,()=>{
//             //回调App上层发送成功
//             currentObj.ReceiveMessageHandle(message);
//         })
//
//     }
//     else{
//
//         currentObj.addDownloadResource(message,function (message) {
//             currentObj.storeRecMessage(message)
//
//             currentObj.ReceiveMessageHandle(message);
//         })
//     }
//
//     currentObj.storeMessageCache({"MSGID":message.MSGID,"message":message});
//     currentObj.sendReceiveAckMessage(message.MSGID)
// }