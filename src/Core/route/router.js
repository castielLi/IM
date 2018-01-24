/**
 * Created by apple on 2017/6/7.
 */
'use strict';

import React from 'react';
import {
    Navigator,
    View,
    InteractionManager
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import * as commons from '../Helper/index'
import AppManagement from '../../App/AppManagement'
import IMController from '../../TSController/IMController'

let rootNavigator;
let imController = undefined;
//指定mainTabBar显示页面
let assignMainTabBarPage = undefined;
//是否正在进行路由处理
let routering = false;
class Route {

    /**
     * 获取 ID 对应的 Component
     * @param {any} id 页面的 ID
     *              有严格的映射关系，会根据传入 ID 同名的文件夹去取路由对应的页面
     * @param {any} params Component 用到的参数
     */
    // static navigator = undefined;
    static routerMap = {};
    static mainPage = {};
    static initialRoute = {};

    static initRouteMap(router) {
        let {
            RouteMap,
            MainPage,
            InitialRoute,
            LoginRoute,
            RootRoute
        } = router;
        this.routerMap = Object.assign(this.routerMap, RouteMap);
        this.mainPage = MainPage;
        this.initialRoute = InitialRoute;
        this.loginRoute = LoginRoute
    }

    static setRootNavigator(navigator){
        rootNavigator = navigator;
    }
    //赋值外部接口
    static setAssignMainTabBarPage(TabBarReduxAction){
        assignMainTabBarPage = TabBarReduxAction;
    }

    static getRoutePage(route, navigator) { //这里route参数是一个对象{id:xx,routeId:xx,params:{xxx}}
        let id = route.key,
            params = route.params || {},
            routeObj = this.routerMap[id],
            markType = undefined,
            Component;
        if (routeObj) {
            let ComponentInfo = routeObj[route.routeId]
            Component = ComponentInfo.component;
            //合并默认参数
            Object.assign(params, ComponentInfo.params);
            if(ComponentInfo.markType) {
                markType = ComponentInfo.markType;
            }
        } else {
            // Component = Error;
            // params = {message: '当前页面没有找到：' + id};
        }

        return <Component navigator={navigator} {...params} MarkType={markType} />
    }


    static getComponentByRouteId(key, routeId) {
        let id = key,
            routeObj = this.routerMap[id],
            params = {},
            Component;
        if (routeObj) {
            let ComponentInfo = routeObj[routeId];
            Component = ComponentInfo.component;
            Object.assign(params, ComponentInfo.params);
        } else {
            // Component = Error;
            // params = {message: '当前页面没有找到：' + id};
        }
        return <Component {...params}/>;
    }

    static getComponentByRouteIdNavigator(key, routeId, navigator) {
        let id = key,
            routeObj = this.routerMap[id],
            params = {},
            markType = undefined,
            Component;
        if (routeObj) {
            let ComponentInfo = routeObj[routeId];
            Component = ComponentInfo.component;
            Object.assign(params, ComponentInfo.params);
            if(ComponentInfo.markType) {
                markType = ComponentInfo.markType;
            }
        } else {
            // Component = Error;
            // params = {message: '当前页面没有找到：' + id};
        }
        return <Component {...params} navigator={navigator} MarkType={markType}/>;
    }

    static push(props, route) {
        // InteractionManager.runAfterInteractions(() => {
            props.navigator.push(route)
        // })
    }


    static toMain(props) {
        let routes = props.navigator.getCurrentRoutes();
        let contain = false;
        let route;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i]["key"] == this.mainPage["key"]) {
                contain = true;
                route = routes[i];
                break;
            }
        }
        if (!contain) {
            if (commons.containsObject(this.initialRoute, routes)) {
                props.navigator.push(this.mainPage);
                return;
            }
        }
        // InteractionManager.runAfterInteractions(() => {
            //props.navigator.jumpTo(route);
            props.navigator.popToRoute(route)
        // })
        assignMainTabBarPage&&assignMainTabBarPage();
    }

    static pop(props) {
        //解决切场动画不流畅，但是会造成反应延迟
        // InteractionManager.runAfterInteractions(() => {
        //     props.navigator.pop();
        // })
        props.navigator.pop();
    }

    static androidBack(props){
        //todo:在pop后动画结束前并没有立马卸载页面 下一次getCurrentRoutes会获取一样的场景 导致处理错误
        let routes = props.navigator.getCurrentRoutes();
        let contain = false;
        let containIndex = 0;
        imController = IMController.getSingleInstance();
        for (let i = 0; i < routes.length; i++) {
            if (routes[i]["key"] == this.mainPage["key"] && routes[i]["routeId"] == this.mainPage["routeId"]) {
                contain = true;
                containIndex = i;
                break;
            }
        }

        if(contain){
            if(routes.length - 1 > containIndex){
                props.navigator.pop();
                return true;
            }else{
                imController.logout();
                return false;
            }

        }else{
            if(routes.length > 2){
                props.navigator.pop();
                return true;
            }else{
                imController.logout();
                return false
            }
        }
    }


    static replaceTop(props,route){
        let routes = props.navigator.getCurrentRoutes();
        let length = routes.length;

        props.navigator.replaceAtIndex(route,length - 1,function(){
            props.navigator.jumpTo(route)
        });
    }

    static replaceAtIndex(props,route,index){
        props.navigator.replaceAtIndex(route,index,function(){
            props.navigator.jumpTo(route)
        });
    }

    static popToSpecialRoute(props,specialRoute){

        // InteractionManager.runAfterInteractions(() => {
            props.navigator.jumpTo(specialRoute)
        // })
    }

    static ToLogin() {
        let routes = rootNavigator.getCurrentRoutes();
        let route;
        let contain = false;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i]["key"] == this.loginRoute["key"] && routes[i]["routeId"] == this.loginRoute["routeId"]) {
                contain = true;
                route = routes[i];
                break;
            }
        }
        if (!contain) {
            let loginRoute = this.loginRoute;
            rootNavigator.replaceAtIndex(this.loginRoute,1,function(){
                rootNavigator.jumpTo(loginRoute)
            });
        }else{
            rootNavigator.jumpTo(route)
        }
    }
}

export default Route;