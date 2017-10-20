/**
 * Created by apple on 2017/10/11.
 */
import * as Helper from '../Helper'
import * as configs from './IMconfig'
import UpdateMessageSqliteType from './UpdateMessageSqliteType'


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
                // AppMessageResultHandle(false,ackMessageQueue[item].message);

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
        currentObj.MessageResultHandle(true, message);

        updateMessage.status = MessageStatus.SendSuccess;
        currentObj.addUpdateSqliteQueue(updateMessage, UpdateMessageSqliteType.storeMessage)



        //判断如果是他人发送的消息
    }else if(message.Command == MessageCommandEnum.MSG_BODY){
        //存入数据库

        if(message.type == 'text')
        {
            currentObj.storeRecMessage(message)
            //回调App上层发送成功
            currentObj.ReceiveMessageHandle(message);
        }else if(message.type == ""){
            //回调App上层发送成功
            currentObj.ReceiveMessageHandle(message);
        }
        else{

            currentObj.addDownloadResource(message,function (message) {
                currentObj.storeRecMessage(message)

                currentObj.ReceiveMessageHandle(message);
            })
        }

    }
}

export default AckManager;