
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
import AppPageMarkEnum from '../../../App/Enum/AppPageMarkEnum';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';

let {height,width} = Dimensions.get('window');
let currentObj;

class ClientInformation extends AppComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        this.state = {
            userInfo:{},
            isFriend:false,
            oneself:false,
            applyKey:props.applyKey,
        };
        currentObj = this;

        this.userController =  this.appManagement.getUserLogicInstance();
        this.applyController =  this.appManagement.getApplyLogicInstance();

        this.changeAddFriendButton = this.changeAddFriendButton.bind(this);
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
        this.applyController = undefined;
    }

    componentDidMount() {
        //todo:更新问题  什么时候更新用户信息
        this.currentAccount = this.userController.getCurrentAccount();
        if(this.currentAccount.Account == this.props.clientId){
            this.setState({
                oneself:true,
                isFriend:false,
                userInfo:this.currentAccount
            })
        }else{
            this.userController.getUserInfo(this.props.clientId,false,(result)=>{
                let isFriend = result.Friend ? true : false;
                this.setState({
                    userInfo:result,
                    isFriend,
                    oneself:false
                })

            });
        }
    }

    _refreshUI(type,params){
        //这里如果没有点击通讯录界面是不会进行初始化的，不会初始化就会导致下层通知上层的时候不会显示contact 申请的红点
        switch (type){
            case AppPageMarkEnum.ChangeRemark:
                currentObj.setState({
                    userInfo:currentObj.state.userInfo
                });
        }
    }

    goToInformationSetting= ()=>{
        this.route.push(this.props,{key:'InformationSetting',routeId:'InformationSetting',params:{clientId:this.state.userInfo.Account,type:'pravite'}});
    };

    goToChatDetail = ()=>{
        if(this.props.existChatDetailId == this.state.userInfo.Account)
            this.route.pop(this.props);
        else{
            let name = this.state.userInfo.Nickname;
            if(this.state.userInfo.Remark){
                name = this.state.userInfo.Remark;
            }
            this.route.pushifExistRoute(this.props,{
                key:'ChatDetail',
                routeId:'ChatDetail',
                params:{
                    client:this.state.userInfo.Account,
                    type:'private',
                    HeadImageUrl:this.state.userInfo.HeadImageUrl,
                    Nick:name
                }});
        }
    };

    _goToRemarkInfo =(account,remark)=>{
        this.route.push(this.props,{key:'RemarkInfo',routeId:'RemarkInfo',params:{account,remark}});
    };

    //todo:双方添加好友 验证页面
    addFriend = (Applicant,Respondent)=>{
        this.route.push(currentObj.props,{key:'Validate',routeId:'Validate',params:{userInfo:this.state.userInfo,Applicant:Applicant,Respondent:Respondent,changeAddFriendButton:this.changeAddFriendButton}})
    };


    changeAddFriendButton(value){
        this.setState({
            isFriend:value
        })
    }



    _acceptFriend = ()=>{
        this.showLoading();
        this.applyController.acceptFriend(this.state.applyKey,()=>{
            this.hideLoading();
            if(result.Result == 1){
                this.setState({
                    isFriend:true,
                })
                // this.alert('接受好友申請成功','提示')
            }else{
                this.alert('接受好友申請失败','提示')
            }
        });
    };

    //用户信息控制
    _infoControl=(Account,Remark,Nickname)=>{
        let path = this.userController.getAccountHeadImagePath(Account);
        let hasRemark = Remark != '' ? true : false;
        return (
            <View style={styles.basicBox}>
                {Account!= undefined ?<ImagePlaceHolder style={styles.headPic} imageUrl ={path}/>:null}
                <View style={styles.basicBoxRight}>
                    <Text style={styles.name}>{hasRemark ? Remark : Nickname}</Text>
                    <View>
                        <Text style={styles.id}>{'云信号：'+Account}</Text>
                        {hasRemark ? <Text style={styles.id}>{'昵称：'+Nickname}</Text> : null}
                    </View>
                </View>
            </View>
        )
    };

    //用户资料控制
    _dataControl=()=>{
        return (
            <View style={styles.dataBox}>
                <TouchableHighlight>
                    <View style={styles.dataRowBox}>
                        <Text style={styles.dataTitle}>地区</Text>
                        <Text style={styles.dataText}>中国 中国大陆</Text>
                    </View>
                </TouchableHighlight>
                {/*{this.state.isFriend ? null :*/}
                    {/*<TouchableHighlight>*/}
                        {/*<View style={[styles.dataRowBox,styles.noBorder]}>*/}
                            {/*<Text style={styles.dataTitle}>个性签名</Text>*/}
                            {/*<Text style={styles.dataText}>签名内容</Text>*/}
                        {/*</View>*/}
                    {/*</TouchableHighlight>*/}
                {/*}*/}
                {this.state.isFriend ?
                    <TouchableHighlight>
                        <View style={styles.dataRowBox}>
                            <Text style={styles.dataTitle}>个性相册</Text>
                            <View style={styles.dataPhotos}>
                                <Image style={styles.dataPhoto} source={require('../resource/test1.jpg')}/>
                                <Image style={styles.dataPhoto} source={require('../resource/test2.jpg')}/>
                                <Image style={styles.dataPhoto} source={require('../resource/test3.jpg')}/>
                            </View>
                        </View>
                    </TouchableHighlight> : null
                }
            </View>
        )
    };

    //备注控制
    _remarkControl=(Account,Remark)=>{
        if(this.state.oneself){
            return null;
        }
        return (
            <View>
                <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>this._goToRemarkInfo(Account,Remark)} style={{marginTop:15}}>
                    <View  style={styles.remarksBox}>
                        <Text style={styles.remarks}>设置备注</Text>
                    </View>
                </TouchableHighlight>
                {(!this.state.isFriend && this.state.applyKey) ?
                    <View style={styles.verifyBox}>
                        <Text style={styles.verifyText}>我是xxx</Text>
                        <View style={styles.touchBtnBox}>
                            {/*<TouchableHighlight style={styles.touchBtn}>*/}
                                {/*<Text style={styles.touchBtnText}>回复</Text>*/}
                            {/*</TouchableHighlight>*/}
                        </View>
                    </View> : null
                }
            </View>
        )
    };

    //按钮显示控制
    _buttonControl=(Account)=>{

        if(this.state.oneself){
            return null;
        }

        if(this.state.isFriend){
            return (
                <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.goToChatDetail} style={styles.sendMessageBox}>
                    <Text style={styles.sendMessage}>发消息</Text>
                </TouchableHighlight>
            )
        }else{
            if(this.state.applyKey){
                return (
                    <View>
                        <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>this._acceptFriend()} style={styles.sendMessageBox}>
                            <Text style={styles.sendMessage}>通过验证</Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{}} style={styles.sendMessageBox}>
                            <Text style={styles.sendMessage}>加入黑名单</Text>
                        </TouchableHighlight>
                    </View>
                )
            }else{
                return (
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{this.addFriend(this.currentAccount.Account,Account)}} style={styles.sendMessageBox}>
                        <Text style={styles.sendMessage}>添加到通讯录</Text>
                    </TouchableHighlight>
                )
            }
        }
    };

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        let {Nickname,Account,HeadImageUrl,Remark} = this.state.userInfo;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    heading={"详细资料"}
                    left={{func:()=>{this.route.pop(this.props)},text:this.props.scan!= undefined?"":'通讯录'}}
                    right={[{func:()=>{this.goToInformationSetting()},icon:this.state.isFriend ?'ellipsis-h':''}]}
                />
                <View>
                    {this._infoControl(Account,Remark,Nickname)}
                    {this._remarkControl(Account,Remark)}
                    {this._dataControl()}
                    {this._buttonControl(Account)}

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
        paddingVertical:10,
        paddingHorizontal:15,
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center'
    },
    headPic:{
        height:60,
        width:60,
        borderRadius:30,
    },
    basicBoxRight:{
        marginLeft:15,
    },
    name:{
        fontSize:15,
        color:'#000'
    },
    id:{
        fontSize:13,
        color:'#989898'
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
        fontSize:16,
        color:'#000'
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
    },

    dataBox:{
        backgroundColor:'#fff',
        paddingHorizontal:15,
        marginTop:15
    },
    noBorder:{
        borderBottomWidth:0
    },
    dataRowBox:{
        paddingVertical:10,
        borderBottomWidth:1,
        borderBottomColor:'#eee',
        flexDirection:'row',
        alignItems:'center',
    },
    dataTitle:{
        fontSize:16,
        color:'#000',
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false,
        width:100
    },
    dataText:{
        fontSize:15,
        color:'#bbb',
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false,
    },
    dataPhotos:{
        flexDirection:'row',
    },
    dataPhoto:{
        height:65,
        width:65,
        marginRight:8
    },

    verifyBox:{
        backgroundColor:'#FCFCFC',
        padding:15,
    },
    verifyText:{
        fontSize:14,
        color:'#bbb',
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false,
    },
    touchBtnBox:{
        alignItems:'flex-end'
    },
    touchBtn:{
        borderWidth:1,
        borderColor:'#ddd',
        borderRadius:3,
        paddingHorizontal:15,
        paddingVertical:5
    },
    touchBtnText:{
        fontSize:14,
        color:'#000',
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false,
    },


});


const mapStateToProps = state => ({
    loginStore : state.loginStore.accountMessage,
});

const mapDispatchToProps = dispatch => ({

});

 export default connect(mapStateToProps, mapDispatchToProps)(ClientInformation);
