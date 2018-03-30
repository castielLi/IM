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
    PanResponder,
    Button,
    TouchableWithoutFeedback,
    Clipboard
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action';
import ChatMessage from './ChatMessage';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import {ListConst} from './typeConfig/index';
import UserController from '../../../../TSController/UserController';
import ApplyController from '../../../../TSController/ApplyController'
import TimeHelper from '../../../../Core/Helper/TimeHelper';
import ImagePlaceHolder from '../../../../Core/Component/PlaceHolder/ImagePlaceHolder';
import AppComponent from '../../../../Core/Component/AppComponent';
import ApplyModal from './ApplyModal';

let _listHeight = 0; //list显示高度
let _footerY = 0; //foot距离顶部距离
let scrollDistance = 0;//滚动距离
let _MaxListHeight = 0; //记录最大list高度
let FooterLayout = false;
let ListLayout = false;
let userController = undefined;
let applyController = undefined;
let currentObj;
let {width,height} = Dimensions.get('window');
let forceRefresh = false;//强刷list
class Chat extends PureComponent {
    constructor(props){
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
            showInvertible:false,
            dataSource: ds,
            dataSourceO: ds,
            isMore:2,
            popupMenu:false,
            loaction:{top:0,left:0,componentWidth:0,componentHeight:0},
            longPressMessageData:null
        }
        currentObj = this;
        this.data = [];
        this.data2 = [];
        this.chatRecord = [];
        this.chatRecord2 = [];

        this.timestamp = 0;
        this.currentAccount = undefined;

