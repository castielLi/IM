var FailCode;
(function (FailCode) {
    //网络错误
    FailCode[FailCode["NET_ERROR"] = 1] = "NET_ERROR";
    //文件不存在
    FailCode[FailCode["FILE_NOT_EXIST"] = 2] = "FILE_NOT_EXIST";
    //文件已经存在
    FailCode[FailCode["FILE_EXIST"] = 3] = "FILE_EXIST";
    FailCode[FailCode["SAVE_ERROR"] = 4] = "SAVE_ERROR";
})(FailCode || (FailCode = {}));
export default FailCode;
//# sourceMappingURL=FailCode.js.map