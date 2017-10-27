/**
 * Created by apple on 2017/10/11.
 */
import * as Helper from '../Helper'
import * as configs from './IMconfig'
import UpdateMessageSqliteType from './UpdateMessageSqliteType'
import MessageType from './dto/MessageType'

//todo: 删除ack manager 和send manager合并成一个

let AckManager = {};
let currentObj = undefined;

let ackMessageQueue = [];

AckManager.Ioc = function(im){
    currentObj = im;
}

//处理ack队列
AckManager.handAckQueue = function(){

    if(ackMessageQueue.length < 1){
        return;
    }

    console.log("开始执行ack队列超时处理")
    let time = new Date().getTime();
    for(let item in ackMessageQueue){
        if(time - ackMessageQueue[item].time > configs.timeOutResend){

            if(ackMessageQueue[item].hasSend > 3) {

                //回调App上层发送失败
                if(ackMessageQueue[item].message.type != MessageType.friend) {
                    currentObj.MessageResultHandle(false, ackMessageQueue[item].message);
                }

                ackMessageQueue[item].message.status = MessageStatus.SendFailed;
                currentObj.addUpdateSqliteQueue(ackMessageQueue[item].message,UpdateMessageSqliteType.storeMessage)

                currentObj.popCurrentMessageSqlite(ackMessageQueue[item].message.MSGID)
                ackMessageQueue.splice(item, 1);
            }else {
                currentObj.reSendMessage(ackMessageQueue[item].message)
                console.log("重新发送" + ackMessageQueue[item].message.MSGID);
                ackMessageQueue[item].time = time;
                ackMessageQueue[item].hasSend += 1;
            }
        }
    }
}

//添加消息至ack队列
AckManager.addAckQueue = function(message,times){
    let time = new Date().getTime();
    ackMessageQueue.push({"message":message,"time":time,"hasSend":times});
    console.log("message 加入发送队列")
}


AckManager.receiveMessageOpreator = function(message){

    let updateMessage = {};
    for (let item in ackMessageQueue) {
        if (ackMessageQueue[item].message.MSGID == message) {

            //回调App上层发送成功
            if(ackMessageQueue[item].message.type != MessageType.friend) {
                currentObj.MessageResultHandle(true, message);
            }

            currentObj.popCurrentMessageSqlite(message)

            updateMessage = ackMessageQueue[item].message;
            ackMessageQueue.splice(item, 1);

            console.log("ack队列pop出：" + message)
            
            updateMessage.status = MessageStatus.SendSuccess;
            currentObj.addUpdateSqliteQueue(updateMessage, UpdateMessageSqliteType.storeMessage)

            console.log(ackMessageQueue.length);
            break;
        }
    }
}

export default AckManager;