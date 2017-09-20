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
import RNFS from 'react-native-fs';
import NavigationTopBar from '../../../Core/Component/NavigationBar/index'
import ContainerComponent from '../../../Core/Component/ContainerComponent'
import ThouchBar from './EnterTool/thouchBar';
import Chat from './List/index'
class ChatDetail extends ContainerComponent {
	constructor(props) {
			super(props);
			this.state = {};
			this._leftButton = this._leftButton.bind(this);
			this._title = this._title.bind(this);
		}
		//定义上导航的左按钮
	_leftButton() {
			return {
				title: 'back',
				handler: () => this.route.pop(this.props),
			}
		}
		//定义上导航的标题
	_title() {
		return {
			title: "聊天"
		}
	}

	//控制子组件Chat中的消息滚动到底部
	goBottom() {
		this.chat.getWrappedInstance().scrollToEnd()
	}
	componentWillMount(){
		let client = 'li';
		//如果是刚开聊的，之前redux里没记录的好友	
		if(!this.props.ChatRecord[client]){//!this.props.ChatRecord[client]
			this.props.addClient(client);
			//新建文件夹
			let audioPath = RNFS.DocumentDirectoryPath + '/audio/' + client;
			let imagePath = RNFS.DocumentDirectoryPath + '/image/' + client;
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

	}
	render() {
		const MyView = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
		return (
			<MyView style={styles.container} behavior='padding'>
    		<NavigationTopBar
				// leftButton={this._leftButton}
				title={this._title} />
				<Chat ref={e => this.chat = e}/>
    		<ThouchBar client={'li'}></ThouchBar>
    	</MyView>

		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#a3bee4',

	},
})

const mapStateToProps = state => ({
  ChatRecord: state.chatRecordStore.ChatRecord
});
const mapDispatchToProps = (dispatch) => {
  return{
    ...bindActionCreators(commonActions,dispatch)
}};

export default connect(mapStateToProps,mapDispatchToProps)(ChatDetail);