/**
 * Created by apple on 2017/10/11.
 */
import RNFS from 'react-native-fs'
import * as Helper from '../../Helper'
import UpdateMessageSqliteType from './UpdateMessageSqliteType'
import networkStatuesType from './networkStatuesType'
import * as methods from './Common/methods'
import netWorking from '../../Networking/Network'


let FileManager = {};
let currentObj = undefined;
let _network = new netWorking();

let resourceQueue = [];
FileManager.Ioc = function(im){
    currentObj = im;
}

FileManager.addResource = function(messageId){

    let cache = currentObj.getCacheFromCacheByMSGID(messageId);
    let callback = cache["callback"];
    let onprogress = cache["onprogress"];
    let message = cache["message"];

    resourceQueue.push({onprogress:onprogress,message:message,callback:callback})
    callback&&callback(true,messageId);
}

//执行resource队列
FileManager.handleResourceQueue = function(){

    if(resourceQueue.length > 0){


        for(let item in resourceQueue){
            FileManager.uploadResource(resourceQueue[item]);
        }
        resourceQueue=[];

    }
}

//执行upload函数体
FileManager.uploadResource = function(obj){

    let messageId = obj["messageId"];

    let message = obj["message"];

    let progressHandles = obj["onprogress"] != null?obj["onprogress"]:null;

    if(window.networkStatus == networkStatuesType.normal) {

        //把资源存入数据库
        for(let item in message.Resource){
            currentObj.addResourceSqlite(message,item)
        }


        let uploadQueue = [];
        for(let item in message.Resource) {

            //整合audio下文件路径
            let resource;

            resource = message.Resource[item].LocalSource;


            uploadQueue.push(methods.getUploadPathFromServer(resource,item,function (progress,index) {
                if(progressHandles != null) {
                    let onprogess = progressHandles[index * 1];
                    onprogess("第" + (index * 1 + 1) + "张图片上传进度：" + progress.loaded / progress.total * 100);
                }
            },function (result) {
                console.log("上传成功" + result);
                message.Resource[item].RemoteSource = result.url;

                //pop上传成功的资源
                currentObj.deleteResourceSqlite(message,item)
            },function(index){
                console.log("上传失败" + index);
            }));
        }

        Promise.all(uploadQueue).then(function(values){
            console.log(values + "已经上传成功了" + message.MSGID);

            message.status = SendStatus.PrepareToSend;
            currentObj.addUpdateSqliteQueue(message,UpdateMessageSqliteType.changeSendMessage)

            //返回IM logic 添加message到发送队列中
            currentObj.addSendMessageQueue(message.MSGID);

            //App上层修改message细节
            currentObj.MessageChangeStatusHandle(message);

        }).catch(function (values) {
            console.log('上传失败的内容是',values);
        })
    }else{
        message.status = SendStatus.PrepareToUpload;
        currentObj.addUpdateSqliteQueue(message,UpdateMessageSqliteType.changeSendMessage)
    }
}

FileManager.downloadResource = function(message,callback){

    let fromUrl = message.Resource[0].RemoteSource,
        sender = message.Data.Data.Sender,
        type = message.type,
        way = message.way,
        toFile;

    let format = fromUrl.slice(fromUrl.lastIndexOf('/'));

    type === 'image' ? toFile = `${RNFS.DocumentDirectoryPath}/${window.ME}/${type}/chat/${way}-${sender}/thumbnail${format}`
        : toFile = `${RNFS.DocumentDirectoryPath}/${window.ME}/${type}/chat/${way}-${sender}${format}`;



    console.log('下载前=============================:  ',message,toFile)
    message.Resource[0].LocalSource = null;
    updateMessage = (result) => {
        if(type === 'image'){
            toFile = 'file://'+toFile;
            //message.Resource[0].RemoteSource = fromUrl + '#imageView2/0/w/200/h/200';
        }
        message.Resource[0].LocalSource = toFile;
        console.log('下载成功后=============================:  ',message)
        callback(message)
    }
    let url = type === 'image' ? fromUrl + '?imageView2/0/w/200/h/200' : fromUrl;
    _network.methodDownload(url,toFile,updateMessage)

    console.log('receiveMessageOpreator:  ',message)
}

FileManager.manualDownloadResource = function(remoteURL,filePath,callback,onprogeress){
    _network.methodDownloadWithProgress(remoteURL,filePath,callback,onprogeress);
}


export default FileManager;
