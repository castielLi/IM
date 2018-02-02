import MobileFS from '../TSCore/Tools/FileSystem/MoblieFS';
import SQLiteFactory from '../TSCore/Tools/SQLite/SQLiteFactory';
import FileNameEnum from '../TSCore/Tools/FileSystem/Enums/FileNameEnum';
export default class SystemManager {
    init(callback) {
        //创建登录数据库
        MobileFS.createDirectory("Files/AllUsers", (reslut) => {
            if (reslut) {
                SQLiteFactory.CreateSQLite("login", "rn", "Files/AllUsers", "Data.db", () => {
                    //保存登录者的头像
                    MobileFS.createDirectory("Files/AllUsers", null, false, FileNameEnum.HeadImage);
                    callback && callback();
                });
            }
            //todo lizongjun 如果创建文件夹失败应该怎么办？
        });
    }
    /*
     * 登录成功后, 初始化文件夹和数据库
     */
    static LoginSuccess(loginAccount, callback) {
        MobileFS.createDirectory("Files/" + loginAccount, (reslut) => {
            if (reslut) {
                MobileFS.createDirectory("Files/" + loginAccount + "/Data", (dbReslut) => {
                    if (dbReslut) {
                        SQLiteFactory.CreateSQLite("IM", "rn", "Files/" + loginAccount + "/Data", "IM.db", () => {
                            //通知已经完成
                            callback && callback();
                        });
                    }
                });
                MobileFS.createDirectory("Files/" + loginAccount, null, true, FileNameEnum.HeadImage);
                MobileFS.createDirectory("Files/" + loginAccount, null, true, FileNameEnum.Audio);
                MobileFS.createDirectory("Files/" + loginAccount, null, true, FileNameEnum.Video);
                MobileFS.createDirectory("Files/" + loginAccount, null, true, FileNameEnum.Image);
            }
        });
    }
}
//# sourceMappingURL=SystemManager.js.map