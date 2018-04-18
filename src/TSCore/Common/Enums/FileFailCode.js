var FileFailCode;
(function (FileFailCode) {
    //网络错误
    FileFailCode[FileFailCode["NET_ERROR"] = 1] = "NET_ERROR";
    //文件不存在
    FileFailCode[FileFailCode["FILE_NOT_EXIST"] = 2] = "FILE_NOT_EXIST";
    //文件已经存在
    FileFailCode[FileFailCode["FILE_EXIST"] = 3] = "FILE_EXIST";
})(FileFailCode || (FileFailCode = {}));
export default FileFailCode;
//# sourceMappingURL=FileFailCode.js.map