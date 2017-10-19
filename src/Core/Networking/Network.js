/**
 * Created by apple on 2017/5/15.
 */
'use strict';
// import  * as methodsAxios from './NetworkAxios'
import  * as methodsFetch from './NetworkFetch'
import  * as commons from '../Helper/index'
import RNFS from 'react-native-fs';

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
              rej(result);
            }
          })

      }).then(
        (result)=>{
            resultData.success = true;
            resultData.data = result.data;
            resultData.errorMessage = "";
            callback(resultData);
        },
        (error)=>{
            resultData.success = false;
            resultData.errorMessage = error.errorMessage;
            resultData.data = {};
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
             rej(error);
           }
         })

       }).then(
         (result)=>{
           callback(result);
         },
         (error)=>{
             console.log(error)
             callback(error)
         }
       )
     }
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



