
import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TouchableHighlight,
    Dimensions,
    Switch
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import IMController from '../../../TSController/IMLogic/IMControllerLogic';
import UserController from '../../../TSController/UserController';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';
let imController = undefined;
let userController = undefined;

let {height,width} = Dimensions.get('window');

class ChatSetting extends AppComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        imController = IMController.getSingleInstance();
        userController = UserController.getSingleInstance();

        let setting = imController.getChatSetting();
        if(setting == undefined){
            this.state = {
                isStickyChat:false,//置顶聊天
                notDisturb:false,//消息免打扰
            }
        }else{
            this.state = {
                isStickyChat:setting.StickToTheTop,//置顶聊天
                notDisturb:setting.NoDisturb,//消息免打扰
            }
        }
        
        this.gotoGroupBackgroundImage = this.gotoGroupBackgroundImage.bind(this);
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    changeIsStickyChat = ()=>{
        imController.setStickToTheTop(!this.state.isStickyChat);
        this.setState({
            isStickyChat:!this.state.isStickyChat
        })
    };

    gotoGroupBackgroundImage = ()=>{
        this.route.push(this.props,{key:'ChatSetting',routeId:'PrivateChatBackgroundImage'});
    }

    _goToClientInfo=()=>{
        this.route.push(this.props,{key:'ClientInformation',routeId:'ClientInformation',params:{clientId:this.props.Account}});
    };

    _createGroup=()=>{
        this.route.push(this.props,{key: 'ChooseClientt',routeId: 'ChooseClientt',params:{Accounts:[this.props.Account],build:true}});
    };
    render() {
        let path = userController.getAccountHeadImagePath(this.props.Account);
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)}}}
                    heading={'聊天设置'} />
                <View style={styles.userModuleBox}>
                    <TouchableHighlight onPress={this._goToClientInfo} underlayColor={'transparent'}>
                        <View style={styles.userBox}>
                            <ImagePlaceHolder style={styles.userHeadImage} imageUrl={path}/>
                            <Text style={styles.userName} numberOfLines={1}>{this.props.Name}</Text>
                        </View>
                    </TouchableHighlight>
                    {/*<TouchableHighlight onPress={this._createGroup} underlayColor={'transparent'}>*/}
                        {/*<View style={styles.addBox}>*/}
                            {/*<Text style={styles.addIcon}>+</Text>*/}
                        {/*</View>*/}
                    {/*</TouchableHighlight>*/}
                </View>
                <View>
                    <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>置顶聊天</Text>
                            <Switch
                                value={this.state.isStickyChat}
                                onValueChange={this.changeIsStickyChat}
                            />
                        </View>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.gotoGroupBackgroundImage} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>设置当前聊天背景</Text>
                            <Icon name="angle-right" size={20} color="#aaa" />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{
                        imController.removeAllMessage(Id,false);
                        alert("清空聊天记录成功")
                    }} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>清空聊天记录</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>投诉</Text>
                            <Icon name="angle-right" size={20} color="#aaa" />
                        </View>
                    </TouchableHighlight>

                </View>
            </View>
            )
            
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ebebeb',

    },
    userModuleBox:{
        backgroundColor:'#fff',
        marginVertical:15,
        paddingHorizontal:15,
        paddingVertical:10,
        alignItems:'flex-start',
        flexDirection:'row'
    },
    userBox:{
        alignItems:'center',
    },
    userHeadImage:{
        width:50,
        height:50
    },
    userName:{
        color:'#989898',
        fontSize:13,
        textAlignVertical:'center',
        includeFontPadding:false,
        maxWidth:50,
        marginTop:3,
    },
    addBox:{
        justifyContent:'center',
        alignItems:'center',
        height:50,
        width:50,
        borderWidth:1,
        borderColor:'#d9d9d9',
        marginLeft:30
    },
    addIcon:{
        color:'#989898',
        fontSize:30,
        textAlignVertical:'center',
        includeFontPadding:false,
    },
    back:{
        color: '#ffffff',
        fontSize: 15,
        marginLeft: 10,
        textAlignVertical:'center',
    },
    rightButton:{
        color: '#ffffff',
        fontSize: 15,
        marginRight: 10,
        textAlignVertical:'center',
    },
    remarksBox:{
        height:50,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    remarks:{
        fontSize:18,
        color:'#000'
    },
    arrow:{
        fontSize:20,
        color:'#aaa'
    },
    sendMessage:{
        width:width - 40,
        height:55,
        borderRadius:5,
        backgroundColor:'#dc0000',
        textAlignVertical:'center',
        textAlign:'center',
        color:'#fff',
        fontSize:20,
        alignSelf:'center'
    },
});


const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({

});

 export default connect(mapStateToProps, mapDispatchToProps)(ChatSetting);