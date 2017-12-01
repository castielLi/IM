
import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableHighlight,
    Dimensions,
    Switch,
    ListView,
    ScrollView
} from 'react-native';
import uuidv1 from 'uuid/v1';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';
import {buildChangeGroupNickMessage,buildChangeGroupNickSendMessageToRudexMessage} from '../../../Core/IM/action/createMessage';;
import {bindActionCreators} from 'redux';
import * as relationListActions from '../../../Core/Redux/contact/action';
import * as Actions from '../../../Core/Redux/chat/action';
import * as recentListActions from '../../../Core/Redux/RecentList/action';

import SettingController from '../../../Logic/settingController'


let settingController = new SettingController();
let {height,width} = Dimensions.get('window');

let currentObj = undefined;

class GroupName extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.state = {
            rightButtonText:'',
            rightButtonDisabled:false,
            text:'',
            isChangeText:false
        };

        currentObj = this;
    }


    componentDidMount(){
        this.setState({
            text:this.props.Name
        })
        if(this.state.isChangeText===false){
            this.setState({rightButtonDisabled:true})
        }
    }



    _onChangeText=(v)=>{
        this.setState({isChangeText:true})
        if(v === this.state.text||v === ''){
            this.setState({text:v,rightButtonDisabled:true})
        }else{
            this.setState({text:v,rightButtonDisabled:false})
        }

    }

    toChangeName = ()=>{
        let {accountId,ID,navigator} = this.props;
        currentObj.showLoading();
        let params = {"Operater":accountId,"GroupId":ID,"Name":this.state.text};
        settingController.updateGroupName(accountId,ID,currentObj.state.text,params,(result)=>{
            currentObj.hideLoading();
            if(!result.success){
                alert(result.errorMessage);
                return;
            }
            if(result.data.Data){
                currentObj.props.changeRelationOfNick(ID,currentObj.state.text);
                currentObj.props.changeRecentListOfGropName(ID,currentObj.state.text)

                //更新redux message
                let copyMessage = Object.assign({},result.data.sendMessage);
                let reduxMessage = buildChangeGroupNickSendMessageToRudexMessage(copyMessage);
                currentObj.props.addMessage(reduxMessage,{Nick:currentObj.state.text,avator:currentObj.props.ProfilePicture});

                //路由跳转
                let routes = navigator.getCurrentRoutes();
                let index;
                for (let i = 0; i < routes.length; i++) {
                    if (routes[i]["key"] == "GroupInformationSetting") {
                        index = i;
                        break;
                    }
                }
                currentObj.alert('修改成功');
                //跳转到群设置
                currentObj.route.replaceAtIndex(currentObj.props,{
                    key:'GroupInformationSetting',
                    routeId: 'GroupInformationSetting',
                    params:{"groupId":ID}
                },index)
            }else{
                alert("http请求出错")
            }
        });

    }

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'取消'}}
                    heading={"修改群名称"}
                    right={{func:()=>{
                            this.toChangeName();
                    },text:'完成',disabled:this.state.rightButtonDisabled}}
                />
                <View style={styles.box}>
                        <View style={styles.titleBox}>
                            <Text style={styles.title}>群聊名称</Text>
                        </View>
                        <View style={styles.inputBox}>
                            <TextInput
                                underlineColorAndroid = {'transparent'}
                                autoFocus = {true}
                                defaultValue={this.state.text}
                                maxLength = {30}
                                onChangeText={(v)=>{this._onChangeText(v)}}
                                style={styles.input}
                            >
                            </TextInput>
                            <Icon name="times-circle" size={20} color="#aaa" onPress={()=>{this.setState({text:''})}} style={{marginHorizontal:10}}/>
                        </View>


                </View>
                <Popup ref={ popup => this.popup = popup}/>
                <Loading ref = { loading => this.loading = loading}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',

    },
    box:{
        flex:1,
    },
    titleBox:{
       height:50,
        paddingLeft:10,
        justifyContent:'center',
    },
    title:{
        color: '#aaa',
        fontSize: 14,
    },
    inputBox:{
        height:50,
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center'
    },
    input:{
        flex:1,
        height:50,
        padding:0,
        paddingHorizontal:10,
        backgroundColor:'#fff'
    }

});


const mapStateToProps = state => ({

    accountName:state.loginStore.accountMessage.Nick,
    accountId:state.loginStore.accountMessage.accountId
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(relationListActions,dispatch),
    ...bindActionCreators(Actions, dispatch),
    ...bindActionCreators(recentListActions, dispatch),

});

export default connect(mapStateToProps, mapDispatchToProps)(GroupName);