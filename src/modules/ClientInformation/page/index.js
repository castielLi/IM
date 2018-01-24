
import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    TouchableHighlight,
    Dimensions
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';

import {bindActionCreators} from 'redux';

import UserController from '../../../TSController/UserController';
import ApplyController from '../../../TSController/ApplyController';
let userController = undefined;
let applyController = undefined;

let {height,width} = Dimensions.get('window');
let currentObj;
let currentAccount = undefined;

class ClientInformation extends AppComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        this.state = {
            userInfo:{},
            isFriend:false,
            oneself:false,
        };
        currentObj = this;

        userController =  UserController.getSingleInstance();
        applyController =  ApplyController.getSingleInstance();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    componentDidMount() {
        //todo:更新问题  什么时候更新用户信息
        currentAccount = userController.getCurrentAccount();
        if(currentAccount.Account == this.props.clientId){
            this.setState({
                oneself:true,
                isFriend:false,
                userInfo:currentAccount
            })
        }else{
            userController.getUserInfo(this.props.clientId,false,(result)=>{
                let isFriend = result.Friend ? true : false;
                this.setState({
                    userInfo:result,
                    isFriend,
                    oneself:false
                })
            });
        }
    }


    //定义上导航的左按钮
    _leftButton() {
        return  <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>this.route.pop(this.props)}>
            <View style={styles.back}>

                <Icon name="angle-left" size={30} color="#fff" style={{textAlignVertical:'center',marginRight:8}}/>

                <Text style={{fontSize:16,textAlignVertical:'center',color:'#fff'}}>{'通讯录'}</Text>
            </View>
        </TouchableOpacity>
    }
    //定义上导航的标题
    _title() {
        return {
            title: "详细资料",
            tintColor:'#fff',
        }
    }
    goToInformationSetting= ()=>{
        this.route.push(this.props,{key:'InformationSetting',routeId:'InformationSetting',params:{clientId:this.state.userInfo.Account,type:'pravite'}});
    }

    _rightButton() {
        return  <TouchableOpacity style={{justifyContent:'center'}} onPress={this.goToInformationSetting}>
            <Icon name="ellipsis-h" size={20} color="#fff" style={{marginRight:10,textAlignVertical:'center'}}/>

        </TouchableOpacity>
    }
    goToChatDetail = ()=>{
        this.route.push(this.props,{key:'ChatDetail',routeId:'ChatDetail',params:{client:this.state.userInfo.Account,type:'private',HeadImageUrl:this.state.userInfo.HeadImageUrl,Nick:this.state.userInfo.Nickname}});
    }


    //todo:双方添加好友 验证页面
    addFriend = (Applicant,Respondent)=>{
        applyController.applyFriend(Applicant,Respondent,(result)=>{
            if(result && result.Result === 1){
                if(result.Data instanceof Object){
                    this.setState({
                        isFriend:true
                    })
                }else if(typeof result.Data === 'string'){
                    currentObj.route.push(currentObj.props,{key:'Validate',routeId:'Validate',params:{userInfo:this.state.userInfo}})
                }
            }else{
                currentObj.alert('发送好友申请失败');
            }
        });
    }
    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        let {Nickname,Account,HeadImageUrl} = this.state.userInfo;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    heading={"详细资料"}
                    left={{func:()=>{this.route.pop(this.props)},text:'通讯录'}}
                    right={[{func:()=>{this.goToInformationSetting()},icon:this.state.isFriend ?'ellipsis-h':''}]}
                />
                <View>
                    <View style={styles.basicBox}>
                        {HeadImageUrl!=''?<Image style={styles.headPic} source={{uri:HeadImageUrl}}/>:<Image style={styles.headPic} source={require('../resource/avator.jpg')}/>}
                        <View style={styles.basicBoxRight}>
                            <Text style={styles.name}>{Nickname}</Text>
                            <Text style={styles.id}>{'微信号：'+Account}</Text>
                        </View>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>设置备注和标签</Text>
                            {/*<Text style={styles.arrow}>{'>'}</Text>*/}
                            <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                        </View>
                    </TouchableHighlight>
                    <View  style={styles.placeBox}>
                        <Text style={styles.address}>地区</Text>
                        <Text style={styles.place}>重庆 大渡口</Text>
                    </View>
                    {this.state.isFriend ? <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('相册')}>
                        <View  style={styles.photoBox}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={styles.address}>个人相册</Text>
                                <View style={styles.photos}>
                                    <Image style={styles.photo} source={require('../resource/other.jpg')}></Image>
                                    <Image style={styles.photo} source={require('../resource/other.jpg')}></Image>
                                    <Image style={styles.photo} source={require('../resource/other.jpg')}></Image>
                                    <Image style={styles.photo} source={require('../resource/other.jpg')}></Image>

                                </View>
                            </View>
                            {/*<Text style={styles.arrow}>{'>'}</Text>*/}
                            <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                        </View>
                    </TouchableHighlight> : null}
                    {this.state.isFriend ? <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('更多')}>
                        <View  style={[styles.remarksBox,{marginTop:0}]}>
                            <Text style={styles.remarks}>更多</Text>
                            {/*<Text style={styles.arrow}>{'>'}</Text>*/}
                            <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                        </View>
                    </TouchableHighlight> : null}
                    {this.state.isFriend && !this.state.oneself ? <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.goToChatDetail} style={styles.sendMessageBox}>
                        <Text style={styles.sendMessage}>发消息</Text>
                    </TouchableHighlight>: null}
                    {this.state.isFriend || this.state.oneself ? null : <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{this.addFriend(currentAccount.Account,Account)}} style={styles.sendMessageBox}>
                        <Text style={styles.sendMessage}>添加到通讯录</Text>
                    </TouchableHighlight>}


                </View>
                <Popup ref={ popup => this.popup = popup}/>
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
        alignItems:'center',
        flex:1,
        marginLeft: 10,
    },
    rightButton:{
        color: '#ffffff',
        fontSize: 15,
        marginRight: 10,
        textAlignVertical:'center',
    },
    basicBox:{
        marginTop:15,
        height:100,
        paddingVertical:10,
        paddingHorizontal:15,
        backgroundColor:'#fff',
        flexDirection:'row'
    },
    headPic:{
        height:80,
        width:80,
        borderRadius:8,
        //resizeMode:'stretch'
    },
    basicBoxRight:{
        marginLeft:15,
        marginTop:5
    },
    name:{
        fontSize:15,
        color:'#000'
    },
    id:{
        fontSize:12,
        color:'#aaa'
    },
    remarksBox:{
        height:40,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    remarks:{
        fontSize:14,
        color:'#000'
    },
    arrow:{
        fontSize:14,
        color:'#aaa'
    },
    placeBox:{
        marginTop:15,
        height:40,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#eee'
    },
    address:{
        fontSize:14,
        color:'#000',
        width:80
    },
    place:{
        fontSize:14,
        color:'#000'
    },
    photoBox:{
        height:100,
        padding:15,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#eee',
        justifyContent:'space-between'
    },
    photos:{
        flexDirection:'row',
    },
    photo:{
        width:50,
        height:50,
        marginRight:8
    },
    sendMessageBox:{
        height:50,
        borderRadius:5,
        marginTop:15,
        marginHorizontal:20,
        backgroundColor:'#009600',
        justifyContent:'center',
        alignItems:'center'
    },
    sendMessage:{
        textAlignVertical:'center',
        color:'#fff',
        fontSize:20,
    }
});


const mapStateToProps = state => ({
    loginStore : state.loginStore.accountMessage,
});

const mapDispatchToProps = dispatch => ({

});

 export default connect(mapStateToProps, mapDispatchToProps)(ClientInformation);
