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
import * as commonActions from '../../../../Core/IM/redux/action';
import ChatMessage from './ChatMessage';

import InvertibleScrollView from 'react-native-invertible-scroll-view';
import {ListConst} from './typeConfig/index';
import InitChatRecordConfig from '../../../../Core/IM/redux/InitChatRecordConfig';
import Ces from './ces';
import IM from '../../../../Core/IM';
import * as DtoMethods from '../../../../Core/IM/dto/Common'


let _listHeight = 0; //list显示高度
let _footerY = 0; //foot距离顶部距离
let scrollDistance = 0;//滚动距离

let _MaxListHeight = 0; //记录最大list高度

let FooterLayout = false;
let ListLayout = false;

let {width, height} = Dimensions.get('window');
let firstOldMsg;


class Chat extends Component {
    constructor(props){
        super(props)
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=> {
            return r1.message.MSGID !== r2.message.MSGID || r1.status !== r2.status;
        }});

        this.data = [];
        this.data2 = [];
        this.shortData = [];
        this.shortData2 = [];
        this.historyData = [];
        this.reduxData = [];
        this.historyData2 = [];
        this.reduxData2 = [];

        this.firstLoad = true;
        this.timestamp = 0;
        this.noMore = 0;

        this.state = {
            dataSource: ds,
            dataSourceO: ds,
            showInvertible:false,
            isMore:0,
        };

    }

    componentWillUnmount(){
        alert(1)
    }
    componentWillReceiveProps(newProps){
        let newData = newProps.chatRecordStore.concat();
        if(this.firstLoad && newData.length < InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
            this.noMore = ListConst.msgState.NOMORE;
            this.firstLoad = false;
            this.reduxData = newData.concat().reverse()
            this.reduxData2 = newData;
        }
        else if(this.firstLoad){
            newData = newData.slice(0,-1);
            this.firstLoad = false;
            this.reduxData = newData.concat().reverse()
            this.reduxData2 = newData;
        }
        else if(!this.firstLoad){
            this.reduxData.push(newData[0]);
            this.reduxData2.shift(newData[0]);
        }


        this.shortData = this.historyData.concat(this.reduxData);
        this.data = this.prepareMessages(this.shortData);


        this.shortData2 =  this.reduxData2.concat(this.historyData2);
        this.data2 = this.prepareMessages(this.shortData2);

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.data.blob, this.data.keys),
            dataSourceO: this.state.dataSourceO.cloneWithRows(this.data2.blob, this.data2.keys),
        });
    }

    componentWillMount() {
        this.im = new IM()

        let chatRecordStore = this.props.chatRecordStore.concat();

        if(!chatRecordStore.length){
            return;
        }
        else if(this.firstLoad && chatRecordStore.length < InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
            this.noMore = ListConst.msgState.NOMORE;
            this.firstLoad = false;
        }
        else{
            chatRecordStore = chatRecordStore.slice(0,10);
            this.firstLoad = false;
        }

        this.reduxData = chatRecordStore.concat().reverse()
        this.reduxData2 = chatRecordStore;


        this.shortData = this.historyData.concat(this.reduxData);
        this.data = this.prepareMessages(this.shortData);

        this.shortData2 =  this.reduxData2.concat(this.historyData2);
        this.data2 = this.prepareMessages(this.shortData2);

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.data.blob, this.data.keys),
            dataSourceO: this.state.dataSourceO.cloneWithRows(this.data2.blob, this.data2.keys),
        });

        this._gestureHandlers = {
            onStartShouldSetResponder: () => true,  //对触摸进行响应
            onMoveShouldSetResponder: ()=> true,  //对滑动进行响应
            //激活时做的动作
            onResponderGrant: (e)=>{
                this.move = e.nativeEvent.pageY;
            },
            //移动时作出的动作
            onResponderMove: (e)=>{
                let {msgState} = ListConst;
                if(e.nativeEvent.pageY>this.move && this.state.isMore == msgState.END && !this.state.showInvertible)
                {
                    this.setState({
                        isMore : ListConst.msgState.LOADING,
                    })
                    let dataLength = this.shortData2.length;
                    let {client} = this.props;
                    let that = this;
                    setTimeout(()=>{
                        this.im.getRecentChatRecode(client,"private",{start:dataLength,limit:InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER},function (messages) {

                            let msgLength = messages.length;

                            if(msgLength == InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
                                messages.pop();
                            }

                            let msg = messages.map((message)=>{
                                return DtoMethods.sqlMessageToMessage(message);
                            });
                            let msg2 = msg.concat();

                            that.historyData = msg.reverse().concat(that.historyData);
                            that.shortData = that.historyData.concat(that.reduxData);
                            that.data = that.prepareMessages(that.shortData);

                            that.historyData2 = that.historyData2.concat(msg2);
                            that.shortData2 = that.reduxData2.concat(that.historyData2);
                            that.data2 = that.prepareMessages(that.shortData2);

                            if(msgLength < InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
                                that.noMore  = msgState.NOMORE;
                            }
                            else{
                                that.noMore  = msgState.END;
                            }

                            that.setState({
                                dataSource: that.state.dataSource.cloneWithRows(that.data.blob, that.data.keys),
                                dataSourceO: that.state.dataSourceO.cloneWithRows(that.data2.blob, that.data2.keys),
                                isMore:that.noMore,
                            })
                        })
                    },500)
                }
            },
        }
    }

    prepareMessages(messages) {
        //console.log(messages)
        return {
            keys: messages.map((m,i) => m.message.MSGID),
            blob: messages.reduce((o, m, i) => { //(previousValue, currentValue, currentIndex, array1)
                o[m.message.MSGID] = {
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
            this.shortData2[index+1] ?
                prevTime = parseInt(this.shortData2[index+1].message.Data.LocalTime) : prevTime = 0;
            console.log(this.shortData2,rowid,this.shortData2[index])
            if((LocalTime - prevTime) > 180000){
                timer = new Date(LocalTime);
            }
            return timer;
        }
        else{
            if((LocalTime - this.timestamp) > 180000){
                timer = new Date(LocalTime);
                this.timestamp = LocalTime;
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

    applyFriend = ()=>{

    }
    renderRow = (row,sid,rowid) => {
        console.log('执行了renderRow');
        let {Sender} = row.message.Data.Data;
        let LocalTime = parseInt(row.message.Data.LocalTime);

        let timer = this.getTimestamp(LocalTime,rowid);
        if(Sender == this.props.accountId){
            return(
                <View key={rowid} style={styles.itemViewRight}>
                    <View style={styles.timestampView}>
                        {timer ? <Text style={styles.timestamp}>{this.timestampFormat(timer)}</Text> : null}
                    </View>
                    <View style={styles.infoViewRight}>
                        <View style={styles.msgStatus}>
                            <TouchableOpacity>
                                {
                                    this.messagesStatus(row.status)
                                }
                            </TouchableOpacity>
                        </View>
                        <ChatMessage style={styles.bubbleViewRight} rowData={row}/>
                        <Image source={{uri:'https://ws1.sinaimg.cn/large/610dc034ly1fj78mpyvubj20u011idjg.jpg'}} style={styles.userImage}/>
                    </View>
                </View>
            )
        }
        else{
            if(row.message.Command !== 5){
                return(
                    <View key={rowid} style={styles.itemView}>
                        <View style={styles.timestampView}>
                            {timer ? <Text style={styles.timestamp}>{this.timestampFormat(timer)}</Text> : null}
                        </View>
                        <View style={styles.infoView}>
                            <Image source={{uri:'https://ws1.sinaimg.cn/large/610dc034ly1fj78mpyvubj20u011idjg.jpg'}} style={styles.userImage}/>
                            <ChatMessage style={styles.bubbleView} rowData={row}/>
                        </View>
                    </View>
                )
            }
            else{
                return(
                    <View key={rowid} style={[styles.informView,{marginHorizontal:40,alignItems:'center',marginBottom:10}]}>
                        <View style={{backgroundColor:'#cfcfcf',flexDirection:'row',flexWrap:'wrap',justifyContent:'center',padding:5}}>
                            <Text style={[styles.informText,{fontSize:14,textAlign:'left'}]}>消息已经发出，但被对方拒收</Text>
                            <TouchableOpacity onPress={()=>{this.applyFriend()}}>
                                <Text>发送朋友验证</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
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
    oldMsg = () => {
        //console.log('oldMsg');
        //alert(this.props.client+this.state.isMore)
        let {msgState} = ListConst;
        if(!firstOldMsg){
            return firstOldMsg = true;
        }
        if(this.noMore === msgState.END){

            this.setState({
                isMore : msgState.LOADING
            })
            let dataLength = this.shortData2.length;
            let {client} = this.props;
            let that = this;
            setTimeout(()=>{
                this.im.getRecentChatRecode(client,"private",{start:dataLength,limit:InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER},function (messages) {

                    let msgLength = messages.length;

                    if(msgLength == InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
                        messages.pop();
                    }
                    let msg = messages.map((message)=>{
                        return DtoMethods.sqlMessageToMessage(message);
                    });

                    that.historyData2 = that.historyData2.concat(msg);
                    that.shortData2 = that.reduxData2.concat(that.historyData2);
                    that.data2 = that.prepareMessages(that.shortData2);

                    if(msgLength < InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
                        that.noMore  = msgState.NOMORE;
                    }
                    else{
                        that.noMore  = msgState.END;
                    }

                    that.setState({
                        dataSourceO: that.state.dataSourceO.cloneWithRows(that.data2.blob, that.data2.keys),
                        isMore:that.noMore,
                    });
                })
            },500)
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

    //界面变化触发
    _onListViewLayout = (event) =>{
        const {showInvertible}=this.state
        if(!showInvertible){
            if(!_MaxListHeight){
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
        //、console.log('render执行了')
        const {showInvertible}=this.state
        if(!showInvertible){
            return (
                    <View style={styles.chatListView}>
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
                            {...this._gestureHandlers}
                        />
                        <Ces uri={this.state.imageUri} isShow={this.state.imageShow}/>
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
                        <Ces uri={this.state.imageUri} isShow={this.state.imageShow}/>
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
        marginVertical:10
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
    }
});

const mapStateToProps = (state,props) => ({
    chatRecordStore: state.chatRecordStore.ChatRecord[props.client],
    accountId:state.loginStore.accountMessage.accountId,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch),
    ...bindActionCreators(commonActions,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps,null,{withRef : true})(Chat);
//通过connect连接后 父组件中ref取不到子组件 方法
// 需添加{withRef : true}配置 并在 父组件中设置 ref={e => this.chat = e.getWrappedInstance()}