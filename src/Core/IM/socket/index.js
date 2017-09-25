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
let netWorkStatus = undefined;
let currentObj = undefined;
let heartBeatCode = undefined;

export default class Connect extends Component{

    constructor(token) {
        super();
        if (__instance()) return __instance();

        __instance(this);

        _token = token;

        currentObj = this;

        // "/socket.io/?EIO=4&transport=websocket"
        this.webSocket = new WebSocket(configs.serverUrl + "/?account=" + token );
        // this.webSocket = new WebSocket(configs.serverUrl);
        console.log("account token:" + token);
        this.reConnectNet = this.reConnectNet.bind(this);

        this.addEventListenner = this.addEventListenner.bind(this);

        this.addEventListenner();


    }

    addEventListenner(){
        this.webSocket.addEventListener('message', function (event) {
            console.log("Socket Core:收到了一条新消息:" + event.data)
            if(event.data.length  <= 0){
                return ;
            }
            let message = JSON.parse(event.data);
            console.log("消息类型是："+message.Command);
            if(message.Command == MessageCommandEnum.MSG_REV_ACK) {
                onRecieveMessage(message.MSGID,MessageCommandEnum.MSG_REV_ACK);
            }else if(message.Command == MessageCommandEnum.MSG_HEART){
                heartBeatCode = message;
                onRecieveMessage(message,MessageCommandEnum.MSG_HEART);
            }else if(message.Command == MessageCommandEnum.MSG_BODY){
                onRecieveMessage(message,MessageCommandEnum.MSG_BODY);
            }
        });

        this.webSocket.addEventListener('open', function (event) {
            console.log('Hello Server!');

            if(heartBeatCode != undefined){
                currentObj.sendMessage(heartBeatCode);
            }
        });


        this.webSocket.addEventListener('error',function(event){
            console.log(event)
        });


        this.webSocket.addEventListener('close', function (event) {

            if(netWorkStatus == "none"){
                console.log('GoodBye Server!');
            }else{
                currentObj.reConnectNet();
            }
        });
    }

    sendMessage(message){
        if(this.webSocket.readyState == this.webSocket.OPEN){
            console.log("Socket Core: 发送消息"+message);

            if(message.Command == MessageCommandEnum.MSG_HEART){
                heartBeatCode = undefined;
            }

            this.webSocket.send(JSON.stringify(message));
            return true;
        }
        return false;
    }




    onRecieveCallback(callback){
        onRecieveMessage = callback;
    }


    reConnectNet(){
        // + "/socket.io/?EIO=4&transport=websocket"
       this.webSocket = new WebSocket(configs.serverUrl + "/?account=" + _token );
       this.addEventListenner();
    }

    setNetWorkStatus(status){
        netWorkStatus = status;
    }
}