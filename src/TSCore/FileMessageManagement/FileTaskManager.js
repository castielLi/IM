import FileDBManager from "./DBManagement/DBManager";
import FileManager from '../FileManagement/FileManager';
import UploadFileDto from '../FileManagement/Dtos/UploadFileDto';
import DownloadFileDto from '../FileManagement/Dtos/DownloadFileDto';
import ResourceType from '../IM/Enums/ResourceType';
import MobileFS from '.././Tools/FileSystem/MoblieFS';
export default class FileTaskManager {
    constructor(isDB, account) {
        this.fileManger = new FileManager(0, 0);
        this.account = account;
        if (isDB) {
            this.dbManager = new FileDBManager();
            this.fileManger.init(this);
            if (this.dbManager != null) {
                //加载数据库中数据(上传数据和下载数据)
                this.dbManager.loadUploadData((data) => {
                    if (data == null || data.length == 0)
                        return;
                    //添加到数据库上传文件表
                    for (let index = 0; index < data.length; index++) {
                        data[index].data = JSON.parse(data[index].data);
                        this.addUpload(data[index]);
                    }
                });
                this.dbManager.loadDownloadData((data) => {
                    if (data == null || data.length == 0)
                        return;
                    //添加到数据库下载文件表
                    for (let index = 0; index < data.length; index++) {
                        this.addDownload(data[index], this.account.accountId);
                    }
                });
            }
        }
    }
    static getSingleInstance(isDB, account) {
        if (FileTaskManager.SingleInstance == null) {
            FileTaskManager.SingleInstance = new FileTaskManager(isDB, account);
        }
        return FileTaskManager.SingleInstance;
    }
    init(callback) {
        this.callbackManager = callback;
    }
    upload(param) {
        //添加到数据库上传文件表
        if (this.dbManager != null) {
            let dbParam = Object.assign({}, param);
            dbParam.data = JSON.stringify(dbParam.data);
            this.dbManager.addUploadData(dbParam);
        }
        this.addUpload(param);
    }
    download(param) {
        //添加到数据库下载文件表
        if (this.dbManager != null) {
            this.dbManager.addDownloadData(param);
        }
        this.addDownload(param, this.account.accountId);
    }
    //上传进度
    UploadRate(index, rate, callBackParam) {
        if (this.callbackManager == null)
            return;
        if (callBackParam == null)
            return;
        this.callbackManager.UploadRate(callBackParam.chatId, callBackParam.group, callBackParam.data, rate);
    }
    //下载进度
    DownloadRate(index, rate, callBackParam) {
        if (this.callbackManager == null)
            return;
        if (callBackParam == null)
            return;
        this.callbackManager.DownloadRate(callBackParam.chatId, callBackParam.group, callBackParam.messageId, rate);
    }
    //上传失败
    UploadFail(failCode, index, callBackParam) {
        if (this.callbackManager == null)
            return;
        if (callBackParam == null)
            return;
        //删除数据库
        if (this.dbManager != null) {
            this.dbManager.removeUploadData(callBackParam.chatId, callBackParam.group, callBackParam.data.MSGID);
        }
        this.callbackManager.UploadFail(callBackParam.chatId, callBackParam.group, callBackParam.data, failCode);
    }
    //下载失败
    DownloadFail(failCode, index, callBackParam) {
        if (this.callbackManager == null)
            return;
        if (callBackParam == null)
            return;
        //删除数据库
        if (this.dbManager != null) {
            this.dbManager.removeDownloadData(callBackParam.chatId, callBackParam.group, callBackParam.messageId);
        }
        this.callbackManager.DownloadFail(callBackParam.chatId, callBackParam.group, callBackParam.messageId, failCode);
    }
    //上传完成
    UploadSuccess(index, url, callBackParam) {
        if (this.callbackManager == null)
            return;
        if (callBackParam == null)
            return;
        //删除数据库
        if (this.dbManager != null) {
            this.dbManager.removeUploadData(callBackParam.chatId, callBackParam.group, callBackParam.data.MSGID);
        }
        this.callbackManager.UploadSuccess(callBackParam.chatId, callBackParam.group, callBackParam.data, url);
    }
    //下载完成
    DownloadSuccess(index, url, callBackParam) {
        if (this.callbackManager == null)
            return;
        if (callBackParam == null)
            return;
        //删除数据库
        if (this.dbManager != null) {
            this.dbManager.removeDownloadData(callBackParam.chatId, callBackParam.group, callBackParam.messageId);
        }
        this.callbackManager.DownloadSuccess(callBackParam.chatId, callBackParam.group, callBackParam.messageId, url);
    }
    destroyInstance() {
        // if(this.dbManager != null)
        //     this.dbManager.logout();
        FileTaskManager.SingleInstance = null;
    }
    addUpload(param) {
        if (param == null)
            return;
        let file = new UploadFileDto();
        file.FileUrls = [param.fileUrl];
        file.CallBackParam = param;
        this.fileManger.Upload(file);
    }
    addDownload(param, account) {
        if (param == null)
            return;
        let file = new DownloadFileDto();
        let localPath;
        switch (param.type) {
            case ResourceType.VIDEO:
                localPath = MobileFS.getCurrentUserVideoPath();
                break;
            case ResourceType.AUDIO:
                localPath = MobileFS.getCurrentUserAudioPath();
                break;
            case ResourceType.IMAGE:
                localPath = MobileFS.getCurrentUserImagePath();
                break;
        }
        file.LocalPath = localPath;
        file.FileUrls = [param.fileUrl];
        file.CallBackParam = param;
        this.fileManger.Download(file);
    }
}
//# sourceMappingURL=FileTaskManager.js.map