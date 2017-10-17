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
import User from '../../../Core/User'
import * as relationActions from '../../../Core/User/redux/action';
import * as contactsActions from '../../Contacts/reducer/action';
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

        //改成 toekn

        AsyncStorage.getItem('account')
            .then((value) => {
                let account = JSON.parse(value);
                //已经登录
                if(account){

                    this.setFetchAuthorization(account.SessionToken)
                    // this.setFetchAuthorization("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50Ijoid2cwMDM2NjIiLCJEZXZpY2VUeXBlIjoiTW9iaWxlIiwiZXhwIjoxNTA4NDg0NzE1LCJpYXQiOjE1MDc4Nzk5MTV9.nfiBb1IDdrN_CxV9AER67JT9IeDF1ao6uC7WN-yr46M")
                    this.fetchData("POST","/Member/LoginByToken",function(result){
                        if(result.Data != null){
                            //缓存token
                            AsyncStorage.setItem('account',JSON.stringify({ accountId:account.accountId,SessionToken:result.Data["SessionToken"]}));
                            let im = new IM();
                            im.setSocket(account.accountId);
                            im.initIMDatabase(account.accountId)


                            let user = new User();
                            user.getAllRelation((data)=>{
                                //初始化联系人store
                                this.props.initFriendList(data);
                            })

                            user.getAllRelationNameAndAvator((relationData)=>{
                                //初始化relationStore
                                currentObj.props.initRelation(relationData);
                            })
                            currentObj.props.signIn(account)
                            //切换至最近聊天列表
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


                    });

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
      ...bindActionCreators(relationActions, dispatch),
      ...bindActionCreators(contactsActions, dispatch),
  }};

 export default connect(mapStateToProps, mapDispatchToProps)(Start);