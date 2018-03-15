/**
 * Created by apple on 2017/6/6.
 */

import React, {Component} from 'react';
import {StyleSheet, Image,View,Text} from 'react-native';
import {
    checkDeviceHeight,
    checkDeviceWidth
} from '../../../Core/Helper/UIAdapter';
import TabNavigator from 'react-native-tab-navigator';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import tabBarPageEnum from './tabBarPageEnum';
import * as unReadMessageActions from '../../MainTabbar/reducer/action';
import * as featuresAction from '../../Common/menu/reducer/action';
import AppPageMarkEnum from '../../../App/Enum/AppPageMarkEnum';
import AppManagement from '../../../App/AppManagement';
import AppPageRequestEnum from '../../../App/Enum/AppPageRequestEnum';
import TabTypeEnum from '../../../TSController/Enums/TabTypeEnum'
let currentObj = undefined;

class TabBarComponent extends AppComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        currentObj = this;
    }

    _refreshUI(type,params){
        switch (type){
            case AppPageMarkEnum.UnReadMessage:
                if(params.type == TabTypeEnum.RecentList){
                    currentObj.props.changeUnReadMessageNumber(params.number);
                }else if(params.type == TabTypeEnum.Contact){
                    currentObj.props.showUnDealRequest();
                }
                break;
        }
    }

    componentWillMount(){
        currentObj.props.changeTabBar(0);
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    isShowFeature = (number)=>{
        if(this.props.tabBarStore !== number && this.props.featuresStore){
            this.props.hideFeatures();
        }
    }

    badgeComponent(title,count){
        if(title == '云信'){
            if(count>0||count == '99+'){
                return <View style={styles.badge}><Text style={styles.badgeText}>{count}</Text></View>
            }else{
                return null;
            }
        }else{
            if(count){
                return <View style={styles.otherBadge}></View>
            }else{
                return null;
            }
        }
    }
    render() {
        let selectedTab = tabBarPageEnum[this.props.tabBarStore];
        return (
            <TabNavigator>

                <TabNavigator.Item
                    selected={selectedTab === '云信'}
                    title="云信"
                    selectedTitleStyle={{color:'#1aad19'}}
                    renderIcon={() =>  <Image source={require('../resources/qixin.png')}
                                              style={[styles.icon]}
                                              resizeMode={Image.resizeMode.contain}
                    />}
                    renderSelectedIcon={() =>  <Image source={require('../resources/qixin_.png')}
                                                      style={[styles.icon]}
                                                      resizeMode={Image.resizeMode.contain}
                    />}
                    //badgeText={this.props.unReadMessageStore.unReadMessageNumber}
                    renderBadge={this.badgeComponent.bind(this,'云信',this.props.unReadMessageStore.unReadMessageNumber)}
                    onPress={() => {this.props.changeTabBar(0);this.isShowFeature(0)}}>
                    {this.route.getComponentByRouteIdNavigator("MainTabbar","TabOne",this.props.navigator)}
                </TabNavigator.Item>

                <TabNavigator.Item
                    selected={selectedTab === '通讯录'}
                    title="通讯录"
                    selectedTitleStyle={{color:'#1aad19'}}
                    renderIcon={() =>  <Image source={require('../resources/contact.png')}
                                              style={[styles.icon]}
                                              resizeMode={Image.resizeMode.contain}
                    />}
                    renderSelectedIcon={() =>  <Image source={require('../resources/contact_.png')}
                                                      style={[styles.icon]}
                                                      resizeMode={Image.resizeMode.contain}
                    />}
                    //badgeText={this.props.unReadMessageStore.unDealRequestNumber}
                    renderBadge={this.badgeComponent.bind(this,'通讯录',this.props.unReadMessageStore.unDealRequestMark)}
                    onPress={() => {this.props.changeTabBar(1);this.isShowFeature(1)}}>
                    {this.route.getComponentByRouteIdNavigator("MainTabbar","TabTwo",this.props.navigator)}
                </TabNavigator.Item>

                <TabNavigator.Item
                    selected={selectedTab === '发现'}
                    title="发现"
                    selectedTitleStyle={{color:'#1aad19'}}
                    renderIcon={() =>  <Image source={require('../resources/zoom.png')}
                                              style={[styles.icon]}
                                              resizeMode={Image.resizeMode.contain}
                    />}
                    renderSelectedIcon={() =>  <Image source={require('../resources/zoom_.png')}
                                                      style={[styles.icon]}
                                                      resizeMode={Image.resizeMode.contain}
                    />}
                    renderBadge={this.badgeComponent.bind(this,'通讯录',this.props.unReadMessageStore.unReadZoomMessageNumber)}

                    onPress={() => {this.props.changeTabBar(2);this.isShowFeature(2)}}>
                    {this.route.getComponentByRouteIdNavigator("MainTabbar","TabThree",this.props.navigator)}
                </TabNavigator.Item>

                <TabNavigator.Item
                    selected={selectedTab === '我'}
                    title="我"
                    selectedTitleStyle={{color:'#1aad19'}}
                    renderIcon={() =>  <Image source={require('../resources/me.png')}
                                              style={[styles.icon]}
                                              resizeMode={Image.resizeMode.contain}
                    />}
                    renderSelectedIcon={() =>  <Image source={require('../resources/me_.png')}
                                                      style={[styles.icon]}
                                                      resizeMode={Image.resizeMode.contain}
                    />}
                    renderBadge={this.badgeComponent.bind(this,'通讯录',this.props.unReadMessageStore.unSettingNumber)}

                    onPress={() => {this.props.changeTabBar(3);this.isShowFeature(3)}}>
                    {this.route.getComponentByRouteIdNavigator("MainTabbar","TabFour",this.props.navigator)}
                </TabNavigator.Item>
            </TabNavigator>
        )
    }
}

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24
    },
    badge:{
        width:checkDeviceHeight(40),
        height:checkDeviceWidth(30),
        borderColor:'#fff',
        borderWidth:2,
        borderRadius:checkDeviceHeight(15),
        backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center'
    },
    otherBadge:{
        width:checkDeviceHeight(20),
        height:checkDeviceWidth(20),
        borderColor:'#fff',
        borderWidth:2,
        borderRadius:checkDeviceHeight(10),
        backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center'
    },
    badgeText:{
        fontSize:checkDeviceHeight(16),
        color:'#fff'
    }
});

const mapStateToProps = state => ({
    loginStore: state.loginStore,
    unReadMessageStore:state.unReadMessageStore,
    tabBarStore:state.tabBarStore,
    featuresStore:state.FeaturesStore.isShow

});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(unReadMessageActions, dispatch),
    ...bindActionCreators(featuresAction, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(TabBarComponent);
