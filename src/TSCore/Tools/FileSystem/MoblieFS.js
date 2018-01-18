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
}
//# sourceMappingURL=MoblieFS.js.map