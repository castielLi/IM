
import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableHighlight,
    Dimensions,
    Switch,
    ListView,
    ScrollView
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import {bindActionCreators} from 'redux';
import ApplyFriendEnum from '../../../Core/Management/Common/dto/ApplyFriendEnum'
import  * as unReadMessageActions from '../../MainTabbar/reducer/action'
import ContactController from '../../../Logic/Contact/contactController';
import ApplyFriendController from '../../../Logic/ApplyFriend/applyFriendController';
let {height,width} = Dimensions.get('window');

let currentObj = undefined;
let contactController = undefined;
let applyFriendController = undefined;

class NewFriend extends AppComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        })
        this.state = {
            dataSource: ds,
            applyRecord:[],
        };
        currentObj = this;
        contactController = new ContactController();
        applyFriendController = new ApplyFriendController();
    }
    goToAddFriends = ()=>{
        this.route.push(this.props,{key: 'AddFriends',routeId: 'AddFriends',params:{}});
    }

    componentWillMount(){
        applyFriendController.setApplyFriendRecord(function(applyRecord) {
            currentObj.setState({
                applyRecord
            })
        })
    }

    acceptFriend = (data)=>{
        let {key} = data;
        let params = {key};
        this.showLoading();
        callback = (results) => {
            currentObj.hideLoading();
            if(results.success){
                console.log('接受好友申請成功')
            }else{
                console.log('接受好友申請失败')
            }
        }

        applyFriendController.acceptFriend(params,callback)

    }

    deleteApply = (index)=>{
        alert('删除好友申请')
    };

    applyMsgStyle = (rowID,rowData)=>{

        if(rowData.status === ApplyFriendEnum.WAIT){
            return (
                <TouchableHighlight
                    underlayColor="#1FB579"
                    onPress={()=>{this.acceptFriend(rowData)}}
                    style={styles.btnBox}>
                    <View style={styles.btnView}>
                        <Text style={styles.btnText}>接受</Text>
                    </View>
                </TouchableHighlight>
            )
        }
        else if (rowData.status === ApplyFriendEnum.ADDED){
            return <Text style={styles.arrow}>{'已添加'}</Text>
        }
        else{
           return <Text style={styles.arrow}>{'已过期'}</Text>
        }
    }

    _renderAvator= (path)=>{
        if(path && path !== ' '){
            return 	<Image style = {styles.headPic} source = {{uri:path}}/>
        }else{
            return 	<Image style = {styles.headPic} source = {require('../resource/avator.jpg')}/>
        }
    }
    _renderRow = (rowData, sectionID, rowID)=>{
        return(
            <View>
                {/*<Swipeout*/}
                    {/*right = {*/}
                        {/*[{*/}
                            {/*text:'删除',*/}
                            {/*type:'delete',*/}
                            {/*onPress:()=>{this.deleteApply(rowID)}*/}
                        {/*}]*/}
                    {/*}*/}
                    {/*rowID = {rowID}*/}
                    {/*sectionID = {sectionID}*/}
                    {/*close = {!(this.state.sectionID === sectionID && this.state.rowID === rowID)}*/}
                    {/*onOpen={(sectionID, rowID) => {*/}
                        {/*this.setState({*/}
                            {/*sectionID:sectionID,*/}
                            {/*rowID:rowID,*/}
                        {/*})*/}
                    {/*}}*/}
                    {/*autoClose={true}*/}
                {/*>*/}

                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')}>
                        <View  style={styles.itemBox}>
                            <View style={styles.basicBox}>
                                {this._renderAvator(rowData.avator)}
                                <View style={styles.basicBoxRight}>
                                    <Text style={styles.name}>{rowData.nick}</Text>
                                    <Text style={styles.description} ellipsizeMode='tail' numberOfLines={1}>{rowData.comment}</Text>
                                </View>
                            </View>
                            {this.applyMsgStyle(rowID,rowData)}
                        </View>
                    </TouchableHighlight>
                {/*</Swipeout>*/}
            </View>
        )
    };

    render() {
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'通讯录'}}
                    heading={"新的朋友"}
                    right={{func:()=>{this.goToAddFriends()},text:'添加朋友'}}
                />
                <ScrollView>
                    <View style={styles.listHeaderBox}>
                        <TextInput
                            style={styles.search}
                            underlineColorAndroid = 'transparent'
                        >
                        </TextInput>
                    </View>
                    <ListView
                        dataSource = {this.state.dataSource.cloneWithRows(this.state.applyRecord)}
                        renderRow = {this._renderRow}
                        enableEmptySections = {true}
                        removeClippedSubviews={false}
                    >
                    </ListView>

                </ScrollView>
                <Loading ref = { loading => this.loading = loading}/>
            </View>
            )
            
    }

    componentWillUnmount(){
        applyFriendController.outApplyFriendPage()
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',

    },
    back:{
        flexDirection:'row',
        flex:1,
        marginLeft: 10,
    },
    rightButton:{
        color: '#ffffff',
        fontSize: 15,
        marginRight: 10,
        textAlignVertical:'center',
    },

    listHeaderBox:{
        backgroundColor: '#ddd',
        alignItems: 'center',
        height:50,
        padding:10
    },
    search:{
        flex:1,
        width:width-20,
        backgroundColor:'#fff',
        borderRadius:5,
        color:'#000'
    },
    itemBox:{
        height:60,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    basicBox:{
        flexDirection:'row',
    },
    basicBoxRight:{
        marginLeft:15,
    },
    headPic:{
        height:40,
        width:40
    },
    name:{
        fontSize:15,
        color:'#000'
    },
    description:{
        fontSize:12,
        color:'#aaa',
        width:width-200,
    },
    arrow:{
        fontSize:15,
        color:'#aaa'
    },
    btnBox:{
        backgroundColor:'#1fd094',
        width:50,
        height:30,
        borderRadius:8,
    },
    btnView:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    btnText:{
        color:'#ffffff',
        fontSize:14,
    },
});


const mapStateToProps = state => ({
    accountName:state.loginStore.accountMessage.Nickname,
    accountId:state.loginStore.accountMessage.Account
});

const mapDispatchToProps = dispatch => ({
    //...bindActionCreators(friendApplicationActions, dispatch),
    ...bindActionCreators(unReadMessageActions, dispatch),

});

 export default connect(mapStateToProps, mapDispatchToProps)(NewFriend);