/**
 * Created by apple on 2018/3/9.
 */
import MobileFS from '../../TSCore/Tools/FileSystem/MoblieFS';
import Configs from "./Configs";
import RequestManager from "./Request/RequsetManager";
import Config from "../../Config";
import SetConfigSettingDto from "../../TSController/Dtos/SetConfigSettingDto";
import SetConfigErrorType from "../../TSController/Enums/SetConfigErrorType";
export default class ConfigManager {
    constructor(callback) {
        this.configSettingCache = null;
        this.httpManager = null;
        this.reStoreTime = 200000;
        this.timerId = 0;
        this.filePath = "";
        this.httpManager = new RequestManager(false);
        this.filePath = MobileFS.getConfigSettingPath(Configs.ConfigSettingFileName);
        this.getConfigSetting(callback);
    }
    static getSingleInstance(callback) {
        if (ConfigManager.SingleInstance == null) {
            ConfigManager.SingleInstance = new ConfigManager(callback);
        }
        return ConfigManager.SingleInstance;
    }
    setConfigSetting(url, callback) {
        let dto = new SetConfigSettingDto();
        this.httpManager.updateConfigSetting((result) => {
            if (result.success) {
                this.configSettingCache.ApiDomain = url;
                this.filePath = MobileFS.getConfigSettingPath(Configs.ConfigSettingFileName);
                MobileFS.writeFile(JSON.stringify(this.configSettingCache), this.filePath, (success) => {
                    if (!success) {
                        dto.success = false;
                        dto.errorType = SetConfigErrorType.SaveError;
                        callback && callback(dto);
                    }
                    else {
                        dto.success = true;
                        callback && callback(dto);
                    }
                });
            }
            else {
                dto.success = false;
                dto.errorType = SetConfigErrorType.UrlError;
                callback && callback(dto);
            }
        }, url);
    }
    updateConfigSetting() {
        this.httpManager.updateConfigSetting((result) => {
            if (result.success) {
                let data = result.data;
                data = this.checkConfigContent(data);
                if (this.configSettingCache == null || data.Version != this.configSettingCache.Version) {
                    this.filePath = MobileFS.getConfigSettingPath(Configs.ConfigSettingFileName);
                    MobileFS.writeFile(JSON.stringify(data), this.filePath, (success) => {
                        if (!success) {
                            //下载成功但是存储不成功,间隔时间通过缓存进行存储文件
                            this.reStoreSettingToFile();
                        }
                    });
                }
                this.configSettingCache = data;
            }
        });
    }
    getConfigAddress() {
        return this.configSettingCache.ApiDomain;
    }
    getConfigSetting(callback) {
        let filePath = MobileFS.getConfigSettingPath(Configs.ConfigSettingFileName);
        MobileFS.readFileByPath(filePath, (settings) => {
            if (settings == null) {
                this.updateConfigSetting();
            }
            else {
                //有setting则把setting里面的配置赋值到 程序config文件中
                let settingDto = this.transferFileToSettingDto(settings);
                this.configSettingCache = settingDto;
                Config.BaseUrl = settingDto.ApiDomain;
                Config.Host = settingDto.Host;
                let currentTime = new Date().getTime();
                if (settingDto.UpdateTime - currentTime >= Configs.IntervalTime) {
                    this.updateConfigSetting();
                }
            }
            callback && callback();
        });
    }
    reStoreSettingToFile() {
        if (this.timerId == 0) {
            let currentObj = this;
            let storeTask = () => {
                MobileFS.writeFile(JSON.stringify(this.configSettingCache), this.filePath, (success) => {
                    if (!success) {
                        //下载成功但是存储不成功,间隔时间通过缓存进行存储文件
                        this.timerId = setTimeout(storeTask, currentObj.reStoreTime);
                    }
                });
            };
            this.timerId = setTimeout(storeTask, this.reStoreTime);
        }
    }
    transferFileToSettingDto(data) {
        let dataObj = JSON.parse(data);
        return dataObj;
    }
    checkConfigContent(dto) {
        if (!dto.ApiDomain.endsWith("/")) {
            dto.ApiDomain += '/';
        }
        if (!dto.Host.endsWith("/")) {
            dto.Host += '/';
        }
        dto.UpdateTime = new Date().getTime();
        return dto;
    }
}
//# sourceMappingURL=ConfigManager.js.map