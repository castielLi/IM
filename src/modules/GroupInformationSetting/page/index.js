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
const title = '退出后不会通知群聊中其他成员,且不会再接收此群聊的消息'

class GroupInformationSetting extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.handlePress = this.handlePress.bind(this);
        this.state = {
            isStickyChat:false,//置顶聊天
            notDisturb:false,//消息免打扰
            members:[]
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

    }


    componentDidMount(){
        currentObj.showLoading()
        currentObj.fetchData("POST","Member/GetGroupMemberList",function(result){
            currentObj.hideLoading();

            if(!result.success){
                alert(result.errorMessage)
                return;
            }else{
                
            }

        },{"GroupId":this.props.groupId})
    }


    handlePress(i){
        // let {group,type,accountId} = this.props;
        // //删除好友
        // if(1 == i){
        //     currentObj.showLoading()
        //     this.fetchData("POST","Member/ExitGroup",function(result){
        //         currentObj.hideLoading()
        //         if(!result.success){
        //             alert(result.errorMessage);
        //             return;
        //         }
        //
        //         if(result.data.Data){
        //
        //
        //         }else{
        //             alert("http请求出错")
        //         }
        //
        //
        //     },{"Applicant":accountId,"Friend":client})
        // }
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

    _renderItem = (item) => {
        //var txt = '第' + item.index + '个' + ' title=' + item.item.title;
        if(item.index === 14){
            return  <TouchableWithoutFeedback onPress={()=>{alert('clientInformation')}}>
                        <View style={styles.itemBox}>
                            <View style={styles.lastItemBox}>
                                <Text style={styles.lastItemText}>+</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

        }
        else if(item.index>14) {
            return null;
        }
        else{
            return   <TouchableWithoutFeedback onPress={()=>{alert('clientInformation')}}>
                        <View style={styles.itemBox}>
                            <Image style={styles.itemImage} source={{uri:item.item.avator}}></Image>
                            <Text style={styles.itemText}>{item.item.nick}</Text>
                        </View>
                    </TouchableWithoutFeedback>

        }

    }
    render() {
        let data = [{nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},


        ]
        let Popup = this.PopContent;
        let Loading = this.Loading;
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
                            data={data}>
                        </FlatList>
                    </View>
                    <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                        <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                            <View  style={styles.remarksBox}>
                                <Text style={styles.remarks}>群聊名称</Text>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={styles.arrowText}>{'IM群'}</Text>
                                    <Icon name="angle-right" size={20} color="#aaa" />
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
                                    <Icon name="angle-right" size={20} color="#aaa" />
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                        <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')}>
                            <View  style={[styles.remarksBox,{height:null,paddingVertical:10}]}>
                                <View style={{maxWidth:width-100}}>
                                    <Text style={styles.remarks}>群公告</Text>
                                    <Text style={styles.remarksText} numberOfLines={3}>群公告群公告群公告群公告群公告群公告群公告群公告群公告群公告群公告群公告</Text>
                                </View>

                                <Icon name="angle-right" size={20} color="#aaa" />
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                        <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginBottom:15}}>
                            <View  style={styles.remarksBox}>
                                <Text style={styles.remarks}>群管理</Text>
                                <Icon name="angle-right" size={20} color="#aaa" />
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
                                value={this.state.notDisturb}
                                onValueChange={this.addToContacts}
                            ></Switch>
                        </View>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>设置当前聊天背景</Text>
                            <Icon name="angle-right" size={20} color="#aaa" />
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
                            <Icon name="angle-right" size={20} color="#aaa" />
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