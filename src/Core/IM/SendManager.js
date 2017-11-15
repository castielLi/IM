/**
 * Created by apple on 2017/10/11.
 */
import * as Helper from '../Helper'
import UpdateMessageSqliteType from './UpdateMessageSqliteType'
import * as configs from './IMconfig'


let SendManager = {};
let currentObj = undefined;

let sendMessageQueue = [];


SendManager.Ioc = function(im){
   currentObj = im;
}


SendManager.checkQueueLength = function(){
    return sendMessageQueue.length;
}

SendManager.addSendMessage = function(messageId,callback=undefined,needACK=true){

    let message = createSendMessageObj(messageId,needACK);
    sendMessageQueue.push(message);
    console.log("message 加入发送队列",message)
    callback && callback(true,message.MSGID);

}

SendManager.changeSendInfoByMSGID = function(messageId){
    for(let item in sendMessageQueue){
        if(sendMessageQueue[item].MSGID == messageId){
            let obj = sendMessageQueue[item];
            if(obj.info == undefined){
                obj.info.sendTime = new Date().getTime();
                obj.info.times = 1;
            }else{
                obj.sendTime = new Date().getTime();
                obj.times += 1;
            }
            break;
        }
    }
}


SendManager.receieveAckHandle = function(messageId){
    for(let item in sendMessageQueue){
        if(sendMessageQueue[item].MSGID == messageId){
            sendMessageQueue.splice(item,1);
            break;
        }
    }
}

SendManager.handleSendMessageQueue = function(){
    if(sendMessageQueue.length > 0){

        for(let item in sendMessageQueue){

            //当times等于undefined的时候说明当前的消息是需要立即发送的新消息
            if(sendMessageQueue[item].info == undefined) {
                currentObj.sendMessage(sendMessageQueue[item].MSGID);
            }else{
                if(sendMessageQueue[item].info.times == configs.Max_Send_Times){
                    currentObj.sendOverMaxTimesHandle(sendMessageQueue[item].MSGID)
                    sendMessageQueue.splice(item,1);
                }else{
                    currentObj.sendMessage(sendMessageQueue[item].MSGID);
                }
            }

            //当needACK等于false说明这条消息不需要接收ack
            if(!sendMessageQueue[item].needACK){
                sendMessageQueue.splice(item,1);
            }

        }
    }
}

export default SendManager;

function createSendMessageObj(messageId,needACK){
    let sendMessage = {};
    sendMessage.MSGID = messageId;
    sendMessage.info = undefined;
    sendMessage.needACK = needACK;
    return sendMessage;
}