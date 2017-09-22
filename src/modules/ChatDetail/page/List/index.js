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
    TouchableWithoutFeedback
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action';
import * as commonActions from '../../../../Core/IM/redux/action'
import ChatMessage from './ChatMessage'

import InvertibleScrollView from 'react-native-invertible-scroll-view';
import {ListConst} from './typeConfig/index';
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
            // if (r1._id !== r2._id) {
            //     console.log("不相等");
            //     console.log(r1);
            //     console.log(r2);
            // } else {
            //     console.log("相等");
            //     console.log(r1);
            //     console.log(r2);
            // }
            return r1._id !== r2._id;
        }});

        this.data = [];
        this.data2 = [];
        this.shortData = [];

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
        //alert(newData.length)
        this.data = newData.concat().reverse();
        this.shortData = newData;
        this.data2 = this.prepareMessages(this.shortData);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.data),
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
        //this.fetchData();
        let {chatRecordStore} = this.props;
        let {isRefreshing} = this.state
        console.log(chatRecordStore,'11111111111111111111111111111111111')
        // let newData = chatRecordStore.ChatRecord.li;
        if(!chatRecordStore){
            return;
        }
        else if(chatRecordStore.length <11){
            isRefreshing = ListConst.msgState.NOMORE;
        }
        else{
            chatRecordStore.pop();
        }
        this.data = chatRecordStore.concat().reverse();
        this.shortData = chatRecordStore;
        this.data2 = this.prepareMessages(this.shortData);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.data),
            dataSourceO: this.state.dataSourceO.cloneWithRows(this.data2.blob, this.data2.keys),
            isRefreshing,
        });
    }

    prepareMessages(messages) {
        //console.log(messages)
        return {
            keys: messages.map(m => m.message.MSGID),
            blob: messages.reduce((o, m, i) => { //(previousValue, currentValue, currentIndex, array1)
                //console.log(o,m,i)
                //console.log(o)
                o[m.message.MSGID] = {
                    ...m,
                };
                //console.log(o)
                return o;
            }, {})
        };
    }

    ToCDB(str) {
        var tmp = "";
        for(var i=0;i<str.length;i++)
        {
            if(str.charCodeAt(i)>65248&&str.charCodeAt(i)<65375)
            {
                tmp += String.fromCharCode(str.charCodeAt(i)-65248);
            }
            else
            {
                tmp += String.fromCharCode(str.charCodeAt(i));
            }
        }
        return tmp
    }

    renderRow = (row,sid,rowid) => {
        console.log('执行了renderRow');
        let isSender = row.message.Data.Data.Sender;
        if(isSender == ''){
            return(
                <View style={styles.itemViewRight}>
                    <ChatMessage rowData={row}/>
                    <Image source={{uri:'https://ws1.sinaimg.cn/large/610dc034ly1fj78mpyvubj20u011idjg.jpg'}} style={styles.userImage}/>
                </View>
            )
        }
        else{
            return(
                <View style={styles.itemView}>
                    <Image source={{uri:'https://ws1.sinaimg.cn/large/610dc034ly1fj3w0emfcbj20u011iabm.jpg'}} style={styles.userImage}/>
                    <ChatMessage rowData={row}/>
                </View>
            )
        }
    }
    scrollToEnd = () => {
        if(this.state.showInvertible){
            if (this._invertibleScrollViewRef === null) { return }
            //console.log(this)
            this._invertibleScrollViewRef.scrollTo({
                y: 0,
                animated:false,
            });
        }
    }
    oldMsg = () => {
        //console.log('oldMsg');
        // this.changeType = 0;
        let {msgState} = ListConst;
        if(this.state.isRefreshing === msgState.END){
            this.setState({
                isRefreshing : msgState.LOADING
            })
            let dataLength = this.shortData.length;
            let that = this;
            setTimeout(()=>{
                this.im.getRecentChatRecode("li","private",{start:dataLength,limit:11},function (messages) {
                    //alert("消息记录为" + messages[0].status);
                    let msgLength = messages.length;
                    messages.pop();
                    let msg = messages.map((message)=>{
                        return DtoMethods.sqlMessageToMessage(message);
                    })

                    //console.l og(messages,msg)
                    //console.log(that.shortData)
                    that.shortData = that.shortData.concat(msg)
                    //console.log(that.shortData)
                    that.data2 = that.prepareMessages(that.shortData);
                    that.setState({
                        dataSourceO: that.state.dataSourceO.cloneWithRows(that.data2.blob, that.data2.keys)
                    },()=>{
                        if(msgLength <= 10){
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
        //console.log('_onFooterLayout')
        //alert(1)
        const {showInvertible}=this.state
        if(!showInvertible) {
            //console.log(1111111111111)
            FooterLayout = event.nativeEvent.layout.y>_footerY;
            _footerY = event.nativeEvent.layout.y;

            //console.log('FooterLayout:'+FooterLayout,'_footerY:'+_footerY)

            this.scrollToBottom();
            //alert(_footerY+'-'+_MaxListHeight)
        }
    }

    scrollToBottom=()=> {
        const {showInvertible}=this.state
        if(FooterLayout === false &&ListLayout===false){
            return;
        }
        FooterLayout = false
        ListLayout=false
        if(_footerY>_MaxListHeight&&_MaxListHeight!==0&&!showInvertible){
                this.setState({
                    showInvertible:true
                })
                return;
        }
        if (_listHeight && _footerY && _footerY > _listHeight) {
            scrollDistance = _listHeight - _footerY;
            this.listView.scrollTo({
                y: -scrollDistance,
                x: 0,
                animated:false,
            });
        }
    }

    //界面变化触发
    _onListViewLayout = (event) =>{
        // console.log(_listHeight)
        //alert(2)
        const {showInvertible}=this.state
        if(!showInvertible){
            if(!_MaxListHeight){
                _MaxListHeight = event.nativeEvent.layout.height;

                //alert(_MaxListHeight)
            }

            ListLayout = event.nativeEvent.layout.height!==_listHeight;
            //alert(ListLayout)
            _listHeight = event.nativeEvent.layout.height;

            //console.log('_MaxListHeight:'+_MaxListHeight,'ListLayout:'+ListLayout,'_listHeight:'+_listHeight)
            this.scrollToBottom();
        }else {
            this.listView.scrollTo({
                y: 0,
                x: 0,
                animated:true,
            });
        }
    }

    render() {
        //console.log('render执行了')
        const {showInvertible}=this.state
        if(!showInvertible){
            return (
                    <View style={styles.chatListView} click={()=>this.push()}>
                        <ListView
                            ref={(lv) => this.listView = lv}
                            dataSource={this.state.dataSource}
                            removeClippedSubviews={false}
                            renderRow={this.renderRow}
                            style={{paddingHorizontal:10}}

                            renderFooter={this.myRenderFooter.bind(this)}
                            onLayout={this._onListViewLayout}
                            enableEmptySections={true}

                            //renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
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
        borderRadius:40,
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
    chatRecordStore: state.chatRecordStore.ChatRecord[props.client]
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch),
    ...bindActionCreators(commonActions,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps,null,{withRef : true})(Chat);
//通过connect连接后 父组件中ref取不到子组件 方法
// 需添加{withRef : true}配置 并在 父组件中设置 ref={e => this.chat = e.getWrappedInstance()}