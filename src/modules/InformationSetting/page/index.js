
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

const options = ['取消','确认删除']
const title = '你确定要删除这位好友么'

class InformationSetting extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.handlePress = this.handlePress.bind(this);
        this.state = {
            notSeeHisZoom:false,
            notSeeMyZoom:false,
            joinBlackList:false,
            currentRelation:{},
            relationSetting:{}
        }
        currentObj = this;
    }
    //定义上导航的左按钮
    _leftButton() {
        return  <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>this.route.pop(this.props)}>
            <View style={styles.back}>

                <Icon name="angle-left" size={30} color="#fff" style={{textAlignVertical:'center',marginRight:8}}/>

                <Text style={{fontSize:16,textAlignVertical:'center',color:'#fff'}}>{'详细资料'}</Text>
            </View>
        </TouchableOpacity>
    }
    //定义上导航的标题
    _title() {
        return {
            title: "资料设置",
            tintColor:'#fff',
        }
    }

    componentWillMount(){
        // this.props.changeTabBar(0)


        //获取当前setting
        // user.GetRelationSetting(this.props.accountId,function(setting){
        //     console.log(setting);
        //     if(setting){
        //         currentObj.setState({
        //             relationSetting:setting
        //         })
        //     }
        // })

        let setting = undefined;
        for(let item in this.props.relations){
            if(this.props.relations[item].RelationId == this.props.client){
                setting = this.props.relations[item];
                break;
            }
        }

        if(setting != undefined){
            let value = setting.BlackList == "false"?false:true;
            this.setState({
                joinBlackList:value,
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
        let {client,type,accountId} = this.props;
        //删除好友
        if(1 == i){
            currentObj.showLoading()
            this.fetchData("POST","Member/DeleteFriend",function(result){
                  currentObj.hideLoading()
                  if(!result.success){
                      alert(result.errorMessage);
                      return;
                  }

                  if(result.data.Data){

                      //todo： 添加更改rudex 好友列表和消息列表
                      currentObj.props.deleteRelation(client);
                      //清空chatRecordStore中对应记录
                      currentObj.props.initChatRecord(client,[])
                      //删除ChatRecode表中记录
                      im.deleteChatRecode(client);
                      //删除该与client的所以聊天记录
                      im.deleteCurrentChatMessage(client,type);
                      //如果该client在最近聊天中有记录

                      //删除account数据库
                      user.deleteRelation(client);

                      currentObj.props.recentListStore.data.forEach((v,i)=>{
                          if(v.Client === client){
                              //清空recentListStore中对应记录
                              currentObj.props.deleteRecentItem(i);
                              //如果该row上有未读消息，减少unReadMessageStore记录
                              v.unReadMessageCount&&currentObj.props.cutUnReadMessageNumber(v.unReadMessageCount);
                          }
                      })



                      let pages = currentObj.props.navigator.getCurrentRoutes();
                      let target = pages[pages.length - 3];

                      currentObj.route.popToSpecialRoute(currentObj.props,target);

                      currentObj.route.popToRoute();
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
                            {/*<Text style={styles.arrow}>{'>'}</Text>*/}
                            <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
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
                            {/*<Text style={styles.arrow}>{'>'}</Text>*/}
                            <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
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
    relations:state.relationStore,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(relationActions, dispatch),
    ...bindActionCreators(recentListActions, dispatch),
    ...bindActionCreators(chatRecordActions, dispatch),
    ...bindActionCreators(unReadMessageActions, dispatch),
});

 export default connect(mapStateToProps, mapDispatchToProps)(InformationSetting);