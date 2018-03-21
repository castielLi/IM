import LoginDto from "./Request/Dtos/LoginDto";
import LoginWithTokenDto from "./Request/Dtos/LoginWithTokenDto";
import RequestManager from "./Request/RequestManager";
import ApiResponseDto from '../Dtos/ApiResponseDto';
import LoginUserInfoDto from './Dtos/LoginUserInfoDto';
import GetCaptchaDto from './Request/Dtos/GetCaptchaDto';
import RegisteredDto from './Request/Dtos/RegisteredDto';
import ResultError from '../Enums/ResultError';
import LoginDBManager from "./DBManagement/LoginDBManager";
import SQLiteFactory from '../../Tools/SQLite/SQLiteFactory';
import Config from "../../../Config";
import WebApiConfig from "../WebApiConfig";
export default class LoginManager {
    constructor(isDB) {
        //TODO:没有初始化
        this.dbManager = null;
        this.httpManager = null;
        this.loginCache = null;
        if (isDB) {
            //初始化全局config，设置当前环境为RN 或者是web
            this.dbManager = new LoginDBManager();
        }
        //http不需要存到db中去
        this.httpManager = new RequestManager(isDB);
    }
    static getSingleInstance(isDB) {
        if (LoginManager.SingleInstance == null) {
            LoginManager.SingleInstance = new LoginManager(isDB);
        }
        return LoginManager.SingleInstance;
    }
    getCurrentUser() {
        return this.loginCache;
    }
    modifyLoginUser(info) {
        this.loginCache = info;
        if (this.dbManager)
            this.dbManager.addUser(info);
    }
    login(Account, Password, callback) {
        let params = new LoginDto();
        params.Account = Account;
        params.DeviceNumber = Config.DeviceId;
        params.DeviceType = Config.DeviceType;
        params.LoginIP = "192.168.0.103";
        params.Password = Password;
        this.httpManager.login(params, (response) => {
            if (response.success && response.data != null) {
                let loginResult = response.data;
                if (loginResult.Result == ResultError.Success) {
                    this.LoginSuccessHandle(loginResult.Data);
                }
                callback && callback(loginResult);
            }
            else {
                this.LoginFailHandle(response, callback);
            }
        });
    }
    checkLoginToken(callback) {
        if (this.dbManager) {
            this.dbManager.getUser((user) => {
                if (user != null) {
                    this.loginCache = user;
                }
                callback && callback(user);
            });
        }
        else {
            callback && callback(null);
        }
    }
    loginWithToken(callback) {
        //目前位置 只有两层的结构this指针才有效，如果是多层this指针会失效
        let currentObj = this;
        if (this.dbManager) {
            this.dbManager.getUser((user) => {
                if (user != null) {
                    //TODO:没有赋值
                    let params = new LoginWithTokenDto();
                    params.token = user.SessionToken;
                    this.httpManager.loginWithToken(params, (response) => {
                        if (response.success && response.data != null) {
                            let loginResult = response.data;
                            if (loginResult.Result == ResultError.Success) {
                                this.LoginSuccessHandle(loginResult.Data, user);
                            }
                            callback && callback(loginResult);
                        }
                        else {
                            this.LoginFailHandle(response, callback);
                        }
                    });
                }
                else {
                    callback(null);
                }
            });
        }
        else
            callback(null);
    }
    GetCaptcha(phoneNumber, callback) {
        let params = new GetCaptchaDto();
        params.PhoneNumber = phoneNumber;
        this.httpManager.GetCaptcha(params, callback);
    }
    Registered(phoneNumber, password, nickname, captcha, callback) {
        let params = new RegisteredDto();
        params.PhoneNumber = phoneNumber;
        params.Password = password;
        params.Nickname = nickname;
        params.Captcha = captcha;
        this.httpManager.Registered(params, callback);
    }
    destroyInstance() {
        let user = this.getCurrentUser();
        this.dbManager.removeUser(user);
        //销毁数据库
        SQLiteFactory.DestroySQLite("IM");
        this.loginCache = null;
    }
    //处理登陆成功返回的用户信息
    LoginSuccessHandle(loginResult, user) {
        let info = new LoginUserInfoDto();
        //如果当前用户的本地头像不等于获取的新的网络头像地址，则需要赋空本地头像地址，以重新下载新的头像
        if (user && user.HeadImageUrl != loginResult.HeadImageUrl) {
            info.HeadImagePath = "";
        }
        info.HeadImageUrl = loginResult.HeadImageUrl;
        info.GivenName = loginResult.GivenName;
        info.FamilyName = loginResult.FamilyName;
        info.PhoneNumber = loginResult.PhoneNumber;
        info.Email = loginResult.Email;
        info.Nickname = loginResult.Nickname;
        info.Gender = loginResult.Gender;
        info.IMToken = loginResult.IMToken;
        info.SessionToken = loginResult.SessionToken;
        info.Account = loginResult.Account;
        WebApiConfig.Authorization = info.SessionToken;
        if (this.dbManager)
            this.dbManager.addUser(info);
        this.loginCache = info;
    }
    //处理登陆失败返回的用户信息
    LoginFailHandle(response, callback) {
        let loginResult = new ApiResponseDto();
        loginResult.Result = ResultError.NetWorkFailed;
        loginResult.Data = response.errorMessage;
        callback && callback(loginResult);
    }
}
//# sourceMappingURL=LoginManager.js.map