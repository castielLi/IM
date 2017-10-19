
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
    Dimensions
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import User from '../../../Core/User'
import Relation from '../../../Core/User/dto/RelationModel'
import netWorking from '../../../Core/Networking/Network'
import RNFS from 'react-native-fs'


let {height,width} = Dimensions.get('window');
let currentObj;

class ClientInformation extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.state = {
            selectedTab: 'home',
            isLogged: false
        }
        currentObj = this;
    }

    isUpdateFriendInfo = (_Relation,UserInfo,propsRelation) =>{
        let isUpdate;
        let user = new User();
        let _network = new netWorking();
        let {accountId} = this.props.loginStore;
        let avatorName = HeadImageUrl.substr(HeadImageUrl.lastIndexOf('/')+1);
        let toFile = `${RNFS.DocumentDirectoryPath}/${accountId}/image/avator/${new Date().getTime()}.jpg`;

        if(_Relation.Nick != UserInfo.Nickname || _Relation.OtherComment != UserInfo.Gender || _Relation.Email != UserInfo.Email){
            _Relation.Nick = UserInfo.Nickname;
            _Relation.OtherComment = UserInfo.Gender;
            _Relation.Email = UserInfo.Email;
            isUpdate = true;
        }
        updateImage = (result) => {
            console.log('下载成功,对数据库进行更改')
            //LocalImage = toFile;
            if(propsRelation.LocalImage){
                RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${accountId}/image/avator/${propsRelation.LocalImage}`).then(()=>{console.log('旧头像删除成功')}).catch(()=>{console.log('旧图片删除失败')})
            }
        };
        if(_Relation.avator == UserInfo.HeadImageUrl){
            _Relation.avator = UserInfo.HeadImageUrl;
            isUpdate = true;
            _network.methodDownload(UserInfo.HeadImageUrl,toFile,updateImage)
        }

        if(isUpdate){
            user.updateRelation(_Relation)
        }
    }
    componentDidMount() {
        if(1){
            return;
        }
        let propsRelation = this.props.Relation;
        let _Relation = new Relation();
        let that = this;
        _Relation.OtherComment = propsRelation.OtherComment;
        _Relation.RelationId = propsRelation.RelationId;
        _Relation.Nick = propsRelation.Nick;
        _Relation.Remark = propsRelation.Remark;
        _Relation.BlackList = propsRelation.BlackList;
        _Relation.avator = propsRelation.avator;
        _Relation.Email = propsRelation.Email;
        _Relation.type = propsRelation.Type;
        _Relation.LocalImage = propsRelation.LocalImage;
        this.fetchData("POST","Member/GetFriendUserInfo",function(result){

            currentObj.hideLoading()
            if(!result.success){
                alert(result.errorMessage);
                return;
            }

            if(result.data.Data){
                that.isUpdateFriendInfo(_Relation,result.Data,propsRelation);
            }
        },{
            "Account":_Relation.RelationId
        })
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
        this.route.push(this.props,{key:'InformationSetting',routeId:'InformationSetting',params:{client:this.props.Relation.RelationId,type:this.props.Relation.Type}});
    }

    _rightButton() {
        return  <TouchableOpacity style={{justifyContent:'center'}} onPress={this.goToInformationSetting}>
            <Icon name="ellipsis-h" size={20} color="#fff" style={{marginRight:10,textAlignVertical:'center'}}/>

        </TouchableOpacity>
    }
    goToChatDetail = ()=>{
        this.route.push(this.props,{key:'ChatDetail',routeId:'ChatDetail',params:{client:this.props.Relation.RelationId,type:this.props.Relation.Type}});
    }

    addFriend = (Respondent)=>{
        let Applicant = this.props.loginStore.accountId;
        this.fetchData("POST","Member/ApplyFriend",function(result){
            if(result.Result && !result.Data){
                console.log('已成功添加被单方面删除的好友')
                alert('成功')
            }
        },{Applicant,Respondent})
    }
    render() {
        let {HeadImageUrl,Account,Nickname} = this.props.Relation;
        let isFriend = this.props.isFriend;
        return (
            <View style={styles.container}>
                <NavigationBar
                    tintColor="#38373d"
                    leftButton={this._leftButton()}
                    rightButton={this._rightButton()}
                    title={this._title()} />
                <View>
                    <View style={styles.basicBox}>
                        <Image style={styles.headPic} source={{uri:HeadImageUrl}}/>
                        <View style={styles.basicBoxRight}>
                            <Text style={styles.name}>{Nickname}</Text>
                            <Text style={styles.id}>{'微信号：'+Account}</Text>
                        </View>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>设置备注和标签</Text>
                            <Text style={styles.arrow}>{'>'}</Text>
                        </View>
                    </TouchableHighlight>
                    <View  style={styles.placeBox}>
                        <Text style={styles.address}>地区</Text>
                        <Text style={styles.place}>重庆 大渡口</Text>
                    </View>
                    {isFriend ? <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('相册')}>
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
                            <Text style={styles.arrow}>{'>'}</Text>
                        </View>
                    </TouchableHighlight> : null}
                    {isFriend ? <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('更多')}>
                        <View  style={[styles.remarksBox,{marginTop:0}]}>
                            <Text style={styles.remarks}>更多</Text>
                            <Text style={styles.arrow}>{'>'}</Text>
                        </View>
                    </TouchableHighlight> : null}

                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.goToChatDetail} style={styles.sendMessageBox}>
                        <Text style={styles.sendMessage}>发消息</Text>
                    </TouchableHighlight>

                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{this.addFriend(Account)}} style={styles.sendMessageBox}>
                        <Text style={styles.sendMessage}>添加到通讯录</Text>
                    </TouchableHighlight>

                </View>
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