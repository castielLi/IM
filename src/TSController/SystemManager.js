import MobileFS from '../TSCore/Tools/FileSystem/MoblieFS';
import SQLiteFactory from '../TSCore/Tools/SQLite/SQLiteFactory';
import FileNameEnum from '../TSCore/Tools/FileSystem/Enums/FileNameEnum';
export default class SystemManager {
    init(callback) {
        //创建登录数据库
        MobileFS.createDirectory("Files/All Users", (reslut) => {
            if (reslut)
                SQLiteFactory.CreateSQLite("login", "rn", "Files/All Users", "Data.db");
            callback && callback();
        });
        //保存登录者的头像
        MobileFS.createDirectory("Files/All Users", null, false, FileNameEnum.HeadImage);
    }
    /*
     * 登录成功后, 初始化文件夹和数据库
     */
    static LoginSuccess(loginAccount, callback) {
        MobileFS.createDirectory("Files/" + loginAccount, (reslut) => {
            if (reslut) {
                MobileFS.createDirectory("Files/" + loginAccount + "/Data", (dbReslut) => {
                    if (dbReslut)
                        SQLiteFactory.CreateSQLite("chat", "rn", "Files/" + loginAccount + "/Data", "IM.db");
                    //通知已经完成
                    callback && callback();
                });
                for (let item = 1; item <= Object.keys(FileNameEnum).length; item++) {
                    MobileFS.createDirectory("Files/" + loginAccount, null, true, item);
                }
            }
        });
    }
}
//# sourceMappingURL=SystemManager.js.map