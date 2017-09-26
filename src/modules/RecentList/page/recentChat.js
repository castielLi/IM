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
import * as recentListActions from '../reducer/action';
import {
	checkDeviceHeight,
	checkDeviceWidth
} from './check';
import IM from '../../../Core/IM';
let im = new IM();
class RecentChat extends ContainerComponent {
	componentWillMount() {
		Platform.OS === 'ios' ? this.setState({
			isAndroid: true
		}) : this.setState({
			isAndroid: false
		})
	}
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
			
		};
		this.goToChatDetail = this.goToChatDetail.bind(this);
	}
	componentWillMount(){
		//初始化recentListStore
		im.getChatList((chatListArr) => {
	        this.props.initRecentList(chatListArr)
	    })
		//this.props.initRecentList([{Client:'2',Type:'pravite',LastMessage:'hahahaha'},])
	}
	goToChatDetail(rowData){
		this.route.push(this.props,{key: 'ChatDetail',routeId: 'ChatDetail',params:{client:rowData.Client,type:rowData.Type}});
	}
	_renderRow = (rowData, sectionID, rowID) => {
		return (
			<View style= {{borderBottomWidth:1,borderColor:'#d9d9d9',marginLeft:checkDeviceWidth(20)}}>
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
						onPress:this.props.deleteRecentItem.bind(this,rowID)
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
				>
				<TouchableHighlight onPress = {this.goToChatDetail.bind(this,rowData)}>
					<View style = {styles.ListContainer}>
						<View style = {styles.userLogo}>
							<Image style = {styles.avatar} source = {require('../resource/user_5.png')}></Image>
						</View>
						<View style = {styles.ChatContent}>
							<View style = {styles.Message}>
								<Text style = {styles.NickName}>{rowData.Client}</Text>
								<Text numberOfLines = {1} style = {styles.ChatMessage}>{rowData.LastMessage}</Text>
							</View>
							<View style = {styles.userTime}>
								<Text style ={styles.LastMessageTime}>20:11</Text>
								<Text style = {styles.MessageNumber}>5</Text>
							</View>
						</View>
					</View>
				</TouchableHighlight>
			</Swipeout>
			</View>
		)
	}
	render() {
		return (
			<View style = {styles.container}>
				<View style = {styles.header}>
					<Text style = {styles.headerTitle}>奇信</Text>
					<View style = {styles.RightLogo}>
					<TouchableOpacity style = {{marginRight:checkDeviceWidth(60)}}>
						<Image style = {styles.headerLogo} source = {require('../resource/search.png')}></Image>
					</TouchableOpacity>
						<TouchableOpacity>
							<Image style = {[styles.headerLogo,{marginRight:0}]} source = {require('../resource/features.png')}></Image>
						</TouchableOpacity>
					</View>
				</View>
				<View style = {styles.content}>
					<ListView
					style = {{height:checkDeviceHeight(1110)}}
						dataSource = {this.state.dataSource.cloneWithRows(this.props.recentListStore.data)}
						renderRow = {this._renderRow}
						enableEmptySections = {true}
					>
					</ListView>
				</View>
				<View style = {{flex:1,backgroundColor:'grey',justifyContent:'center',alignItems:'center'}}><Text>下面的导航条</Text></View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff"
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: checkDeviceHeight(90),
		backgroundColor: '#38373d',
	},
	headerTitle: {
		color: '#ffffff',
		fontSize: checkDeviceHeight(36),
		marginLeft: checkDeviceWidth(20),
	},
	RightLogo: {
		flexDirection: 'row',
		marginRight: checkDeviceWidth(40),

	},
	headerLogo: {
		height: checkDeviceWidth(40),
		width: checkDeviceHeight(40),
		resizeMode: 'stretch',
	},
	ListContainer: {
		flexDirection: 'row',
		height: checkDeviceHeight(130),
		backgroundColor: '#ffffff',
	},
	userLogo: {
		height: checkDeviceHeight(130),
		width: checkDeviceWidth(125),
		justifyContent: 'center',
	},
	avatar: {
		height: checkDeviceHeight(105),
		width: checkDeviceHeight(105),
		borderRadius: checkDeviceHeight(50),
		resizeMode: 'stretch',
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
		fontSize: checkDeviceHeight(34),
		color: '#373737',
		lineHeight: checkDeviceHeight(34),
		marginBottom: checkDeviceHeight(20),
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
	MessageNumber: {
		lineHeight: checkDeviceHeight(30),
		height: checkDeviceHeight(30),
		width: checkDeviceWidth(40),
		borderRadius: 10,
		color: '#ffffff',
		textAlign: 'center',
		fontSize: checkDeviceHeight(24),
		backgroundColor: '#e64545'
	},
});

const mapStateToProps = state => ({
    recentListStore:state.recentListStore
});

const mapDispatchToProps = (dispatch) => {
  return{
    ...bindActionCreators(recentListActions, dispatch),
}};

 export default connect(mapStateToProps, mapDispatchToProps)(RecentChat);