/**
 * Created by apple on 2017/12/20.
 */
import Queue from "../Tools/Queue";
import DBManager from "./DBManagement/DBManager";
import MoblieFS from '../Tools/FileSystem/MoblieFS';
import FileManager from "../FileManagement/FileManager";
import DownloadFileDto from '../FileManagement/Dtos/DownloadFileDto';
import HeadImageConfig from "./HeadImageConfig";
<<<<<<< Updated upstream:src/TSCore/HeadImageManager/HeadImageManager.js
=======
import UploadFileDto from "../../../FileManagement/Dtos/UploadFileDto";
import FileSaveManager from "../../../Tools/DownloadFile/FileSaveManager";
import UploadHeadImageCallbackParamDto from "./Dtos/UploadHeadImageCallbackParamDto";
>>>>>>> Stashed changes:src/TSCore/WebApiManagement/UserManagement/HeadImageManager/HeadImageManager.js
export default class HeadImageManager {
    constructor(isDB, Account) {
        this.dbManager = null;
        this.headImageQueue = new Queue("HeadImage");
        this.downloadTime = 10;
        this.sleepTime = 200;
        this.headImageCache = {};
        this.uploadHeadImageCache = {};
        this.timerId = 0;
<<<<<<< Updated upstream:src/TSCore/HeadImageManager/HeadImageManager.js
        this.fileDownloadManager = null;
        if (isDB)
            this.dbManager = new DBManager();
        this.fileDownloadManager = new FileManager();
        this.fileDownloadManager.init(this);
=======
        this.fileManager = null;
        this.handle = null;
        this.uploadRequestIndex = 0;
        if (isDB)
            this.dbManager = new DBManager();
        this.fileManager = new FileManager();
        this.fileManager.init(this);
        if (this.dbManager != null) {
            //加载数据库中数据
            this.dbManager.getUploadRecord(Account, (data) => {
                if (data == null || data.length == 0)
                    return;
                this.addUploadHandle(data.userId, data.localPath);
            });
        }
>>>>>>> Stashed changes:src/TSCore/WebApiManagement/UserManagement/HeadImageManager/HeadImageManager.js
        this.start();
    }
    static getSingleInstance(isDB, Account) {
        if (HeadImageManager.SingleInstance == null) {
            HeadImageManager.SingleInstance = new HeadImageManager(isDB, Account);
        }
        return HeadImageManager.SingleInstance;
    }
    start() {
        if (this.timerId == 0) {
            let currentObj = this;
            let headImageTask = () => {
                if (this.timerId != 0)
                    clearTimeout(currentObj.timerId);
                let userId = currentObj.headImageQueue.receive();
                if (userId != null) {
                    //若有数据库的情况判断数据库，否则不需要下载
                    if (this.dbManager != null) {
                        this.dbManager.getHeadImageById(userId, (dto) => {
                            //若网络地址为空则只存储或者更新数据库，不进行下载处理
                            if (this.headImageCache[userId] == "") {
                                this.dbManager.addHeadImage(userId, this.headImageCache[userId]);
                            }
                            else {
                                let resourceDto = new DownloadFileDto();
                                resourceDto.SpecifiedName = true;
                                resourceDto.LocalPath = this.getPathBySpecifiedUser(userId);
                                resourceDto.FileUrls = [];
                                //判断如果数据库和缓存中的值不一致则使用缓存中的值，进行下载并且更新数据库
                                //如果是缓存中没有相关数据，或者是一致的情况则直接使用数据库中的url重新进行下载
                                if (this.headImageCache[userId] != undefined && dto.HeadImageUrl != this.headImageCache[userId]) {
                                    let remoteURL = this.typeHeadImageUrlWithJPG(this.headImageCache[userId]);
                                    resourceDto.FileUrls.push(remoteURL);
                                    //修改数据库中userId的headImage
                                    this.dbManager.addHeadImage(userId, this.headImageCache[userId]);
                                }
                                else {
                                    let remoteURL = this.typeHeadImageUrlWithJPG(dto.HeadImageUrl);
                                    resourceDto.FileUrls.push(remoteURL);
                                }
                                this.fileDownloadManager.Download(resourceDto);
                            }
                        });
                    }
                    this.timerId = setTimeout(headImageTask, currentObj.downloadTime);
                }
                this.timerId = setTimeout(headImageTask, currentObj.sleepTime);
            };
            this.timerId = setTimeout(headImageTask, this.sleepTime);
        }
    }
    addHeadImageRequest(userId, headImageUrl) {
        //如果出现脏数据的undefined的情况，将undefined设置成空字符串
        if (headImageUrl == undefined) {
            headImageUrl = "";
        }
        let oldRequest = this.headImageCache[userId];
        if (oldRequest != undefined && headImageUrl == oldRequest) {
            return;
        }
        this.headImageCache[userId] = headImageUrl;
        this.headImageQueue.send(userId);
    }
<<<<<<< Updated upstream:src/TSCore/HeadImageManager/HeadImageManager.js
=======
    addUploadHeadImageRequest(data, userId, callback) {
        let localPath = MoblieFS.getCurrentUserHeadImagePath() + "/" + userId + ".jpg";
        FileSaveManager.saveHeadImage(localPath, data, (path, success) => {
            callback && callback(path, success);
        });
        //添加上传头像db
        if (this.dbManager) {
            this.dbManager.addUploadRecord(userId, localPath);
        }
        //对上传进行标记，若在上传的过程中有新的上传请求来，则标记+1，上传成功回调判断标记是否是最新的请求，若是最新的请求
        //则删除数据库，标记清空，修改成功，否则需要进行等待上传到最新的标记才能进行操作，其余的操作都将丢弃
        this.uploadRequestIndex += 1;
        this.addUploadHandle(userId, localPath);
    }
    addUploadHandle(userId, localPath) {
        let dto = new UploadFileDto();
        dto.FileUrls = [localPath];
        let paramDto = new UploadHeadImageCallbackParamDto();
        paramDto.userId = userId;
        paramDto.index = this.uploadRequestIndex;
        dto.CallBackParam = paramDto;
        this.fileManager.Upload(dto);
    }
>>>>>>> Stashed changes:src/TSCore/WebApiManagement/UserManagement/HeadImageManager/HeadImageManager.js
    getUserHeadImagePath(userId) {
        //查看当前用户headImage目录下是否有文件，若没有也需要进行下载
        let path = this.getPathBySpecifiedUser(userId);
        MoblieFS.checkFileExist(path, (exist) => {
            if (exist) {
                this.dbManager.getHeadImageById(userId, (dto) => {
                    if (dto.HeadImageUrl != this.headImageCache[userId]) {
                        this.addHeadImageRequest(userId, dto.HeadImageUrl);
                    }
                });
            }
        });
        return path;
    }
    stop() {
        if (this.timerId > 0) {
            clearTimeout(this.timerId);
        }
    }
    logout() {
        HeadImageManager.SingleInstance = null;
    }
    //下载失败
    DownloadFail(failCode, callBackParam) {
        //重新加入队列中去下载
        let callbackParam = callBackParam;
        this.headImageQueue.send(callbackParam.userId);
    }
    UploadRate(index, rate, callBackParam) {
    }
    //下载进度
    DownloadRate(index, rate, callBackParam) {
    }
    //上传失败
    UploadFail(failCode, index, callBackParam) {
        let param = callBackParam;
        //重新进行upload上传处理
        if (param.index == this.uploadRequestIndex) {
            let localPath = MoblieFS.getCurrentUserHeadImagePath() + "/" + param.userId + ".jpg";
            this.addUploadHandle(param.userId, localPath);
        }
    }
    //上传成功
    UploadSuccess(index, url, callBackParam) {
<<<<<<< Updated upstream:src/TSCore/HeadImageManager/HeadImageManager.js
=======
        let uploadRequestIndex = callBackParam.index;
        //当上传的图片的标记已经不是最新的上传标记了，直接丢弃掉
        if (uploadRequestIndex == this.uploadRequestIndex) {
            this.handle.HeadImageUploadSuccess && this.handle.HeadImageUploadSuccess(url);
            //删除上传数据库记录
            if (this.dbManager) {
                this.dbManager.removeUploadRecord(callBackParam);
            }
            this.uploadRequestIndex = 0;
        }
>>>>>>> Stashed changes:src/TSCore/WebApiManagement/UserManagement/HeadImageManager/HeadImageManager.js
    }
    //下载完成
    DownloadSuccess(index, url, callBackParam) {
    }
    typeHeadImageUrlWithJPG(headImageUrl) {
        return headImageUrl + "?imageView2/1/w/" + HeadImageConfig.defaultWidth + "/h/" + HeadImageConfig.defaultHeight + "/format/" + HeadImageConfig.SuffixName;
    }
    getPathBySpecifiedUser(userId) {
        return MoblieFS.getCurrentUserHeadImagePath() + "/" + userId + "." + HeadImageConfig.SuffixName;
    }
}
//# sourceMappingURL=HeadImageManager.js.map