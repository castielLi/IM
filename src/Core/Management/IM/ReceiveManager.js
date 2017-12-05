/**
 * Created by apple on 2017/10/11.
 */
import ResourceTypeEnum from '../Common/dto/ResourceTypeEnum'


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

ReceiveManager.receiveBodyMessage = function(message){

    //todo:lizongjun  这里收到了消息之后，如果是错误消息，需要数据库查询之前发送消息的msgid 获取到isack属性，如果需要ack则进行发送


    if(!message.Resource || (message.Resource[0].FileType == ResourceTypeEnum.audio ))
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
