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
import * as commonActions from '../../../Core/IM/redux/action';
import * as recentListActions from '../../RecentList/reducer/action';
import * as chatDetailActions from '../reducer/action';
import RNFS from 'react-native-fs';
import ContainerComponent from '../../../Core/Component/ContainerComponent'
import ThouchBar from './EnterTool/thouchBar';
import Chat from './List/index'
import MyNavigationBar from '../../../Core/Component/NavigationBar';
import Icon from 'react-native-vector-icons/FontAwesome';

class ChatDetail extends ContainerComponent {
	constructor(props) {
			super(props);
			this.state = {};
			this._leftButton = this._leftButton.bind(this);
			this._title = this._title.bind(this);
		}
    goToChatSeeting = ()=>{
        let {client,type} = this.props;

        if(type === 'private'){
            this.route.push(this.props,{key: 'ChatSetting',routeId: 'ChatSetting',params:{}});

        }else{
            this.route.push(this.props,{key: 'GroupInformationSetting',routeId: 'GroupInformationSetting',params:{"groupId":client}});

        }
    }
		//定义上导航的左按钮
	_rightButton() {
        return  <TouchableOpacity style={{justifyContent:'center'}} onPress={this.goToChatSeeting}>

						<Icon name="user" size={22} color="#fff" style={styles.right}/>

				</TouchableOpacity>
		}
    //定义上导航的右按钮
    _leftButton() {
        return  <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>this.route.pop(this.props)}>
			<Text style={styles.back}>{'< 返回'}</Text>
		</TouchableOpacity>
    }
		//定义上导航的标题
	_title() {
		return {
			title: "聊天",
            tintColor:'#fff',
		}
	}

	//控制子组件Chat中的消息滚动到底部
	goBottom() {
		this.chat.getWrappedInstance().scrollToEnd()
	}
	componentWillMount(){
		let {client,type} = this.props;
		//如果chatRecordStore里没记录
		if(!this.props.ChatRecord[client]){
			//
			this.props.addClient(client);
            //初始化chatRecordStore
            this.props.getChatRecord(client,type)
			//新建文件夹
			let audioPath = RNFS.DocumentDirectoryPath + '/' +this.props.accountId+'/audio/chat/' + type + '-' +client;
			let imagePath = RNFS.DocumentDirectoryPath + '/' +this.props.accountId+'/image/chat/' + type + '-' +client;
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
		}

		//修改chatDetailPageStore
		this.props.changeChatDetailPageStatus(true,client,type)
		//清空未读消息计数红点
		this.props.updateRecentItemLastMessage(client,type,false);

	}
	componentWillUnmount(){
		//修改chatDetailPageStore
		this.props.changeChatDetailPageStatus(false,'','')
	}
	render() {
		const MyView = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
		return (
			<MyView style={styles.container} behavior='padding'>
    			<MyNavigationBar
					left={{func:()=>{this.route.toMain(this.props)}}}
					right={{func:()=>{this.goToChatSeeting()},text:'设置'}}
					heading={'聊天'} />
				<Chat ref={e => this.chat = e} client={this.props.client}/>
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
	accountId:state.loginStore.accountMessage.accountId,

});
const mapDispatchToProps = (dispatch) => {
  return{
    ...bindActionCreators(commonActions,dispatch),
    ...bindActionCreators(chatDetailActions,dispatch),
    ...bindActionCreators(recentListActions,dispatch),
}};

export default connect(mapStateToProps,mapDispatchToProps)(ChatDetail);