/**
 * Created by apple on 2017/10/11.
 */
import * as Helper from '../Helper'
import UpdateMessageSqliteType from './UpdateMessageSqliteType'


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

export default ReceiveManager;