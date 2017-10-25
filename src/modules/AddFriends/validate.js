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
import Icon from 'react-native-vector-icons/FontAwesome';

import ContainerComponent from '../../Core/Component/ContainerComponent';
import MyNavigationBar from '../../Core/Component/NavigationBar';
import IM from '../../Core/IM';
import {addApplyFriendMessage} from '../../Core/IM/action/createMessage';
let im = new IM();
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
        let {Applicant,Respondent} = this.props;
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
                    <View>
                        <Text style={styles.rowTitle}>你需要发送验证申请，等对方通过</Text>
                        <View style={styles.validateView}>
                            <TextInput
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                                onChangeText={(v)=>{this.setState({text:v})}}
                                value={this.state.text}
                            />
                            {this.state.text.length ? <Icon name="times-circle" size={20} color="#aaa" onPress={()=>{this.setState({text:''})}} style={{marginRight:10}}/> : null}
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
        height:50,
        backgroundColor:'#fff',
      flexDirection:'row',
        alignItems:'center',
    },
    textInput:{
      flex:1,
        fontSize:16,
    },
    rowTitle:{
        height:50,
        fontSize:14,
        color:'#999',
        paddingLeft:10,
        textAlignVertical:'center'
    },
    rowSetting:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#fff',
        height:50,
        paddingHorizontal:10
    },
    rowText:{
        fontSize:16,
        color:'#000',
        height:50,
        textAlignVertical:'center',
    },
});