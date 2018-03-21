import Queue from "../Tools/Queue";
import MessageStatus from "./Enums/MessageStatus";
export default class ReceiveManager {
    constructor(receiveManager, dbManager) {
        this.receiveQueue = new Queue("IM_ReceiveQueue");
        this.receiveTime = 10;
        this.sleepTime = 200;
        this.timerId = 0;
        this.messageManager = receiveManager;
        this.dbManager = dbManager;
        this.start();
    }
    start() {
        if (this.timerId == 0) {
            let currentObj = this;
            let receiveTask = () => {
                while (true) {
                    let message = currentObj.receiveQueue.receive();
                    if (message != null) {
                        if (message == null || message.length == 0)
                            return;
                        let messageDto = JSON.parse(message);
                        if (messageDto == null)
                            return;
                        currentObj.messageManager.onReceiveMessage(messageDto);
                        //修改接收消息状态
                        currentObj.dbManager.updateReceiveStatus(messageDto.MSGID, MessageStatus.RECEIVE_SUCCESS);
                        //currentObj.timerId = setTimeout(receiveTask, currentObj.receiveTime);
                    }
                    else {
                        currentObj.timerId = setTimeout(receiveTask, currentObj.sleepTime);
                        break;
                    }
                }
            };
            this.timerId = setTimeout(receiveTask, currentObj.sleepTime);
        }
    }
    stop() {
        if (this.timerId > 0) {
            clearTimeout(this.timerId);
        }
    }
    receive(message) {
        this.receiveQueue.send(message);
    }
}
//# sourceMappingURL=ReceiveManager.js.map