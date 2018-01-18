/**
 * Created by apple on 2018/1/18.
 */
import RNFS from 'react-native-fs';
export default class MoblieFS {
    static createDirectory(localPath) {
        let filePath = RNFS.DocumentDirectoryPath + localPath;
        RNFS.exists(filePath).then((result) => {
            if (!result) {
                RNFS.mkdir(filePath).then(() => {
                    console.log('资源目录创建成功');
                }).catch((err) => {
                    console.log(err);
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    static fillingFullPath(localPath) {
        return RNFS.DocumentDirectoryPath + localPath;
    }
    static createChatResourceFile(accountId, chatId, group) {
        let filePath = RNFS.DocumentDirectoryPath + "/" + accountId;
        let directoryNames = ["image", "audio", "video"];
        for (let i = 0; i < directoryNames.length; i++) {
            let chatName = (group ? "group-" : "private-") + chatId;
            let path = filePath + "/" + directoryNames[i] + "/chat/" + chatName;
            RNFS.mkdir(path).then(() => {
                console.log("创建聊天目录" + directoryNames[i] + "成功");
            });
        }
    }
    static initDirectory(path) {
        let filePath = RNFS.DocumentDirectoryPath + "/" + path;
        RNFS.exists(filePath).then((result) => {
            if (!result) {
                RNFS.mkdir(filePath).then(() => {
                    console.log("创建根目录成功");
                    let imagePath = filePath + "/image";
                    let audioPath = filePath + "/audio";
                    let videoPath = filePath + "/video";
                    RNFS.mkdir(imagePath).then(() => {
                        console.log("创建根目录下image目录成功");
                    });
                    RNFS.mkdir(audioPath).then(() => {
                        console.log("创建根目录下audio目录成功");
                    });
                    RNFS.mkdir(videoPath).then(() => {
                        console.log("创建根目录下video目录成功");
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }
}
//# sourceMappingURL=MoblieFS.js.map