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
import Route from './Core/route/router'
import * as router from './modules/routerMap'
import IM from './Core/IM'
import User from './Core/UserGroup'
import DisplayComponent from './Core/Component'
import * as IMHandle from './Core/IM/action/receiveHandleMessage'
import {changeTabBar} from './modules/MainTabbar/reducer/action';
import Network from './Core/Networking/Network'
let network = new Network();

export default function App() {

    //关闭yellowbox
    console.disableYellowBox = true

    let store = Store;

    let user = new User();

    //初始化app的http组件
    configureNetwork({
        "Content-Type": "application/json"
    }, 'fetch', false)

    //初始化路由表
    Route.initRouteMap(router);
    Route.setAssignMainTabBarPage(()=>{store.dispatch(changeTabBar(0))});
    //初始化IM
    let im = new IM();
    //改变消息状态 {state:这里变化,message:{}}
    let handleMessageResult = function(status,MSGID){
        IMHandle.handleMessageResult(status,MSGID);
    }
    //改变消息数据 {state: ,message:{这里变化}}
    let handleMessageChange = function(message){
       IMHandle.handleMessageChange(message);
    }


    let handleRecieveMessage = function(message){
       IMHandle.handleRecieveMessage(message);
    }

    //收到同意添加好友申请回调
    let handleRecieveAddFriendMessage = function(relation){
      IMHandle.handleRecieveAddFriendMessage(relation);
    }


    let handleKickOutMessage = function(){
        IMHandle.handleKickOutMessage()
    }

    im.connectIM(handleMessageResult,handleMessageChange,handleRecieveMessage,handleKickOutMessage,handleRecieveAddFriendMessage)


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