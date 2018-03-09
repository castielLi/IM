import React, {
    Component
} from 'react';
import {
    Image,
    View,
    Text,
    ListView,
    TouchableHighlight,
    TouchableOpacity,
    Platform,
    StyleSheet,
    Alert,
    AsyncStorage,
    InteractionManager,
    ActivityIndicator
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import AppComponent from '../../../Core/Component/AppComponent';
import {
    connect
} from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import Features from '../../Common/menu/features';
import * as unReadMessageActions from '../../MainTabbar/reducer/action';
import * as featuresAction from '../../Common/menu/reducer/action';
import * as navigationActions from '../../Common/NavigationBar/reducer/action'
import {
    checkDeviceHeight,
    checkDeviceWidth
} from '../../../Core/Helper/UIAdapter';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import TimeHelper from '../../../Core/Helper/TimeHelper';

import UserController from '../../../TSController/UserController'
import ApplyController from '../../../TSController/ApplyController';
import AppPageMarkEnum from '../../../App/AppPageMarkEnum';
import AppManagement from '../../../App/AppManagement'
import IMControllerLogic from '../../../TSController/IMLogic/IMControllerLogic';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';
import LoginController from '../../../TSController/LoginController'
import Icon from 'react-native-vector-icons/FontAwesome';
import AppStatusEnum from '../Enum/AppStatusEnum'
let userController = undefined;
let applyController = undefined;
let imLogicController = undefined;
let loginController = undefined;
let currentObj= undefined;

class RecentChat extends AppComponent {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        })
        this.state = {
            sectionID: '',
            rowID: '',
            dataSource: ds,
            socket:AppStatusEnum.Normal,//socket连接状态
            socketError:'',//socket错误提示
            ConverseList:[]
        };
        this.goToChatDetail = this.goToChatDetail.bind(this);
        this.deleteSomeRow = this.deleteSomeRow.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        currentObj = this;
        userController =  UserController.getSingleInstance();
        applyController = ApplyController.getSingleInstance();
        imLogicController = IMControllerLogic.getSingleInstance();
        loginController = LoginController.getSingleInstance();
        this._changeAppStatus = this._changeAppStatus.bind(this);
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    _refreshUI(type,params){
        switch (type){
            case AppPageMarkEnum.ConversationList:
                currentObj.setState({
                    ConverseList:params
                });
                break;
            case AppPageMarkEnum.AppStatus:
                let {appStatus,info} = params;
                currentObj.setState({
                    socket:appStatus,
                    socketError:info
                });
                break;
        }
    }

    _changeAppStatus(type){
        this.setState({
            socket:type
        })
    }

    componentDidMount() {
        // this.props.showNavigationBottom();

        InteractionManager.runAfterInteractions(()=>{
            imLogicController.getConversationList();
            applyController.getUncheckApplyFriendCount();
            userController.getUserContactList(false, null);

            //有token，但是还没有经过验证
            if(AppManagement.getAppLoginStates()) {
                userController.getUserContactList(true, (result) => {
                    userController.getGroupContactList(true, (result) => {
                        // currentObj.props.hideNavigationBottom();
                    })
                })
            }else{
                currentObj._changeAppStatus(AppStatusEnum.Loginning);
                loginController.loginWithToken((result)=>{
                    if(result == null){
                        currentObj.route.ToLogin(currentObj.props);
                        return;
                    }


                    if(result.Result != 1){

                        if(result.Result == 6001){
                            Alert.alert("错误","网络出现故障，请检查当前设备网络连接状态");
                        }

                        currentObj._changeAppStatus(AppStatusEnum.LoginFailed);
                        return;
                    }
                    AppManagement.loginSuccess();
                    userController.getUserContactList(true, (result) => {
                        userController.getGroupContactList(true, (result) => {
                        })
                    })
                });
            }
        })


    }


    goToChatDetail(rowData) {
        let type = rowData.group ? 'group' : 'private';
        this.route.push(this.props, {
            key: 'ChatDetail',
            routeId: 'ChatDetail',
            params: {
                client: rowData.chatId,
                type: type,
                Nick: rowData.name
            }
        });
    }
    deleteSomeRow(rowID, rowData) {
        let oKCallback = () => {
            imLogicController.removeConverse(rowData.chatId,rowData.group);
        }
        this.confirm('提示', '删除后，将清空该聊天的消息记录', okButtonTitle = "删除", oKCallback, cancelButtonTitle = "取消", cancelCallback = undefined);

    }
    _renderAvator = (userId,group,nosound,unreadCount) => {
        let imageUrl = "";
        if(!group){
            imageUrl = userController.getAccountHeadImagePath(userId);
        }
        return <View style = {styles.avatar}>
            <ImagePlaceHolder style = {styles.avatar}
                      imageUrl = {imageUrl}
                      />
            {nosound&&unreadCount?<View style={styles.circle}></View>:null}
        </View>
    }

    renderHeader = ()=>{
        switch (this.state.socket){
            case AppStatusEnum.SocketConnect:
                return null;
                break;
            case AppStatusEnum.NetworkError:
                return (
                    <View style={{backgroundColor:'#FFC1C1',flexDirection:'row',paddingVertical:12,paddingLeft:15}}>
                        <Image style={{width:20,height:20}} source={require('../resource/fail.png')}/>
                        <View style={{height:20,alignItems:'center',marginLeft:5}}><Text>网络连接不可用</Text></View>
                    </View>
                );
            case AppStatusEnum.SocketConnectError:
                return (
                    <View style={{backgroundColor:'#FFC1C1',flexDirection:'row',paddingVertical:12,paddingLeft:15}}>
                        <Image style={{width:20,height:20}} source={require('../resource/fail.png')}/>
                        <View style={{height:20,alignItems:'center',marginLeft:5}}><Text>接收消息失败</Text></View>
                    </View>
                );
            case AppStatusEnum.Loginning:
                return (
                    <View style={{backgroundColor:'white',flexDirection:'row',paddingVertical:12,paddingLeft:15}}>
                        <ActivityIndicator
                            size="small"
                            color="black"
                            style={{width:20,height:20}}
                        />
                        <View style={{height:20,alignItems:'center',marginLeft:5}}><Text>连接中...</Text></View>
                    </View>
                );
            case AppStatusEnum.SocketConnecting:
                return (
                    <View style={{backgroundColor:'white',flexDirection:'row',paddingVertical:12,paddingLeft:15}}>
                        <ActivityIndicator
                            size="small"
                            color="black"
                            style={{width:20,height:20}}
                        />
                        <View style={{height:20,alignItems:'center',marginLeft:5}}><Text>接收消息...</Text></View>
                    </View>
                );
        }
    }

    _renderRow = (rowData, sectionID, rowID) => {
        return (
			<View style= {{borderBottomWidth:1,borderColor:'#d9d9d9'}}>
				<Swipeout
					right = {
                        [{
                            text:'标为未读',
                            backgroundColor:'#c7c7cc',
                            onPress:function(){alert('标记为未读成功!')}
                        },
                            {
                                text:'删除',
                                type:'delete',
                                onPress:this.deleteSomeRow.bind(this,rowID,rowData)
                            },]
                    }
					rowID = {rowID}
					sectionID = {sectionID}
					close = {!(this.state.sectionID === sectionID && this.state.rowID === rowID)}
					onOpen={(sectionID, rowID) => {
                        this.setState({
                            sectionID:sectionID,
                            rowID:rowID,
                        })
                    }}
					autoClose={true}
				>
					<TouchableHighlight onPress = {this.goToChatDetail.bind(this,rowData)}>
						<View style = {styles.ListContainer}>
							<View style = {styles.userLogo}>
                                {this._renderAvator(rowData.chatId,rowData.group,rowData.noSound,rowData.unreadCount)}
							</View>
							<View style = {styles.ChatContent}>
								<View style = {styles.Message}>
									<Text numberOfLines = {1} style = {styles.Nickname}>{rowData.name}</Text>
                                    {
                                        rowData.noSound?(rowData.unreadCount>0?<Text numberOfLines = {1} style = {styles.ChatMessage}>[{rowData.unreadCount}]
                                            <Text numberOfLines = {1} style = {styles.ChatMessage}>{rowData.lastMessage}</Text>
                                        </Text>:<Text numberOfLines = {1} style = {styles.ChatMessage}>{rowData.lastMessage}</Text>):
                                            <Text numberOfLines = {1} style = {styles.ChatMessage}>{rowData.lastMessage}</Text>
                                    }

								</View>
								<View style = {styles.userTime}>
									<Text style ={styles.LastMessageTime}>{rowData.lastTime == 0?"":TimeHelper.DateFormat(rowData.lastTime,false,'h:mm',)}</Text>
                                    {
                                        rowData.noSound?<Icon name="bell-slash" size={20} color="#aaa" />:
                                            (rowData.unreadCount?<View  style = {styles.MessageNumberBox}>
                                        <Text style = {styles.MessageNumber}>{rowData.unreadCount>99?  99+'+' : rowData.unreadCount}</Text>
                                         </View>:null)
                                    }
								</View>
							</View>
						</View>
					</TouchableHighlight>
				</Swipeout>
			</View>
        )
    }

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        let PopContent = this.PopContent;
        return (
			<View style = {styles.container}>
				<MyNavigationBar
					left = {'云信'}
					right = {[
                        {func:()=>{alert('搜索')},icon:'search'},
                        {func:()=>{this.props.showFeatures()},icon:'list-ul'}
                    ]}
				/>
				<View style = {styles.content}>
					<ListView
						style = {{height:checkDeviceHeight(1110)}}
						dataSource = {this.state.dataSource.cloneWithRows(this.state.ConverseList)}
                        renderHeader = {this.renderHeader}
						renderRow = {this._renderRow}
						enableEmptySections = {true}
						removeClippedSubviews={false}
					>
					</ListView>
				</View>
                {/*<View style = {{flex:1,backgroundColor:'grey',justifyContent:'center',alignItems:'center'}}><Text>下面的导航条</Text></View>*/}
				<Features navigator={this.props.navigator}/>
				<PopContent ref={(p)=>{this.popup = p}}></PopContent>

				<Popup ref={ popup => this.popup = popup}/>
				<Loading ref = { loading => this.loading = loading}/>
			</View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    content:{
        flex:1
    },
    ListContainer: {
        flexDirection: 'row',
        height: checkDeviceHeight(130),
        backgroundColor: '#ffffff',
        paddingLeft: checkDeviceWidth(20),
    },
    userLogo: {
        height: checkDeviceHeight(130),
        width: checkDeviceWidth(125),
        justifyContent: 'center',
    },
    avatar: {
        height: checkDeviceHeight(100),
        width: checkDeviceHeight(100),
        borderRadius: checkDeviceHeight(50),
        resizeMode: 'cover',
    },
    ChatContent: {
        flex: 1,
        height: checkDeviceHeight(130),
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    Message: {
        flex: 1,
        justifyContent: 'center',
    },
    Nickname: {
        fontSize: checkDeviceHeight(30),
        color: '#373737',
        marginBottom: checkDeviceHeight(10),
        ...Platform.select({
            ios: {
                lineHeight: checkDeviceHeight(34),
            },
            android: {},
        }),
    },
    ChatNoSoundMessageCount: {
        fontSize: checkDeviceHeight(30),
        lineHeight: checkDeviceHeight(35),
        width:30,
        color: '#999999',
    },
    ChatMessage: {
        fontSize: checkDeviceHeight(30),
        lineHeight: checkDeviceHeight(35),
        color: '#999999',
    },
    userTime: {
        height: checkDeviceHeight(130),
        width: checkDeviceWidth(110),
        justifyContent: 'center',
        alignItems: "flex-end",
        marginRight: checkDeviceWidth(20),
    },
    LastMessageTime: {
        fontSize: checkDeviceHeight(24),
        color: '#999999',
        marginBottom: checkDeviceHeight(20),
    },
    MessageNumberBox: {
        height: checkDeviceHeight(25),
        width: checkDeviceWidth(40),
        borderRadius: 12,
        backgroundColor: '#e64545',
        justifyContent: 'center',
        alignItems: 'center'
    },
    MessageNumber: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: checkDeviceHeight(20),
    },
    circle:{
        width:10,
        height:10,
        backgroundColor:'red',
        borderRadius:5,
        position:'absolute',
        left:3,
        top:0
    }
});

const mapStateToProps = state => ({
    accountId: state.loginStore.accountMessage.Account,
});

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(unReadMessageActions, dispatch),
        ...bindActionCreators(featuresAction, dispatch),
        ...bindActionCreators(navigationActions,dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RecentChat);



