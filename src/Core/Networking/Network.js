/**
 * Created by apple on 2017/5/15.
 */
'use strict';
// import  * as methodsAxios from './NetworkAxios'
import  * as methodsFetch from './NetworkFetch'
import  * as commons from '../Helper/index'
import RNFS from 'react-native-fs';
// import RNFetchBlob from 'react-native-fetch-blob'
//const { fs, fetch, wrap } = RNFetchBlob


let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());


var netWorkingConfig = {}
var AuthToken = ""
var UsingFramework = ""
var NeedAuth = false;


let resultData = {};
resultData.success = false;
resultData.errorMessage = "";
resultData.data = {};
resultData.errorCode = -1;


export default class netWorking {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);
    }

    static setConfig(config){
        netWorkingConfig = config
    }

    static setNeedAuth(needAuth){
        NeedAuth = needAuth;
    }

    static setUsingFramework(frameworkName){
        UsingFramework = frameworkName;
    }

    static setAuthorization(authorization){
        AuthToken = authorization;
    }

    methodGET(requestURL,callback,encryption){

        setAuthToken()
        if(!encryption){
            let promise = new Promise(function(res,rej){
                gettingFrameworkMethod().httpRequestGET(requestURL,netWorkingConfig,function(result,error){

                    if(result!= null && result.status == 200){
                        // if(NeedAuth){
                        //   AuthToken = result.response.headers["Auth_Token"];
                        // }
                        res(result);
                    }else {
                        if(error!=null){

                            rej(error);
                        }else{

                            rej({"message":result.status + "错误"})
                        }
                    }
                })

            }).then(
                (result)=>{

                    if(result.Data !=null && result.Data != false){

                        resultData.success = true;
                        resultData.data = result;
                        resultData.errorMessage = "";
                    }else{
                        resultData.success = false;
                        resultData.data = {};
                        resultData.errorMessage = "错误代码:" + result.Result;
                        resultData.errorCode = result.Result;
                    }
                    callback(resultData);
                },
                (error)=>{
                    resultData.success = false;
                    resultData.errorMessage = error.message;
                    resultData.data = {};
                    resultData.errorCode = -1;
                    callback(resultData);
                }
            )
        }
    }

    methodPOST(requestURL,params,callback,encryption,header={}){

        setAuthToken()

        let networkConfig = commons.isObjectEmpty(header) ? netWorkingConfig : header;
        if(!encryption){

            let promise = new Promise(function(res,rej){
                gettingFrameworkMethod().httpRequestPOST(requestURL,params,networkConfig,function(result,error){

                    if(result!= null && result.status == 200){

                        res(result.json());
                    }else {
                        if(error!=null){

                            rej(error);
                        }else{

                            rej({"message":result.status + "错误"})
                        }

                    }
                })

            }).then(
                (result)=>{
                    if(result.Data != null && result.Data != false){

                        resultData.success = true;
                        resultData.data = result;
                        resultData.errorMessage = "";
                    }else{
                        resultData.success = false;
                        resultData.data = {};
                        resultData.errorCode = result.Result;
                        resultData.errorMessage = "错误代码:" + result.Result;
                    }
                    callback(resultData);
                },
                (error)=>{
                    resultData.success = false;
                    resultData.errorMessage = error.message;
                    resultData.data = {};
                    resultData.errorCode = -1;
                    callback(resultData);
                }
            )
        }
    }

    methodDownloadWithProgress(requestURL,filePath,callback,onprogress){
        var request = new XMLHttpRequest();
        request.open("POST", requestURL, true);
        //监听进度事件
        // request.setRequestHeader({'Content-Type' : 'application/octet-stream'})
        request.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                console.log(percentComplete);
                onprogress&&onprogress(percentComplete);
            }
        }, false);

        // request.responseType = "arraybuffer";
        request.responseType = "blob";
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                RNFS.writeFile(filePath,request._response,"base64")
                    .then((success) => {
                        callback&&callback(true)
                    })
                    .catch((err) => {
                        console.log(err.message);
                        callback&&callback(false)
                    });
            }
        };
        request.send();
    }

    methodDownload(requestURL,filePath,callback){
        RNFS.downloadFile({
            fromUrl: requestURL,
            toFile: filePath
        }).promise.then((result) => {
            callback(result);
        },(error)=>{
            console.log(error);
        });
    }
}

function setAuthToken(){
    if(NeedAuth) {
        Object.assign(netWorkingConfig, { "Authorization"  : AuthToken})
    }
}

function gettingFrameworkMethod(){
    if(UsingFramework === 'fetch'){
        return methodsFetch;
    }
    return methodsAxios;
}
