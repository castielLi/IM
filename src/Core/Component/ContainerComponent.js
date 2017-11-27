/**
 * Created by apple on 2017/7/3.
 */


import React, { Component } from 'react';
import {BackHandler} from 'react-native';
import netWorking from '../Networking/Network'
import BaseComponent from './index'
import Popup from 'react-native-popup';
import Loading from './Popup/loading'
import Route from '../route/router'
import style from '../StyleSheet/style'
import StyleSheetHelper from '../StyleSheet/index'
import {
    View
} from 'react-native';
import Localization from '../Localization';

export default class ContainerComponent extends Component {

    constructor(props) {
        super(props);
        this.PopContent = Popup;
        this.Loading = Loading;
        this.route = Route;
        this.viewModel = {};
        this.style = style;
        this.Localization = Localization;
        this._handleBack = this._handleBack.bind(this);
    }


    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this._handleBack)
    }

    componentWillMount(newStyles){
        const styles = StyleSheetHelper.mergeStyleSheets(style,newStyles);
        return styles;
    }


    alert(content,title="",clickCallback=undefined) {
        if(title == ""){

            this.popup.alert(content);
        }else{
            this.popup.tip({
                title: title,
                content: [content],
                btn: {
                    text: '确定',
                    // style: {
                    //     color: 'red'
                    // },
                    callback: () => {
                        clickCallback&&clickCallback();
                    },
                },
            });
        }

    }

    //android的返回按钮点击
    _handleBack () {
        let navigator = this.props.navigator;
        //
        if(navigator!=undefined){
            return this.route.androidBack(this.props)
        }else{
            return false;
        }
    }

    showLoading(){
        this.loading.show();
    }

    hideLoading(){
        this.loading.hide();
    }

    confirm(title,content,okButtonTitle="OK",oKCallback=undefined,cancelButtonTitle="Cancel",cancelCallback=undefined,) {
        this.popup.confirm({
            title: title,
            content: [content],
            ok: {
                text: okButtonTitle,
                style: {
                    // color: 'green',
                    // fontWeight: 'bold'
                },
                callback: () => {

                    oKCallback != undefined && oKCallback(this.popup);
                }
            },
            cancel: {
                text: cancelButtonTitle,
                style: {
                    // color: 'red'
                    // fontWeight: 'bold'
                },
                callback: () => {
                    cancelCallback != undefined && cancelCallback(this.popup);
                }
            }
        });
    }

    fetchData(method,requestURL,callback,params){
        let network = new netWorking();
        if(method == 'GET'){
            network.methodGET(requestURL,callback,false);
        }else{
            network.methodPOST(requestURL,params,callback,false);
        }
    }

    setFetchAuthorization(authorization){

        netWorking.setNeedAuth(true)
        netWorking.setAuthorization(authorization);

    }

}
