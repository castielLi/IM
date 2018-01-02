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
    Switch,Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import ContainerComponent from '../../Core/Component/ContainerComponent';
import MyNavigationBar from '../Common/NavigationBar/NavigationBar';

import {bindActionCreators} from 'redux';

import RelationModel from '../../Logic/Common/dto/RelationDto'
import ChatWayEnum from '../../Core/Management/Common/dto/ChatWayEnum';
import ApplyFriendController from '../../Logic/ApplyFriend/applyFriendController';


let currentObj;
let applyFriendController = undefined;

class Validate extends ContainerComponent {
    constructor(props){
        super(props)
        this.state={
            privilege:false,
            text:''
        }
        currentObj = this;
        applyFriendController = new ApplyFriendController();
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
        // currentObj.showLoading()
        Keyboard.dismiss();
        // im.addMessage(addMessage,function(){
        //     currentObj.hideLoading()
            currentObj.alert("申请消息已经发送,等待对方验证","提醒",
                function(){
                    currentObj.route.pop(currentObj.props);
                });

            //向数据库添加关系，并且标记这条关系显示为false;
            let relation = new RelationModel();
            relation.Nick = currentObj.props.relation.Nickname;
            relation.RelationId = currentObj.props.relation.Account;
            relation.OtherComment = currentObj.props.relation.Gender;
            relation.avator = currentObj.props.relation.HeadImageUrl;
            relation.Type = ChatWayEnum.Private;
            relation.show = 'false';
            // user.AddNewRelation(relation);


            applyFriendController.tempApplyFriend(relation);
            //currentObj.props.addRelation(relation);

        // })
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
                        <View style={styles.textBox}>
                            <Text style={styles.rowTitle}>你需要发送验证申请，等对方通过</Text>
                        </View>
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
                        <View style={styles.textBox}>
                            <Text style={styles.rowTitle}>朋友圈权限</Text>
                        </View>
                        <View style={styles.rowSetting}>
                            <View style={styles.textBox}>
                                <Text style={styles.rowText}>不让他(她)看我的朋友圈</Text>
                            </View>
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
        paddingLeft:10
    },
    textBox:{
        height:50,
        justifyContent:'center'
    },
    rowTitle:{
        fontSize:14,
        color:'#999',

    },
    rowSetting:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#fff',
        height:50,
        paddingHorizontal:15
    },
    rowText:{
        fontSize:16,
        color:'#000',
    },
});

const mapStateToProps = state => ({
    accountId:state.loginStore.accountMessage.accountId,
    accountName:state.loginStore.accountMessage.Nick,
    avator:state.loginStore.accountMessage.avator,
});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps,mapDispatchToProps)(Validate);