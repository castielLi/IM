/**
 * Created by apple on 2017/6/6.
 */

import React, {Component} from 'react';
import {StyleSheet, Image,AsyncStorage,Platform} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../Login/reducer/action';
import LoginController from '../../../Logic/loginController'
import ImController from '../../../Logic/Im/imController'
let imController = new ImController();
let loginController = new LoginController();
let currentObj = undefined;

class Start extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.state = {
            selectedTab: 'home',
            isLogged: false
        }
        currentObj = this;
    }


    componentWillMount(){
        AsyncStorage.getItem('account')
            .then((value) => {
                let account = JSON.parse(value);
                imController.setMyAccount(account);
                //已经登录
                if(account){
                    loginController.loginWithToken(function(result){
                        if(!result.success){
                            //2003代码是token失效
                            if(result.errorCode == 2003){
                                currentObj.route.push(currentObj.props,{
                                    key:'Login',
                                    routeId: 'Login'
                                });
                                return;
                            }
                            alert(result.errorMessage)
                            return;
                        }

                        if(result.data.Data == null){
                            currentObj.route.push(currentObj.props,{
                                key:'Login',
                                routeId: 'Login'
                            });
                        }else{
                            account = result.data.account;
                            currentObj.props.signIn(account);
                            imController.setMyAccount(account);

                            currentObj.route.push(currentObj.props,{
                                key:'MainTabbar',
                                routeId: 'MainTabbar'
                            });
                        }

                    },{},account);
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
    resizeMode:'stretch',
    }
});


const mapStateToProps = state => ({
    
});

const mapDispatchToProps = (dispatch) => {
  return{
    ...bindActionCreators(Actions, dispatch)

  }};

 export default connect(mapStateToProps, mapDispatchToProps)(Start);