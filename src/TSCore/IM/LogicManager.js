import MessageDto from "./Dtos/MessageDto";
import DBMessageDto from "./Dtos/DBMessageDto";
import MainCommand from "./Enums/MainCommand";
import WebSocketManager from "../Socket/WebSocketManager";
import SocktParam from "../Socket/SocktParam";
import SendManager from "./SendManager";
import ReceiveManager from "./ReceiveManager";
import DBManager from "./DBManagement/DBManager";
import SendInfoDto from "./Dtos/SendInfoDto";
import MessageStatus from "./Enums/MessageStatus";
export default class LogicManager {
    constructor(messageManager, isDB, socketUrl) {
        this.dbManager = null;
        this.messages = {};
        if (isDB)
            this.dbManager = new DBManager();
        this.messageLogic = messageManager;
        let param = new SocktParam(this);
        this.socket = new WebSocketManager();
        this.socket.init(param);
        this.sendManager = new SendManager(this);
        this.receiveManager = new ReceiveManager(this.messageLogic, this.dbManager);
        if (this.dbManager != null) {
            //从DB加载未发送消息
            this.dbManager.getUnSendMessage((msgs) => {
                if (msgs.length == 0)
                    return;
                for (let index = 0; index < msgs.length; index++) {
                    let msg = msgs[index];
                    this.sendMessage(JSON.parse(msg.message));
                }
            });
            //从DB加载接收消息没有推送到上层的消息
            this.dbManager.getUnPushMessage((msgs) => {
                if (msgs.length == 0)
                    return;
                for (let index = 0; index < msgs.length; index++) {
                    let msg = msgs[index];
                    this.receiveManager.receive(msg.message);
                }
            });
        }
        this.socket.connect(socketUrl);
    }
    static getSingleInstance(messageManager, isDB, socketUrl) {
        if (LogicManager.SingleInstance == null) {
            LogicManager.SingleInstance = new LogicManager(messageManager, isDB, socketUrl);
        }
        return LogicManager.SingleInstance;
    }
    //连接成功
    onConnect() {
        this.sendManager.start();
        this.receiveManager.start();
        //通知上层连接成功
        this.messageLogic.onConnect();
    }
    //关闭连接
    onClosed() {
        this.sendManager.stop();
        this.receiveManager.stop();
        //通知上层关闭连接
        this.messageLogic.onClosed();
    }
    //socket错误
    onError(message) {
        //通知上层socket错误
        this.messageLogic.onError(message);
    }
    //收到消息
    onMessage(message) {
        if (message == null || message.length == 0)
            return;
        let messageDto;
        try {
            messageDto = JSON.parse(message);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        if (messageDto == null)
            return;
        //不是心跳信号都保存到数据库
        //todo:lizongjun 现在是对ack消息进行了过滤，其实ack消息收到了之后应该是直接设置为receivesuccess状态
        if (messageDto.Command != MainCommand.MSG_HEART && messageDto.Command != MainCommand.MSG_SEND_ACK) {
            //数据库现在是insert or replace
            let dbDto = new DBMessageDto(messageDto.MSGID, message);
            //保存消息到DB
            if (this.dbManager != null) {
                this.dbManager.addReceiveMessage(dbDto);
            }
        }
        switch (messageDto.Command) {
            //心跳
            case MainCommand.MSG_HEART:
                this.socket.send(message);
                break;
            case MainCommand.MSG_SEND_ACK:
                //修改状态 -> 发送成功
                if (this.dbManager != null) {
                    this.dbManager.updateSendStatus(messageDto.Data, MessageStatus.SEND_SUCCESS);
                }
                let sendMessageDto = this.messages[messageDto.Data];
                //消除内存数据
                delete this.messages[messageDto.Data];
                //从发送队列去除
                this.sendManager.ackMessage(messageDto.Data);
                if (sendMessageDto == null) {
                    if (this.dbManager != null) {
                        this.dbManager.getMessage(messageDto.Data, (msg) => {
                            if (msg != null) {
                                this.messageLogic.onSendSuccess(JSON.parse(msg.message));
                            }
                            else {
                                this.messageLogic.onSendSuccessById(messageDto.Data);
                            }
                        });
                    }
                    else {
                        this.messageLogic.onSendSuccessById(messageDto.Data);
                    }
                }
                else {
                    //通知发送成功
                    this.messageLogic.onSendSuccess(JSON.parse(sendMessageDto));
                }
                break;
            case MainCommand.MSG_BODY:
                if (messageDto.Data == null)
                    return;
                let body = messageDto.Data;
                if (body == null)
                    return;
                if (body.IsACK) {
                    //发送ACK
                    this.sendReceiveAck(messageDto.MSGID);
                }
                //保存到接收队列
                this.receiveManager.receive(message);
                break;
            case MainCommand.MSG_ERROR://错误消息
                //发送ACK
                this.sendReceiveAck(messageDto.MSGID);
                //保存到接收队列
                this.receiveManager.receive(message);
                break;
            case MainCommand.MSG_KICKOUT://登出
                this.socket.close();
                //通知上层被登出
                this.messageLogic.kickOut();
                break;
            case MainCommand.MSG_REV_ACK://不做处理
                break;
        }
    }
    //准备重新连接(网络已经断开)
    onWillReconnect() {
        //通知上层正在重新连接
        this.messageLogic.onWillReconnect();
    }
    //发送消息
    sendMessage(message) {
        //添加到队列
        if (message == null)
            return;
        //保存消息到内存
        this.messages[message.MSGID] = JSON.stringify(message);
        //保存消息到发送表
        let dbMessage = new DBMessageDto(message.MSGID, JSON.stringify(message));
        this.dbManager.addSendMessage(dbMessage);
        //添加入发送队列
        let sendInfo = new SendInfoDto();
        this.sendManager.addSendMessage(message.MSGID, sendInfo);
    }
    //关闭连接
    close() {
        this.socket.close();
    }
    destroyInstance() {
        // if(this.dbManager != null)
        //     this.dbManager.logout();
        LogicManager.SingleInstance = null;
    }
    //TODO: 测试大量接收消息时对界面是否有影响, 如果有影响就把ACK放到发送队列中处理
    sendReceiveAck(messageId) {
        //发送ACK
        let ackMessage = new MessageDto();
        ackMessage.createMessage(MainCommand.MSG_REV_ACK, "ack");
        ackMessage.Data = messageId;
        this.socket.send(JSON.stringify(ackMessage));
    }
    //将消息推给socket
    send(message) {
        this.socket.send(message);
    }
    sendById(messageId) {
        if (this.messages[messageId]) {
            this.send(this.messages[messageId]);
        }
    }
    sendFail(messageId) {
        if (this.dbManager != null) {
            this.dbManager.updateReceiveStatus(messageId, MessageStatus.SEND_FAIL);
        }
        if (this.messageLogic != null) {
            if (this.messages[messageId] != null)
                this.messageLogic.onSendFail(this.messages[messageId]);
            else
                this.messageLogic.onSendFailById(messageId);
        }
    }
}
//# sourceMappingURL=LogicManager.js.map