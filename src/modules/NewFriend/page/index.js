
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
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../../Core/Component/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeout from 'react-native-swipeout';
import IM from '../../../Core/IM';
import User from '../../../Core/User';
import {bindActionCreators} from 'redux';
import * as friendApplicationActions from '../../../Core/IM/redux/applyFriend/action'
import * as relationActions from '../../Contacts/reducer/action';

import {addAddFriendMessage} from '../../../Core/IM/action/createMessage';

let {height,width} = Dimensions.get('window');

let currentObj = undefined;
let im = new IM();
let user = new User();
class NewFriend extends ContainerComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        })
        this.im = new IM();
        this.state = {
            dataSource: ds,
            dataObj:{},
            idS:this.getIdSfromApplyStore(props.friendApplicationStore.applicationRecord)
        };
        this.applyData = [];
        currentObj = this;
    }
    goToAddFriends = ()=>{
        this.route.push(this.props,{key: 'AddFriends',routeId: 'AddFriends',params:{}});
    }

    componentWillMount(){
        // this.im.getAllApplyFriendMessage(function(result){
        //
        //     this.applyData = result;
        //     this.sqlData = result;
        //
        // })
    }


    // componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         dataSource:this.state.dataSource.cloneWithRows(nextProps.friendApplicationStore.applicationRecord)
    //     })
    // }

    agreeApply = (index,data)=>{
        let {key,send} = data;
        this.showLoading();
        this.fetchData('POST','Member/AcceptFriend',function (result) {
            currentObj.hideLoading();
            if(result.success){
                // let addMessage = addAddFriendMessage({comment:currentObj.props.accountName,key},currentObj.props.accountId,send);
                // im.addMessage(addMessage,function(){
                //添加到relationStore
                    let {Account,HeadImageUrl,Nickname,Email} = result.data.Data;
                    let relationObj = {RelationId:Account,avator:HeadImageUrl,Nick:Nickname,Type:'private',OtherComment:'',Remark:'',Email,owner:'',BlackList:'false',show:'true'}
                    currentObj.props.addRelation(relationObj);
                    //添加到数据库
                    user.AddNewRelation(relationObj)
                    //修改friendMessage状态
                    im.updateApplyFriendMessage({"status":ApplyFriendEnum.ADDED,"key":data.key})
                    currentObj.props.acceptFriendApplication(data.key);

                // });
            }else{
                alert(result.errorMessage);
                return;
            }
        },{
            key
        })
    };
    deleteApply = (index)=>{
        alert('删除好友申请')
        //this.props.deleteFriendApplication(index)
    };

    applyMsgStyle = (rowID,rowData)=>{

        if(rowData.status === ApplyFriendEnum.WAIT){
            return (
                <TouchableHighlight
                    underlayColor="#1FB579"
                    onPress={()=>{this.agreeApply(rowID,rowData)}}
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
        let {dataObj} = this.state;
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
                                {this._renderAvator(dataObj[rowData.send]?dataObj[rowData.send].avator:'')}
                                <View style={styles.basicBoxRight}>
                                    <Text style={styles.name}>{dataObj[rowData.send]?dataObj[rowData.send].Nick:''}</Text>
                                    <Text style={styles.description} ellipsizeMode='tail' numberOfLines={1}>{rowData.comment}</Text>
                                </View>
                            </View>
                            {this.applyMsgStyle(rowID,rowData)}
                        </View>
                    </TouchableHighlight>
                {/*</Swipeout>*/}
            </View>
        )
    }
    getIdSfromApplyStore = (applyList)=>{
        let needArr = applyList.map((v,i)=>{
            return v.send;
        })
        return needArr;
    }
    formateArrToObj = (arr)=>{
        let needObj = {};
        arr.forEach((v,i)=>{
            needObj[v.RelationId] = v;
        })
        return needObj;
    }

    componentDidMount(){

        user.GetRelationsByRelationIds(this.state.idS,(realations)=>{
            let needObj = this.formateArrToObj(realations);
            this.setState({
                dataObj:needObj
            })
        })
    }
    componentWillReceiveProps(newProps){
            this.state.idS = this.getIdSfromApplyStore(newProps.friendApplicationStore.applicationRecord)
            user.GetRelationsByRelationIds(this.state.idS,(realations)=>{
                let needObj = this.formateArrToObj(realations);
                this.setState({
                    dataObj:needObj
                })
            })

    }
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
                        dataSource = {this.state.dataSource.cloneWithRows(this.props.friendApplicationStore.applicationRecord)}
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
    friendApplicationStore : state.friendApplicationStore,
    accountName:state.loginStore.accountMessage.nick,
    accountId:state.loginStore.accountMessage.accountId
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(friendApplicationActions, dispatch),
    ...bindActionCreators(relationActions, dispatch),

});

 export default connect(mapStateToProps, mapDispatchToProps)(NewFriend);