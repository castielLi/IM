import RNFS from 'react-native-fs';
export default class FileSaveManager {
    constructor() {
    }
    static save(path, response, fileType = "base64", complete, error) {
        RNFS.writeFile(path, response, fileType)
            .then(() => {
            complete && complete(path, true);
        }).catch((err) => {
            console.log(err.message);
            // error && error(FailCode.SAVE_FAIL);
            error && error(path, false);
            throw err;
        });
    }
    static saveHeadImage(path, data, complete) {
        FileSaveManager.save(path, data, "base64", complete, complete);
    }
}
//# sourceMappingURL=FileSaveManager.js.map