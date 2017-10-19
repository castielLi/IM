/**
 * Created by apple on 2017/6/6.
 */
'use strict';
import React, {
    Component
} from 'react';
import {
    Provider
} from 'react-redux';
import { AppState , NetInfo,Platform,Alert} from 'react-native'
import Root from './modules/Root/root'
import Store from './store'
import configureNetwork from './Core/Networking/configureNetwork'
import BaseComponent from './Core/Component'
import Route from './Core/route/router'
import * as router from './modules/routerMap'
import IM from './Core/IM'

import ChatCommandEnum from './Core/IM/dto/ChatCommandEnum'
import MessageBodyTypeEnum from './Core/IM/dto/MessageBodyTypeEnum'
import MessageCommandEnum from './Core/IM/dto/MessageCommandEnum'

import SendMessageBodyDto from './Core/IM/dto/SendMessageBodyDto'
import SendMessageDto from './Core/IM/dto/SendMessageDto'
import messageBodyChatDto from './Core/IM/dto/messageBodyChatDto'

import * as ActionForChatRecordStore from './Core/IM/redux/action'

import netWorking from './Core/Networking/Network'
import DisplayComponent from './Core/Component'
import route from './Core/route/router'
let network = new netWorking();


export default function App() {


    let store = Store;

    //初始化app的http组件
    configureNetwork({
        "Content-Type": "application/json"
    }, 'fetch', false)


    //初始化路由表
    Route.initRouteMap(router);

    //初始化IM
    let im = new IM();
    //改变消息状态 {state:这里变化,message:{}}
    let handleMessageResult = function(status,MSGID){
       store.dispatch(ActionForChatRecordStore.updateMessageStatus(status,MSGID))
    }
    //改变消息数据 {state: ,message:{这里变化}}
    let handleMessageChange = function(message){
       store.dispatch(ActionForChatRecordStore.updateMessage(message))
    }


    let handleRecieveMessage = function(message){
        store.dispatch(ActionForChatRecordStore.receiveMessage(message))
    }

    let handleKickOutMessage = function(){
        Alert.alert(
            '下线通知',
            "该账号在其他设备上登录,请确认是本人操作并且确保账号安全!",
            [
                {text: '确定', onPress: () => {
                    route.ToLogin();
                }},
                {text: '不是本人操作',style:{color:"red"}, onPress: () => {
                    route.ToLogin();
                }},
            ]);
    }

    im.connectIM(handleMessageResult,handleMessageChange,handleRecieveMessage,handleKickOutMessage)


    // let sendMessage = setInterval(function(){
    //     let addMessage = new SendMessageDto();
    //     let messageBody = new SendMessageBodyDto();
    //     let messageData = new messageBodyChatDto();
    //
    //     messageData.Data = "hello world";
    //     messageData.Command = ChatCommandEnum.MSG_BODY_CHAT_C2C
    //     messageData.Sender = "1";
    //     messageData.Receiver = "2";
    //
    //     messageBody.LocalTime = new Date().getTime();
    //     messageBody.Command = MessageBodyTypeEnum.MSG_BODY_CHAT;
    //     messageBody.Data = messageData;
    //
    //
    //     addMessage.Command = MessageCommandEnum.MSG_BODY;
    //     addMessage.Data = messageBody;
    //     addMessage.type = "text";
    //     addMessage.way = "chatroom";
    //
    //     im.addMessage(addMessage);
    //
    //     // im.addRecMessage(addMessage);
    // },2000)
    //
    // setInterval(function(){
    //     clearInterval(sendMessage)
    // },10000)
    //
    // im.getRecentChatRecode("2","chatroom",{start:2,limit:10},function (messages) {
    //     console.log("消息记录为" + messages);
    // })



    // //todo:使用chatwayenum枚举来控制类型
    // im.deleteCurrentChatMessage("2","chatroom")
    //
    //
    // let deleteMessage = new message();
    // deleteMessage.id = 59;
    // im.deleteMessage(deleteMessage,"chatroom","hello");


    class InitApp extends DisplayComponent {
        constructor() {
            super();

            this.state = {
                store,
                appState: AppState.currentState,
                memoryWarnings: 0,
                connectionInfo:"NONE"
            }

            this._handleAppStateChange = this._handleAppStateChange.bind(this);
            this._handleMemoryWarning = this._handleMemoryWarning.bind(this);
            this._handleConnectionInfoChange = this._handleConnectionInfoChange.bind(this);
        }


        componentDidMount() {
            AppState.addEventListener('change', this._handleAppStateChange);
            AppState.addEventListener('memoryWarning', this._handleMemoryWarning);

            if(Platform.OS === 'android'){
                NetInfo.isConnected.fetch().done((isConnected) => {
                    console.log('First, is ' + (isConnected ? 'online' : 'offline'));
                    im.setNetEnvironment(isConnected);
                });
            }


            NetInfo.addEventListener('connectionChange', this._handleConnectionInfoChange);
        }
        componentWillUnmount() {
            AppState.removeEventListener('change', this._handleAppStateChange);
            AppState.removeEventListener('memoryWarning', this._handleMemoryWarning);
        }
        _handleMemoryWarning() {
            this.setState({memoryWarnings: this.state.memoryWarnings + 1});
        }
        _handleAppStateChange(appState) {
            console.log('AppState changed to', appState)
            this.setState({
                appState : appState
            });

            if(appState == 'background'){
                 im.stopIM();
            }else if(appState == "active"){
                im.startIM();
            }
        }

        _handleConnectionInfoChange(connectionInfo) {

            console.log(connectionInfo);
            this.setState({
            connectionInfo:connectionInfo
                      });

            // if(connectionInfo == "NONE" || connectionInfo == "none"){
                im.handleNetEnvironment(connectionInfo);
            // }

        }

        render() {

            return (<Provider store={this.state.store}>
                <Root/>
            </Provider>)
        }
    }
    return InitApp;
}