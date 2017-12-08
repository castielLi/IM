
import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    TouchableHighlight,
    Dimensions
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';

import * as relationActions from '../../../Core/Redux/contact/action';
import {bindActionCreators} from 'redux';

import SettingController from '../../../Logic/Setting/SettingController'
import ContactController from '../../../Logic/Contact/contactController'



let contactController = new ContactController();
let settingController = new SettingController();

let {height,width} = Dimensions.get('window');
let currentObj;

class ClientInformation extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.state = {
                Account:'',
                Nickname:'',
                PhoneNumber:'',
                HeadImageUrl:'',
                isRenderSendMessage:false//针对单方面添加好友，直接显示发送消息
        }
        currentObj = this;
    }

    // isUpdateFriendInfo = (UserInfo,propsRelation) =>{
    //     let isUpdate;
    //     let _network = new netWorking();
    //     let {accountId} = this.props.loginStore;
    //     let avatorName = HeadImageUrl.substr(HeadImageUrl.lastIndexOf('/')+1);
    //     let toFile = `${RNFS.DocumentDirectoryPath}/${accountId}/image/avator/${new Date().getTime()}.jpg`;
    //
    //     if(propsRelation.Nick !== UserInfo.Nickname || _Relation.OtherComment !== UserInfo.Gender || _Relation.Email !== UserInfo.Email){
    //         propsRelation.Nick = UserInfo.Nickname;
    //         propsRelation.OtherComment = UserInfo.Gender;
    //         propsRelation.Email = UserInfo.Email;
    //         isUpdate = true;
    //     }
    //     updateImage = (result) => {
    //         console.log('下载成功,对数据库进行更改')
    //         //LocalImage = toFile;
    //         if(propsRelation.LocalImage){
    //             RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${accountId}/image/avator/${propsRelation.LocalImage}`).then(()=>{console.log('旧头像删除成功')}).catch(()=>{console.log('旧图片删除失败')})
    //         }
    //         //todo:缺少数据库操作
    //     };
    //     if(UserInfo.HeadImageUrl&&propsRelation.avator !== UserInfo.HeadImageUrl){
    //         propsRelation.avator = UserInfo.HeadImageUrl;
    //         isUpdate = true;
    //         _network.methodDownload(UserInfo.HeadImageUrl,toFile,updateImage)
    //     }
    //
    //     if(isUpdate){
    //         user.updateRelation(_Relation)
    //     }
    // }
    isUpdateFriendInfo = (UserInfo,propsRelation) =>{
        let {accountId} = this.props.loginStore;
        contactController.UpdateFriendInfo(accountId,UserInfo,propsRelation)
    }
    componentDidMount() {

        if(this.props.hasRelation){
            let needRelation = currentObj.props.Relation;

            let accountId = currentObj.props.Relation.RelationId;
            this.showLoading()

            let params = {"Account":accountId}
            settingController.getFriendUserInfo(params,(results)=>{
                currentObj.hideLoading();
                if(!results.success){
                    alert(result.errorMessage);
                    return;
                }
                if(results.data.Data){
                    let {Account,Nickname,PhoneNumber,HeadImageUrl} = results.data.Data;
                    currentObj.setState({
                        Account,
                        Nickname,
                        PhoneNumber,
                        HeadImageUrl
                    })
                    currentObj.isUpdateFriendInfo(results.data.Data,needRelation);
                }
            })
        }else{

            let {Account,Nickname,PhoneNumber,HeadImageUrl} = currentObj.props.Relation;
            currentObj.setState({
                Account,
                Nickname,
                PhoneNumber,
                HeadImageUrl
            })
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
        this.route.push(this.props,{key:'InformationSetting',routeId:'InformationSetting',params:{client:this.state.Account,type:'pravite'}});
    }

    _rightButton() {
        return  <TouchableOpacity style={{justifyContent:'center'}} onPress={this.goToInformationSetting}>
            <Icon name="ellipsis-h" size={20} color="#fff" style={{marginRight:10,textAlignVertical:'center'}}/>

        </TouchableOpacity>
    }
    goToChatDetail = ()=>{
        this.route.push(this.props,{key:'ChatDetail',routeId:'ChatDetail',params:{client:this.state.Account,type:'private',HeadImageUrl:this.state.HeadImageUrl,Nick:this.state.Nickname}});
    }

    addFriend = (Respondent)=>{
        let Applicant = this.props.loginStore.accountId;
        currentObj.showLoading()


        let params = {Applicant,Respondent};
        contactController.applyFriend(params,(result)=>{
            currentObj.hideLoading()
            if(!result.success){
                alert(result.errorMessage);
                return;
            }
            //单方面添加好友
            if(result.success && result.data.Data instanceof Object){
                currentObj.setState({
                    isRenderSendMessage:true
                })
                //relationStore里面添加该好友(或者重新初始化)
                // let {Account,HeadImageUrl,Nickname,Email} = result.data.Data.MemberInfo;
                // let IsInBlackList =result.data.Data.IsInBlackList;
                // let relationObj = new RelationModel();
                // relationObj.RelationId = Account;
                // relationObj.avator = HeadImageUrl;
                // relationObj.Nick = Nickname;
                // relationObj.Type = 'private';
                // relationObj.Email = Email;
                // relationObj.BlackList = IsInBlackList;
                // relationObj.show = 'true';

                //currentObj.props.addRelation(relationObj);
            }
            //双方互不为好友
            else if(result.success && typeof result.data.Data === 'string'){
                currentObj.route.push(currentObj.props,{key:'Validate',routeId:'Validate',params:{validateID:result.data.Data,"relation":currentObj.props.Relation,Applicant,Respondent}})
            }
        })
    }
    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        let {HeadImageUrl,Account,Nickname,isRenderSendMessage} = this.state;
        let hasRelation = this.props.hasRelation;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    heading={"详细资料"}
                    left={{func:()=>{this.route.pop(this.props)},text:'通讯录'}}
                    right={[{func:()=>{this.goToInformationSetting()},icon:hasRelation ||isRenderSendMessage?'ellipsis-h':''}]}
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
                    {hasRelation ? <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('相册')}>
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
                    {hasRelation ? <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('更多')}>
                        <View  style={[styles.remarksBox,{marginTop:0}]}>
                            <Text style={styles.remarks}>更多</Text>
                            {/*<Text style={styles.arrow}>{'>'}</Text>*/}
                            <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                        </View>
                    </TouchableHighlight> : null}
                    {hasRelation||isRenderSendMessage ? <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.goToChatDetail} style={styles.sendMessageBox}>
                        <Text style={styles.sendMessage}>发消息</Text>
                    </TouchableHighlight>: null}
                    {hasRelation ||isRenderSendMessage? null: <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{this.addFriend(Account)}} style={styles.sendMessageBox}>
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
    ...bindActionCreators(relationActions, dispatch),
});

 export default connect(mapStateToProps, mapDispatchToProps)(ClientInformation);