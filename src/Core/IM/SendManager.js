/**
 * Created by apple on 2017/10/11.
 */
import * as Helper from '../Helper'
import UpdateMessageSqliteType from './UpdateMessageSqliteType'


let SendManager = {};
let currentObj = undefined;

let sendMessageQueue = [];


SendManager.Ioc = function(im){
   currentObj = im;
}


SendManager.checkQueueLength = function(){
    return sendMessageQueue.length;
}

SendManager.addSendMessage = function(message,callback){

    sendMessageQueue.push(message);
    console.log("message 加入发送队列",message)
    callback && callback(true,message.MSGID);

}

SendManager.handleSendMessageQueue = function(){
    if(sendMessageQueue.length > 0){

        let copyMessageQueue = Helper.cloneArray(sendMessageQueue);
        sendMessageQueue = [];

        for(let item in copyMessageQueue){
            currentObj.sendMessage(copyMessageQueue[item]);

            // sendMessageQueue.shift();
        }
        copyMessageQueue = [];
    }
}

export default SendManager;