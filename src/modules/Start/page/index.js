/**
 * Created by apple on 2017/6/6.
 */

import React, {Component} from 'react';
import {StyleSheet, Image,AsyncStorage} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../Login/reducer/action';
import IM from '../../../Core/IM'

class Start extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.state = {
            selectedTab: 'home',
            isLogged: false
        }
    }


    componentWillMount(){
        AsyncStorage.getItem('accountId')
            .then((value) => {
                //已经登录
                if(value){
                    let im = new IM();
                    im.setSocket(value);
                    this.props.signIn({ accountId:value,avatar:''})
                    //切换至最近聊天列表
                    this.route.push(this.props,{
                        key:'RecentList',
                        routeId: 'RecentList'
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
            alert(error)
        })
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


const mapStateToProps = state => ({
    
});

const mapDispatchToProps = (dispatch) => {
  return{
    ...bindActionCreators(Actions, dispatch),
}};

 export default connect(mapStateToProps, mapDispatchToProps)(Start);