        this.renderRow = this.renderRow.bind(this);
        userController = UserController.getSingleInstance();
        applyController = ApplyController.getSingleInstance();
        this.ShowInvertibleList = this.ShowInvertibleList.bind(this);
        this.InShowInvertibleList = this.InShowInvertibleList.bind(this);
    }


    componentWillReceiveProps(nextProps){
        let {chatRecord,isMore} = nextProps;
        let {msgState} = ListConst;
        if(this.props.Nickname !== nextProps.Nickname){
            forceRefresh = true;
        }
        // if(!chatRecord
        //     || !chatRecord.length
        // ) return;
        currentObj.chatRecord = chatRecord;
        currentObj.chatRecord2 = chatRecord.concat([]).reverse();
        currentObj.data = currentObj.prepareMessages(currentObj.chatRecord);
        currentObj.data2 = currentObj.prepareMessages(currentObj.chatRecord2);
        currentObj.setState({
            dataSource:currentObj.state.dataSource.cloneWithRows(currentObj.data.blob, currentObj.data.keys),
            dataSourceO:currentObj.state.dataSourceO.cloneWithRows(currentObj.data2.blob, currentObj.data2.keys),
            isMore: isMore ? msgState.END : msgState.NOMORE
        })
    }

    componentWillUnmount(){
        _listHeight = 0; //list显示高度
        _footerY = 0; //foot距离顶部距离
        scrollDistance = 0;//滚动距离
        _MaxListHeight = 0; //记录最大list高度
        FooterLayout = false;
        ListLayout = false;
    }


    componentWillMount() {
        this.currentAccount = userController.getCurrentAccount();
        let {type,client} = this.props;
        let group;
        if(type === 'private'){
            group = false;
        }else{
            group = true;
        }

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e) => false,  //对触摸进行响应
            onStartShouldSetPanResponderCapture: ()=> false, //是否要劫持点击事件
            onMoveShouldSetPanResponderCapture: ()=> false, //是否要劫持滑动事件
            onMoveShouldSetPanResponder: (e,g)=> {
                if(g.dy > 30){
                    return true;
                }
                else{
                    return false;
                }
            },//对滑动进行响应
            onPanResponderTerminate : ()=> true,
            //激活时做的动作
            onPanResponderGrant: (e)=>{
                this.move = e.nativeEvent.pageY;
            },
            //移动时作出的动作
            onPanResponderMove: (e)=>{
                let {msgState} = ListConst;
                //todo:缺少无更多历史记录状态
                if(e.nativeEvent.pageY-this.move>20 && this.state.isMore === msgState.END && !this.state.showInvertible)
                {
                    //获取历史记录 回调修改页面 用到之前的setCurrentConverse方法中传过去的callback取数控逻辑也在 controller
                    this.setState({
                        isMore:msgState.LOADING,
                    });

                    this.props.getHistoryChatRecord();
                }
            },
        })
    }


    componentDidMount(){
        this.props.onRef(this)
    }

    prepareMessages(messages) {
        //console.log(messages)
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

    getTimestamp = (LocalTime,rowid) =>{
        let timer = null;
        if(this.state.showInvertible){
            let prevTime;
            let index = this.data2.blob[rowid].index;
            this.chatRecord2[index+1] ?
                prevTime = parseInt(this.chatRecord2[index+1].messageTime) : prevTime = 0;
            if((LocalTime - prevTime) > 180000){
                timer = TimeHelper.DateFormat(LocalTime,true,'h:mm');
            }
            return timer;
        }
        else{
            let prevTime;
            let index = this.data.blob[rowid].index;
            prevTime = this.chatRecord[index-1] ?
               parseInt(this.chatRecord[index-1].messageTime) : 0;
            if((LocalTime - prevTime) > 180000){
                timer = TimeHelper.DateFormat(LocalTime,true,'h:mm');
            }
            return timer;
        }
    }


    messagesStatus = (status)=>{

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

        if(status === 0 || status === 3 || status === 4 || status === 5){
            return (
                <ActivityIndicator
                    size="small"
                />
            )
        }
        else if(status === 1){
            return null;
        }
        else{
            return (
                <Image source={require('../../resource/fail.png')} style={{width:20,height:20}}/>
            )
        }
    }

    receiveMessagesStatus = (status)=>{

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

        if(status === 4){
            return (
                <ActivityIndicator
                    size="small"
                />
            )
        }
        else if(status === 1){
            return null;
        }
        else if(status == 2){
            return (
                <Image source={require('../../resource/fail.png')} style={{width:20,height:20}}/>
            )
        }
    }


    //发送好友申请信息
    _sendApplyMessage=(value)=>{
        // Keyboard.dismiss();
        // currentObj.showLoading();
        applyController.applyFriend(this.currentAccount.Account,this.props.client,value,(result)=>{
            // currentObj.hideLoading();
            if(result && result.Result === 1){
                alert("申请消息已经发送");
            }else if(result && result.Result === 3003){
                alert('对方已为好友');
            }
            else{
                alert('发送好友申请失败');
            }
        });
    };
    //显示好友申请框
    applyFriend = ()=>{
        this.ApplyModal.onChange();
    };

    analysisInfo = (message)=> {
        var regex = new RegExp('{{.*?}}', 'g')
        let array = message.match(regex)


        if(!array || array.length == 0)
            return (
                <View style={{backgroundColor:'#cfcfcf',flexDirection:'row',flexWrap:'wrap',justifyContent:'center',padding:5,borderRadius:5,marginTop:5}}>
                    <Text style={[styles.informText,{fontSize:14,textAlign:'left',color:"white"}]}>{message}</Text>
                </View>)

        let tempMessage = message.replace(regex,"#");
        let pureStringArray = tempMessage.split("#");

        for(let item = 0; item<pureStringArray.length;item++){
            if(pureStringArray[item] == ""){
                pureStringArray.splice(item,1);
            }
        }

        let beginWithPureString = tempMessage.indexOf('#') > 0?true:false;
        let maxLength = pureStringArray.length > array.length?pureStringArray.length:array.length

        let displayString = [];
        if(beginWithPureString){
            for(let i = 0;i<maxLength;i++){
                if(i<pureStringArray.length){
                    displayString.push({"filling":false,"content":pureStringArray[i]})
                }
                if(i<array.length){
                    displayString.push({"filling":true,"content":array[i]})
                }
            }

        }else{
            for(let i = 0;i<maxLength;i++){
                if(i<array.length){
                    displayString.push({"filling":true,"content":array[i]})
                }

                if(i<pureStringArray.length){
                    displayString.push({"filling":false,"content":pureStringArray[i]})
                }
            }
        }

        return(

            <View style={{backgroundColor:'#cfcfcf',flexDirection:'row',flexWrap:'wrap',justifyContent:'center',padding:5,borderRadius:5,marginTop:5}}>
                    {
                        displayString.map((value,index)=>{

                            if(value["filling"]){
                                let account = value["content"].replace("{{","").replace("}}","");
                                let infos = account.split(',')
                                return <TouchableOpacity key={index} onPress={()=> {
                                    this.props.goToClientInfo(infos[0]);
                                }}>
                                    <Text style={[styles.informText,{fontSize:14,textAlign:'left',color:"#4d90fe"}]}>{"'" + infos[1] +"'"}</Text>
                                </TouchableOpacity>
                            }else{
                                return <Text key={index} style={[styles.informText,{fontSize:14,textAlign:'left',color:"white"}]}>{value["content"]}</Text>
                            }
                        })
                    }
                </View>

        )

    }

    _errorMessageOpt=(ErrorCode)=>{
        //不是好友:6001,已经是好友:6002,被加入黑名单:6003,不在群:6004
        switch (ErrorCode){
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

    renderRow = (row,sid,rowid) => {
        console.log('renderRow')
        let {sender,message,messageTime,messageSource,status} = row;
        let headImagePath = userController.getAccountHeadImagePath(sender.account);
        let timer = this.getTimestamp(messageTime,rowid);

         //发送消息SEND = 1,接收消息RECEIVE = 2,系统消息SYSTEM = 3,ERROR = 4,FRIEND=5
        if(messageSource == 3){
            return (
                <View key={rowid} style={[styles.informView,{marginHorizontal:40,alignItems:'center',marginBottom:10}]}>
                    <View style={styles.timestampView}>
                        {timer ? <Text style={styles.timestamp}>{timer}</Text> : null}
                    </View>

                    {this.analysisInfo(message)}

                </View>
            )
        }
        else if(messageSource == 4){
            return(
                <View key={rowid} style={[styles.informView,{marginHorizontal:40,alignItems:'center',marginBottom:10}]}>
                    <View style={styles.timestampView}>
                        {timer ? <Text style={styles.timestamp}>{timer}</Text> : null}
                    </View>
                    <View style={{backgroundColor:'#cfcfcf',flexDirection:'row',flexWrap:'wrap',justifyContent:'center',padding:5,borderRadius:5}}>
                        <Text style={[styles.informText,{fontSize:14,textAlign:'left',color:"white"}]}>{this._errorMessageOpt(message)}</Text>
                        {message === 6001 ? <TouchableOpacity onPress={()=>{this.applyFriend()}}>
                            <Text style={{color:'#1d4eb2'}}>发送朋友验证</Text>
                        </TouchableOpacity> : null}
                    </View>
                </View>
            )
        }
        else if (sender.account == this.currentAccount.Account){
            return(
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
                            goToGallery = {this.props.goToGallery}
                            playVideo = {this.props.playVideo}
                            playSound = {this.props.playSound}
                            // onLongPress={this.ShowPopupMenu}
                        />
                        <ImagePlaceHolder style={styles.userImage} imageUrl={headImagePath}/>
                    </View>
                </View>
            )
        }
        else{
            return(
                <View key={rowid} style={styles.itemView}>
                    <View style={styles.timestampView}>
                        {timer ? <Text style={styles.timestamp}>{timer}</Text> : null}
                    </View>
                    <View style={styles.infoView}>
                        <TouchableOpacity onPress = {()=>{this.props.goToClientInfo(sender.account);}}>
                            <ImagePlaceHolder style={styles.userImage} imageUrl={headImagePath}/>
                        </TouchableOpacity>
                        <View>
                            {(this.props.type === 'group' && this.props.Nickname) ? <Text style={{fontSize:12,color:'#666',marginLeft:10,marginBottom:3}}>{sender.name}</Text> : null}
                            <ChatMessage
                                style={styles.bubbleView}
                                rowData={row}
                                chatId={this.props.client}
                                type={this.props.type}
                                navigator={this.props.navigator}
                                onPress={this.ShowPopupMenu}
                                sender={false}
                                goToGallery = {this.props.goToGallery}
                                playVideo = {this.props.playVideo}
                                playSound = {this.props.playSound}
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

    ShowPopupMenu = (loaction,rowData)=>{
        this.listView.setNativeProps({scrollEnabled: false})
        this.setState({
            popupMenu:true,
            longPressMessageData:rowData,
            loaction
        })
    };
    HidePopupMenu = ()=>{
        this.listView.setNativeProps({scrollEnabled: true})
        this.setState({
            popupMenu:false,
            longPressMessageData:null
        })
    };
    _PopupMenu(){
        if(!this.state.popupMenu) return;
        let {left,componentWidth,top,componentHeight} = this.state.loaction;
        //距屏幕左边
        let menuLeft = 0;
        //距屏幕顶部
        let menuTop = top-45;
        //是否可以撤回
        let retract = false;
        //是否可以复制
        let copy = false;
        let optionNumber = 2;
        //是否可撤回由时间和发送着决定
        if(new Date().getTime() - this.state.longPressMessageData.messageTime < 120000 && this.state.longPressMessageData.sender.account == this.currentAccount.Account){
            retract = true;
            optionNumber+=1;
        }
        if(this.state.longPressMessageData.messageType == 1){
            copy = true;
            optionNumber+=1;
        }
        let menuWidth = 50*optionNumber+10;
        //消息体中心距离左边的距离
        let messageLeft = left+(componentWidth-10)/2;
        if(messageLeft>=menuWidth/2 && (width-messageLeft)>=menuWidth/2){
            menuLeft = messageLeft - menuWidth/2;
        }else if((width-messageLeft)<menuWidth/2){
            menuLeft = width - menuWidth;
        }
        if(top<45){
            menuTop = top + componentHeight +5;
        }
        return (
            <Modal
                animationType='none'
                transparent={true}
                onRequestClose={()=>{}}
                visible={this.state.popupMenu}
            >
                <TouchableWithoutFeedback onPress={()=>this.HidePopupMenu()}>
                    <View style={{position: 'absolute',top: 0,left: 0,width,height}}/>
                </TouchableWithoutFeedback>
                <View style={{flexDirection:'row',backgroundColor:'#333',height:40,borderRadius:5,alignItems:'center',
                position:'absolute',top:menuTop,left:menuLeft,paddingHorizontal:5}}>
                    {copy ? <TouchableHighlight underlayColor='#666' onPress={()=>this.copyTextMessage()} style={{height:40,width:50,justifyContent:'center',alignItems:'center',paddingHorizontal:8}}>
                        <Text style={{color:'#fff'}}>复制</Text>
                    </TouchableHighlight> : null}
                    <TouchableHighlight underlayColor='#666' onPress={()=>this.forwardMessage()} style={{height:40,width:50,justifyContent:'center',alignItems:'center',paddingHorizontal:8}}>
                        <Text style={{color:'#fff'}}>转发</Text>
                    </TouchableHighlight>
                    {retract ? <TouchableHighlight underlayColor='#666' onPress={()=>this.retactMessage()} style={{height:40,width:50,justifyContent:'center',alignItems:'center',paddingHorizontal:8}}>
                        <Text style={{color:'#fff'}}>撤销</Text>
                    </TouchableHighlight> : null}
                    <TouchableHighlight underlayColor='#666' onPress={()=>this.deleteMessage()} style={{height:40,width:50,justifyContent:'center',alignItems:'center',paddingHorizontal:8}}>
                        <Text style={{color:'#fff'}}>删除</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
        )
    }

    copyTextMessage(){
        this.HidePopupMenu()
        const {longPressMessageData} = this.state;
        Clipboard.setString(longPressMessageData.message)
    }

    deleteMessage(){
        this.HidePopupMenu()
        const {longPressMessageData} = this.state;
        this.props.deleteMessage(longPressMessageData)
    }

    retactMessage(){
        this.HidePopupMenu()
        const {longPressMessageData} = this.state;
        this.props.retactMessage(longPressMessageData)
    }

    forwardMessage(){
        this.HidePopupMenu()
        const {longPressMessageData} = this.state;
        this.props.forwardMessage(longPressMessageData)
    }

    oldMsg = () => {
        let {msgState} = ListConst;
        if(this.state.isMore === msgState.END){
            this.setState({
                isMore : msgState.LOADING
            });

            this.props.getHistoryChatRecord();
        }
    };

    myRenderFooter(){
        //console.log('foot执行了')
        const {isMore,showInvertible}=this.state;
        let {msgState} = ListConst;

        if(!showInvertible) {
            return <View
                onLayout={this._onFooterLayout}
            />
        }
        else{
            if(isMore === msgState.LOADING){
                return(
                    <ActivityIndicator
                        size="small"
                        style={{height:40}}
                    />
                )
            }
            else{
                return null;
            }
        }
    }

    //聊天信息变化触发
    _onFooterLayout = (event) =>{
        const {showInvertible}=this.state
        if(!showInvertible) {
            //FooterLayout = event.nativeEvent.layout.y>_footerY;
            _footerY = event.nativeEvent.layout.y;
            this.scrollToBottom();
        }
    }

    scrollToBottom=()=> {
        const {showInvertible}=this.state
        // if(FooterLayout === false &&ListLayout===false){
        //     return;
        // }
        FooterLayout = false
        ListLayout=false
        console.log('屏幕最大高度：'+_MaxListHeight+'   当前高度：'+_listHeight+'   距离屏幕高度'+_footerY)
        if (_listHeight && _footerY && _footerY > _listHeight) {
            scrollDistance = _listHeight - _footerY;
            this.listView.scrollTo({
                y: -scrollDistance,
                x: 0,
                animated:false,
            });
        }
        if(_footerY>_MaxListHeight&&_MaxListHeight!==0&&!showInvertible){
            this.setState({
                showInvertible:true
            });
            return;
        }
    }

    scrollToEnd = () => {
        if(this.state.showInvertible){
            if (this._invertibleScrollViewRef === null) { return }
            this._invertibleScrollViewRef.scrollTo({
                y: 0,
                animated:false,
            });
        }
    }

    //界面变化触发
    _onListViewLayout = (event) =>{
        const {showInvertible}=this.state
        console.log('屏幕最大高度：'+_MaxListHeight+'   当前高度：'+_listHeight)
        if(!showInvertible){
            if(!_MaxListHeight || _MaxListHeight < event.nativeEvent.layout.height){
                _MaxListHeight = event.nativeEvent.layout.height;
            }
            //ListLayout = event.nativeEvent.layout.height!==_listHeight;
            _listHeight = event.nativeEvent.layout.height;
            this.scrollToBottom();
        }else {
            this.listView.scrollTo({
                y: 0,
                x: 0,
                animated:true,
            });
        }
    }

    myRenderHeader = () =>{
        let {isMore}=this.state;
        let {msgState} = ListConst;
        if(isMore === msgState.LOADING){
            return(
                <ActivityIndicator
                    size="small"
                    style={{height:40}}
                />
            )
        }
        else{
            return null;
        }
    }

    ShowInvertibleList = ()=>{
        if(this.props.conversationBackgroundImage != ""){
            return <View style={styles.chatListView}>
                <Image source={{uri:this.props.conversationBackgroundImage}} style={{flex:1,
                    width:null,
                    height:null,
                    backgroundColor:'rgba(0,0,0,0)'}}>
                    <ListView
                        ref={(lv) => this.listView = lv}
                        dataSource={this.state.dataSourceO}
                        removeClippedSubviews={false}
                        renderRow={this.renderRow}
                        style={{paddingHorizontal:10, backgroundColor: 'rgba(52, 52, 52, 0.0)'}}
                        pageSize={10}

                        onEndReached={this.oldMsg}
                        onEndReachedThreshold={5}

                        renderFooter={this.myRenderFooter.bind(this)}
                        onLayout={this._onListViewLayout}

                        renderScrollComponent={props => <InvertibleScrollView ref={e => this._invertibleScrollViewRef = e} {...props} inverted />}
                    />
                    <ApplyModal ref={e=>this.ApplyModal = e} onConfirm={this._sendApplyMessage}/>
                    {this._PopupMenu()}
                </Image>
            </View>
        }else{
            return <View style={styles.chatListView}>
                    <ListView
                        ref={(lv) => this.listView = lv}
                        dataSource={this.state.dataSourceO}
                        removeClippedSubviews={false}
                        renderRow={this.renderRow}
                        style={{paddingHorizontal:10, backgroundColor: 'rgba(52, 52, 52, 0.0)'}}
                        pageSize={10}

                        onEndReached={this.oldMsg}
                        onEndReachedThreshold={5}

                        renderFooter={this.myRenderFooter.bind(this)}
                        onLayout={this._onListViewLayout}

                        renderScrollComponent={props => <InvertibleScrollView ref={e => this._invertibleScrollViewRef = e} {...props} inverted />}
                    />
                    <ApplyModal ref={e=>this.ApplyModal = e} onConfirm={this._sendApplyMessage}/>
                    {this._PopupMenu()}
            </View>
        }

    }

    InShowInvertibleList = ()=>{
        if(this.props.conversationBackgroundImage != ""){
            return <View style={styles.chatListView}>
                <Image source={{uri:this.props.conversationBackgroundImage}} style={{flex:1,
                    width:null,
                    height:null,
                    backgroundColor:'rgba(0,0,0,0)'}}>
                <View {...this._panResponder.panHandlers} style={{...StyleSheet.absoluteFillObject}}>
                    <ListView
                        ref={(lv) => this.listView = lv}
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        renderRow={this.renderRow}
                        style={{paddingHorizontal:10}}

                        renderFooter={this.myRenderFooter.bind(this)}
                        renderHeader={()=>this.myRenderHeader()}
                        onLayout={this._onListViewLayout}
                        enableEmptySections={true}

                        //renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                    />
                </View>
                <ApplyModal ref={e=>this.ApplyModal = e} onConfirm={this._sendApplyMessage}/>
                {this._PopupMenu()}
                </Image>
            </View>
        }else{
            return <View style={styles.chatListView}>
                <View {...this._panResponder.panHandlers} style={{...StyleSheet.absoluteFillObject}}>
                    <ListView
                        ref={(lv) => this.listView = lv}
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        renderRow={this.renderRow}
                        style={{paddingHorizontal:10}}

                        renderFooter={this.myRenderFooter.bind(this)}
                        renderHeader={()=>this.myRenderHeader()}
                        onLayout={this._onListViewLayout}
                        enableEmptySections={true}

                        //renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                    />
                </View>
                <ApplyModal ref={e=>this.ApplyModal = e} onConfirm={this._sendApplyMessage}/>
                {this._PopupMenu()}
            </View>
        }
    }

    render() {
        const {showInvertible}=this.state
        if(!showInvertible){
           return this.InShowInvertibleList();
        }else{
           return this.ShowInvertibleList();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
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