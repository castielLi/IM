var MessageStatus;
(function (MessageStatus) {
    //正在发送
    MessageStatus[MessageStatus["SENDING"] = 0] = "SENDING";
    //接收成功/发送成功
    MessageStatus[MessageStatus["SUCCESS"] = 1] = "SUCCESS";
    //下载失败/发送失败
    MessageStatus[MessageStatus["FAIL"] = 2] = "FAIL";
    //等待下载(如果是文件类型)
    MessageStatus[MessageStatus["WAIT_DOWNLOAD"] = 3] = "WAIT_DOWNLOAD";
    //正在下载(如果是文件类型)
    MessageStatus[MessageStatus["DOWNLOADING"] = 4] = "DOWNLOADING";
    //正在撤回
    MessageStatus[MessageStatus["RETACTING"] = 5] = "RETACTING";
})(MessageStatus || (MessageStatus = {}));
export default MessageStatus;
//# sourceMappingURL=MessageStatus.js.map