/**
 * Created by apple on 2017/9/26.
 */

import {AsyncStorage} from 'react-native';

export default StorageMethods = {};

StorageMethods.getValueByKey = function(key,success,failed,otherParam){
    AsyncStorage.getItem(key)
        .then((value) => {
           success(value,otherParam);
        }).catch((error) => {
         failed(error);
    })
}

StorageMethods.setValueByKey = function (key,value,success,failed,otherParam){
    AsyncStorage.setItem(key,value)
        .then((value) => {
            success(value,otherParam);
        }).catch((error) => {
        failed(error);
    })
}

StorageMethods.removeItemByKey = function(key,success,failed,otherParam){
    AsyncStorage.removeItem(key)
        .then((value) => {
            success(value,otherParam);
        }).catch((error) => {
        failed(error);
    })
}

StorageMethods.clearAllItem = function(success,failed,otherParam){
    AsyncStorage.clear()
        .then((value) => {
            success(value,otherParam);
        }).catch((error) => {
        failed(error);
    })
}


//参考http://www.lcode.org/react-native-api%E6%A8%A1%E5%9D%97%E4%B9%8Basyncstorage%E6%8C%81%E4%B9%85%E5%8C%96%E5%AD%98%E5%82%A8%E4%BD%BF%E7%94%A8%E8%AF%A6%E8%A7%A329/