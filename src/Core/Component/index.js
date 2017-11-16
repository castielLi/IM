/**
 * Created by apple on 2017/6/29.
 */

import React, { Component } from 'react';
import ReactNative,{BackHandler} from 'react-native';
import StyleSheetHelper from '../StyleSheet/index'
import Style from '../StyleSheet/style'
import Route from '.././route/router'
import Localization from '../Localization';

export default class DisplayComponent extends Component {

    constructor(props){
        super(props);
        this.viewModel = {};
        //关联路由组件
        this.route = Route;
        this.Localization = Localization;

        this._handleBack = this._handleBack.bind(this);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this._handleBack)
        console.log( this.constructor.name + "已经加入展示界面" )
    }

    componentWillMount(newStyles){
        const styles = StyleSheetHelper.mergeStyleSheets(Style,newStyles);
        return styles;
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

    render(){

    }

}
