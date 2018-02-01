import Config from "./Config";
import WebApiManager from "../TSCore/WebApiManagement/WebApiManager";
import ResultError from '../TSCore/WebApiManagement/Enums/ResultError';
import SystemManager from "./SystemManager";
export default class LoginController {
    constructor() {
        this.commonManager = WebApiManager.getSingleInstance(Config.IsDB);
    }
    //todo:第一次登陆的时候 初始化login表的sql  会比活取用户信息的sql 慢导致报错
    login(Account, Password, callback) {
        this.commonManager.login(Account, Password, (response) => {
            if (response.Result == ResultError.Success) {
                //设置当前客户的Id
                this.onLoginSuccess(response.Data.Account);
                callback && callback(response);
            }
            else {
                callback && callback(response);
            }
        });
    }
    loginWithToken(callback) {
        this.commonManager.loginWithToken((response) => {
            if (!response) {
                callback && callback(null);
            }
            if (response.Result == ResultError.Success) {
                //设置当前客户的Id
                this.onLoginSuccess(response.Data.Account);
                callback && callback(response);
            }
            else {
                callback && callback(response);
            }
        });
    }
    GetCaptcha(phoneNumber, callback) {
        this.commonManager.GetCaptcha(phoneNumber, (response) => {
            callback && callback(response);
        });
    }
    Registered(phoneNumber, password, nickname, captcha, callback) {
        this.commonManager.Registered(phoneNumber, password, nickname, captcha, (response) => {
            callback && callback(response);
        });
    }
    logOut() {
        // let account = this.commonManager.getCurrentAccount();
        // Config.SetLogout(account.Account);
        this.commonManager.logOut();
    }
    onLoginSuccess(account, callback) {
        //初始化文件目录，用户db，客户端类型
        SystemManager.LoginSuccess(account, callback);
        //创建UserManager和GroupManager实例
        this.commonManager.onLoginSuccess();
    }
}
//# sourceMappingURL=LoginController.js.map