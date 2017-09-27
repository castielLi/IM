/**
 * Created by apple on 2017/6/6.
 */

import React, {Component} from 'react';
import {StyleSheet, Image} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import DisplayComponent from '../../../Core/Component/index'
import {connect} from 'react-redux';


class TabBarComponent extends DisplayComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        this.state = {
            selectedTab: '齐信',
            isLogged: false
        }
    }



    render() {

        return (
            <TabNavigator>

                <TabNavigator.Item
                    selected={this.state.selectedTab === '齐信'}
                    title="齐信"
                    renderIcon={() =>  <Image source={require('../resources/action.png')}
                                              style={[styles.icon]}
                                              resizeMode={Image.resizeMode.contain}
                    />}
                    renderSelectedIcon={() =>  <Image source={require('../resources/action.png')}
                                                      style={[styles.icon]}
                                                      resizeMode={Image.resizeMode.contain}
                    />}
                    badgeText="1"
                    onPress={() => this.setState({ selectedTab: '齐信' })}>
                    {this.route.getComponentByRouteIdNavigator("MainTabbar","TabOne",this.props.navigator)}
                </TabNavigator.Item>

                <TabNavigator.Item
                    selected={this.state.selectedTab === '通讯录'}
                    title="通讯录"
                    renderIcon={() =>  <Image source={require('../resources/action.png')}
                                              style={[styles.icon]}
                                              resizeMode={Image.resizeMode.contain}
                    />}
                    renderSelectedIcon={() =>  <Image source={require('../resources/action.png')}
                                                      style={[styles.icon]}
                                                      resizeMode={Image.resizeMode.contain}
                    />}
                    onPress={() => this.setState({ selectedTab: '通讯录' })}>
                    {this.route.getComponentByRouteIdNavigator("MainTabbar","TabTwo",this.props.navigator)}
                </TabNavigator.Item>

                <TabNavigator.Item
                    selected={this.state.selectedTab === '发现'}
                    title="发现"
                    renderIcon={() =>  <Image source={require('../resources/action.png')}
                                              style={[styles.icon]}
                                              resizeMode={Image.resizeMode.contain}
                    />}
                    renderSelectedIcon={() =>  <Image source={require('../resources/action.png')}
                                                      style={[styles.icon]}
                                                      resizeMode={Image.resizeMode.contain}
                    />}
                    onPress={() => this.setState({ selectedTab: '发现' })}>
                    {this.route.getComponentByRouteIdNavigator("MainTabbar","TabThree",this.props.navigator)}
                </TabNavigator.Item>

                <TabNavigator.Item
                    selected={this.state.selectedTab === '我'}
                    title="我"
                    renderIcon={() =>  <Image source={require('../resources/action.png')}
                                              style={[styles.icon]}
                                              resizeMode={Image.resizeMode.contain}
                    />}
                    renderSelectedIcon={() =>  <Image source={require('../resources/action.png')}
                                                      style={[styles.icon]}
                                                      resizeMode={Image.resizeMode.contain}
                    />}
                    onPress={() => this.setState({ selectedTab: '我' })}>
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
    }
});

const mapStateToProps = state => ({
    loginStore: state.loginStore
});

const mapDispatchToProps = dispatch => ({
    // ...bindActionCreators(tabbarAction,dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(TabBarComponent);
