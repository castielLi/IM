/**
* Created by apple on 2017/12/20.
*/
import Queue from "../Tools/Queue";
import HttpFetchRequest from '../Tools/HTTP/HttpFetchRequest';
import DBManager from "./DBManagement/DBManager";
import CacheRequestDto from "./Dtos/CacheRequestDto";
import RequestMethod from "./Dtos/RequestMethod";
export default class HttpManager {
    constructor(isDB) {
        this.dbManager = null;
        this.httpRequest = null;
        this.requestCache = {};
        this.requestQueue = new Queue("HTTP_Manager");
        this.requestTime = 10;
        this.sleepTime = 200;
        this.timerId = 0;
        if (isDB)
            this.dbManager = new DBManager();
        this.httpRequest = new HttpFetchRequest();
        if (this.dbManager != null) {
            this.dbManager.getAllRequest((requests) => {
                if (requests != null && requests.length > 0) {
                    for (let item in requests) {
                        try {
                            let cache = new CacheRequestDto();
                            let request = JSON.parse(requests[item].request);
                            cache.request = request;
                            this.requestCache[request.requestId] = cache;
                        }
                        catch (error) {
                            console.log(error);
                            throw error;
                        }
                    }
                }
            });
        }
        this.start();
    }
    static getSingleInstance(isDB) {
        if (HttpManager.SingleInstance == null) {
            HttpManager.SingleInstance = new HttpManager(isDB);
        }
        return HttpManager.SingleInstance;
    }
    start() {
        if (this.timerId == 0) {
            let currentObj = this;
            let requestCallback = (requestId, result) => {
                if (result == null)
                    return;
                if (result.success) {
                    let cache = this.requestCache[requestId];
                    if (cache == null) {
                        return;
                    }
                    let request = cache.request;
                    if (request == null) {
                        return;
                    }
                    if (this.dbManager != null)
                        this.dbManager.deleteRequest(requestId);
                    delete this.requestCache[requestId];
                    let callback = cache.callback;
                    callback && callback(requestId, result);
                }
                else {
                    let cache = this.requestCache[requestId];
                    if (cache == null) {
                        return;
                    }
                    let request = cache.request;
                    if (request == null) {
                        return;
                    }
                    //如果是强制请求就继续添加到队列中去
                    if (request.forceSuccess) {
                        this.requestQueue.send(requestId);
                    }
                    else {
                        if (this.dbManager)
                            this.dbManager.deleteRequest(requestId);
                        delete this.requestCache[requestId];
                        let callback = cache.callback;
                        callback && callback(requestId, result);
                    }
                }
            };
            let requestTask = () => {
                if (this.timerId != 0)
                    clearTimeout(currentObj.timerId);
                let requestId = currentObj.requestQueue.receive();
                if (requestId != null) {
                    let requestCache = currentObj.requestCache[requestId];
                    if (requestCache == null)
                        return;
                    let request = requestCache.request;
                    if (request == null)
                        return;
                    currentObj.requestInfo(requestId, request.method, request.requestURL, request.params, request.header, requestCallback);
                    this.timerId = setTimeout(requestTask, currentObj.requestTime);
                }
                this.timerId = setTimeout(requestTask, currentObj.sleepTime);
            };
            this.timerId = setTimeout(requestTask, this.sleepTime);
        }
    }
    stop() {
        if (this.timerId > 0) {
            clearTimeout(this.timerId);
        }
    }
    //todo :lizongjun
    //添加请求
    //加个参数，是否进db
    request(request, callback = null) {
        if (request == null)
            return;
        if (request.forceSuccess == false) {
            this.requestInfo("", request.method, request.requestURL, request.params, request.header, callback);
            return;
        }
        //存入cache缓存 或者覆盖之前的缓存
        let cache = new CacheRequestDto();
        cache.callback = callback;
        cache.request = request;
        //新请求时间 < 旧请求时间
        let oldRequest = this.requestCache[request.requestId];
        if (oldRequest != null && request.requestTime < oldRequest.request.requestTime) {
            return;
        }
        this.requestCache[request.requestId] = cache;
        if (this.dbManager != null) {
            if (oldRequest != null)
                this.dbManager.updateRequest(request);
            else
                this.dbManager.addRequest(request);
        }
        // this.requestInfo(request.requestId, request.method, request.requestURL, request.params,request.header,callback);
        this.requestQueue.send(request.requestId);
    }
    destroyInstance() {
        // if(this.dbManager != null)
        //     this.dbManager.logout();
        HttpManager.SingleInstance = null;
    }
    requestInfo(requestId, method, requestURL, params, header, callback = null) {
        switch (method) {
            case RequestMethod.POST:
                this.httpRequest.request(requestId, requestURL, params, "POST", header, callback, callback);
                break;
            default:
                this.httpRequest.request(requestId, requestURL, params, "GET", header, callback, callback);
        }
    }
}
//# sourceMappingURL=HttpManager.js.map