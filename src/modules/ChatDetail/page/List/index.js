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
    PanResponder
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action';
import * as commonActions from '../../../../Core/IM/redux/action';
import ChatMessage from './ChatMessage';

import InvertibleScrollView from 'react-native-invertible-scroll-view';
import {ListConst} from './typeConfig/index';
import InitChatRecordConfig from '../../../../Core/IM/dto/InitChatRecordConfig';
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

class Chat extends Component {
    constructor(props){
        super(props)
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=> {
            return r1.message.MSGID !== r2.message.MSGID;
        }});

        this.data = [];
        this.data2 = [];
        this.shortData = [];
        this.shortData2 = [];
        this.historyData = [];
        this.reduxData = [];
        this.historyData2 = [];
        this.reduxData2 = [];

        this.state = {
            dataSource: ds,
            dataSourceO: ds,
            showInvertible:false,
            isRefreshing:0,

        };

    }

    componentWillReceiveProps(newProps){
        console.log(newProps,11111111111111111111111111111111111)
        let newData = newProps.chatRecordStore;
        console.log(newData,'22222222222222222222222222222222222222222222')

        this.reduxData = newData.concat().reverse()
        this.shortData = this.historyData.concat(this.reduxData);
        this.data = this.prepareMessages(this.shortData);

        this.reduxData2 = newData;
        this.shortData2 =  this.reduxData2.concat(this.historyData2);
        this.data2 = this.prepareMessages(this.shortData2);

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.data.blob, this.data.keys),
            dataSourceO: this.state.dataSourceO.cloneWithRows(this.data2.blob, this.data2.keys)
        });
    }

    // shouldComponentUpdate(nextProps,nextState) {
    //     // let newData = nextProps.chatRecordStore;
    //     // if(newData != this.props.chatRecordStore)
    //     // console.log(newData,11111111111111111111111111111111111)
    //     // this.data = newData;
    //     // this.data2 = this.prepareMessages(newData.concat().reverse());
    //     // this.setState({
    //     //     dataSource: this.state.dataSource.cloneWithRows(this.data),
    //     //     dataSourceO: this.state.dataSourceO.cloneWithRows(this.data2.blob, this.data2.keys)
    //     // });
    // }

    componentWillMount() {
        this.im = new IM()
        let {chatRecordStore} = this.props;
        let {isRefreshing} = this.state;
        if(!chatRecordStore){
            return;
        }
        else if(chatRecordStore.length < InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
            isRefreshing = ListConst.msgState.NOMORE;
        }
        else{
            chatRecordStore.pop();
        }

        this.reduxData = chatRecordStore.concat().reverse();
        this.shortData = this.reduxData;
        this.data = this.prepareMessages(this.shortData);

        this.reduxData2 = chatRecordStore;
        this.shortData2 = this.reduxData2;
        this.data2 = this.prepareMessages(this.shortData2);

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.data.blob, this.data.keys),
            dataSourceO: this.state.dataSourceO.cloneWithRows(this.data2.blob, this.data2.keys),
            isRefreshing,
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
                if(e.nativeEvent.pageY>this.move && this.state.isRefreshing == 0 && !this.state.showInvertible)
                {
                    this.setState({
                        isRefreshing : ListConst.msgState.LOADING,
                    })
                    let dataLength = this.shortData2.length;
                    console.log('加载')
                    let that = this;
                    setTimeout(()=>{
                        this.im.getRecentChatRecode("li","private",{start:dataLength,limit:InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER},function (messages) {
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

                            that.setState({
                                isRefreshing : ListConst.msgState.END,
                                dataSource: that.state.dataSource.cloneWithRows(that.data.blob, that.data.keys),
                                dataSourceO: that.state.dataSourceO.cloneWithRows(that.data2.blob, that.data2.keys),
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
            keys: messages.map(m => m.message.MSGID),
            blob: messages.reduce((o, m, i) => { //(previousValue, currentValue, currentIndex, array1)
                o[m.message.MSGID] = {
                    ...m,
                };
                return o;
            }, {})
        };
    }

    renderRow = (row,sid,rowid) => {
        console.log('执行了renderRow');
        let isSender = row.message.Data.Data.Sender;
        
        if(isSender == this.props.accountId){
            return(
                <View style={styles.itemViewRight}>
                    <ChatMessage rowData={row} userID={this.props.client}/>
                    <Image source={{uri:'https://ws1.sinaimg.cn/large/610dc034ly1fj78mpyvubj20u011idjg.jpg'}} style={styles.userImage}/>
                </View>
            )
        }
        else{
            return(
                <View style={styles.itemView}>
                    <Image source={{uri:'https://ws1.sinaimg.cn/large/610dc034ly1fj3w0emfcbj20u011iabm.jpg'}} style={styles.userImage}/>
                    <ChatMessage rowData={row} userID={this.props.client}/>
                </View>
            )
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
        let {msgState} = ListConst;
        if(this.state.isRefreshing === msgState.END){
            this.setState({
                isRefreshing : msgState.LOADING
            })
            let dataLength = this.shortData2.length;
            let that = this;
            setTimeout(()=>{
                this.im.getRecentChatRecode("li","private",{start:dataLength,limit:InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER},function (messages) {

                    let msgLength = messages.length;
                    messages.pop();
                    let msg = messages.map((message)=>{
                        return DtoMethods.sqlMessageToMessage(message);
                    })

                    that.historyData2 = that.historyData2.concat(msg);
                    that.shortData2 = that.reduxData2.concat(that.historyData2)
                    that.data2 = that.prepareMessages(that.shortData2);

                    that.setState({
                        dataSourceO: that.state.dataSourceO.cloneWithRows(that.data2.blob, that.data2.keys)
                    },()=>{
                        if(msgLength < InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER){
                            that.setState({
                                isRefreshing : msgState.NOMORE
                            })
                        }
                        else{
                            that.setState({
                                isRefreshing : msgState.END
                            })
                        }
                    });
                })
            },500)
        }

    }

    myRenderFooter(){
        //console.log('foot执行了')
        const {isRefreshing,showInvertible}=this.state;
        let {msgState} = ListConst;

        if(!showInvertible) {
            return <View
                onLayout={this._onFooterLayout}
            />
        }
        else{
            if(isRefreshing === msgState.LOADING){
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
            FooterLayout = event.nativeEvent.layout.y>_footerY;
            _footerY = event.nativeEvent.layout.y;
            this.scrollToBottom();
        }
    }

    scrollToBottom=()=> {
        const {showInvertible}=this.state
        if(FooterLayout === false &&ListLayout===false){
            return;
        }
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
            ListLayout = event.nativeEvent.layout.height!==_listHeight;
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
        let {isRefreshing}=this.state;
        let {msgState} = ListConst;
        if(isRefreshing === msgState.LOADING){
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
        //console.log('render执行了')
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
        backgroundColor:'#ddd',
        flex:1,
        overflow:'hidden',
    },
    itemView:{
        marginBottom:10,
        flexDirection:'row',
    },
    itemViewRight:{
        marginBottom:10,
        flexDirection:'row',
        justifyContent:'flex-end'
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
        maxWidth:width-150,
        padding:12,
        justifyContent:'center',
        borderRadius:5
    },
    bubbleViewRight:{
        alignSelf:'flex-start',
        marginRight:10,
        backgroundColor: '#98E165',
        maxWidth:width-150,
        padding:10,
        justifyContent:'center',
        borderRadius:5
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