import RequestDto from "../../HttpMangement/Dtos/RequestDto";
import HttpManager from "../../HttpMangement/HttpManager";
import RequestURL from "./RequestURL";
import RequestMethod from "../../HttpMangement/Dtos/RequestMethod";
import Config from "../../../Config";
/**
 * Created by apple on 2018/3/9.
 */
export default class RequestManager {
    constructor(isDB) {
        this.request = HttpManager.getSingleInstance(isDB);
    }
    updateConfigSetting(callback, baseUrl) {
        let forceSuccess = (baseUrl != null && baseUrl != "") ? false : true;
        this.requestInfo("updateNewSetting", '', null, RequestURL.ConfigSettingURL, forceSuccess, callback, baseUrl);
    }
    requestInfo(actionName, userId, param, url, forceSuccess, callback = null, baseUrl) {
        let request = new RequestDto();
        request.method = RequestMethod.GET;
        request.forceSuccess = forceSuccess;
        request.requestId = "configSetting_" + actionName + "_" + "UserId" + userId;
        request.params = param;
        if (baseUrl != null && baseUrl != "") {
            request.requestURL = baseUrl + url;
        }
        else
            request.requestURL = Config.Host + url;
        this.request.request(request, function (key, result) {
            callback && callback(result);
        });
    }
}
//# sourceMappingURL=RequsetManager.js.map