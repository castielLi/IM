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
    ScrollView
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../../Core/Component/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet'
import * as relationActions from '../../Contacts/reducer/action';
import * as recentListActions from '../../../Core/User/redux/action';
import * as chatRecordActions from '../../../Core/IM/redux/chat/action';
import * as unReadMessageActions from '../../MainTabbar/reducer/action';
import {bindActionCreators} from 'redux';
import IM from '../../../Core/IM';
import User from '../../../Core/User'

let im = new IM();
let user = new User();
let {height,width} = Dimensions.get('window');
let currentObj;

const options = ['取消','确认']
const title = '退出后不会通知群聊中其他成员,且不会再接收此群聊的消息'

class GroupInformationSetting extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.handlePress = this.handlePress.bind(this);
        this.state = {
            isStickyChat:false,//置顶聊天
            notDisturb:false,//消息免打扰
            isSave:false,
            members:[],
            realMemberList:[],
            groupInformation:{}
        }
        currentObj = this;
    }
    changeIsStickyChat = ()=>{
        this.setState({
            isStickyChat:!this.state.isStickyChat
        })
    }
    changeNotDisturb = ()=>{
        this.setState({
            notDisturb:!this.state.notDisturb
        })
    }

    addToContacts = ()=>{
        let Save = !this.state.isSave;
        alert(Save)
        let info = this.state.groupInformation;
        if(Save){
            this.fetchData('POST','Member/AddGroupToContact',function (result) {
                if(result.success && result.data.Result){
                    alert('添加通讯录成功')
                    let obj = {
                        RelationId:info.ID,
                        OtherComment:info.Description,
                        Nick:info.Name,
                        BlackList:false,
                        Type:'chatroom',
                        avator:info.ProfilePicture,
                        owner:info.Owner,
                        show:true}
                    user.AddNewRelation(obj);
                    currentObj.props.addRelation(obj);

                    currentObj.setState({
                        isSave:Save
                    })
                }
            },{"Account":this.props.accountId,"GroupId":this.props.groupId})
        }
        else{
            this.fetchData('POST','Member/RemoveGroupFromContact',function (result) {
                if(result.success && result.data.Result){
                    alert('移除通讯录成功')
                    user.deleteRelation(info.ID);
                    currentObj.props.deleteRelation(info.ID);

                    currentObj.setState({
                        isSave:Save
                    })
                }
            },{"Account":this.props.accountId,"GroupId":this.props.groupId})
        }
    }


    componentDidMount(){
        currentObj.showLoading()
        currentObj.fetchData("POST","Member/GetGroupInfo",function(result){
            currentObj.hideLoading();

            if(!result.success){
                alert(result.errorMessage)
                return;
            }else{
                let Data = result.data.Data;
                let groupInformation = {
                    ID:Data.ID,
                    LastUpdateTime:Data.LastUpdateTime,
                    Name:Data.Name,
                    Owner:Data.Owner,
                    ProfilePicture:Data.ProfilePicture,
                    Description:Data.Description,
                };
                let members;
                if(Data.MemberList.length>13){
                    members = Data.MemberList.slice(0,13);
                }else{
                    members = Data.MemberList.concat()
                }
                let save;
                let relations = currentObj.props.relations;
                for(let i=0;i<relations.length;i++){
                    if(relations[i].RelationId === groupInformation.ID){
                        save = true;
                    }
                }
                currentObj.setState({
                    members:members.concat([{},{}]),
                    realMemberList:Data.MemberList,
                    groupInformation,
                    isSave:save
                })
            }

        },{"GroupId":this.props.groupId})
    }


    handlePress(i){
        let {groupId,accountId} = this.props;
        //退出群组
        if(1 == i){
            currentObj.showLoading()
            this.fetchData("POST","Member/ExitGroup",function(result){
                currentObj.hideLoading()
                if(!result.success){
                    alert(result.errorMessage);
                    return;
                }

                if(result.data.Data){
                    //todo:添加删除group的redux
                    currentObj.props.deleteRelation(groupId);
                    //清空chatRecordStore中对应记录
                    currentObj.props.initChatRecord(groupId,[])
                    //删除ChatRecode表中记录
                    im.deleteChatRecode(groupId);
                    //删除该与client的所以聊天记录
                    im.deleteCurrentChatMessage(groupId,'chatroom');
                    //如果该client在最近聊天中有记录
                    currentObj.props.deleteRecentItemFromId(groupId)
                    //删除account数据库中数据
                    user.deleteRelation(groupId);
                    user.deleteFromGrroup(groupId);
                    currentObj.route.toMain(currentObj.props);


                }else{
                    alert("http请求出错")
                }


            },{"GroupId":groupId,"Account":accountId})
        }
    }

    showActionSheet() {
        this.ActionSheet.show()
    }

    _footer = () => {
        return  <TouchableOpacity onPress={()=>{this.route.push(this.props,{key:'MoreGroupList',routeId:'MoreGroupList',params:{}})}}>
                    <View style={styles.listFooter}>
                        <Text style={styles.listFooterText}>查看更多群成员</Text>
                        <Icon name="angle-right" size={20} color="#aaa" />
                    </View>
                </TouchableOpacity>

    }


    goToChooseClient = ()=>{
        let members = this.state.members.map((item,index)=>{
            return item.Account;
        });
        let groupId = this.props.groupId;
        this.route.push(this.props,{key:'ChooseClient',routeId:'ChooseClient',params:{members,groupId}})
    }
    goToDeleteClient = ()=>{
        this.route.push(this.props,{key:'DeleteGroupMember',routeId:'DeleteGroupMember',params:{ID:this.state.groupInformation.ID,realMemberList:this.state.realMemberList}})
    }
    _renderItem = (item) => {
        //var txt = '第' + item.index + '个' + ' title=' + item.item.title;
        if(item.index == this.state.members.length-2){

                return  <TouchableWithoutFeedback onPress={()=>{this.goToChooseClient()}}>
                            <View style={styles.itemBox}>
                                <View style={styles.lastItemBox}>
                                    <Text style={styles.lastItemText}>+</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>


        }else if(item.index == this.state.members.length-1){
            if(this.state.groupInformation.Owner === this.props.accountId){
                return  <TouchableWithoutFeedback onPress={()=>{this.goToDeleteClient()}}>
                    <View style={styles.itemBox}>
                        <View style={styles.lastItemBox}>
                            <Text style={styles.lastItemText}>-</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            }else{
                return null;
            }

        }
        else{

                return <TouchableWithoutFeedback onPress={()=>{this.goToChooseClient()}}>
                            <View style={styles.itemBox}>
                                {item.item.HeadImageUrl ? <Image style={styles.itemImage} source={{uri:item.item.HeadImageUrl}}/> : <Image source={require('../resource/avator.jpg')} style={styles.itemImage} />}
                                <Text style={styles.itemText}>{item.item.Nickname}</Text>
                            </View>
                        </TouchableWithoutFeedback>

        }



    }
    gotoGroupAnnouncement = ()=>{
        let {ID,LastUpdateTime,Name,Owner,ProfilePicture,Description} = this.state.groupInformation;
        if(Owner!==this.props.accountId&&!Description){
            alert('只有群主才能设置公告')
        }else{
            this.route.push(this.props,{key:'GroupAnnouncement',routeId:'GroupAnnouncement',params:{...this.state.groupInformation}});

        }
    }
    gotoGroupName = ()=>{

            this.route.push(this.props,{key:'GroupName',routeId:'GroupName',params:{...this.state.groupInformation}});

    }
    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        let {ID,LastUpdateTime,Name,Owner,ProfilePicture,Description} = this.state.groupInformation;
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
                            //每行有3列。每列对应一个item
                            numColumns ={5}
                            //多列的行容器的样式
                            columnWrapperStyle={{marginTop:10}}
                            //要想numColumns有效必须设置horizontal={false}
                            horizontal={false}
                            keyExtractor={(item,index)=>(index)}
                            style={{backgroundColor:'#fff'}}
                            data={this.state.members}>
                        </FlatList>
                    </View>
                    <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                        <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.gotoGroupName} style={{marginTop:15}}>
                            <View  style={styles.remarksBox}>
                                <Text style={styles.remarks}>群聊名称</Text>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={styles.arrowText}>{Name}</Text>
                                    <Icon name="angle-right" size={35} color="#aaa" />
                                </View>

                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                        <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')}>
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
                            {Description?
                                <View  style={[styles.remarksBox,{height:null,paddingVertical:10}]}>
                                    <View style={{maxWidth:width-100}}>
                                        <Text style={styles.remarks}>群公告</Text>
                                        <Text style={styles.remarksText} numberOfLines={3}>{Description}</Text>
                                    </View>

                                    <Icon name="angle-right" size={35} color="#aaa" />
                                </View>:
                                <View  style={[styles.remarksBox,{height:null,paddingVertical:10}]}>
                                    <View style={{maxWidth:width-100}}>
                                        <Text style={styles.remarks}>群公告</Text>
                                    </View>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={styles.arrowText}>{'未设置'}</Text>
                                        <Icon name="angle-right" size={35} color="#aaa" />
                                    </View>
                                </View>
                            }

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
                            ></Switch>
                        </View>
                    </View>
                    <View>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>消息免打扰</Text>
                            <Switch
                                value={this.state.notDisturb}
                                onValueChange={this.changeNotDisturb}
                            ></Switch>
                        </View>
                    </View>
                    <View>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>添加到通讯录</Text>
                            <Switch
                                value={this.state.isSave}
                                onValueChange={this.addToContacts}
                            ></Switch>
                        </View>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>设置当前聊天背景</Text>
                            <Icon name="angle-right" size={35} color="#aaa" />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>清空聊天记录</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>投诉</Text>
                            <Icon name="angle-right" size={35} color="#aaa" />
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
        height:70,
        alignItems:'center',
    },
    itemImage:{
        width:50,
        height:50,
        borderRadius:5
    },
    itemText:{
        fontSize:14,
        color:'#000'
    },
    lastItemBox:{
        width:49,
        height:49,
        borderWidth:1,
        borderColor:'#aaa',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
    },
    lastItemText:{
        fontSize:25,
        color:'#ccc'
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupInformationSetting);