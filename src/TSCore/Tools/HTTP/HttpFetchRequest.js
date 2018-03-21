import ResponseDto from "./Dtos/ResponseDto";
export default class HttpFetchRequest {
    constructor() {
        this.timeout = 300000;
    }
    request(key, requestURL, param, method, header, successCallback, errorCallback) {
        let requestObject = Object.assign({}, {
            method: method,
        });
        if (method == 'POST') {
            requestObject = Object.assign(requestObject, {
                body: (param != null && Object.keys(param).length > 0) ? JSON.stringify(param) : ""
            });
        }
        if (header != null && Object.keys(header).length > 0) {
            if (header["Accept"] == null && header["accept"] == null) {
                header = Object.assign(header, { "Accept": "application/json" });
            }
            //todo
            header = Object.assign(header, { "Content-Type": "application/json" });
            Object.assign(requestObject, { "headers": header });
        }
        else {
            header = {};
            header = Object.assign(header, { "Content-Type": "application/json" });
            Object.assign(requestObject, { "headers": header });
        }
        /*发送请求*/
        let promiseResponse = fetch(requestURL, requestObject);
        /*请求超时*/
        let timer = 0;
        //记录this
        let currentObj = this;
        let promiseTimeout = new Promise(function (resolve, reject) {
            timer = setTimeout(() => reject("request time out"), currentObj.timeout);
        });
        let promise = Promise.race([promiseResponse, promiseTimeout]);
        promise.then((response) => {
            clearTimeout(timer);
            let result = new ResponseDto();
            result.success = false;
            result.errorCode = response.status;
            result.errorMessage = response.statusText;
            if (response.ok && response.status == 200) {
                response.json().then(data => {
                    result.data = data;
                    result.success = true;
                    successCallback(key, result);
                });
            }
            else {
                errorCallback(key, result);
            }
        });
        promise.catch(error => {
            let result = new ResponseDto();
            result.success = false;
            result.errorCode = -1;
            result.errorMessage = error;
            errorCallback(key, result);
        });
    }
}
//# sourceMappingURL=HttpFetchRequest.js.map