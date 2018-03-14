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
import LoginController from '../../../TSController/LoginController';
import SystemManager from '../../../TSController/SystemManager'
import {LoginningState,TokenLoginState} from '../../../App/AppManagementState'
let loginController = undefined;
let currentObj = undefined;
let systemManager = undefined;

class Start extends AppComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        this.state = {
            selectedTab: 'home',
            isLogged: false
        }
        currentObj = this;
        systemManager = new SystemManager()
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }


    componentDidMount(){
        SystemManager.initConfig(() => {
            systemManager.init(() => {
                let loginningState = new LoginningState();
                loginningState.stateOpreation(this.appManagement);

                loginController = LoginController.getSingleInstance();
                loginController.checkLoginToken((user)=>{
                    if(user != null){

                        //之前登录过，设置为token登录模式
                        let tokenLoginnedState = new TokenLoginState();
                        tokenLoginnedState.stateOpreation(this.appManagement);

                        currentObj.props.changeTabBar(0);
                        currentObj.route.push(currentObj.props,{
                            key:'MainTabbar',
                            routeId: 'MainTabbar'
                        });
                    }else{
                        currentObj.route.push(currentObj.props,{
                            key:'Login',
                            routeId: 'Login'
                        });
                    }
                })
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