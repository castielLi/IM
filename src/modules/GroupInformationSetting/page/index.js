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
    Switch,
    FlatList,
    TouchableWithoutFeedback,
    ScrollView,
    InteractionManager
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet'
import * as unReadMessageActions from '../../MainTabbar/reducer/action';
import {bindActionCreators} from 'redux';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';
import UserController from '../../../TSController/UserController';
import IMController from '../../../TSController/IMLogic/IMControllerLogic'
import AppPageMarkEnum from '../../../App/Enum/AppPageMarkEnum'
let userController = undefined;
let imController = undefined;

let {height,width} = Dimensions.get('window');
let currentObj;
let currentAccount = undefined;
const options = ['取消','确认']
const title = '退出后不会通知群聊中其他成员,且不会再接收此群聊的消息'

class GroupInformationSetting extends AppComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        this.handlePress = this.handlePress.bind(this);
        userController =  UserController.getSingleInstance();
        imController = IMController.getSingleInstance();

        let setting = imController.getChatSetting();

        if(setting == undefined){
            this.state = {
                isStickyChat:false,//置顶聊天
                notDisturb:false,//消息免打扰
                isSave:false,
                searchResult:true,
                isNickname:false,
                members:[],
                realMemberList:[],
                groupInformation:{}
            }
        }else{
            this.state = {
                isStickyChat:setting.StickToTheTop,//置顶聊天
                notDisturb:setting.NoDisturb,//消息免打扰
                isSave:false,
                searchResult:true,
                isNickname:false,
                members:[],
                realMemberList:[],
                groupInformation:{}
            }
        }
        currentObj = this;
    }

    _refreshUI(type,params){
        //这里如果没有点击通讯录界面是不会进行初始化的，不会初始化就会导致下层通知上层的时候不会显示contact 申请的红点
        switch (type){
            case AppPageMarkEnum.ChangeRemark:
                 let {account,remark} = params;
                 let changesMembers = currentObj.state.members;
                 for(let item in changesMembers){
                     if(changesMembers[item].Account == account){
                         changesMembers.Remark = remark;
                     }
                 }
                currentObj.setState({
                    members:changesMembers.concat([])
                });
                break;
            case AppPageMarkEnum.ModifyGroupName:
                let name = params.name;
                currentObj.onUpdateHeadName(name);
                break;
        }
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    changeIsStickyChat = ()=>{
        imController.setStickToTheTop(!this.state.isStickyChat);
        this.setState({
            isStickyChat:!this.state.isStickyChat
        })
    };
    changeNotDisturb = ()=>{
        imController.setNoDisturb(!this.state.notDisturb);
        this.setState({
            notDisturb:!this.state.notDisturb
        })
    };

    addOrRemoveTheContacts = () =>{
        currentObj.setState({
            isSave:!this.state.isSave
        });
        userController.addOrRemoveContacts(this.props.groupId,!this.state.isSave);
    };
    _changeIsNickname = (value)=>{
        currentObj.setState({
            isNickname:value
        });
        userController.modifyNicknameSetting(this.props.groupId,value);
    };

    componentDidMount(){
        InteractionManager.runAfterInteractions(()=> {
            currentAccount = userController.getCurrentAccount();
            userController.getGroupAndMembersInfo(this.props.groupId, 10, (result) => {
                // let save = result.Save ? true : false;
                // if (!result.Note || result.Note == 'null') {
                //     result.Note = null;
                // }
                let groupInformation = {
                    Id: result.Id,
                    Name: result.Name,
                    Note: result.Note,
                    HeadImageUrl: result.HeadImageUrl,
                    HeadImagePath: result.HeadImagePath,
                    Owner: result.Owner,
                    Save: result.Save,
                };
                let members = [];
                if (result.memberList) {
                    members = result.memberList.concat([{}, {}]);
                }
                currentObj.setState({
                    members,
                    groupInformation,
                    isSave: result.Save
                })
            });
            userController.getGroupSetting(this.props.groupId,(result)=>{
                this.setState({
                    isNickname:result.Nickname,
                })
            })
        });
    }


    handlePress(i){
        //退出群组
        if(1 == i){
            currentObj.showLoading();
            userController.removeGroup(this.props.groupId,()=>{
                currentObj.hideLoading();
                currentObj.route.toMain(currentObj.props);
            });
        }
    }

    showActionSheet() {
        this.ActionSheet.show()
    }

    _footer = () => {

        if(this.state.members.length<=12) return null;
        return  (
            <TouchableOpacity onPress={this.goToMoreGroupList}>
                <View style={styles.listFooter}>
                    <Text style={styles.listFooterText}>查看更多群成员</Text>
                    <Icon name="angle-right" size={20} color="#aaa" />
                </View>
            </TouchableOpacity>
        )
    };

    goToGroupQRCode = ()=>{
        currentObj.route.push(currentObj.props,{key:'GroupInformationSetting',routeId:'GroupQRCodeContent',params:{groupId:this.props.groupId,"name":this.state.groupInformation.Name}});
    };


    goToMoreGroupList = (groupId)=>{
        this.route.push(this.props,{key:'MoreGroupList',routeId:'MoreGroupList',params:{groupId:this.props.groupId}})
    };
    goToClientInfo = (Account)=>{
        this.route.push(currentObj.props,{key:'ClientInformation',routeId:'ClientInformation',params:{clientId:Account}});
    };

    //跳转加添群成员页面
    goToChooseClient = ()=>{
        let members = this.state.members.map((item,index)=>{
            return item.Account;
        });
        let groupId = this.props.groupId;
        this.route.push(this.props,{key:'ChooseClient',routeId:'ChooseClient',params:{members,groupId,"UpdateHeadName":this.props.onUpdateHeadName}})
    };

    goToDeleteClient = ()=>{
        this.route.push(this.props,{key:'DeleteGroupMember',routeId:'DeleteGroupMember',params:{groupId:this.props.groupId,"UpdateHeadName":this.props.onUpdateHeadName}})
    };
    _renderItem = (item) => {
        //var txt = '第' + item.index + '个' + ' title=' + item.item.title;
        if(item.index == this.state.members.length-2){
                return (
                    <TouchableWithoutFeedback onPress={()=>{this.goToChooseClient()}}>
                        <View style={styles.itemBox}>
                            <View style={styles.lastItemBox}>
                                <Text style={styles.lastItemText}>+</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )
        }else if(item.index == this.state.members.length-1){
            if(this.state.groupInformation.Owner === currentAccount.Account){
                return (
                    <TouchableWithoutFeedback onPress={()=>{this.goToDeleteClient()}}>
                        <View style={styles.itemBox}>
                            <View style={styles.lastItemBox}>
                                <Text style={styles.lastItemText}>-</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )
            }else{
                return null;
            }
        }
        else{
            let path = userController.getAccountHeadImagePath(item.item.Account);
            let name = item.item.Remark != "" ? item.item.Remark:item.item.Nickname;
            return (
                <TouchableWithoutFeedback onPress={()=>{this.goToClientInfo(item.item.Account)}}>
                    <View style={styles.itemBox}>
                        <ImagePlaceHolder style={styles.itemImage} imageUrl={path}/>
                        <Text style={styles.itemText} numberOfLines={1}>{name}</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        }
    };
    gotoGroupAnnouncement = ()=>{
        let {Owner} = this.state.groupInformation;
        if(Owner!==currentAccount.Account){
            alert('只有群主才能设置公告')
        }else{
            this.route.push(this.props,{key:'GroupAnnouncement',routeId:'GroupAnnouncement',params:{...this.state.groupInformation}});
        }
    };
    gotoGroupName = ()=>{
            this.route.push(this.props,{key:'GroupName',routeId:'GroupName',params:{...this.state.groupInformation,"UpdateHeadName":this.props.onUpdateHeadName}});

    };

    gotoGroupBackgroundImage = ()=>{
        this.route.push(this.props,{key:'GroupInformationSetting',routeId:'GroupBackgroundImage'});
    };

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        let {Id,HeadImageUrl,Name,Owner,Save,Note,HeadImagePath} = this.state.groupInformation;

        return (
            <View style={styles.container}>
                <MyNavigationBar
                    heading={"群聊天设置"}
                    left={{func:()=>{this.route.pop(this.props)},text:'返回'}}
                />
                <ScrollView>
                    <View>
                        <FlatList
                            ListFooterComponent={this._footer}
                            renderItem={this._renderItem}
                            //每行有5列。每列对应一个item
                            numColumns ={5}
                            //多列的行容器的样式
                            columnWrapperStyle={{marginTop:10}}
                            //要想numColumns有效必须设置horizontal={false}
                            horizontal={false}
                            keyExtractor={(item,index)=>(index)}
                            style={{backgroundColor:'#fff',paddingBottom:10}}
                            data={this.state.members}>
                        </FlatList>
                    </View>
                    <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                        <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.gotoGroupName} style={{marginTop:15}}>
                            <View  style={styles.remarksBox}>
                                <Text style={styles.remarks}>群聊名称</Text>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text numberOfLines = {1} style={styles.arrowText}>{Name}</Text>
                                    <Icon name="angle-right" size={35} color="#aaa" />
                                </View>

                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                        <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.goToGroupQRCode}>
                            <View  style={styles.remarksBox}>
                                <Text style={styles.remarks}>群二维码</Text>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Icon name="qrcode" size={20} color="#aaa" style={{textAlignVertical:'center',marginRight:10}}/>
                                    <Icon name="angle-right" size={35} color="#aaa" />
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                        <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.gotoGroupAnnouncement}>
                            <View  style={[styles.remarksBox,{height:null,paddingVertical:10}]}>
                                <View style={{maxWidth:width-100}}>
                                    <Text style={styles.remarks}>群公告</Text>
                                </View>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={styles.arrowText}>{Note ? Note : '未设置'}</Text>
                                    <Icon name="angle-right" size={35} color="#aaa" />
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                        <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginBottom:15}}>
                            <View  style={styles.remarksBox}>
                                <Text style={styles.remarks}>群管理</Text>
                                <Icon name="angle-right" size={35} color="#aaa" />
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>置顶聊天</Text>
                            <Switch
                                value={this.state.isStickyChat}
                                onValueChange={this.changeIsStickyChat}
                            />
                        </View>
                    </View>
                    <View>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>消息免打扰</Text>
                            <Switch
                                value={this.state.notDisturb}
                                onValueChange={this.changeNotDisturb}
                            />
                        </View>
                    </View>
                    <View style={{marginBottom:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>添加到通讯录</Text>
                            <Switch
                                value={this.state.isSave}
                                onValueChange={this.addOrRemoveTheContacts}
                            />
                        </View>
                    </View>

                    <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>显示群成员昵称</Text>
                            <Switch
                                value={this.state.isNickname}
                                onValueChange={this._changeIsNickname}
                            />
                        </View>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.gotoGroupBackgroundImage} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>设置当前聊天背景</Text>
                            <Icon name="angle-right" size={35} color="#aaa" />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{
                        imController.removeAllMessage(Id,true)
                        alert("清空聊天记录成功")
                    }} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>清空聊天记录</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>this.showActionSheet()} style={[styles.sendMessageBox,{marginBottom:20}]}>
                        <Text style={styles.sendMessage}>删除并退出</Text>
                    </TouchableHighlight>
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={title}
                        options={options}
                        cancelButtonIndex={0}
                        destructiveButtonIndex={1}
                        onPress={this.handlePress}
                    />
                </ScrollView>
                <Popup ref={ popup => this.popup = popup}/>
                <Loading ref = { loading => this.loading = loading}/>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ebebeb',

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
    remarksText:{
        fontSize:16,
        color:'#aaa',
    },
    arrow:{
        fontSize:20,
        color:'#bbb'
    },
    arrowText:{
        fontSize:16,
        color:'#aaa',
        marginRight:10,
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
    },
    itemBox:{
        width:width/5,
        alignItems:'center',
    },
    itemImage:{
        width:50,
        height:50,
        borderRadius:25
    },
    itemText:{
        color:'#989898',
        fontSize:13,
        textAlignVertical:'center',
        includeFontPadding:false,
        maxWidth:50,
        marginTop:3,
    },
    lastItemBox:{
        justifyContent:'center',
        alignItems:'center',
        height:50,
        width:50,
        borderWidth:1,
        borderColor:'#d9d9d9',
        borderRadius:25
    },
    lastItemText:{
        color:'#989898',
        fontSize:30,
        textAlignVertical:'center',
        includeFontPadding:false,
    },
    listFooter:{
        height:50,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    listFooterText:{
        fontSize:16,
        color:'#aaa',
        marginRight:10
    }
});


const mapStateToProps = state => ({
    accountId:state.loginStore.accountMessage.Account,
    relations:state.relationStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(unReadMessageActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupInformationSetting);