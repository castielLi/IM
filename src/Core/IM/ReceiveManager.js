/**
 * Created by apple on 2017/10/11.
 */
import * as Helper from '../Helper'
import UpdateMessageSqliteType from './UpdateMessageSqliteType'
import MessageType from './dto/MessageType'

let ReceiveManager = {};
let currentObj = undefined;

let recieveMessageQueue = [];

ReceiveManager.Ioc = function(im){
    currentObj = im;
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
    if(message.type == MessageType.text || message.type == MessageType.friend)
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
}

export default ReceiveManager;