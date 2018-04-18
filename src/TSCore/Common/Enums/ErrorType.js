var ErrorType;
(function (ErrorType) {
    //不是好友
    ErrorType[ErrorType["NOTFRIEND"] = 6001] = "NOTFRIEND";
    //已经是好友
    ErrorType[ErrorType["ALREADYFRIEND"] = 6002] = "ALREADYFRIEND";
    //被加入黑名单
    ErrorType[ErrorType["BLACKLISTED"] = 6003] = "BLACKLISTED";
    //不在群
    ErrorType[ErrorType["NOTINGROUP"] = 6004] = "NOTINGROUP";
})(ErrorType || (ErrorType = {}));
export default ErrorType;
//# sourceMappingURL=ErrorType.js.map