/**
 * Created by apple on 2017/6/6.
 */

import React, {Component} from 'react';
import {StyleSheet, Image,AsyncStorage} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';

export default class Start extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.state = {
            selectedTab: 'home',
            isLogged: false
        }
    }


    componentWillMount(){
        setTimeout(()=>{
            AsyncStorage.getItem('loginStatus')
            .then((value) => {
                //已经登录
                if(value === 'true'){
                    //初始化IM

                    //切换至最近聊天列表
                    this.route.push(this.props,{
                        key:'ChatDetail',
                        routeId: 'ChatDetail'
                    });
                //未登录
                }else{
                    //切换至登录页面
                    this.route.push(this.props,{
                        key:'Login',
                        routeId: 'Login'
                    });
                }                
            }).catch((error) => {

                    })
        },1000)
    }
    render() {

        return (
            <Image source={require('../resource/earth.jpg')} style={styles.img}>

            </Image>
            )
            
    }
}

const styles = StyleSheet.create({
    img:{
    flex:1,
    width:null,
    height:null,
    resizeMode:'cover',
    }
});


