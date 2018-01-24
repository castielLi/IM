/**
 * Created by apple on 2017/6/6.
 */

import React, {Component} from 'react';
import {StyleSheet, Image,AsyncStorage,Platform,Alert} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../Login/reducer/action';
import * as unReadMessageActions from '../../MainTabbar/reducer/action';
import AppManagement from '../../../App/AppManagement'
import loginController from '../../../TSController/loginController';
let LoginController = undefined;
let currentObj = undefined;


class Start extends AppComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        this.state = {
            selectedTab: 'home',
            isLogged: false
        }
        currentObj = this;
        LoginController = new loginController();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }


    componentDidMount(){

        LoginController.loginWithToken(function(result){
            if(result == null){
                currentObj.route.push(currentObj.props,{
                    key:'Login',
                    routeId: 'Login'
                });
                return;
            }


            if(result.Result != 1){

                if(result.Result == 6001){
                    Alert.alert("错误","网络出现故障，请检查当前设备网络连接状态");
                }

                currentObj.route.push(currentObj.props,{
                    key:'Login',
                    routeId: 'Login'
                });
                return;
            }
            currentObj.props.changeTabBar(0);
            AppManagement.onLoginSuccess();
            currentObj.route.push(currentObj.props,{
                key:'MainTabbar',
                routeId: 'MainTabbar'
            });


        });
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
    resizeMode:'stretch',
    }
});


const mapStateToProps = state => ({
    
});

const mapDispatchToProps = (dispatch) => {
  return{
      ...bindActionCreators(unReadMessageActions, dispatch),
    ...bindActionCreators(Actions, dispatch)

  }};

 export default connect(mapStateToProps, mapDispatchToProps)(Start);