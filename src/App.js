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
import Route from './Core/route/router'
import * as router from './modules/routerMap'
import {changeTabBar} from './modules/MainTabbar/reducer/action';
import AppPageMarkEnum from './App/Enum/AppPageMarkEnum'
import AppManagement from './App/AppManagement'
import AppStatusEnum from './App/Enum/AppStatusEnum'

export default function App() {

    //关闭yellowbox
    console.disableYellowBox = true

    let appManagement = new AppManagement();

    let store = Store;
    //初始化路由表
    Route.initRouteMap(router);
    Route.setAssignMainTabBarPage(()=>{store.dispatch(changeTabBar(0))});

    class InitApp extends Component {
        constructor() {
            super();

            this.state = {
                store,
                appState: AppState.currentState,
                memoryWarnings: 0,
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
                    //im.setNetEnvironment(isConnected);
                    if(!isConnected){
                        appManagement.dispatchMessageToMarkPage(AppPageMarkEnum.AppStatus,{appStatus:AppStatusEnum.NetworkError,info:''})
                        appManagement.normalNetwork = false;
                    }
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
                 // im.stopIM();
            }else if(appState == "active"){
                // im.startIM();
            }
        }

        _handleConnectionInfoChange(connectionInfo) {

            console.log(connectionInfo);

            if(connectionInfo.type == "NONE" || connectionInfo.type == "none"){
                appManagement.dispatchMessageToMarkPage(AppPageMarkEnum.AppStatus,{appStatus:AppStatusEnum.NetworkError,info:''})
                appManagement.normalNetwork = false;
            }else{
                appManagement.normalNetwork = true;
            }
        }

        render() {

            return (<Provider store={this.state.store}>
                <Root/>
            </Provider>)
        }
    }
    return InitApp;
}