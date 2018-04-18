var MessageStatus;
(function (MessageStatus) {
    //未发送
    MessageStatus[MessageStatus["UN_SEND"] = 0] = "UN_SEND";
    //发送失败
    MessageStatus[MessageStatus["SEND_FAIL"] = 1] = "SEND_FAIL";
    //发送成功
    MessageStatus[MessageStatus["SEND_SUCCESS"] = 2] = "SEND_SUCCESS";
    //接收
    MessageStatus[MessageStatus["RECEIVE"] = 3] = "RECEIVE";
    //接收成功
    MessageStatus[MessageStatus["RECEIVE_SUCCESS"] = 4] = "RECEIVE_SUCCESS";
})(MessageStatus || (MessageStatus = {}));
export default MessageStatus;
//# sourceMappingURL=MessageStatus.js.map