import FileSaveManager from "./FileSaveManager";
import FailCode from "./Enums/FailCode";
export default class DownloadFileManager {
    constructor() {
    }
    //下载(远程文件地址, 本地保存路径, 保存方法, 回调方法{progress:function,complete:function,timeout:function,error:function}, 回调参数)
    Download(fileUrl, localPath, hander, callbackParam, specifiedName) {
        try {
            let request = new XMLHttpRequest();
            request.responseType = "blob";
            request.open("POST", fileUrl, true);
            if (hander["progress"]) {
                //监听进度事件
                request.addEventListener("progress", (event) => {
                    if (event.lengthComputable) {
                        //四舍五入
                        let percentComplete = Math.floor((event.loaded / event.total) * 100);
                        hander["progress"](percentComplete, callbackParam);
                    }
                }, false);
            }
            //下载结束
            if (hander["complete"]) {
                request.addEventListener("readystatechange", (event) => {
                    if (request.readyState === 4 && request.status === 200) {
                        //TODO: 根据不同类型设备, 引用不同JS处理
                        //hander.DownloadSuccess("", callbackParam); return;
                        // localPath = localPath.trim();
                        //解析名字, 组装地址
                        let path = localPath;
                        if (!specifiedName) {
                            let names = fileUrl.split('/');
                            let name = names[names.length - 1].split('?')[0];
                            path += "/" + name;
                        }
                        FileSaveManager.save(path, request._response, "base64", (localPath) => {
                            hander["complete"](true, localPath);
                        }, () => {
                            // hander["complete"](false);
                        });
                    }
                }, false);
            }
            //下载超时
            if (hander["timeout"]) {
                request.addEventListener("timeout", (event) => {
                    hander["timeout"](FailCode.NET_ERROR, callbackParam);
                }, false);
            }
            //下载错误
            if (hander["error"]) {
                request.addEventListener("error", (event) => {
                    hander["error"](FailCode.NET_ERROR, callbackParam);
                }, false);
            }
            //发送请求
            request.send();
        }
        catch (err) {
            throw err;
        }
    }
}
//# sourceMappingURL=DownloadManager.js.map