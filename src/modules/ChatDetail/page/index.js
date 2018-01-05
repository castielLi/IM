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
import * as chatDetailActions from '../reducer/action';
import AppComponent from '../../../Core/Component/AppComponent';
import ThouchBar from './EnterTool/thouchBar';
import Chat from './List/index'
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import IMController from '../../../TSController/IMController'
import UserController from '../../../TSController/UserController';
import AppPageMarkEnum from '../../../App/AppPageMarkEnum'
let userController = undefined;
let settingButton = undefined;
let imController = undefined;
let currentObj = undefined;

class ChatDetail extends AppComponent {
	constructor(props) {
        super(props);


        if (props.type == 'group') {
            userController.getGroupInfo(props.client,false,(result)=>{
                settingButton = result.Exited;
            })
        }
        this.state = {
            isDisabled: true,
            name: props.Nick,
            settingButtonDisplay: settingButton,
            chatRecord:[],
            isMore:0
        };
        currentObj = this;
        this.isDisabled = false;

        imController = IMController.getSingleInstance();
        userController = new UserController();
    }


    getHistoryChatRecord(){
        imController.getHistoryChatRecord(this.props.client,this.props.type);
    }


    componentWillMount(){
	    let group = this.props.type == "private"?false:true;
        imController.setCurrentConverse(this.props.client,group);
    }

    componentWillUnmount(){
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
            case AppPageMarkEnum.ModifyGroupSetting:
                let name = params.name;

                currentObj.onUpdateHeadName(name);
                break;
            case AppPageMarkEnum.ModifyGroupSetting:
                let display = params.display;
                currentObj.setState({
                    settingButtonDisplay:display
                })
                break;
        }
	}

    onUpdateHeadName(name){
        currentObj.setState({
            name
        })
    }


    goToChatSeeting = ()=>{
        let {client,type} = this.props;

        if(type === 'private'){
            this.route.push(this.props,{key: 'ChatSetting',routeId: 'ChatSetting',params:{}});

        }else if(type === 'group'){
            this.route.push(this.props,{key: 'GroupInformationSetting',routeId: 'GroupInformationSetting',params:{"groupId":client,"onUpdateHeadName":this.onUpdateHeadName.bind(this)}});

        }
    }

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
					    imController.goOutCurrentConverse();
					}}}
					right={{func:()=>{this.goToChatSeeting()},text:this.state.settingButtonDisplay?'':'设置',disabled:this.state.settingButtonDisplay}}
					heading={this.state.name} />
				<TouchableWithoutFeedback disabled={this.state.isDisabled} onPressIn={()=>{if(this.props.thouchBarStore.isRecordPage){return;}this.props.changeThouchBarInit()}}>
					<View  style={{flex:1,backgroundColor:'#e8e8e8',overflow:'hidden'}}>

                        <Chat onRef={ref => (this.chat = ref)}
                              isMore = {this.state.isMore}
                              chatRecord = {this.state.chatRecord}
                              client={this.props.client}
                              updateDisplaySetting={this.onUpdateDisplaySetting}
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
