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
    AsyncStorage
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
import AppPageMarkEnum from '../../../App/AppPageMarkEnum'
import AppManagement from '../../../App/AppManagement'
import IMControllerLogic from '../../../TSController/IMLogic/IMControllerLogic'

let userController = undefined;
let applyController = undefined;
let imLogicController = undefined;
let currentObj= undefined;

class RecentChat extends AppComponent {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        })
        this.state = {
            isAndroid: '',
            sectionID: '',
            rowID: '',
            dataSource: ds,
            relationStore:[],
            socket:0,//socket连接状态
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
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    _refreshUI(type,params){
        if(type == AppPageMarkEnum.ConversationList) {
            currentObj.setState({
                ConverseList:params
            })
        }else if(type == AppPageMarkEnum.AppStatus){
            currentObj.setState({
                socket:params.socketStatus,
                socketError:params.info
            })
        }
    }

    componentDidMount() {

        // this.props.showNavigationBottom();

        imLogicController.getConversationList();
        applyController.getUncheckApplyFriendCount();

        userController.getUserContactList(true,(result)=>{
            userController.getGroupContactList(true,(result)=>{
                // currentObj.props.hideNavigationBottom();
            })
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
    _renderAvator = (HeadImageUrl) => {
        if (!HeadImageUrl || HeadImageUrl === '') {
            return <Image style = {styles.avatar} source = {require('../resource/avator.jpg')}/>
        }
        return <Image style = {styles.avatar} source = {{uri:HeadImageUrl}}/>
    }

    renderHeader = ()=>{
        switch (this.state.socket){
            case 0:
                return null;
                break;
            default:
                return (
                    <View style={{backgroundColor:'#FFC1C1',flexDirection:'row',paddingVertical:12,paddingLeft:15}}>
                        <Image style={{width:20,height:20}} source={require('../resource/fail.png')}/>
                        <Text>网络连接不可用</Text>
                    </View>
                );
                break;

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
                                {this._renderAvator(rowData.HeadImageUrl)}
							</View>
							<View style = {styles.ChatContent}>
								<View style = {styles.Message}>
									<Text numberOfLines = {1} style = {styles.Nickname}>{rowData.name}</Text>
									<Text numberOfLines = {1} style = {styles.ChatMessage}>{rowData.lastMessage}</Text>
								</View>
								<View style = {styles.userTime}>
									<Text style ={styles.LastMessageTime}>{TimeHelper.formatSpecifiedDate('hh:mm:ss',rowData.lastTime)}</Text>
                                    {rowData.unreadCount?<View  style = {styles.MessageNumberBox}><Text style = {styles.MessageNumber}>{rowData.unreadCount>99?  99+'+' : rowData.unreadCount}</Text></View>:null}
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



