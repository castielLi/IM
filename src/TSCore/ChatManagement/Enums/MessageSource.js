var MessageSource;
(function (MessageSource) {
    //发送消息
    MessageSource[MessageSource["SEND"] = 1] = "SEND";
    //接收消息
    MessageSource[MessageSource["RECEIVE"] = 2] = "RECEIVE";
    //系统消息
    MessageSource[MessageSource["SYSTEM"] = 3] = "SYSTEM";
    MessageSource[MessageSource["ERROR"] = 4] = "ERROR";
    MessageSource[MessageSource["FRIEND"] = 5] = "FRIEND";
})(MessageSource || (MessageSource = {}));
export default MessageSource;
//# sourceMappingURL=MessageSource.js.map