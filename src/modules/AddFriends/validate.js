/**
 * Created by Hsu. on 2017/10/20.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Switch
} from 'react-native';

import ContainerComponent from '../../Core/Component/ContainerComponent';
import MyNavigationBar from '../../Core/Component/NavigationBar';
import IM from '../../Core/IM';
import {addApplyFriendMessage} from '../../Core/IM/action/createMessage';

let currentObj = undefined;

export default class Validate extends ContainerComponent {
    constructor(props){
        super(props)
        this.state={
            privilege:false,
            text:''
        }
        currentObj = this;
    }

    static defaultProps = {

    };

    static propTypes = {

    };



    goToSearchNewFriend = () =>{
        this.route.push(this.props,{key:'SearchNewFriend',routeId:'SearchNewFriend',params:{}});

    }

    changePrivilege = (value)=>{
        alert(value)
        this.setState({
            privilege:value
        })
    }

    sendApplyMessage= ()=>{
        currentObj.showLoading()
        let addMessage = addApplyFriendMessage({comment:'我是台台台台',key:currentObj.props.validateID},Applicant,Respondent);
        im.addMessage(addMessage,function(){
            currentObj.hideLoading()
            currentObj.alert("申请消息已经发送,等待对方验证","提醒");
        })
    }
    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return(
            <View style={styles.container}>
                <MyNavigationBar
                    heading={'验证申请'}
                    left={{func:()=>{this.route.pop(this.props)}}}
                    right={{func:this.sendApplyMessage,text:'发送'}}
                />
                <View style={styles.Box}>
                    <View style={styles.rowBox}>
                        <Text style={styles.rowTitle}>你需要发送验证申请，等对方通过</Text>
                        <View style={styles.validateView}>
                            <TextInput
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                                onChangeText={(v)=>{this.setState({text:v})}}
                                value={this.state.text}
                            />
                            {this.state.text.length ? <Text style={styles.rowClose} onPress={()=>{this.setState({text:''})}}>X</Text> : null}
                        </View>
                    </View>
                    <View style={styles.rowBox}>
                        <Text style={styles.rowTitle}>朋友圈权限</Text>
                        <View style={styles.rowSetting}>
                            <Text style={styles.rowText}>不让他(她)看我的朋友圈</Text>
                            <Switch
                                value={this.state.privilege}
                                onValueChange={(value)=>{this.changePrivilege(value)}}
                            />
                        </View>
                    </View>
                </View>
                <Popup ref={ popup => this.popup = popup}/>
                <Loading ref = { loading => this.loading = loading}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#ddd',
        flex:1
    },
    validateView:{
      flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1
    },
    textInput:{
      flex:1,
        fontSize:16,
        paddingBottom:0
    },
    rowBox:{
        backgroundColor:'#fff',
        marginBottom:10,
        padding:10,
    },
    rowTitle:{
        fontSize:14,
        color:'#999',
    },
    rowSetting:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    rowText:{
        fontSize:16,
        color:'#000',
    },
    rowClose:{
        padding:10,
        backgroundColor:'yellow',
        marginRight:10
    },
});