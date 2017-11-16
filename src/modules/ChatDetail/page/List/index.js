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
import * as commonActions from '../../../../Core/Redux/chat/action';
import ChatMessage from './ChatMessage';

import InvertibleScrollView from 'react-native-invertible-scroll-view';
import {ListConst} from './typeConfig/index';
import InitChatRecordConfig from '../../../../Core/Redux/chat/InitChatRecordConfig';
import Ces from './ces';
import IM from '../../../../Core/IM';
import * as DtoMethods from '../../../../Core/IM/dto/Common'
import Player from './player'
import User from '../../../../Core/User'


let _listHeight = 0; //list显示高度
let _footerY = 0; //foot距离顶部距离
let scrollDistance = 0;//滚动距离

let _MaxListHeight = 0; //记录最大list高度

let FooterLayout = false;
let ListLayout = false;

let {width, height} = Dimensions.get('window');
let firstOldMsg;
let recordData;

let user = new User();


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
        this.isTime = false;
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

    componentWillReceiveProps(newProps){
        let newData = newProps.chatRecordStore.concat();
        if(this.firstLoad && newData.length < InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
            this.noMore = ListConst.msgState.NOMORE;
            this.firstLoad = false;
        }
        else if (this.firstLoad){
            this.firstLoad = false;
        }

        if(newData.length === InitChatRecordConfig.INIT_CHAT_REDUX_NUMBER){
            if(recordData && newData[newData.length-1].message.MSGID !== recordData.message.MSGID){
                this.historyData.push(recordData);
                this.historyData2.unshift(recordData);
            }
            recordData = newData[newData.length-1];
        }

        this.reduxData = newData.concat().reverse();
        this.shortData = this.historyData.concat(this.reduxData);
        this.data = this.prepareMessages(this.shortData);

        this.reduxData2 = newData;
        this.shortData2 =  this.reduxData2.concat(this.historyData2);
        this.data2 = this.prepareMessages(this.shortData2);

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.data.blob, this.data.keys),
            dataSourceO: this.state.dataSourceO.cloneWithRows(this.data2.blob, this.data2.keys),
        });
    }

    componentWillMount() {
        this.im = new IM()
        let currentObj = this;
        //当是群组消息的时候，向cache里面初始化所有的成员信息
        console.log(this.state.groupMembers)
        if(this.props.type == "chatroom"){
            user.getInformationByIdandType(this.props.client,"chatroom",function(group,groupMembers){
                currentObj.setState({
                    groupMembers,
                })
            });
        }


        let chatRecordStore = this.props.chatRecordStore.concat();
        let {isMore} = this.state;

        if(!chatRecordStore.length){
            return;
        }
        else if(this.firstLoad && chatRecordStore.length < InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
            this.noMore = ListConst.msgState.NOMORE;
            this.firstLoad = false;
        }
        else{
            chatRecordStore = chatRecordStore.slice(0,InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER);
            this.firstLoad = false;
        }

        this.reduxData = chatRecordStore.concat().reverse()
        this.shortData = this.historyData.concat(this.reduxData);
        this.data = this.prepareMessages(this.shortData);

        this.reduxData2 = chatRecordStore;
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
                if(e.nativeEvent.pageY>this.move && this.noMore === msgState.END && !this.state.showInvertible)
                {
                    this.noMore = msgState.LOADING;
                    this.setState({
                        isMore : ListConst.msgState.LOADING,
                    })
                    let dataLength = this.shortData.length;
                    let {client} = this.props;
                    let that = this;
                    setTimeout(()=>{
                        this.im.getRecentChatRecode(client,this.props.type,{start:dataLength,limit:InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER},function (messages) {

                            if(!messages){
                                that.noMore  = msgState.NOMORE;
                                that.setState({
                                    isMore:that.noMore,
                                });
                                return;
                            }
                            let msgLength = messages.length;

                            if(msgLength === InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
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
            if((LocalTime - prevTime) > 180000){
                timer = new Date(LocalTime);
            }
            return timer;
        }
        else{
            let prevTime;
            let index = this.data.blob[rowid].index;
            this.shortData[index-1] ?
                prevTime = parseInt(this.shortData[index-1].message.Data.LocalTime) : prevTime = 0;
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

    getGroupMembersInfo = (MemberID)=>{
        let Members = this.state.groupMembers;
        let MembersLength = Members.length;
        for(let i=0;i<MembersLength;i++){
            if(Members[i].RelationId == MemberID)
            {
                return <Text style={{fontSize:12,color:'#666',marginLeft:10,marginBottom:3}}>{Members[i].Nick}</Text>
            }
        }
        return <Text style={{fontSize:12,color:'#666',marginLeft:10,marginBottom:3}}>{MemberID}</Text>
    }
    renderRow = (row,sid,rowid) => {
        console.log('执行了renderRow');
        let {Sender} = row.message.Data.Data;
        let {Receiver} = row.message.Data.Data;
        let {Data} = row.message.Data.Data;
        let LocalTime = parseInt(row.message.Data.LocalTime);

        let timer = this.getTimestamp(LocalTime,rowid);
        if(Sender == this.props.accountId){

         //显示邀请群组人员消息
         if(row.message.Command * 1 == 101 && this.props.type == "chatroom"){
                return(
                    <View key={rowid} style={[styles.informView,{marginHorizontal:40,alignItems:'center',marginBottom:10}]}>
                        <View style={{backgroundColor:'#cfcfcf',flexDirection:'row',flexWrap:'wrap',justifyContent:'center',padding:5,borderRadius:5,marginTop:5}}>
                            <Text style={[styles.informText,{fontSize:12,textAlign:'left',color:"white"}]}>{"你邀请"+ Data +"进入群聊"}</Text>
                        </View>
                    </View>
                )
         }else{
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
                         <ChatMessage style={styles.bubbleViewRight} rowData={row} type={this.props.type}/>
                         {this.props.myAvator&&this.props.myAvator!==''?<Image source={{uri:this.props.myAvator}} style={styles.userImage}/>:<Image source={require('../../resource/avator.jpg')} style={styles.userImage}/>}

                     </View>
                 </View>
             )
         }
        }
        else{
            if(row.message.Command * 1 == 5){
                return(
                    <View key={rowid} style={[styles.informView,{marginHorizontal:40,alignItems:'center',marginBottom:10}]}>
                        <View style={{backgroundColor:'#cfcfcf',flexDirection:'row',flexWrap:'wrap',justifyContent:'center',padding:5,borderRadius:5}}>
                            <Text style={[styles.informText,{fontSize:14,textAlign:'left'}]}>消息已经发出，但被对方拒收，</Text>
                            <TouchableOpacity onPress={()=>{this.applyFriend()}}>
                                <Text style={{color:'#1d4eb2'}}>发送朋友验证</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }else if(row.message.Command * 1 == 101){

                return(<View key={rowid} style={[styles.informView,{marginHorizontal:40,alignItems:'center',marginBottom:10}]}>
                    <View style={{backgroundColor:'#cfcfcf',flexDirection:'row',flexWrap:'wrap',justifyContent:'center',padding:5,borderRadius:5,marginTop:5}}>
                        <Text style={[styles.informText,{fontSize:12,textAlign:'left',color:"white"}]}>{Data}</Text>
                    </View>
                </View>)


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
                                {this.props.type === 'chatroom' ? this.getGroupMembersInfo(Receiver) : null}
                                <ChatMessage style={styles.bubbleView} rowData={row} type={this.props.type}/>
                            </View>
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
            this.noMore = msgState.LOADING;
            this.setState({
                isMore : msgState.LOADING
            })
            let dataLength = this.shortData2.length;
            let {client} = this.props;
            let that = this;
            setTimeout(()=>{
                this.im.getRecentChatRecode(client,this.props.type,{start:dataLength,limit:InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER},function (messages) {

                    if(!messages){
                        that.noMore  = msgState.NOMORE;
                        that.setState({
                            isMore:that.noMore,
                        });
                        return;
                    }
                    let msgLength = messages.length;

                    if(msgLength === InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
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
        console.log(this.state.groupMembers)
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
                        <Ces/>
                        <Player/>
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
                        <Ces/>
                        <Player/>
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
    chatRecordStore: state.chatRecordStore.ChatRecord[props.client],
    accountId:state.loginStore.accountMessage.accountId,
    myAvator:state.loginStore.accountMessage.avator,
    accountName:state.loginStore.accountMessage.nick
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch),
    ...bindActionCreators(commonActions,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps,null,{withRef : true})(Chat);
//通过connect连接后 父组件中ref取不到子组件 方法
// 需添加{withRef : true}配置 并在 父组件中设置 ref={e => this.chat = e.getWrappedInstance()}