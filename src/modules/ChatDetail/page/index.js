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
import * as recentListActions from '../../../Core/Redux/RecentList/action';
import * as chatDetailActions from '../reducer/action';
import RNFS from 'react-native-fs';
import ContainerComponent from '../../../Core/Component/ContainerComponent'
import ThouchBar from './EnterTool/thouchBar';
import Chat from './List/index'
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import ChatController from '../../../Controller/chatController';
import InitChatRecordConfig from '../../../Core/Redux/chat/InitChatRecordConfig';
import * as DtoMethods from '../../../Core/IM/dto/Common';

let chatController = new ChatController();
class ChatDetail extends ContainerComponent {
	constructor(props) {
			super(props);
			this.state = {
                isDisabled:true
			};
        currentObj = this;
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
            let thumbnail = RNFS.DocumentDirectoryPath + '/' +this.props.accountId+'/image/chat/' + type + '-' +client+'/thumbnail';
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
            RNFS.mkdir(thumbnail)
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
		if(chatRecordLength<InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
            //初始化chatRecordStore
            chatController.getRecentChatRecode(client,type,{start:chatRecordLength,limit:InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER},function (messages) {
                let messageList = messages.map((message)=>{
                    return DtoMethods.sqlMessageToMessage(message);
                })
                currentObj.props.initChatRecord(client,messageList);
            })
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
		//通知controller正在与某人会话
        chatController.chatWithNewClient(client,type);
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
	getNickByIdFromRelation(groupId){
	    let relationStore = this.props.relationStore;
	    let nick = '';
	    for(let i=0;i<relationStore.length;i++){
	        if(relationStore[i].RelationId == groupId){
	            nick =  relationStore[i].Nick;
	            break;
            }
        }
        return nick;
    }
	render() {
		const MyView = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
		return (
			<MyView style={styles.container} behavior='padding'>
    			<MyNavigationBar
					left={{func:()=>{
					    this.route.toMain(this.props);
					    this.props.changeChatDetailPageStatus(false,'','');
                        chatController.emptyCurrentChat();
                        chatController.emptyChangeCallback()
					}}}
					right={{func:()=>{this.goToChatSeeting()},text:'设置'}}
					heading={this.getNickByIdFromRelation(this.props.client)} />
				<TouchableWithoutFeedback disabled={this.state.isDisabled} onPressIn={()=>{if(this.props.thouchBarStore.isRecordPage){return;}this.props.changeThouchBarInit()}}>
					<View  style={{flex:1,backgroundColor:'#e8e8e8',overflow:'hidden'}}>
						<Chat ref={e => this.chat = e} client={this.props.client} type={this.props.type} HeadImageUrl={this.props.HeadImageUrl} navigator={this.props.navigator}/>
					</View>
				</TouchableWithoutFeedback>
				{/*<Chat ref={e => this.chat = e} client={this.props.client} type={this.props.type} HeadImageUrl={this.props.HeadImageUrl}/>*/}
				<ThouchBar client={this.props.client} type={this.props.type} Nick={this.props.Nick} HeadImageUrl={this.props.HeadImageUrl}></ThouchBar>
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
    relationStore: state.relationStore,
});
const mapDispatchToProps = (dispatch) => {
  return{
    ...bindActionCreators(commonActions,dispatch),
    ...bindActionCreators(chatDetailActions,dispatch),
    ...bindActionCreators(recentListActions,dispatch),
}};

export default connect(mapStateToProps,mapDispatchToProps)(ChatDetail);