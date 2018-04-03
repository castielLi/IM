import React, {
    Component
} from 'react';
import {
    Image,
    View,
    Text,
    ListView,
    TouchableHighlight,
    Platform,
    StyleSheet,
    InteractionManager,
    ActivityIndicator,
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
import {SwipeListView} from 'react-native-swipe-list-view'
import UserController from '../../../TSController/UserController'
import ApplyController from '../../../TSController/ApplyController';
import AppPageMarkEnum from '../../../App/Enum/AppPageMarkEnum';
import IMControllerLogic from '../../../TSController/IMLogic/IMControllerLogic';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppStatusEnum from '../../../App/Enum/AppStatusEnum'
let userController = undefined;
let applyController = undefined;
let imLogicController = undefined;
let currentObj= undefined;


class RecentChat extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
            sectionID: '',
            rowID: '',
            socket:AppStatusEnum.Normal,//socket连接状态
            socketError:'',//socket错误提示
            ConverseList:[]
        };
        this.goToChatDetail = this.goToChatDetail.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        currentObj = this;
        userController =  UserController.getSingleInstance();
        applyController = ApplyController.getSingleInstance();
        imLogicController = IMControllerLogic.getSingleInstance();
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
            if(imLogicController!= undefined && imLogicController!=null){
                imLogicController.getConversationList();
            }
        })


    }

    _reValidateTokenLogin =()=>{
        validateManager.reloginWithToken();
    }

    goToChatDetail(rowData) {
        let type = rowData.group ? 'group' : 'private';
        this.route.push(this.props, {
            key: 'ChatDetail',
            routeId: 'ChatDetail',
            params: {
                client: rowData.chatId,
                type: type,
                Nick: rowData.name,
            }
        });
    }
    _deleteSomeRow = (data,rowMap)=> {
        let oKCallback = () => {
            rowMap[data.chatId].closeRow();
            imLogicController.removeConverse(data.chatId,data.group);
        }
        this.confirm('提示', '删除后，将清空该聊天的消息记录', okButtonTitle = "删除", oKCallback, cancelButtonTitle = "取消", cancelCallback = undefined);

    }
    _renderAvator = (userId,group,nosound,unreadCount) => {
        let imageUrl = require('../resource/groupAvator.png');
        if(!group){
            imageUrl = userController.getAccountHeadImagePath(userId);
        }
        return <View style = {styles.avatar}>
            <ImagePlaceHolder style = {styles.avatar} imageUrl = {imageUrl}/>
            {nosound&&unreadCount?<View style={styles.circle}></View>:null}
        </View>
    }

    renderHeader = ()=>{
        switch (this.state.socket){
            case AppStatusEnum.SocketConnect:
                return null;
                break;
            case AppStatusEnum.NetworkNormal:
                if(!this.appManagement.Logined){
                    return (
                        <TouchableHighlight onPress = {this._reValidateTokenLogin}>
                            <View style={{backgroundColor:'white',flexDirection:'row',paddingVertical:12,paddingLeft:15}}>
                                <ActivityIndicator
                                    size="small"
                                    color="black"
                                    style={{width:20,height:20}}
                                />
                                <View style={{height:20,alignItems:'center',marginLeft:5}}><Text>登录验证中...</Text></View>
                            </View>
                        </TouchableHighlight>
                    );
                }else{
                    return null;
                }
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
            case AppStatusEnum.SocketResetConnect:
                return this.appManagement.normalNetwork?
                    (
                        <View style={{backgroundColor:'white',flexDirection:'row',paddingVertical:12,paddingLeft:15}}>
                            <ActivityIndicator
                                size="small"
                                color="black"
                                style={{width:20,height:20}}
                            />
                            <View style={{height:20,alignItems:'center',marginLeft:5}}><Text>网络重新连接中...</Text></View>
                        </View>
                    )
                    :(
                        <View style={{backgroundColor:'#FFC1C1',flexDirection:'row',paddingVertical:12,paddingLeft:15}}>
                            <Image style={{width:20,height:20}} source={require('../resource/fail.png')}/>
                            <View style={{height:20,alignItems:'center',marginLeft:5}}><Text>网络重新连接中...</Text></View>
                        </View>
                    );
                break;
        }
    };

    _renderRow = (rowData, rowID) => {
        let content = rowData.item;
        return (
           <TouchableHighlight onPress = {this.goToChatDetail.bind(this,content)}>
                <View style = {styles.ListContainer}>
                    <View style = {styles.userLogo}>
                        {this._renderAvator(content.chatId,content.group,content.noSound,content.unreadCount)}
                    </View>
                    <View style = {styles.ChatContent}>
                        <View style = {styles.Message}>
                            <Text numberOfLines = {1} style = {styles.Nickname}>{content.name}</Text>
                            {
                                content.noSound?(content.unreadCount>0?<Text numberOfLines = {1} style = {styles.ChatMessage}>[{content.unreadCount}]
                                    <Text numberOfLines = {1} style = {styles.ChatMessage}>{content.lastMessage}</Text>
                                </Text>:<Text numberOfLines = {1} style = {styles.ChatMessage}>{content.lastMessage}</Text>):
                                    <Text numberOfLines = {1} style = {styles.ChatMessage}>{content.lastMessage}</Text>
                            }
                        </View>
                        <View style = {styles.userTime}>
                            <Text style ={styles.LastMessageTime}>{content.lastTime == 0?"":TimeHelper.DateFormat(content.lastTime,false,'h:mm',)}</Text>
                            {
                                content.noSound?<Icon name="bell-slash" size={20} color="#aaa" />:
                                    (content.unreadCount?<View  style = {styles.MessageNumberBox}>
                                        <Text style = {styles.MessageNumber}>{content.unreadCount>99?  99+'+' : content.unreadCount}</Text>
                                    </View>:null)
                            }
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    };

    _renderSeparator=()=>{
        return(
            <View style={styles.ItemSeparator}/>
        )
    };

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        let PopContent = this.PopContent;
        return (
			<View style = {styles.container}>
				<MyNavigationBar
					left = {'云信'}
					right = {[
                        {func:()=>{
                            this.route.push(this.props, {
                                key: 'Search',
                                routeId: 'Search'
                            });
                        },icon:'search'},
                        {func:()=>{this.props.showFeatures()},icon:'list-ul'}
                    ]}
				/>
				<View style = {styles.content}>
                    {this.renderHeader()}
                    <SwipeListView
                        useFlatList={true}
                        data={this.state.ConverseList}
                        rightOpenValue={-70}
                        keyExtractor={(item,index)=>(item.chatId)}
                        disableRightSwipe={true}//关闭右滑
                        closeOnRowPress={true}//按下某一行时是否应关闭打开的行
                        closeOnScroll={true}//当listView开始滚动时应该关闭打开的行
                        closeOnRowBeginSwipe={true}//当一排开始滑动打开时，是否应关闭打开的行
                        renderItem={this._renderRow}
                        renderHiddenItem={ (data, rowMap) => (
                            <View style={{alignItems:'flex-end'}}>
                                <TouchableHighlight onPress={()=>this._deleteSomeRow(data.item,rowMap)}>
                                    <View style={{backgroundColor:'red',justifyContent:'center', alignItems:'center',width:70,flex:1,marginVertical:1}}>
                                        <Text style={{fontSize:14, color:'#fff'}}>删除</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        )}
                        ItemSeparatorComponent={this._renderSeparator}
                    />
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
        backgroundColor: "#ebebeb"
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
        fontSize: checkDeviceHeight(32),
        color: '#373737',
        marginBottom: checkDeviceHeight(10),
        ...Platform.select({
            ios: {
                lineHeight: checkDeviceHeight(34),
            },
            android: {},
        }),
    },
    ChatMessage: {
        fontSize: checkDeviceHeight(28),
        lineHeight: checkDeviceHeight(35),
        color: '#989898',
    },
    ChatNoSoundMessageCount: {
        fontSize: checkDeviceHeight(30),
        lineHeight: checkDeviceHeight(35),
        width:30,
        color: '#989898',
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
    },
    ItemSeparator:{
        height:1,
        backgroundColor:'#eee',
    },
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



