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
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Features from '../../Common/menu/features';
import * as recentListActions from '../../../Core/User/redux/action';
import * as chatRecordActions from '../../../Core/Redux/chat/action';
import * as unReadMessageActions from '../../MainTabbar/reducer/action';
import * as featuresAction from '../../Common/menu/reducer/action';
import {
	checkDeviceHeight,
	checkDeviceWidth
} from '../../../Core/Helper/UIAdapter';
import IM from '../../../Core/IM';
import User from '../../../Core/User';
import MyNavigationBar from '../../../Core/Component/NavigationBar';
let im = new IM();
let user = new User();

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    ListContainer: {
        flexDirection: 'row',
        height: checkDeviceHeight(130),
        backgroundColor: '#ffffff',
        paddingLeft:checkDeviceWidth(20),
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
    NickName: {
        fontSize: checkDeviceHeight(30),
        color: '#373737',
        marginBottom: checkDeviceHeight(10),
        ...Platform.select({
            ios: {
                lineHeight:checkDeviceHeight(34),
            },
            android: {
            },
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
    MessageNumberBox:{
        height: checkDeviceHeight(25),
        width: checkDeviceWidth(35),
        borderRadius: 12,
        backgroundColor: '#e64545',
		justifyContent:'center',
		alignItems:'center'
	},
    MessageNumber: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: checkDeviceHeight(20),
    },
});


class RecentChat extends ContainerComponent {
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
            groupData:[],
		};
		this.goToChatDetail = this.goToChatDetail.bind(this);
		this.deleteSomeRow = this.deleteSomeRow.bind(this);
	}
	componentWillMount(){

		styles = super.componentWillMount(styles)

		//初始化recentListStore
		im.getChatList((chatListArr) => {
			//将IM.db最近聊天列表与Acount.db好友列表作对比，如果Acount.db中不存在这个好友，则不添加到recentListStore
			let needArr = [];
            //初始化unReadMessageStore
            let unReadMessageCount = 0;
            chatListArr.forEach((v,i)=>{
                if(v.unReadMessageCount){
                    unReadMessageCount+=v.unReadMessageCount;
                }

                for( let j=0;j<this.props.relationStore.length;j++){
					if(v.Client === this.props.relationStore[j].RelationId || v.Type === 'chatroom'){
                        needArr.push(v);
                        break;
					}
				}
			})

	        this.props.initRecentList(needArr);

            this.props.initUnReadMessageNumber(unReadMessageCount)
	    })

		user.getAllGroupFromGroup((data)=>{
            this.setState({
				groupData:data
			})
		})
	}

	goToChatDetail(rowData){
		this.route.push(this.props,{key: 'ChatDetail',routeId: 'ChatDetail',params:{client:rowData.Client,type:rowData.Type,nick:this.formateRelationData[rowData.Client].Nick}});
	}
	deleteSomeRow(rowID,rowData){
		let oKCallback = ()=>{
			//清空recentListStore中对应记录
			this.props.deleteRecentItem(rowID);
			//如果该row上有未读消息，减少unReadMessageStore记录
            rowData.unReadMessageCount&&this.props.cutUnReadMessageNumber(rowData.unReadMessageCount);
			//清空chatRecordStore中对应记录
			this.props.clearChatRecordFromId(rowData.Client)
			//删除ChatRecode表中记录
			im.deleteChatRecode(rowData.Client);
			//删除该与client的所以聊天记录
			im.deleteCurrentChatMessage(rowData.Client,rowData.Type);

		}
		this.confirm('提示','删除后，将清空该聊天的消息记录',okButtonTitle="删除",oKCallback,cancelButtonTitle="取消",cancelCallback=undefined);

	}
	_renderAvator= (oneRealationObj)=>{
			if(oneRealationObj){
				if((!oneRealationObj.localImage||oneRealationObj.localImage === '')&&!oneRealationObj.avator){
					return 	<Image style = {styles.avatar} source = {require('../resource/avator.jpg')}></Image>

                }
                return 	<Image style = {styles.avatar} source = {{uri:(oneRealationObj.localImage&&oneRealationObj.localImage!=='')?oneRealationObj.localImage:oneRealationObj.avator}}></Image>

            }else{
				return null
			}
	}
    formateRelationDataMethod = (arr) =>{
		let obj = {};
		arr.forEach((v,i)=>{
			obj[v.RelationId] = v;
		})
		return obj
	}
	_renderRow = (rowData, sectionID, rowID) => {
		let needData = this.formateRelationData;
		if((rowData.Type == 'chatroom')&&!this.formateRelationData[rowData.Client]) needData = this.formateGroupData;
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
							{this._renderAvator(needData[rowData.Client])}
						</View>
						<View style = {styles.ChatContent}>
							<View style = {styles.Message}>
								<Text style = {styles.NickName}>{needData[rowData.Client]?needData[rowData.Client].Nick:''}</Text>
								<Text numberOfLines = {1} style = {styles.ChatMessage}>{rowData.LastMessage}</Text>
							</View>
							<View style = {styles.userTime}>
								<Text style ={styles.LastMessageTime}>{dateFtt('hh:mm:ss',new Date(parseInt(rowData.Time)))}</Text>
								{rowData.unReadMessageCount?<View  style = {styles.MessageNumberBox}><Text style = {styles.MessageNumber}>{rowData.unReadMessageCount}</Text></View>:null}
							</View>
						</View>
					</View>
				</TouchableHighlight>
			</Swipeout>
			</View>
		)
	}

	render() {
		this.formateRelationData = this.formateRelationDataMethod(this.props.relationStore);
		this.formateGroupData = this.formateRelationDataMethod(this.state.groupData);
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
						dataSource = {this.state.dataSource.cloneWithRows(this.props.recentListStore.data)}
						renderRow = {this._renderRow}
						enableEmptySections = {true}
						removeClippedSubviews={false}
					>
					</ListView>
				</View>
				{/*<View style = {{flex:1,backgroundColor:'grey',justifyContent:'center',alignItems:'center'}}><Text>下面的导航条</Text></View>*/}
				<Features navigator={this.props.navigator}/>
				<PopContent ref={(p)=>{this.popup = p}}></PopContent>
			</View>
		)
	}
}

const mapStateToProps = state => ({
    recentListStore:state.recentListStore,
    accountId:state.loginStore.accountMessage.accountId,
	relationStore:state.relationStore,
});

const mapDispatchToProps = (dispatch) => {
  return{
    ...bindActionCreators(recentListActions, dispatch),
    ...bindActionCreators(chatRecordActions, dispatch),
	  ...bindActionCreators(unReadMessageActions, dispatch),
      ...bindActionCreators(featuresAction, dispatch)


  }};

 export default connect(mapStateToProps, mapDispatchToProps)(RecentChat);


function dateFtt(fmt,date)   
{ //author: meizz   
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}