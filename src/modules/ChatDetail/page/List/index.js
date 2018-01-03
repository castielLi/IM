/**
 * Created by Hsu. on 2017/8/29.
 */
import React, { Component } from 'react';
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
    TouchableWithoutFeedback,
    PanResponder,

} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action';

import ChatMessage from './ChatMessage';

import InvertibleScrollView from 'react-native-invertible-scroll-view';
import {ListConst} from './typeConfig/index';
import RNFS from 'react-native-fs';

let _listHeight = 0; //list显示高度
let _footerY = 0; //foot距离顶部距离
let scrollDistance = 0;//滚动距离

let _MaxListHeight = 0; //记录最大list高度

let FooterLayout = false;
let ListLayout = false;
let currentObj;

class Chat extends Component {
    constructor(props){
        super(props);
        this.state = {
            chatRecordStore:[]
        }
        currentObj = this;
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=> {
            if(r1.type === 'image' || r1.type === 'video'||r1.type === 'audio')
            {
                let r1Local = r1.message.localSource;
                let r2Local = r2.message.localSource;
                return r1Local !== r2Local || r1.messageId !== r2.messageId || r1.status !== r2.status;
            }
            return r1.messageId !== r2.messageId || r1.status !== r2.status;
        }});

        this.data = [];
        this.data2 = [];
        this.chatRecord = [];
        this.chatRecord2 = [];

        this.timestamp = 0;
        this.noMore = 0;

        this.state = {
            dataSource: ds,
            dataSourceO: ds,
            showInvertible:false,
            isMore:0,
            isShowModal:false,
            groupMembers:[],
        };

        this.renderRow = this.renderRow.bind(this);
    }

    _refreshUI(params){
        console.log(params.content);
        alert("component" + params.content);
    }


    onUpdataChatRecord(chatRecord,isMore){
        let {msgState} = ListConst;
        if(!chatRecord || !chatRecord.length) return;
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

    componentWillMount() {
        // imController.init(param);
        let {type,client} = this.props;
        let group;
        if(type === 'private'){
            group = false;
        }else{
            group = true;
        }
        imController.setCurrentConverse(client,group,this.onUpdataChatRecord,this.props.updateHeadName,this.props.updateDisplaySetting);

        if(!this.chatRecord.length){
            //this.props.addClient(client);
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
                    imController.getHistoryChatList(client,group);
                }
            },
        })
    }

    componentDidMount(){
        this.props.onRef(this)
    }

    prepareMessages(messages) {
        //console.log(messages)
        if(!messages || !messages.length) return;
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

    timeFormat = (time) => {
        if(time < 10){
            return '0'+time;
        }
        else{
            return time;
        }
    }

    timestampFormat = (time)=>{
        let nowTime = new Date();
        let Hours = this.timeFormat(time.getHours());
        let Minutes = this.timeFormat(time.getMinutes());

        if(time.toLocaleDateString() == nowTime.toLocaleDateString()){
            return Hours+':'+Minutes;
        }
        else{
            return time.getMonth()+1+'月'+time.getDate()+'日'+' '+Hours+':'+Minutes;
        }
    }

    getTimestamp = (LocalTime,rowid) =>{
        let timer = null;
        if(this.state.showInvertible){
            let prevTime;
            let index = this.data2.blob[rowid].index;
            this.chatRecord2[index+1] ?
                prevTime = parseInt(this.chatRecord2[index+1].sendTime) : prevTime = 0;
            if((LocalTime - prevTime) > 180000){
                timer = new Date(LocalTime);
            }
            return timer;
        }
        else{
            let prevTime;
            let index = this.data.blob[rowid].index;
            this.chatRecord[index-1] ?
                prevTime = parseInt(this.chatRecord[index-1].sendTime) : prevTime = 0;
            if((LocalTime - prevTime) > 180000){
                timer = new Date(LocalTime);
            }
            return timer;
        }
    }


    messagesStatus = (status)=>{
        if(status === 'WaitOpreator'){
            return (
                <ActivityIndicator
                    size="small"
                />
            )
        }
        else if(status === 'SendSuccess'){
            return null;
        }
        else{
            return (
                <Image source={require('../../resource/fail.png')} style={{width:20,height:20}}/>
            )
        }
    }
    renderModal() {
        return <Modal
            animationType='fade'
            transparent={true}
            onRequestClose={()=>{}}
            visible={this.state.isShowModal}
        >
            <View style={styles.validateModalBox}>
                <View style={styles.validateModal}>
                    <Text style={styles.modalTitle}>对方启用类好友验证</Text>
                    <Text style={styles.modalSubTitle}>你需要发送验证申请，对方通过后你才能添加其为好友</Text>
                    <TextInput style={styles.modalInput} underlineColorAndroid="transparent"></TextInput>
                    <View style={styles.modalButtonBox}>
                        <TouchableOpacity  style={{flex:1}} onPress={()=>{this.setState({isShowModal:false})}}>
                            <View style={styles.modalButton}>
                                <Text style={styles.modalButtonTxt}>取消</Text>

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1}}>
                            <View style={[styles.modalButton,{borderLeftWidth:1,borderColor:'#000'}]}>
                                <Text style={styles.modalButtonTxt}>发送</Text>

                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    }
    applyFriend = ()=>{
        this.setState({
            isShowModal:true
        })
    }

    renderRow = (row,sid,rowid) => {
        console.log('renderRow')
        let {sender,message,sendTime,type,status} = row;
        sendTime = parseInt(sendTime);

        let timer = this.getTimestamp(sendTime,rowid);
        if(type == 'info'){
            return (
                <View key={rowid} style={[styles.informView,{marginHorizontal:40,alignItems:'center',marginBottom:10}]}>
                    <View style={styles.timestampView}>
                        {timer ? <Text style={styles.timestamp}>{this.timestampFormat(timer)}</Text> : null}
                    </View>
                    <View style={{backgroundColor:'#cfcfcf',flexDirection:'row',flexWrap:'wrap',justifyContent:'center',padding:5,borderRadius:5,marginTop:5}}>
                        <Text style={[styles.informText,{fontSize:14,textAlign:'left',color:"white"}]}>{message}</Text>
                    </View>
                </View>
            )
        }
        else if(type == 'error'){
            return(
                <View key={rowid} style={[styles.informView,{marginHorizontal:40,alignItems:'center',marginBottom:10}]}>
                    <View style={styles.timestampView}>
                        {timer ? <Text style={styles.timestamp}>{this.timestampFormat(timer)}</Text> : null}
                    </View>
                    <View style={{backgroundColor:'#cfcfcf',flexDirection:'row',flexWrap:'wrap',justifyContent:'center',padding:5,borderRadius:5}}>
                        <Text style={[styles.informText,{fontSize:14,textAlign:'left',color:"white"}]}>{message}</Text>
                        {this.props.type === 'group'?null: <TouchableOpacity onPress={()=>{this.applyFriend()}}>
                            <Text style={{color:'#1d4eb2'}}>发送朋友验证</Text>
                        </TouchableOpacity>}
                    </View>
                </View>
            )
        }
        else if (sender.account == this.props.accountId){
            return(
                <View key={rowid} style={styles.itemViewRight}>
                    <View style={styles.timestampView}>
                        {timer ? <Text style={styles.timestamp}>{this.timestampFormat(timer)}</Text> : null}
                    </View>
                    <View style={styles.infoViewRight}>
                        <View style={styles.msgStatus}>
                            <TouchableOpacity>
                                {
                                    this.messagesStatus(status)
                                }
                            </TouchableOpacity>
                        </View>
                        <ChatMessage style={styles.bubbleViewRight} rowData={row} type={this.props.type} navigator={this.props.navigator}/>
                        {this.props.myAvator&&this.props.myAvator!==''?<Image source={{uri:this.props.myAvator}} style={styles.userImage}/>:<Image source={require('../../resource/avator.jpg')} style={styles.userImage}/>}

                    </View>
                </View>
            )
        }
        else{
            return(
                <View key={rowid} style={styles.itemView}>
                    <View style={styles.timestampView}>
                        {timer ? <Text style={styles.timestamp}>{this.timestampFormat(timer)}</Text> : null}
                    </View>
                    <View style={styles.infoView}>
                        {this.props.HeadImageUrl&&this.props.HeadImageUrl!==''?<Image source={{uri:this.props.HeadImageUrl}} style={styles.userImage}/>:<Image source={require('../../resource/avator.jpg')} style={styles.userImage}/>}
                        <View>
                            {this.props.type === 'group' ? <Text style={{fontSize:12,color:'#666',marginLeft:10,marginBottom:3}}>{sender.name}</Text> : null}
                            <ChatMessage style={styles.bubbleView} rowData={row} type={this.props.type} navigator={this.props.navigator}/>
                        </View>
                    </View>
                </View>
            )
        }
    }

    oldMsg = () => {
        let {type,client} = this.props;
        let group;
        if(type === 'private'){
            group = false;
        }else{
            group = true;
        }
        let {msgState} = ListConst;
        if(this.state.isMore === msgState.END){
            this.setState({
                isMore : msgState.LOADING
            });
            imController.getHistoryChatList(client,group);
        }
    }

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
    render() {
        const {showInvertible}=this.state
        if(!showInvertible){
            return (
                    <View style={styles.chatListView}>
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
                        {this.renderModal()}
                    </View>
            );
        }else{
            return(
                    <View style={styles.chatListView}>
                        <ListView
                            ref={(lv) => this.listView = lv}
                            dataSource={this.state.dataSourceO}
                            removeClippedSubviews={false}
                            renderRow={this.renderRow}
                            style={{paddingHorizontal:10}}
                            pageSize={10}

                            onEndReached={this.oldMsg}
                            onEndReachedThreshold={5}

                            renderFooter={this.myRenderFooter.bind(this)}
                            onLayout={this._onListViewLayout}

                            renderScrollComponent={props => <InvertibleScrollView ref={e => this._invertibleScrollViewRef = e} {...props} inverted />}
                        />
                        {this.renderModal()}
                    </View>
                )
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
        backgroundColor: '#98E165',
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
        height: 200,
        width: 400,
        backgroundColor: '#eee',
        borderRadius:10,
        alignItems:'center',
    },
    modalTitle:{
        color:'#000',
        fontSize:16,
        marginTop:10
    },
    modalSubTitle:{
        color:'#000',
        fontSize:12
    },
    modalInput:{
        width:300,
        height:40,
        borderColor:'#000',
        borderWidth:1,
        padding:0,
        paddingHorizontal:5,
        marginTop:30
    },
    modalButtonBox:{
        flex:1,
        height:50,
        flexDirection:'row',
        marginTop:30,
        borderTopWidth:1,
        borderColor:'#000',
    },
    modalButton:{
        flex:1,
        height:50,
        alignItems:'center',
        justifyContent:'center'
    },
    modalButtonTxt:{
        color:'#1d4eb2',
        fontSize:16
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