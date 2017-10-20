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

import * as ActionForChatRecordStore from './Core/IM/redux/action'
import * as ActionForLoginStore from './modules/Login/reducer/action';
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
                    store.dispatch(ActionForLoginStore.signOut());
                }},
                {text: '不是本人操作',style:{color:"red"}, onPress: () => {
                    store.dispatch(ActionForLoginStore.signOut());
                }},
            ]);
    }

    im.connectIM(handleMessageResult,handleMessageChange,handleRecieveMessage,handleKickOutMessage)


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