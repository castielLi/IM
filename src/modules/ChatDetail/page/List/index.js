/**
 * Created by Hsu. on 2017/8/29.
 */
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    FlatList,
    Image,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Modal,
    TouchableHighlight,
    Keyboard,
    ScrollView,
    TouchableWithoutFeedback,
    Clipboard
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action';
import ChatMessage from './ChatMessage';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import {msgState} from './typeConfig/index';
import UserController from '../../../../TSController/UserController';
import ApplyController from '../../../../TSController/ApplyController'
import TimeHelper from '../../../../Core/Helper/TimeHelper';
import ImagePlaceHolder from '../../../../Core/Component/PlaceHolder/ImagePlaceHolder';
import AppComponent from '../../../../Core/Component/AppComponent';
import ApplyModal from './ApplyModal';

let userController = undefined;
let applyController = undefined;
let currentObj;
let {width,height} = Dimensions.get('window');
let forceRefresh = false;//强刷list
class Chat extends PureComponent {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=> {
            if (forceRefresh) return true;
            if(r1.messageType === 2)
            {
                let r1Local = r1.message.LocalSource;
                let r2Local = r2.message.LocalSource;
                return r1Local !== r2Local || r1.sourceRate !== r2.sourceRate || r1.messageId !== r2.messageId || r1.status !== r2.status;
            }
            return r1.messageId !== r2.messageId || r1.status !== r2.status;
        }});

        this.state = {
            dataSource: ds,
            history: msgState.NOMORE,
            popupMenu: false,
            loaction: {top: 0, left: 0, componentWidth: 0, componentHeight: 0},
            longPressMessageData: null
        };

        this.chatRecord = [];
        this.data = {};
        currentObj = this;

        userController = UserController.getSingleInstance();
        this.currentAccount = userController.getCurrentAccount();
        applyController = ApplyController.getSingleInstance();
    }


    componentWillReceiveProps(nextProps) {
        let {chatRecord, isMore} = nextProps;
        if (this.props.Nickname !== nextProps.Nickname) {
            forceRefresh = true;
        }
        currentObj.chatRecord = chatRecord.concat([]).reverse();
        currentObj.data = currentObj.prepareMessages(currentObj.chatRecord);
        currentObj.setState({
            dataSource:currentObj.state.dataSource.cloneWithRows(currentObj.data.blob, currentObj.data.keys),
            history: isMore ? msgState.END : msgState.NOMORE
        })
    }

    componentWillUnmount() {
    }

    componentWillMount() {
    }


    componentDidMount() {
        this.props.onRef(this)
    }

    /*数据转化*/
    prepareMessages = (messages) =>{
        if(!messages || !messages.length) {
            return {keys:[],blob:[]}
        };
        return {
            keys: messages.map((m,i) => m.messageId),
            blob: messages.reduce((o, m, i) => { //(previousValue, currentValue, currentIndex, array1)
                o[m.messageId] = {
                    ...m,
                    index:i,
                };
                return o;
            }, {})
        };
    }


    /*判断时间显示*/
    getTimestamp = (LocalTime, rowid) => {
        let timer = null;
        let prevTime;
        let index = this.data.blob[rowid].index;
        this.chatRecord[index+1] ?
            prevTime = parseInt(this.chatRecord[index+1].messageTime) : prevTime = 0;
        if((LocalTime - prevTime) > 180000){
            timer = TimeHelper.DateFormat(LocalTime,true,'h:mm');
        }
        return timer;
    };


    messagesStatus = (status) => {

        // //正在发送
        // SENDING = 0,
        //     //接收成功/发送成功
        //     SUCCESS = 1,
        //     //下载失败/发送失败
        //     FAIL = 2,
        //     //等待下载(如果是文件类型)
        //     WAIT_DOWNLOAD = 3,
        //     //正在下载(如果是文件类型)
        //     DOWNLOADING = 4,
        //     RETACTING = 5

        if (status === 0 || status === 3 || status === 4 || status === 5) {
            return (
                <ActivityIndicator
                    size="small"
                />
            )
        }
        else if (status === 1) {
            return null;
        }
        else {
            return (
                <Image source={require('../../resource/fail.png')} style={{width: 20, height: 20}}/>
            )
        }
    }

    receiveMessagesStatus = (status) => {

        // //正在发送
        // SENDING = 0,
        //     //接收成功/发送成功
        //     SUCCESS = 1,
        //     //下载失败/发送失败
        //     FAIL = 2,
        //     //等待下载(如果是文件类型)
        //     WAIT_DOWNLOAD = 3,
        //     //正在下载(如果是文件类型)
        //     DOWNLOADING = 4,
        //     RETACTING = 5

        if (status === 4) {
            return (
                <ActivityIndicator
                    size="small"
                />
            )
        }
        else if (status === 1) {
            return null;
        }
        else if (status == 2) {
            return (
                <Image source={require('../../resource/fail.png')} style={{width: 20, height: 20}}/>
            )
        }
    }


    //发送好友申请信息
    _sendApplyMessage = (value) => {
        // Keyboard.dismiss();
        // currentObj.showLoading();
        applyController.applyFriend(this.currentAccount.Account, this.props.client, value, (result) => {
            // currentObj.hideLoading();
            if (result && result.Result === 1) {
                alert("申请消息已经发送");
            } else if (result && result.Result === 3003) {
                alert('对方已为好友');
            }
            else {
                alert('发送好友申请失败');
            }
        });
    };
    //显示好友申请框
    applyFriend = () => {
        this.ApplyModal.onChange();
    };

    analysisInfo = (message) => {
        var regex = new RegExp('{{.*?}}', 'g')
        let array = message.match(regex)


        if (!array || array.length == 0)
            return (
                <View style={{
                    backgroundColor: '#cfcfcf',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    padding: 5,
                    borderRadius: 5,
                    marginTop: 5
                }}>
                    <Text
                        style={[styles.informText, {fontSize: 14, textAlign: 'left', color: "white"}]}>{message}</Text>
                </View>)

        let tempMessage = message.replace(regex, "#");
        let pureStringArray = tempMessage.split("#");

        for (let item = 0; item < pureStringArray.length; item++) {
            if (pureStringArray[item] == "") {
                pureStringArray.splice(item, 1);
            }
        }

        let beginWithPureString = tempMessage.indexOf('#') > 0 ? true : false;
        let maxLength = pureStringArray.length > array.length ? pureStringArray.length : array.length

        let displayString = [];
        if (beginWithPureString) {
            for (let i = 0; i < maxLength; i++) {
                if (i < pureStringArray.length) {
                    displayString.push({"filling": false, "content": pureStringArray[i]})
                }
                if (i < array.length) {
                    displayString.push({"filling": true, "content": array[i]})
                }
            }

        } else {
            for (let i = 0; i < maxLength; i++) {
                if (i < array.length) {
                    displayString.push({"filling": true, "content": array[i]})
                }

                if (i < pureStringArray.length) {
                    displayString.push({"filling": false, "content": pureStringArray[i]})
                }
            }
        }

        return (

            <View style={{
                backgroundColor: '#cfcfcf',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                padding: 5,
                borderRadius: 5,
                marginTop: 5
            }}>
                {
                    displayString.map((value, index) => {

                        if (value["filling"]) {
                            let account = value["content"].replace("{{", "").replace("}}", "");
                            let infos = account.split(',')
                            return <TouchableOpacity key={index} onPress={() => {
                                this.props.goToClientInfo(infos[0]);
                            }}>
                                <Text style={[styles.informText, {
                                    fontSize: 14,
                                    textAlign: 'left',
                                    color: "#4d90fe"
                                }]}>{"'" + infos[1] + "'"}</Text>
                            </TouchableOpacity>
                        } else {
                            return <Text key={index} style={[styles.informText, {
                                fontSize: 14,
                                textAlign: 'left',
                                color: "white"
                            }]}>{value["content"]}</Text>
                        }
                    })
                }
            </View>

        )

    }

    _errorMessageOpt = (ErrorCode) => {
        //不是好友:6001,已经是好友:6002,被加入黑名单:6003,不在群:6004
        switch (ErrorCode) {
            case 6001:
                return "你与该用户并非好友,或你已经被拉入黑名单,请重新添加";
            case 6002:
                return "对方已经是你的好友";
            case 6003:
                return "对方拒绝接收你的消息";
            case 6004:
                return "你已经被踢出了该群";
        }
    };

    _renderRow = (row,sid,rowid) => {
        console.log('renderRow')
        let {sender, message, messageTime, messageSource, status} = row;
        let headImagePath = userController.getAccountHeadImagePath(sender.account);
        let timer = this.getTimestamp(messageTime, rowid);

        //发送消息SEND = 1,接收消息RECEIVE = 2,系统消息SYSTEM = 3,ERROR = 4,FRIEND=5
        if (messageSource == 3) {
            return (
                <View key={rowid}
                      style={[styles.informView, {marginHorizontal: 40, alignItems: 'center', marginBottom: 10}]}>
                    <View style={styles.timestampView}>
                        {timer ? <Text style={styles.timestamp}>{timer}</Text> : null}
                    </View>

                    {this.analysisInfo(message)}

                </View>
            )
        }
        else if (messageSource == 4) {
            return (
                <View key={rowid}
                      style={[styles.informView, {marginHorizontal: 40, alignItems: 'center', marginBottom: 10}]}>
                    <View style={styles.timestampView}>
                        {timer ? <Text style={styles.timestamp}>{timer}</Text> : null}
                    </View>
                    <View style={{
                        backgroundColor: '#cfcfcf',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        padding: 5,
                        borderRadius: 5
                    }}>
                        <Text style={[styles.informText, {
                            fontSize: 14,
                            textAlign: 'left',
                            color: "white"
                        }]}>{this._errorMessageOpt(message)}</Text>
                        {message === 6001 ? <TouchableOpacity onPress={() => {
                            this.applyFriend()
                        }}>
                            <Text style={{color: '#1d4eb2'}}>发送朋友验证</Text>
                        </TouchableOpacity> : null}
                    </View>
                </View>
            )
        }
        else if (sender.account == this.currentAccount.Account) {
            return (
                <View key={rowid} style={styles.itemViewRight}>
                    <View style={styles.timestampView}>
                        {timer ? <Text style={styles.timestamp}>{timer}</Text> : null}
                    </View>
                    <View style={styles.infoViewRight}>
                        <View style={styles.msgStatus}>
                            <TouchableOpacity>
                                {this.messagesStatus(status)}
                            </TouchableOpacity>
                        </View>
                        <ChatMessage
                            style={styles.bubbleViewRight}
                            rowData={row}
                            chatId={this.props.client}
                            type={this.props.type}
                            navigator={this.props.navigator}
                            onPress={this.ShowPopupMenu}
                            sender={true}
                            goToGallery={this.props.goToGallery}
                            playVideo={this.props.playVideo}
                            playSound={this.props.playSound}
                            // onLongPress={this.ShowPopupMenu}
                        />
                        <ImagePlaceHolder style={styles.userImage} imageUrl={headImagePath}/>
                    </View>
                </View>
            )
        }
        else {
            return (
                <View key={rowid} style={styles.itemView}>
                    <View style={styles.timestampView}>
                        {timer ? <Text style={styles.timestamp}>{timer}</Text> : null}
                    </View>
                    <View style={styles.infoView}>
                        <TouchableOpacity onPress={() => {
                            this.props.goToClientInfo(sender.account);
                        }}>
                            <ImagePlaceHolder style={styles.userImage} imageUrl={headImagePath}/>
                        </TouchableOpacity>
                        <View>
                            {(this.props.type === 'group' && this.props.Nickname) ? <Text style={{
                                fontSize: 12,
                                color: '#666',
                                marginLeft: 10,
                                marginBottom: 3
                            }}>{sender.name}</Text> : null}
                            <ChatMessage
                                style={styles.bubbleView}
                                rowData={row}
                                chatId={this.props.client}
                                type={this.props.type}
                                navigator={this.props.navigator}
                                onPress={this.ShowPopupMenu}
                                sender={false}
                                goToGallery={this.props.goToGallery}
                                playVideo={this.props.playVideo}
                                playSound={this.props.playSound}
                                // onLongPress={this.ShowPopupMenu}
                            />
                        </View>
                        <View style={styles.msgStatusLeft}>
                            <TouchableOpacity>
                                {this.receiveMessagesStatus(status)}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }
    }

    ShowPopupMenu = (loaction, rowData) => {
        this._FlatList.setNativeProps({scrollEnabled: false});
        // InteractionManager.runAfterInteractions(()=>{
        this.setState({
            popupMenu: true,
            longPressMessageData: rowData,
            loaction
        })
        // });
    };
    HidePopupMenu = () => {
        this._FlatList.setNativeProps({scrollEnabled: true});
        // InteractionManager.runAfterInteractions(()=>{
        this.setState({
            popupMenu: false,
            longPressMessageData: null
        })
        // });
    };
    _PopupMenu = () => {
        if (!this.state.popupMenu) return;
        let {left, componentWidth, top, componentHeight} = this.state.loaction;
        //距屏幕左边
        let menuLeft = 0;
        //距屏幕顶部
        let menuTop = top - 45;
        //是否可以撤回
        let retract = false;
        //是否可以复制
        let copy = false;
        let optionNumber = 2;
        //是否可撤回由时间和发送着决定
        if (new Date().getTime() - this.state.longPressMessageData.messageTime < 120000 && this.state.longPressMessageData.sender.account == this.currentAccount.Account) {
            retract = true;
            optionNumber += 1;
        }

        if (this.state.longPressMessageData.status != 1) {
            retract = false;
        }

        if (this.state.longPressMessageData.messageType == 1) {
            copy = true;
            optionNumber += 1;
        }
        let menuWidth = 50 * optionNumber + 10;
        //消息体中心距离左边的距离
        let messageLeft = left + (componentWidth - 10) / 2;
        if (messageLeft >= menuWidth / 2 && (width - messageLeft) >= menuWidth / 2) {
            menuLeft = messageLeft - menuWidth / 2;
        } else if ((width - messageLeft) < menuWidth / 2) {
            menuLeft = width - menuWidth;
        }
        if (top < 45) {
            menuTop = top + componentHeight + 5;
        }
        return (
            <Modal
                animationType='none'
                transparent={true}
                onRequestClose={() => {
                }}
                visible={this.state.popupMenu}
            >
                <TouchableWithoutFeedback onPress={() => this.HidePopupMenu()}>
                    <View style={{position: 'absolute', top: 0, left: 0, width, height}}/>
                </TouchableWithoutFeedback>
                <View style={{
                    flexDirection: 'row', backgroundColor: '#333', height: 40, borderRadius: 5, alignItems: 'center',
                    position: 'absolute', top: menuTop, left: menuLeft, paddingHorizontal: 5
                }}>
                    {copy ? <TouchableHighlight underlayColor='#666' onPress={() => this.copyTextMessage()} style={{
                        height: 40,
                        width: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 8
                    }}>
                        <Text style={{color: '#fff'}}>复制</Text>
                    </TouchableHighlight> : null}
                    <TouchableHighlight underlayColor='#666' onPress={() => this.forwardMessage()} style={{
                        height: 40,
                        width: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 8
                    }}>
                        <Text style={{color: '#fff'}}>转发</Text>
                    </TouchableHighlight>
                    {retract ? <TouchableHighlight underlayColor='#666' onPress={() => this.retactMessage()} style={{
                        height: 40,
                        width: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 8
                    }}>
                        <Text style={{color: '#fff'}}>撤销</Text>
                    </TouchableHighlight> : null}
                    <TouchableHighlight underlayColor='#666' onPress={() => this.deleteMessage()} style={{
                        height: 40,
                        width: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 8
                    }}>
                        <Text style={{color: '#fff'}}>删除</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
        )
    }

    copyTextMessage() {
        this.HidePopupMenu()
        const {longPressMessageData} = this.state;
        Clipboard.setString(longPressMessageData.message)
    }

    deleteMessage() {
        this.HidePopupMenu()
        const {longPressMessageData} = this.state;
        this.props.deleteMessage(longPressMessageData)
    }

    retactMessage() {
        this.HidePopupMenu()
        const {longPressMessageData} = this.state;
        this.props.retactMessage(longPressMessageData)
    }

    forwardMessage() {
        this.HidePopupMenu()
        const {longPressMessageData} = this.state;
        this.props.forwardMessage(longPressMessageData)
    }

    /*历史消息加载*/
    _getHistoryMessage = () => {
        if (this.state.history === msgState.END) {
            this.setState({
                history: msgState.LOADING,
            });
            this.props.getHistoryChatRecord();
        }
    };

    /*数据加载菊花*/
    _listFooterComponent = () => {
        if (this.state.history === msgState.LOADING) {
            return <ActivityIndicator size="small" style={{height: 40}}/>
        }
        return null;
    };

    render() {
        let MyImage = this.props.conversationBackgroundImage != '' ? Image : View;
        return (
            <View style={styles.container}>
                <MyImage source={{uri: this.props.conversationBackgroundImage}} style={{flex:1,width:null,height:null,backgroundColor:'rgba(0,0,0,0)'}}>
                    <ListView
                        style={{paddingHorizontal: 10,margin:0,flexGrow: 0, width: width}}
                        ref={e => this._FlatList = e}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        renderScrollComponent={props => <InvertibleScrollView ref={e => this._invertibleScrollViewRef = e} {...props} inverted />}
                        pageSize={10}

                        onEndReachedThreshold={5}
                        onEndReached={this._getHistoryMessage}
                        renderFooter={this._listFooterComponent}
                        // keyboardDismissMode={'on-drag'}
                    />
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View ref={e => this._Filling = e} style={{flex: 1}}/>
                    </TouchableWithoutFeedback>
                    <ApplyModal ref={e=>this.ApplyModal = e} onConfirm={this._sendApplyMessage}/>
                    {this._PopupMenu()}
                </MyImage>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    msg: {
        fontSize: 20,
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#98E165',
        borderRadius: 8,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 7,
        borderRightWidth: 7,
        borderBottomWidth: 7,
        borderTopWidth: 7,
        borderLeftColor: '#98E165',
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    chatListView:{
        backgroundColor:'#e8e8e8',
        flex:1,
        overflow:'hidden',
    },
    msgStatus:{
        justifyContent:'center',
        marginRight:10
    },
    msgStatusLeft:{
        justifyContent:'center',
        marginLeft:10,
    },
    itemView:{
        marginBottom:10,
    },
    itemViewRight:{
        marginBottom:10,
    },
    timestampView:{
        alignItems:'center',
        borderRadius:3
    },
    timestamp:{
        backgroundColor:'#cfcfcf',
        paddingHorizontal:5,
        borderRadius:3,
        marginVertical:10,
        color:"white"
    },
    infoView:{
        flexDirection:'row',
        justifyContent:'flex-start',
    },
    infoViewRight:{
        flexDirection:'row',
        justifyContent:'flex-end',
    },
    userImage:{
        width:40,
        height:40,
        borderRadius:20,
    },
    bubbleView:{
        alignSelf:'flex-start',
        marginLeft:10,
        backgroundColor: '#fff',
    },
    bubbleViewRight:{
        alignSelf:'flex-start',
        marginRight:10,
        backgroundColor: '#a0e75b',
    },
    contentText:{
        includeFontPadding:false,
        fontSize:16
    },
    validateModalBox: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    validateModal: {
        width: 350,
        backgroundColor: '#fff',
        padding:15,
        borderRadius:2,
    },
    modalTitle:{
        fontSize:20,
        color:'#000',
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false
    },
    modalSubTitle:{
        color:'#000',
        fontSize:16,
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false,
        marginTop:15
    },
    modalInput:{
        height:40,
        borderBottomColor:'#62b900',
        borderBottomWidth:1,
        padding:0,
        paddingHorizontal:5,
        marginTop:10
    },
    modalButtonBox:{
        backgroundColor:'#fff',
        flexDirection:'row',
        justifyContent:'flex-end',
        paddingTop:10,
    },
    modalTouch:{
        borderRadius:2
    },
    modalButton:{
        paddingHorizontal:10,
        paddingVertical:4,
        justifyContent:'center',
        alignItems:'center',
    },
    modalButtonTxt:{
        fontSize:16,
        color:'#666',
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false,
    },
    modalTextColor:{
        color:'#62b900',
    }
});

const mapStateToProps = (state,props) => ({

    accountId:state.loginStore.accountMessage.Account,
    myAvator:state.loginStore.accountMessage.HeadImageUrl,
    accountName:state.loginStore.accountMessage.Nickname
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch),

});

    export default connect(mapStateToProps, mapDispatchToProps,null,{withRef : true})(Chat);
//通过connect连接后 父组件中ref取不到子组件 方法
// 需添加{withRef : true}配置 并在 父组件中设置 ref={e => this.chat = e.getWrappedInstance()}