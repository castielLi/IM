import React, {
	Component
} from 'react';
import {
	Text,
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback
} from 'react-native';
import {
  connect
} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as commonActions from '../../../Core/Redux/chat/action';
import * as recentListActions from '../../../Core/User/redux/action';
import * as chatDetailActions from '../reducer/action';
import RNFS from 'react-native-fs';
import ContainerComponent from '../../../Core/Component/ContainerComponent'
import ThouchBar from './EnterTool/thouchBar';
import Chat from './List/index'
import MyNavigationBar from '../../../Core/Component/NavigationBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as groupStoreSqlite from '../../../Core/User/StoreSqlite/Group'

class ChatDetail extends ContainerComponent {
	constructor(props) {
			super(props);
			this.state = {
                isDisabled:true
			};
        this.isDisabled = false
		}
    goToChatSeeting = ()=>{
        let {client,type} = this.props;

        if(type === 'private'){
            this.route.push(this.props,{key: 'ChatSetting',routeId: 'ChatSetting',params:{}});

        }else if(type === 'chatroom'){
            this.route.push(this.props,{key: 'GroupInformationSetting',routeId: 'GroupInformationSetting',params:{"groupId":client}});

        }
    }

	//控制子组件Chat中的消息滚动到底部
	goBottom() {
		this.chat.getWrappedInstance().scrollToEnd()
	}
	componentWillMount(){
		let {client,type} = this.props;
        if(!this.props.ChatRecord[client]){
        	this.props.addClient(client);
            //新建文件夹
            let audioPath = RNFS.DocumentDirectoryPath + '/' +this.props.accountId+'/audio/chat/' + type + '-' +client;
            let imagePath = RNFS.DocumentDirectoryPath + '/' +this.props.accountId+'/image/chat/' + type + '-' +client;
            let videoPath = RNFS.DocumentDirectoryPath + '/' +this.props.accountId+'/video/chat/' + type + '-' +client;
            RNFS.mkdir(audioPath)
                .then((success) => {
                    console.log('create new dir success!');
                })
                .catch((err) => {
                    console.log(err.message);
                });
            RNFS.mkdir(imagePath)
                .then((success) => {
                    console.log('create new dir success!');
                })
                .catch((err) => {
                    console.log(err.message);
                });
            RNFS.mkdir(videoPath)
                .then((success) => {
                    console.log('create new dir success!');
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
		let chatRecordLength = this.props.ChatRecord[client]?this.props.ChatRecord[client].length:0;
		if(chatRecordLength<10){
            //初始化chatRecordStore
            this.props.getChatRecord(client,type,chatRecordLength)
		}



		// if(type == 'chatroom'){
         //    groupStoreSqlite.FindGroupTable(client,function (results) {
		// 		console.log(results)
		// 		if(results.length == 0){
        //
        //
        //
         //            groupStoreSqlite.initGroupMemberByGroupId(client)
		// 			callback()
		// 		}
         //    })
		// }
		//修改chatDetailPageStore
		this.props.changeChatDetailPageStatus(true,client,type)
		//清空未读消息计数红点
		this.props.updateRecentItemLastMessage(client,type,false);

	}
	componentWillUnmount(){
		//修改chatDetailPageStore
        this.props.handleChatRecord(this.props.client)
		//this.props.changeChatDetailPageStatus(false,'','')
	}
	componentWillReceiveProps(newProps){
        let {isRecordPage,isExpressionPage,isPlusPage,listScrollToEnd} = newProps.thouchBarStore;
        if(isRecordPage||(!isExpressionPage&&!isPlusPage&&!listScrollToEnd)){
            this.setState({
                isDisabled:true
			})
        }else{
            this.setState({
                isDisabled:false
            })
		}
	}
	render() {
		const MyView = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
		return (
			<MyView style={styles.container} behavior='padding'>
    			<MyNavigationBar
					left={{func:()=>{this.route.toMain(this.props);this.props.changeChatDetailPageStatus(false,'','')}}}
					right={{func:()=>{this.goToChatSeeting()},text:'设置'}}
					heading={'聊天'} />
				<TouchableWithoutFeedback disabled={this.state.isDisabled} onPressIn={()=>{if(this.props.thouchBarStore.isRecordPage){return;}this.props.changeThouchBarInit()}}>
					<View  style={{flex:1,backgroundColor:'#e8e8e8',overflow:'hidden'}}>
						<Chat ref={e => this.chat = e} client={this.props.client} type={this.props.type} HeadImageUrl={this.props.HeadImageUrl}/>
					</View>
				</TouchableWithoutFeedback>
				{/*<Chat ref={e => this.chat = e} client={this.props.client} type={this.props.type} HeadImageUrl={this.props.HeadImageUrl}/>*/}
				<ThouchBar client={this.props.client} type={this.props.type}></ThouchBar>
    		</MyView>

		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#a3bee4',

	},
    back:{
        color: '#ffffff',
        fontSize: 15,
        marginLeft: 20,
        textAlignVertical:'center',
	},
	right:{
        marginRight: 20,
        textAlignVertical:'center',
	}
})

const mapStateToProps = state => ({
  ChatRecord: state.chatRecordStore.ChatRecord,
    thouchBarStore: state.thouchBarStore,
	accountId:state.loginStore.accountMessage.accountId,

});
const mapDispatchToProps = (dispatch) => {
  return{
    ...bindActionCreators(commonActions,dispatch),
    ...bindActionCreators(chatDetailActions,dispatch),
    ...bindActionCreators(recentListActions,dispatch),
}};

export default connect(mapStateToProps,mapDispatchToProps)(ChatDetail);