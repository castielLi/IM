import Queue from "../Tools/Queue";
import FileDto from "./Dtos/FileDto";
import NetCallbackParamDto from "./Dtos/NetCallbackParamDto";
import Qiniu from '../QiniuClound/Qiniu';
export default class FileManager {
    constructor(maxUpload = 0, maxDownload = 0) {
        //最大上传数
        this.maxUploadCount = 5;
        //最大下载数
        this.maxDownloadCount = 5;
        //正在上传数
        this.uploadingCount = 0;
        //正在下载数
        this.downloadingCount = 0;
        this.uploadQueue = new Queue("FileUpload");
        this.downloadQueue = new Queue("FileDownload");
        //上传进度
        this.UploadRate = function (rate, callBackParam) {
            this.callBack.UploadRate && this.callBack.UploadRate(callBackParam.Index, rate, callBackParam.CallBackParam);
        };
        //下载进度
        this.DownloadRate = function (rate, callBackParam) {
            this.callBack.DownloadRate && this.callBack.DownloadRate(callBackParam.Index, rate, callBackParam.CallBackParam);
        };
        //上传失败
        this.UploadFail = function (failCode, callBackParam) {
            this.uploadingCount--;
            this.StartUpload();
            this.callBack.UploadFail && this.callBack.UploadFail(failCode, callBackParam.Index, callBackParam.CallBackParam);
        };
        //下载失败
        this.DownloadFail = function (failCode, callBackParam) {
            this.downloadingCount--;
            this.StartDownload();
            this.callBack.DownloadFail && this.callBack.DownloadFail(failCode, callBackParam.Index, callBackParam.CallBackParam);
        };
        //上传完成
        this.UploadSuccess = function (url, callBackParam) {
            this.uploadingCount--;
            this.StartUpload();
            this.callBack.UploadSuccess && this.callBack.UploadSuccess(callBackParam.Index, url, callBackParam.CallBackParam);
        };
        //下载完成
        this.DownloadSuccess = function (url, callBackParam) {
            this.downloadingCount--;
            this.StartDownload();
            this.callBack.DownloadSuccess && this.callBack.DownloadSuccess(callBackParam.Index, url, callBackParam.CallBackParam);
        };
        if (maxUpload > 0) {
            this.maxUploadCount = maxUpload;
        }
        if (maxDownload > 0) {
            this.maxDownloadCount = maxDownload;
        }
        this.netFileManager = new Qiniu();
    }
    //回调(hander: 回调接口)
    init(hander) {
        this.callBack = hander;
    }
    //上传
    Upload(file) {
        for (let index = 0; index < file.FileUrls.length; index++) {
            let fileDto = new FileDto();
            fileDto.Index = index;
            fileDto.FileUrl = file.FileUrls[index];
            fileDto.CallBackParam = file.CallBackParam;
            fileDto.ParamPath = file.ServerUrl;
            this.uploadQueue.send(fileDto);
        }
        this.StartUpload();
    }
    //下载
    Download(file) {
        for (let index = 0; index < file.FileUrls.length; index++) {
            let fileDto = new FileDto();
            fileDto.Index = index;
            fileDto.FileUrl = file.FileUrls[index];
            fileDto.CallBackParam = file.CallBackParam;
            fileDto.ParamPath = file.LocalPath;
            //若SpecifiedName 为false则用网络路径最后字段做文件名，否则用本地地址最后字段做文件名
            fileDto.SpecifiedName = (file.SpecifiedName != null && file.SpecifiedName) ? true : false;
            this.downloadQueue.send(fileDto);
        }
        this.StartDownload();
    }
    StartUpload() {
        while (this.uploadingCount < this.maxUploadCount) {
            let fileDto = this.uploadQueue.receive();
            if (fileDto == null)
                return;
            let callbackDto = new NetCallbackParamDto();
            callbackDto.Index = fileDto.Index;
            callbackDto.CallBackParam = fileDto.CallBackParam;
            this.netFileManager.Upload(fileDto.FileUrl, fileDto.ParamPath, this, callbackDto);
            //累计上传
            this.uploadingCount++;
        }
    }
    StartDownload() {
        while (this.downloadingCount < this.maxDownloadCount) {
            let fileDto = this.downloadQueue.receive();
            if (fileDto == null)
                return;
            let callbackDto = new NetCallbackParamDto();
            callbackDto.Index = fileDto.Index;
            callbackDto.CallBackParam = fileDto.CallBackParam;
            this.netFileManager.Download(fileDto.FileUrl, fileDto.ParamPath, this, callbackDto, fileDto.SpecifiedName);
            //累计上传
            this.downloadingCount++;
        }
    }
}
//# sourceMappingURL=FileManager.js.map