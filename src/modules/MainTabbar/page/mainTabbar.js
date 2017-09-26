/**
 * Created by apple on 2017/6/6.
 */

import React, {Component} from 'react';
import {StyleSheet, Image} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import DisplayComponent from '../../../Core/Component/index'
import {connect} from 'react-redux';


class TabBarComponent extends DisplayComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.state = {
            selectedTab: 'home',
            isLogged: false
        }
    }



    render() {

        return (
            <TabNavigator>

                <TabNavigator.Item
                    selected={this.state.selectedTab === 'home'}
                    title="Home"
                    renderIcon={() =>  <Image source={require('../resources/action.png')}
                                              style={[styles.icon]}
                                              resizeMode={Image.resizeMode.contain}
                    />}
                    renderSelectedIcon={() =>  <Image source={require('../resources/action.png')}
                                                      style={[styles.icon]}
                                                      resizeMode={Image.resizeMode.contain}
                    />}
                    badgeText="1"
                    onPress={() => this.setState({ selectedTab: 'home' })}>
                    {this.route.getComponentByRouteId("MainTabbar","TabOne")}
                </TabNavigator.Item>

                <TabNavigator.Item
                    selected={this.state.selectedTab === 'profile'}
                    title="Profile"
                    renderIcon={() =>  <Image source={require('../resources/action.png')}
                                              style={[styles.icon]}
                                              resizeMode={Image.resizeMode.contain}
                    />}
                    renderSelectedIcon={() =>  <Image source={require('../resources/action.png')}
                                                      style={[styles.icon]}
                                                      resizeMode={Image.resizeMode.contain}
                    />}
                    onPress={() => this.setState({ selectedTab: 'profile' })}>
                    {this.route.getComponentByRouteId("MainTabbar","TabTwo")}
                </TabNavigator.Item>

                <TabNavigator.Item
                    selected={this.state.selectedTab === 'contacts'}
                    title="Contacts"
                    renderIcon={() =>  <Image source={require('../resources/action.png')}
                                              style={[styles.icon]}
                                              resizeMode={Image.resizeMode.contain}
                    />}
                    renderSelectedIcon={() =>  <Image source={require('../resources/action.png')}
                                                      style={[styles.icon]}
                                                      resizeMode={Image.resizeMode.contain}
                    />}
                    onPress={() => this.setState({ selectedTab: 'contacts' })}>
                    {this.route.getComponentByRouteId("MainTabbar","TabThree")}
                </TabNavigator.Item>

                <TabNavigator.Item
                    selected={this.state.selectedTab === 'me'}
                    title="Me"
                    renderIcon={() =>  <Image source={require('../resources/action.png')}
                                              style={[styles.icon]}
                                              resizeMode={Image.resizeMode.contain}
                    />}
                    renderSelectedIcon={() =>  <Image source={require('../resources/action.png')}
                                                      style={[styles.icon]}
                                                      resizeMode={Image.resizeMode.contain}
                    />}
                    onPress={() => this.setState({ selectedTab: 'me' })}>
                    {this.route.getComponentByRouteId("MainTabbar","TabFour")}
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
