/**
* Created by apple on 2017/12/25.
*/
//import DBConfigDto = Common.DBConfigDto;
import RequestURL from './RequestURL';
import RequestDto from '../../../HttpMangement/Dtos/RequestDto';
import WebApiConfig from "../../WebApiConfig";
import HttpFetchRequest from '../../../Tools/HTTP/HttpFetchRequest';
import Config from "../../../../Config";
export default class RequestManager {
    constructor(isDB) {
        this.request = new HttpFetchRequest();
    }
    login(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("login", param.Key, param, RequestURL.loginUrl, false, function (result) {
            callback && callback(result);
        });
    }
    loginWithToken(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        WebApiConfig.Authorization = param.token;
        this.requestInfo("loginWithToken", '', null, RequestURL.loginWithTokenUrl, false, callback);
    }
    GetCaptcha(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("GetCaptcha", '', param, RequestURL.GetCaptcha, false, callback);
    }
    Registered(param, callback) {
        if (param == null) {
            callback(null);
            return;
        }
        this.requestInfo("Registered", '', param, RequestURL.Registered, false, callback);
    }
    requestInfo(actionName, userId, param, url, forceSuccess, callback = null) {
        let request = new RequestDto();
        request.forceSuccess = forceSuccess;
        request.requestId = "user_" + actionName + "_" + "UserId" + userId;
        request.params = param;
        request.requestURL = Config.BaseUrl + url;
        request.header = { "Authorization": WebApiConfig.Authorization };
        let requestCallback = (key, result) => {
            if (result.success) {
                if (result.data.Data && result.data.Data["SessionToken"]) {
                    WebApiConfig.Authorization = result.data.Data["SessionToken"];
                }
            }
            callback && callback(result);
        };
        this.request.request(request.requestId, request.requestURL, request.params, "POST", request.header, requestCallback, requestCallback);
    }
}
//# sourceMappingURL=RequestManager.js.map