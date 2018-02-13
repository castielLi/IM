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
	TouchableWithoutFeedback,
    InteractionManager
} from 'react-native';
import {
  connect
} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as chatDetailActions from '../reducer/action';
import AppComponent from '../../../Core/Component/AppComponent';
import ThouchBar from './EnterTool/thouchBar';
import Chat from './List/index'
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import IMController from '../../../TSController/IMLogic/IMControllerLogic'
import UserController from '../../../TSController/UserController';
import AppPageMarkEnum from '../../../App/AppPageMarkEnum'
import AppManagement from '../../../App/AppManagement';
import AppPageRequestEnum from '../../../App/AppPageRequestEnum';

let userController = undefined;
let settingButton = undefined;
let imController = undefined;
let currentObj = undefined;
let group = undefined;

class ChatDetail extends AppComponent {
	constructor(props) {
        super(props);
        this.state = {
            isDisabled: true,
            name: props.Nick,
            settingButtonDisplay: false,
            chatRecord:[],
            isMore:false
        };
        currentObj = this;
        this.isDisabled = false;
        group = props.type == "private"?false:true;

        imController = IMController.getSingleInstance();
        userController = UserController.getSingleInstance();
    }


    getHistoryChatRecord(){
         imController.getHistory();

	}


    componentDidMount(){
        InteractionManager.runAfterInteractions(()=> {
            if (group) {
                userController.getGroupInfo(this.props.client, false, (result) => {
                    let settingButton = result.Exited;
                    if (settingButton == true || settingButton == 'true') {
                        settingButton = true;
                    } else {
                        settingButton = false;
                    }
                    this.setState({
                        settingButtonDisplay: settingButton
                    })
                })
            }
            imController.setCurrentConversation(this.props.client, group);
        });
    }

    componentWillUnmount(){
        imController.exitCurrentConversation();
        super.componentWillUnmount();
    }


    _refreshUI(type,params){
        switch (type){
            case AppPageMarkEnum.ConversationDetail:
                let chatRecord = params.list;
                currentObj.setState({
                    chatRecord,
                    isMore:params.dropAble
                })
                break;
            case AppPageMarkEnum.ModifyGroupName:
                let name = params.name;
                currentObj.onUpdateHeadName(name);
                break;
            case AppPageMarkEnum.ModifyGroupSetting:
                currentObj.setState({
                    settingButtonDisplay:!params
                })
                break;
        }
	}

    onUpdateHeadName(name){
        currentObj.setState({
            name
        })
    }

    goToClientInfo = (Account)=>{
        let {type} = this.props;
        if(type === 'group'){
            this.route.push(this.props,{key:'ClientInformation',routeId:'ClientInformation',params:{clientId:Account}});

        }
    }

    goToChatSeeting = ()=>{
        let {client,type} = this.props;

        if(type === 'private'){
            this.route.push(this.props,{key: 'ChatSetting',routeId: 'ChatSetting',params:{}});

        }else if(type === 'group'){
            this.route.push(this.props,{key: 'GroupInformationSetting',routeId: 'GroupInformationSetting',params:{"groupId":client,"onUpdateHeadName":this.onUpdateHeadName.bind(this)}});

        }
    }

    //复制文字消息

    //删除聊天信息
    deleteChatMessage = (rowData)=>{
        const {messageId} = rowData;
        imController.removeMessage(messageId)
    };

    //撤回聊天信息
    retactMessage = (rowData)=>{
        const {messageId} = rowData;
        imController.RetactMessage(messageId)
    };

    //转发消息
    forwardMessage = (rowData)=>{
        this.route.push(this.props,{key:'ForwardChoose',routeId:'ForwardChoose',params:{rowData}});
        // let receives = [];
        // receives.push({"receiveId":"wg003723","group":false});
        // receives.push({"receiveId":"wg003744","group":false});
        // receives.push({"receiveId":"wg003735","group":false});
        // imController.ForwardMessage(rowData,receives)
    };


	//控制子组件Chat中的消息滚动到底部
	goBottom() {
		this.chat.getWrappedInstance().scrollToEnd()
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
					left={{func:()=>{
					    this.route.toMain(this.props);
					    // imController.exitCurrentConversation();
					}}}
					right={{func:()=>{this.goToChatSeeting()},text:this.state.settingButtonDisplay?'':'设置',disabled:this.state.settingButtonDisplay}}
					heading={this.state.name} />
				<TouchableWithoutFeedback disabled={this.state.isDisabled} onPressIn={()=>{if(this.props.thouchBarStore.isRecordPage){return;}this.props.changeThouchBarInit()}}>
					<View  style={{flex:1,backgroundColor:'#e8e8e8',overflow:'hidden'}}>

                        <Chat onRef={ref => (this.chat = ref)}
                              isMore = {this.state.isMore}
                              chatRecord = {this.state.chatRecord}
                              client={this.props.client}
                              getHistoryChatRecord={this.getHistoryChatRecord}
                              deleteMessage={this.deleteChatMessage}
                              retactMessage={this.retactMessage}
                              forwardMessage={this.forwardMessage}
                              goToClientInfo = {this.goToClientInfo}
                              type={this.props.type} HeadImageUrl={this.props.HeadImageUrl}
                              navigator={this.props.navigator}/>
                    </View>
				</TouchableWithoutFeedback>
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
    thouchBarStore: state.thouchBarStore,
});
const mapDispatchToProps = (dispatch) => {
  return{
    ...bindActionCreators(chatDetailActions,dispatch)
}};

export default connect(mapStateToProps,mapDispatchToProps)(ChatDetail);
