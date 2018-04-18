/**
 * Created by apple on 2018/1/16.
 */
import Queue from "../Tools/Queue";
import WebApiManager from '../WebApiManagement/WebApiManager';
import Config from '../../Config';
import FillingCacheDto from "./Dtos/FillingCacheDto";
export default class FillingManager {
    constructor() {
        this.fillingCache = {};
        this.fillingQueue = new Queue("FillingManager");
        this.requestTime = 10;
        this.sleepTime = 200;
        this.timerId = 0;
        this.commonManager = WebApiManager.getSingleInstance(Config.IsDB);
        this.start();
    }
    static getSingleInstance() {
        if (FillingManager.SingleInstance == null) {
            FillingManager.SingleInstance = new FillingManager();
        }
        return FillingManager.SingleInstance;
    }
    start() {
        if (this.timerId == 0) {
            let currentObj = this;
            let fillingTask = () => {
                let fillingId = currentObj.fillingQueue.receive();
                if (fillingId != null) {
                    try {
                        if (currentObj.fillingCache[fillingId] == undefined)
                            return;
                        let cache = currentObj.fillingCache[fillingId];
                        let requestCallback = (info) => {
                            for (let i = 0; i < cache.callbacks.length; i++) {
                                let callback = cache.callbacks[i];
                                callback && callback(info);
                            }
                            delete currentObj.fillingCache[fillingId];
                        };
                        if (cache.group)
                            currentObj.commonManager.getGroupInfo(fillingId, false, requestCallback);
                        else
                            currentObj.commonManager.getUserInfo(fillingId, false, requestCallback);
                    }
                    finally {
                    }
                    this.timerId = setTimeout(fillingTask, currentObj.requestTime);
                }
                else {
                    this.timerId = setTimeout(fillingTask, currentObj.sleepTime);
                }
            };
            this.timerId = setTimeout(fillingTask, this.sleepTime);
        }
    }
    stop() {
        if (this.timerId > 0) {
            clearTimeout(this.timerId);
        }
    }
    //添加user填充请求
    requestUser(userId, callback) {
        if (this.fillingCache[userId] != undefined) {
            try {
                let cache = this.fillingCache[userId];
                cache.callbacks.push(callback);
            }
            finally {
            }
        }
        else {
            let cache = new FillingCacheDto();
            cache.id = userId;
            cache.group = false;
            let callbacks = [];
            callbacks.push(callback);
            cache.callbacks = callbacks;
            this.fillingCache[userId] = cache;
            this.fillingQueue.send(userId);
        }
    }
    //添加group填充请求
    requestGroup(groupId, callback) {
        if (this.fillingCache[groupId] != undefined) {
            try {
                let cache = this.fillingCache[groupId];
                cache.callbacks.push(callback);
            }
            finally {
            }
        }
        else {
            let cache = new FillingCacheDto();
            cache.id = groupId;
            cache.group = true;
            let callbacks = [];
            callbacks.push(callback);
            cache.callbacks = callbacks;
            this.fillingCache[groupId] = cache;
            this.fillingQueue.send(groupId);
        }
    }
}
//# sourceMappingURL=FillingManager.js.map