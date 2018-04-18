import DownloadFileManager from "../Tools/DownloadFile/DownloadManager";
import config from "./config";
import Rpc from "./Rpc";
import FailCode from '../FileManagement/Enums/FailCode';
import uuidv1 from 'uuid/v1';
export default class Qiniu {
    constructor() {
        //文件下载
        this.download = new DownloadFileManager();
    }
    //上传(本地文件地址, 服务器路径, 回调方法, 回调参数)
    Upload(fileUrl, serverPath, hander, callbackParam) {
        return new Promise((resolve, reject) => {
            let keys = fileUrl.split("/");
            // let key = keys[keys.length - 1];
            let key = uuidv1() + new Date().getTime() + keys[keys.length - 1];
            fetch(config.TOKEN_URL + key).then(response => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                }
                else {
                    reject && reject(callbackParam);
                }
            }).then(response => {
                if (response != undefined) {
                    return response.json();
                }
            }).then(response => {
                let formInput = {
                    key: key,
                };
                Rpc.uploadFile(fileUrl, response.Value, formInput, function (event, xhr) {
                    hander.UploadRate(Math.floor(event), callbackParam);
                }).then(() => {
                    let result = {
                        key: key,
                        url: config.QIY_URL + key
                    };
                    hander.UploadSuccess(result.url, callbackParam);
                    resolve && resolve(callbackParam);
                }, (xhr) => {
                    hander.UploadFail(FailCode.NET_ERROR, callbackParam);
                    reject && reject(callbackParam);
                });
            }).catch(e => {
                console.log(e);
                hander.UploadFail(FailCode.NET_ERROR, callbackParam);
                reject && reject(callbackParam);
                throw e;
            });
        });
    }
    Download(fileUrl, localPath, hander, callbackParam, specifiedName) {
        this.download.Download(fileUrl, localPath, {
            progress: function (rate) {
                hander.DownloadRate(rate, callbackParam);
            }, complete: function (success, path) {
                if (success) {
                    hander.DownloadSuccess(path, callbackParam);
                }
                else {
                    hander.DownloadFail(FailCode.FILE_NOT_EXIST, callbackParam);
                }
            }, timeout: function () {
                hander.DownloadFail(FailCode.NET_ERROR, callbackParam);
            }, error: function () {
                hander.DownloadFail(FailCode.NET_ERROR, callbackParam);
            }
        }, callbackParam, specifiedName);
    }
}
//# sourceMappingURL=Qiniu.js.map