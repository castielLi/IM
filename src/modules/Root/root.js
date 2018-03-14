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
import AppComponent from '../../Core/Component/AppComponent'


let initRootNavigation = false;

class Root extends AppComponent {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
    }

    componentWillUnmount(){
        initRootNavigation = false;
        super.componentWillUnmount();
    }

    renderScene(Route, navigator) {
        this.navigator = navigator;
        console.log('renderScene启动')

        //初始化跟导航器
        if(!initRootNavigation){
            this.route.setRootNavigator(navigator);
            initRootNavigation = !initRootNavigation;
            this.appManagement.setRoot(this);
        }

        return this.route.getRoutePage(Route, navigator);
    }


    configureScene(route) {
        if (route.sceneConfig) {
             return route.sceneConfig;
         }

        return ({
            ...Navigator.SceneConfigs.FloatFromRight,
            //禁止手势
            gestures: null
        });
    }
    
    render() {
        let initialRoute = this.route.initialRoute;
            return ( < Navigator 
                        initialRoute = {
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

    }
}


function MapState(store) {
    return {
        isLoggedIn: store.loginStore.isLoggedIn,
    }
}

export default connect(MapState)(Root);