/**
 * Created by apple on 2017/10/11.
 */
import RNFS from 'react-native-fs'
import * as Helper from '../Helper'
import UpdateMessageSqliteType from './UpdateMessageSqliteType'
import networkStatuesType from './networkStatuesType'
import * as methods from './Common'
import netWorking from '../Networking/Network'


let FileManager = {};
let currentObj = undefined;
let _network = new netWorking();

let resourceQueue = [];
let ME = "";
FileManager.Ioc = function(im){
    currentObj = im;
}

FileManager.setAccountId = function(accountId){
    ME = accountId;
}

FileManager.addResource = function(message,onprogress,callback){

    resourceQueue.push({onprogress:onprogress,message:message})
    callback(true,message.MSGID);
}

//执行resource队列
FileManager.handleResourceQueue = function(){

    if(resourceQueue.length > 0){

        let copyResourceQueue = Helper.cloneArray(resourceQueue);

        //cloneArry 方法不能拷贝方法
        for(let item in resourceQueue){
            copyResourceQueue[item].onprogress = resourceQueue[item].onprogress;
        }

        resourceQueue = [];

        for(let item in copyResourceQueue){
            FileManager.uploadResource(copyResourceQueue[item]);
        }
        copyResourceQueue=[];

    }
}

//执行upload函数体
FileManager.uploadResource = function(obj){

    let message = obj["message"];

    let copyMessage = Object.assign({}, message);

    let progressHandles = obj["onprogress"] != null?obj["onprogress"]:null;
    let callback = obj["callback"];

    if(window.networkStatus == networkStatuesType.normal) {

        //把资源存入数据库
        for(let item in message.Resource){
            currentObj.addResourceSqlite(message,item)
        }


        let uploadQueue = [];
        for(let item in message.Resource) {

            //整合audio下文件路径
            let resource;
            // if(message.type == MessageType.audio){
            //     resource = message.Resource[item].LocalSource.split("_")[0] + ".aac";
            // }else{
                resource = message.Resource[item].LocalSource;
            // }

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

            let copyMessage = Object.assign({}, message);

            copyMessage.status = SendStatus.PrepareToSend;
            currentObj.addUpdateSqliteQueue(copyMessage,UpdateMessageSqliteType.changeSendMessage)

            //返回IM logic 添加message到发送队列中
            currentObj.addSendMessageQueue(message);

            //App上层修改message细节
            currentObj.MessageChangeStatusHandle(message);

        }).catch(function (values) {
            console.log('上传失败的内容是',values);
        })
    }else{
        copyMessage.status = SendStatus.PrepareToSend;
        currentObj.addUpdateSqliteQueue(copyMessage,UpdateMessageSqliteType.changeSendMessage)
    }
}

FileManager.downloadResource = function(message,callback){

    let fromUrl = message.Resource[0].RemoteSource,
        sender = message.Data.Data.Sender,
        type = message.type,
        way = message.way,
        toFile;

    let format = fromUrl.slice(fromUrl.lastIndexOf('.'));
    toFile = `${RNFS.DocumentDirectoryPath}/${ME}/${type}/${way}-${sender}/${new Date().getTime()}${format}`;


    message.Resource[0].LocalSource = null;
    updateMessage = (result) => {
        message.Resource[0].LocalSource = 'file://' + toFile;
        console.log('下载成功后=============================:  ',message)
        callback(message)
    }

    _network.methodDownload(fromUrl,toFile,updateMessage)

    console.log('receiveMessageOpreator:  ',message)
}

export default FileManager;