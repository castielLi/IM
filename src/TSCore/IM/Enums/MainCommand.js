var MainCommand;
(function (MainCommand) {
    //心跳
    MainCommand[MainCommand["MSG_HEART"] = 1] = "MSG_HEART";
    // 登出
    MainCommand[MainCommand["MSG_KICKOUT"] = 2] = "MSG_KICKOUT";
    // 客户端接收消息后,向服务器发送应答消息
    MainCommand[MainCommand["MSG_REV_ACK"] = 3] = "MSG_REV_ACK";
    // 客户端发送消息后, 服务器收到消息向客户端发送应答消息
    MainCommand[MainCommand["MSG_SEND_ACK"] = 4] = "MSG_SEND_ACK";
    // 错误消息
    MainCommand[MainCommand["MSG_ERROR"] = 5] = "MSG_ERROR";
    // 消息主体
    MainCommand[MainCommand["MSG_BODY"] = 6] = "MSG_BODY";
})(MainCommand || (MainCommand = {}));
export default MainCommand;
//# sourceMappingURL=MainCommand.js.map