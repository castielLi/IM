var ApplyMessageStatus;
(function (ApplyMessageStatus) {
    //等待处理
    ApplyMessageStatus[ApplyMessageStatus["WAIT"] = 0] = "WAIT";
    //已添加
    ApplyMessageStatus[ApplyMessageStatus["ADDED"] = 1] = "ADDED";
    //过期
    ApplyMessageStatus[ApplyMessageStatus["EXPIRED"] = 2] = "EXPIRED";
    //拒绝
    ApplyMessageStatus[ApplyMessageStatus["REJECT"] = 3] = "REJECT";
})(ApplyMessageStatus || (ApplyMessageStatus = {}));
export default ApplyMessageStatus;
//# sourceMappingURL=ApplyMessageStatus.js.map