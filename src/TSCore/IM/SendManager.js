import TimeHelper from "../Tools/TimeHelper";
export default class SendManager {
    constructor(logic) {
        this.waitSendMessages = {};
        this.sendTime = 200;
        this.timerId = 0;
        this.ackTimeout = 30000;
        this.logicManager = logic;
        this.start();
    }
    addSendMessage(messageId, sendInfo) {
        if (this.waitSendMessages[messageId] == null) {
            this.waitSendMessages[messageId] = sendInfo;
        }
    }
    ackMessage(messageId) {
        if (this.waitSendMessages[messageId] != null) {
            delete this.waitSendMessages[messageId];
        }
    }
    start() {
        if (this.timerId == 0) {
            let currentObj = this;
            let sendTask = () => {
                for (let messageId in this.waitSendMessages) {
                    let info = currentObj.waitSendMessages[messageId];
                    if (info == null) {
                        delete currentObj.waitSendMessages[messageId];
                        continue;
                    }
                    let timestamp = TimeHelper.getTimestamp();
                    if (info.lastSendTime == 0) {
                        currentObj.send(messageId);
                    }
                    else if (timestamp - info.lastSendTime > this.ackTimeout) {
                        if (info.maxSendCount == 0 || info.maxSendCount > info.sendCount) {
                            currentObj.send(messageId);
                        }
                        else {
                            delete this.waitSendMessages[messageId];
                            //TODO: 通知发送失败
                            currentObj.logicManager.sendFail(messageId);
                        }
                    }
                }
            };
            this.timerId = setInterval(sendTask, currentObj.sendTime);
        }
    }
    stop() {
        if (this.timerId > 0) {
            clearInterval(this.timerId);
        }
    }
    // private sendTask() {
    //     for (let messageId in this.waitSendMessages) {
    //         let info: SendInfoDto = this.waitSendMessages[messageId];
    //         if (info == null) {
    //             delete this.waitSendMessages[messageId];
    //             continue;
    //         }
    //         let timestamp: number = TimeHelper.getTimestamp();
    //         if (info.lastSendTime == 0) {//还没有发送过
    //             this.send(messageId);
    //         } else if (timestamp - info.lastSendTime > this.ackTimeout) {//已经超时
    //             if (info.maxSendCount == 0 || info.maxSendCount > info.sendCount) {//必须保证发送成功 || 没有超过发送次数
    //                 this.send(messageId);
    //             } else {//超过发送次数
    //                 delete this.waitSendMessages[messageId];
    //                 //TODO: 通知发送失败
    //                 this.logicManager.sendFail(messageId);
    //             }
    //         }
    //     }
    // }
    send(messageId) {
        let info = this.waitSendMessages[messageId];
        if (info == null) {
            delete this.waitSendMessages[messageId];
            return;
        }
        info.lastSendTime = TimeHelper.getTimestamp();
        info.sendCount++;
        //TODO: 调用sendById
        this.logicManager.sendById(messageId);
    }
}
//# sourceMappingURL=SendManager.js.map