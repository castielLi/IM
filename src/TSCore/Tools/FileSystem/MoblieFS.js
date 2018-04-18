/**
 * Created by apple on 2018/1/18.
 */
import RNFS from 'react-native-fs';
import FileNameEnum from './Enums/FileNameEnum';
export default class MoblieFS {
    static createDirectory(localPath, callback, specific, type) {
        let filePath = RNFS.DocumentDirectoryPath + "/" + localPath;
        if (type != null) {
            switch (type) {
                case FileNameEnum.HeadImage:
                    filePath += "/HeadImage";
                    if (specific) {
                        MoblieFS.filePaths = Object.assign({ HeadImage: filePath }, MoblieFS.filePaths);
                    }
                    else {
                        MoblieFS.filePaths = Object.assign({ AllUserHeadImage: filePath }, MoblieFS.filePaths);
                    }
                    break;
                case FileNameEnum.Audio:
                    filePath += "/Audio";
                    if (specific) {
                        MoblieFS.filePaths = Object.assign({ Audio: filePath }, MoblieFS.filePaths);
                    }
                    break;
                case FileNameEnum.Video:
                    filePath += "/Video";
                    if (specific) {
                        MoblieFS.filePaths = Object.assign({ Video: filePath }, MoblieFS.filePaths);
                    }
                    break;
                case FileNameEnum.Image:
                    filePath += "/Image";
                    if (specific) {
                        MoblieFS.filePaths = Object.assign({ Image: filePath }, MoblieFS.filePaths);
                    }
                    break;
            }
        }
        RNFS.exists(filePath).then((result) => {
            if (!result) {
                RNFS.mkdir(filePath).then(() => {
                    console.log('资源目录创建成功');
                    callback && callback(true);
                }).catch((err) => {
                    console.log(err);
                    callback && callback(false);
                    throw new Error();
                });
            }
            else {
                callback && callback(true);
            }
        }).catch((err) => {
            console.log(err);
            callback && callback(false);
            throw new Error();
        });
    }
    static createErrorLogFile() {
        let filePath = RNFS.DocumentDirectoryPath + "/Files/ErrorLog.txt";
        MoblieFS.filePaths = Object.assign({ ErrorLog: filePath }, MoblieFS.filePaths);
        MoblieFS.checkFileExist(filePath, (exist) => {
            if (!exist) {
                RNFS.writeFile(filePath, "", 'utf8');
            }
        });
    }
    static checkFileExist(localPath, callback) {
        RNFS.exists(localPath).then((exist) => {
            callback && callback(exist);
        }).catch((err) => {
            callback && callback(false);
        });
    }
    static getLoginUserHeadImagePath() {
        return MoblieFS.filePaths["AllUserHeadImage"];
    }
    static getCurrentUserHeadImagePath() {
        return MoblieFS.filePaths["HeadImage"];
    }
    static getCurrentUserImagePath() {
        return MoblieFS.filePaths["Image"];
    }
    static getCurrentUserVideoPath() {
        return MoblieFS.filePaths["Video"];
    }
    static getCurrentUserAudioPath() {
        return MoblieFS.filePaths["Audio"];
    }
    static getConfigSettingPath(configFileName) {
        return RNFS.DocumentDirectoryPath + "/Files/" + configFileName;
    }
    static ErrorLog(error) {
        let errorLogPath = RNFS.DocumentDirectoryPath + "/Files/ErrorLog.txt";
        RNFS.readFile(errorLogPath).then((result) => {
            if (result == null || result == "") {
                RNFS.writeFile(errorLogPath, error, 'utf8');
            }
            else {
                RNFS.appendFile(errorLogPath, error, 'utf8');
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    static readFileByPath(filePath, callback) {
        RNFS.readFile(filePath).then((result) => {
            callback && callback(result);
        }).catch((err) => {
            callback && callback(null);
        });
    }
    static writeFile(data, filePath, callback) {
        RNFS.writeFile(filePath, data, 'utf8')
            .then(() => {
            callback && callback(true);
        })
            .catch((err) => {
            callback && callback(false);
            throw err;
        });
    }
}
MoblieFS.filePaths = {};
//# sourceMappingURL=MoblieFS.js.map