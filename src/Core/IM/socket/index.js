/**
 * Created by apple on 2017/7/31.
 */
import * as configs from './socketConfig'
import React, {
    Component
} from 'react';
import MessageCommandEnum from '../dto/MessageCommandEnum'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

let onRecieveMessage = "undefined";
let _token = undefined;
let _deviceId = undefined;
let _device = undefined;
let _imToken = undefined;
let netWorkStatus = undefined;
let currentObj = undefined;

export default class Connect extends Component{

    constructor() {
        super();
        if (__instance()) return __instance();

        __instance(this);

        currentObj = this;

        this.reConnectNet = this.reConnectNet.bind(this);

        this.addEventListenner = this.addEventListenner.bind(this);

        this.startConnect = this.startConnect.bind(this);

    }

    addEventListenner(callback=undefined){

        this.webSocket.addEventListener('message', function (event) {
            console.log("Socket Core:收到了一条新消息:" + event.data)
            if(event.data.length  <= 0){
                return ;
            }
            let message = JSON.parse(event.data);
            onRecieveMessage(message,message.Command);
        });

        this.webSocket.addEventListener('open', function (event) {
            console.log('Hello Server!');

            callback&&callback();
        });


        this.webSocket.addEventListener('error',function(event){
            console.log(event)
        });


        this.webSocket.addEventListener('close', function (event) {

            console.log("socket close")
            console.log('GoodBye Server!');
        });
    }

    sendMessage(message){
        if(this.webSocket.readyState == this.webSocket.OPEN){
            console.log("Socket Core: 发送消息:   ",message);

            this.webSocket.send(JSON.stringify(message));
            return true;
        }
        return false;
    }


    logout(){
        this.webSocket.close();
    }


    onRecieveCallback(callback){
        onRecieveMessage = callback;
    }

    startConnect(token,Device,DeviceId,IMToken,callback=undefined){
        _token = token;
        _deviceId = DeviceId;
        _device = Device;
        _imToken = IMToken;

        // AppId = 1
        // Device = DeviceType
        // DeviceNumber = DeviceId

        if(this.webSocket != undefined){
            if( this.webSocket.readyState == this.webSocket.OPEN){
                return;
            }
        }

        this.webSocket = new WebSocket(configs.serverUrl + "/?AppId=1&account=" + _token+"&Device="+Device+"&Token="+ IMToken + "&DeviceId="+DeviceId);
        this.addEventListenner(callback);
    }

    reConnectNet(callback=undefined){
        // + "/socket.io/?EIO=4&transport=websocket"

       if(this.webSocket == undefined ||  this.webSocket.readyState == this.webSocket.OPEN){
           return;
       }

       this.webSocket = new WebSocket(configs.serverUrl + "/?AppId=1&account=" + _token+"&Device="+_device+"&Token="+ _imToken + "&DeviceId="+_deviceId);
       this.addEventListenner();
    }

    setNetWorkStatus(status){
        netWorkStatus = status;
    }
}