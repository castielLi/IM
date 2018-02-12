/**
 * Created by apple on 2017/12/20.
 */
import Queue from "../Tools/Queue";
import DBManager from "./DBManagement/DBManager";
import MoblieFS from '../Tools/FileSystem/MoblieFS';
import FileManager from "../FileManagement/FileManager";
import DownloadFileDto from '../FileManagement/Dtos/DownloadFileDto';
import HeadImageConfig from "./HeadImageConfig";
export default class HeadImageManager {
    constructor(isDB) {
        this.dbManager = null;
        this.headImageQueue = new Queue("HeadImage");
        this.downloadTime = 10;
        this.sleepTime = 200;
        this.headImageCache = {};
        this.timerId = 0;
        this.fileDownloadManager = null;
        if (isDB)
            this.dbManager = new DBManager();
        this.fileDownloadManager = new FileManager();
        this.fileDownloadManager.init(this);
        this.start();
    }
    static getSingleInstance(isDB) {
        if (HeadImageManager.SingleInstance == null) {
            HeadImageManager.SingleInstance = new HeadImageManager(isDB);
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
        let oldRequest = this.headImageCache[userId];
        if (oldRequest != undefined && headImageUrl == oldRequest) {
            return;
        }
        this.headImageCache[userId] = headImageUrl;
        this.headImageQueue.send(userId);
    }
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
    }
    UploadSuccess(index, url, callBackParam) {
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