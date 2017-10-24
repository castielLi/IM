/**
 * Created by apple on 2017/10/24.
 */

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
    Switch
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../../Core/Component/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet'
import * as relationActions from '../../Contacts/reducer/action';
import * as recentListActions from '../../RecentList/reducer/action';
import * as chatRecordActions from '../../../Core/IM/redux/action';
import * as unReadMessageActions from '../../MainTabbar/reducer/action';
import {bindActionCreators} from 'redux';
import IM from '../../../Core/IM';
import User from '../../../Core/User'

let im = new IM();
let user = new User();
let {height,width} = Dimensions.get('window');
let currentObj;

const options = ['取消','确认']
const title = '推出后不会通知群聊中其他成员,且不会再接收此群聊的消息'

class GroupInformationSetting extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.handlePress = this.handlePress.bind(this);
        this.state = {
            notSeeHisZoom:false,
            notSeeMyZoom:false,
            joinBlackList:false,
            currentRelation:{}
        }
        currentObj = this;
    }
    //定义上导航的左按钮
    _leftButton() {
        return  <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>this.route.pop(this.props)}>
            <View style={styles.back}>

                <Icon name="angle-left" size={30} color="#fff" style={{textAlignVertical:'center',marginRight:8}}/>

                <Text style={{fontSize:16,textAlignVertical:'center',color:'#fff'}}>{'返回'}</Text>
            </View>
        </TouchableOpacity>
    }
    //定义上导航的标题
    _title() {
        return {
            title: "聊天信息",
            tintColor:'#fff',
        }
    }

    componentWillMount(){
        let setting = undefined;
        for(let item in this.props.relations){
            if(this.props.relations[item].RelationId == this.props.client){
                setting = this.props.relations[item];
                break;
            }
        }

        if(setting != undefined){
            this.setState({
                joinBlackList:setting.BlackList,
                currentRelation:setting
            })
        }
    }

    changeNotSeeMyZoom = ()=>{
        this.setState({
            notSeeMyZoom:!this.state.notSeeMyZoom
        })
    }
    changeNotSeeHisZoom = ()=>{
        this.setState({
            notSeeHisZoom:!this.state.notSeeHisZoom
        })
    }
    changeJoinBlackList = (value)=>{
        this.setState({
            joinBlackList:value
        })

        //todo：这里改state只是控制显示。 改redux 该个用户的blacklist 这样修改了 下次进来才是对的
        let relation = this.state.currentRelation;
        relation.BlackList = value;
        this.props.changeRelation(relation)

        currentObj.showLoading()
        if(!value){
            currentObj.fetchData("POST","Member/RemoveBlackMember",function(result){

                currentObj.hideLoading()
                if(result.success) {
                    user.changeRelationBlackList(value, currentObj.props.client);
                }

            },{"Applicant":currentObj.props.accountId
                ,"Account":currentObj.props.client,
                "IsDelete":false})

        }else{
            currentObj.fetchData("POST","Member/AddBlackMember",function(result){

                currentObj.hideLoading()
                if(result.success) {
                    user.changeRelationBlackList(value, currentObj.props.client);
                }

            },{"Applicant":currentObj.props.accountId
                ,"Account":currentObj.props.client})
        }


    }


    handlePress(i){
        let {group,type,accountId} = this.props;
        //删除好友
        if(1 == i){
            currentObj.showLoading()
            this.fetchData("POST","Member/ExitGroup",function(result){
                currentObj.hideLoading()
                if(!result.success){
                    alert(result.errorMessage);
                    return;
                }

                if(result.data.Data){

                    
                }else{
                    alert("http请求出错")
                }


            },{"Applicant":accountId,"Friend":client})
        }
    }

    showActionSheet() {
        this.ActionSheet.show()
    }



    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    heading={"资料设置"}
                    left={{func:()=>{this.route.pop(this.props)},text:'详细资料'}}
                />
                <View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>设置备注和标签</Text>
                            <Text style={styles.arrow}>{'>'}</Text>
                        </View>
                    </TouchableHighlight>
                    <View style={{marginTop:15,borderBottomWidth:1,borderColor:'#eee'}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>不让他看我朋友圈</Text>
                            <Switch
                                value={this.state.notSeeMyZoom}
                                onValueChange={this.changeNotSeeMyZoom}
                            ></Switch>
                        </View>
                    </View>
                    <View>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>不看他朋友圈</Text>
                            <Switch
                                value={this.state.notSeeHisZoom}
                                onValueChange={this.changeNotSeeHisZoom}
                            ></Switch>
                        </View>
                    </View>
                    <View style={{marginTop:15,borderBottomWidth:1,borderColor:'#eee'}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>加入黑名单</Text>
                            <Switch
                                value={this.state.joinBlackList}
                                onValueChange={this.changeJoinBlackList}
                            ></Switch>
                        </View>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>投诉</Text>
                            <Text style={styles.arrow}>{'>'}</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>this.showActionSheet()} style={styles.sendMessageBox}>
                        <Text style={styles.sendMessage}>删除</Text>
                    </TouchableHighlight>
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={title}
                        options={options}
                        cancelButtonIndex={0}
                        destructiveButtonIndex={1}
                        onPress={this.handlePress}
                    />
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
    back:{
        flexDirection:'row',
        alignItems:'center',
        flex:1,
        marginLeft: 10,
    },
    rightButton:{
        color: '#ffffff',
        fontSize: 15,
        marginRight: 10,
        textAlignVertical:'center',
    },
    remarksBox:{
        height:50,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    remarks:{
        fontSize:18,
        color:'#000'
    },
    arrow:{
        fontSize:20,
        color:'#aaa'
    },
    sendMessageBox:{
        height:55,
        borderRadius:5,
        marginTop:15,
        marginHorizontal:20,
        backgroundColor:'#dc0000',
        justifyContent:'center',
        alignItems:'center'
    },
    sendMessage:{
        textAlignVertical:'center',
        color:'#fff',
        fontSize:20,
    }
});


const mapStateToProps = state => ({
    accountId:state.loginStore.accountMessage.accountId,
    recentListStore:state.recentListStore,
    relations:state.relationStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(relationActions, dispatch),
    ...bindActionCreators(recentListActions, dispatch),
    ...bindActionCreators(chatRecordActions, dispatch),
    ...bindActionCreators(unReadMessageActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(InformationSetting);