/**
 * Created by apple on 2017/6/7.
 */
'use strict'

import React, {
    Component
} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text
} from 'react-native'
import {
    Navigator,
    NavigationBar
} from 'react-native-deprecated-custom-components';
import {
    connect
} from 'react-redux';
import BaseComponent from '../../Core/Component'
import * as router from '../routerMap'
import IM from '../../Core/IM'
import * as ActionForChatRecordStore from '../../Core/IM/redux/action'
import {bindActionCreators} from 'redux';
 var im = new IM();
class Root extends BaseComponent {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
    }

    renderScene(Route, navigator) {
        // this.route = route;
        this.navigator = navigator;
        console.log('renderScene启动')
        //如果已登录，再点击登录页面或者再返回登录页面，将跳转到TestRefresh
        if(Route.key === 'Login' && this.props.isLoggedIn === true){
        	Route.routeId = 'TestRefresh';
        	Route.key = 'TestRefresh';
        }
        return this.route.getRoutePage(Route, navigator);
    }


    configureScene(route) {
        console.log(route)
        return Navigator.SceneConfigs.FloatFromRight;
    }
    componentWillMount(){
        im.getChatList(function(chatListArr){
            this.props.initChatRecord(ActionForChatRecordStore.initChatRecord(chatListArr))
        })
    }
    componentWillReceiveProps(newProps){
        console.log(newProps,'888888888888888888888888888888888888888888888888888888888888888888')
    }


    render() {
        console.log('aaaaaaaaaaaaaaaaaaaaaaa')
        let initialRoute = this.route.initialRoute;
        if(Object.keys(this.props.hasChatRecord)>0){
            return ( < Navigator initialRoute = {
                    initialRoute
                }
                                 configureScene = {
                                     this.configureScene.bind(this)
                                 }
                                 renderScene = {
                                     this.renderScene.bind(this)
                                 }
                />
            );
        }else{
            return <Text>地球</Text>;
        }

    }
}

const styles = StyleSheet.create({
    navContainer: {
        height: 40,
        backgroundColor: '#fff'
    }
})

function MapState(store) {
    return {
        isLoggedIn: store.loginStore.isLoggedIn,
        hasChatRecord:store.chatRecordStore.ChatRecord
    }
}
function mapDispatch(dispatch){
    return {...bindActionCreators(ActionForChatRecordStore, dispatch),}
}

export default connect(MapState,mapDispatch)(Root);