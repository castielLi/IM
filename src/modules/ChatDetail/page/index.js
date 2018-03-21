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
    InteractionManager,
    Dimensions,
    Alert,
    AppState
} from 'react-native';
var {height} = Dimensions.get('window');
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
import AppPageMarkEnum from '../../../App/Enum/AppPageMarkEnum';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import {
    Navigator,
} from 'react-native-deprecated-custom-components';
let stopSoundObj = null;
let userController = undefined;
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
            isMore:false,
            BackgroundImage:'',
        };
        currentObj = this;
        this.isDisabled = false;
        group = props.type == "private"?false:true;

        imController = IMController.getSingleInstance();
        userController = UserController.getSingleInstance();
        this._handleAppStateChange = this._handleAppStateChange.bind(this);
        this._goToGallery = this._goToGallery.bind(this);
        this._playVideo = this._playVideo.bind(this);
        this.goToClientInfo = this.goToClientInfo.bind(this);
        this.goToChatSeeting = this.goToChatSeeting.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
    }


    getHistoryChatRecord(){
         imController.getHistory();

	}

    componentWillMount(){
        // if (group) {
        //     userController.getGroupInfo(this.props.client, false, (result) => {
        //         this.setState({
        //             settingButtonDisplay: result.Exited
        //         })
        //     })
        // }
        AppState.addEventListener('change', this._handleAppStateChange);
        imController.setCurrentConversation(this.props.client, group);
        let setting = imController.getChatSetting();
        if(setting){
            this.setState({
                BackgroundImage:setting.BackgroundImagePath
            });
        }
        if (group) {
            userController.getGroupInfo(this.props.client, false, (result) => {
                this.setState({
                    settingButtonDisplay: result.Exited
                })
            })
        }
    }

    // componentDidMount(){
    //     InteractionManager.runAfterInteractions(()=> {
    //         if (group) {
    //             userController.getGroupInfo(this.props.client, false, (result) => {
    //                 this.setState({
    //                     settingButtonDisplay: result.Exited
    //                 })
    //             })
    //         }
    //         // imController.setCurrentConversation(this.props.client, group);
    //         // let setting = imController.getChatSetting();
    //         // if(setting){
    //         //     this.BackgroundImage = setting.BackgroundImagePath;
    //         // }
    //
    //     });
    // }

    componentWillUnmount(){
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.releaseSound();
        imController.exitOrResetCurrentConversation(this.props.client);
        super.componentWillUnmount();
    }


    _refreshUI(type,params){
        console.log("children refreshUI"+ new Date().getTime());
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
            case AppPageMarkEnum.ConversationDetailBackgroundImage:
                currentObj.setState({
                    BackgroundImage:params
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
        this.releaseSound();
        // let {type} = this.props;
        // if(type === 'group'){
            this.route.push(this.props,{key:'ClientInformation',routeId:'ClientInformation',params:{clientId:Account,existChatDetailId:this.props.client}});
        // }
    }

    goToChatSeeting = ()=>{
        this.releaseSound();
        let {client,type} = this.props;

        if(type === 'private'){
            this.route.push(this.props,{key: 'ChatSetting',routeId: 'ChatSetting',params:{'Name': this.state.name,'Account':client}});

        }else if(type === 'group'){
            this.route.push(this.props,{key: 'GroupInformationSetting',routeId: 'GroupInformationSetting',params:{"groupId":client}});

        }
    }

    releaseSound = () =>{
        if(stopSoundObj){
            stopSoundObj.stop(()=>{
                stopSoundObj = null;
            }).release();
        }
    }

    _handleAppStateChange=(nextAppState)=>{
        if(nextAppState !== 'active'){
            this.releaseSound();
        }
    };

    //Image
    _goToGallery = (chatId,type,data)=>{
        this.releaseSound();
        this.route.push(this.props,{key: 'Gallery',routeId: 'Gallery',params:{"chatId":chatId,"type":type,"data":data,},sceneConfig:Navigator.SceneConfigs.FloatFromBottomAndroid});
    };
    //Audio
    _playSound = (SoundUrl,component,durant) => {

        if(component!=null){
            component.changeVolumeHidden(false);
            setTimeout(()=>{
                component.changeVolumeHidden(true)
            },durant * 1000);
        }

        if (Platform.OS === 'ios') {
            Sound.enable(true);
        }
        const callback = (error, sound) => {
            if (error) {
                Alert.alert('error', error.message);
            }
            if(stopSoundObj){
                stopSoundObj.stop(()=>{
                    if(stopSoundObj && sound._filename == stopSoundObj._filename){
                        stopSoundObj = null;
                        return;
                    }
                    stopSoundObj = sound;
                    sound.play(() => {
                        stopSoundObj = null;
                        sound.release();
                    });

                }).release()
            }
            else{
                stopSoundObj = sound;
                sound.play(() => {
                    stopSoundObj = null;
                    sound.release();
                });
            }
        };
        const sound = new Sound(SoundUrl,'', error => callback(error, sound));
    };
    //video
    _playVideo = (Local,Remote,data)=>{
        this.releaseSound();
        let {messageId,message} = data;
        RNFS.exists(Local).then((success) => {
            if(!success){
                imController.manualDownloadResource(this.props.client,messageId,group,message);
            }
            else{
                this.route.push(this.props,{key: 'Player',routeId: 'Player',params:{"path":Local},sceneConfig:Navigator.SceneConfigs.FloatFromBottomAndroid});
            }
        }).catch((err) => {
            console.log(err.message);
        });
    };

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
			<MyView style={styles.container} behavior='padding'  keyboardVerticalOffset={0}>
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
                              conversationBackgroundImage = {this.state.BackgroundImage}
                              getHistoryChatRecord={this.getHistoryChatRecord}
                              deleteMessage={this.deleteChatMessage}
                              retactMessage={this.retactMessage}
                              forwardMessage={this.forwardMessage}
                              goToGallery = {this._goToGallery}
                              playVideo = {this._playVideo}
                              playSound = {this._playSound}
                              goToClientInfo = {this.goToClientInfo}
                              type={this.props.type}
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
