import React,{Component}from 'react';
import {View,TextInput,Text,Image,Keyboard,TouchableOpacity,StyleSheet,Dimensions,Alert}from 'react-native';
import {checkDeviceHeight,checkDeviceWidth} from '../../../Core/Helper/UIAdapter';
import Confirm from './confirm';
import AppComponent from '../../../Core/Component/AppComponent';
import LoginController from '../../../TSController/LoginController';
let loginController = undefined;



export default class ResetPassword extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
            NewPasswordText:'',//账号框的内容
            ConfirmPasswordText:'',//密码框的内容
            textMessage:true,//true表示密码登录，false表示短信验证登录
        };
        loginController = new LoginController();
    }

    confirm(){

        if(this.state.ConfirmPasswordText == "" || this.state.NewPasswordText == ""){
            this.alert("新密码或者确认密码不能为空，请重新输入","错误");
        }

        if((this.state.ConfirmPasswordText == this.state.NewPasswordText)){
            this.showLoading();
            loginController.ResetPassword(this.state.NewPasswordText,this.props.validateKey,this.props.phone,(response)=>{
                this.hideLoading();
                if(response.success){
                    this.route.pop(this.props)
                }else{
                    this.alert("重置密码发生错误，请重新设置","错误");
                }
            })
        }else{
            this.alert("两次输入密码不一致,请重新输入","错误");
        }
    }

    passwordEndEditing = ()=>{
        if(this.state.NewPasswordText.length < 8){
            this.alert("密码必须超过8位","错误");
        }
    }

    confirmEndEditing = ()=>{
        if((this.state.ConfirmPasswordText != this.state.NewPasswordText)){
            this.alert("两次输入密码不一致,请重新输入","错误");
        }
    }

    componentWillUpdate() {
        console.log(this.props.loading)
        if(!this.state.textMessage){
            this._textInput.setNativeProps({maxLength:6})
        }else if(this.state.textMessage){
            this._textInput.setNativeProps({maxLength:16})
        }

    }

    render(){
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return (
            <View style= {styles.container}>
                <TouchableOpacity style={styles.goBackBtn}  onPress = {()=>{Keyboard.dismiss();this.route.pop(this.props)}}><Text style = {styles.goBack}>返回</Text></TouchableOpacity>
                <View style = {styles.content}>
                    <Text style= {styles.loginTitle}>重置密码</Text>
                    <View style= {styles.inputBox}>
                        <View style={styles.imageBox}>
                            <Image style = {[styles.loginImage,{width:checkDeviceWidth(35),marginLeft:5}]} source = {require('../resource/password.png')}></Image>
                        </View>
                        <TextInput
                            style = {[styles.textInput,{marginLeft:-10,}]}
                            maxLength = {11}
                            placeholderTextColor = '#cecece'
                            placeholder = '请输入新密码'
                            secureTextEntry = {true}
                            underlineColorAndroid= {'transparent'}
                            onChangeText={(Text)=>{this.setState({NewPasswordText:Text})}}
                            onEndEditing={()=>{this.passwordEndEditing()}}
                        ></TextInput>

                    </View>
                    <View style = {styles.inputBox}>
                        <View style={styles.imageBox}>
                            <Image style = {[styles.loginImage,{width:checkDeviceWidth(35),marginLeft:5}]} source = {require('../resource/password.png')}></Image>
                        </View>
                        <TextInput
                            ref = {(c)=>{this._textInput = c}}
                            maxLength = {16}
                            style = {[styles.textInput,{marginLeft:-10,}]}
                            placeholderTextColor = '#cecece'
                            secureTextEntry = {true}
                            placeholder = '请确定新密码'
                            underlineColorAndroid= {'transparent'}
                            onChangeText={(Text)=>{this.setState({ConfirmPasswordText:Text})}}
                        ></TextInput>
                    </View>
                    {
                        this.state.NewPasswordText && this.state.ConfirmPasswordText?
                            (
                                <TouchableOpacity activeOpacity = {0.8} style={styles.Login} onPress = {()=>{this.confirm();}}>
                                    <Text style = {styles.loginText}>确定</Text>
                                </TouchableOpacity>)
                            :(
                            <Image style={[styles.Login,{backgroundColor:'transparent'}]} source = {require('../resource/notSure.png')}></Image>
                        )
                    }
                </View>
                <Popup ref={ popup => this.popup = popup}/>
                <Loading ref = { loading => this.loading = loading}/>
            </View>
        )
    }

}

function mapStateToProps(store) {
    return {
        loading:store.loginIn.loading
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#ffffff',
    },
    goBack:{
        fontSize:checkDeviceHeight(32),
        color:'#0ebe0c',
    },
    goBackBtn:{
        alignSelf:'flex-start',
        marginLeft:checkDeviceWidth(20),
        marginTop:checkDeviceHeight(35),
    },
    loginTitle:{
        fontSize:checkDeviceHeight(50),
        marginTop:checkDeviceHeight(20),
        color:'#333333',
        marginBottom:checkDeviceHeight(110),
    },
    content:{
        alignItems:'center',
        width:Dimensions.get('window').width - checkDeviceHeight(80),
        flex:1,
    },
    area:{
        width:Dimensions.get('window').width - checkDeviceHeight(80),
        flexDirection:'row',
        marginBottom:checkDeviceWidth(30),
        alignItems:'center',
    },
    inputBox:{
        height:checkDeviceHeight(80),
        width:Dimensions.get('window').width - checkDeviceWidth(80),
        flexDirection:'row',
        alignItems:'center',
        borderRadius:10,
        borderWidth:1,
        borderColor:'#ddddde',
        marginBottom:checkDeviceWidth(30),
    },
    areaTitle:{
        fontSize:checkDeviceHeight(30),
        color:'#333333',
        marginRight:checkDeviceWidth(35),
    },
    country:{
        fontSize:checkDeviceHeight(30),
        color:'#333333',
    },
    rightLogo:{
        width:checkDeviceWidth(15),
        height:checkDeviceHeight(30),
        resizeMode:'contain',
        position:'absolute',
        right:0,
    },
    loginImage:{
        width:checkDeviceWidth(25),
        height:checkDeviceHeight(45),
        borderRightWidth:1,
        borderColor:'#ddddde',
        resizeMode:'stretch',
    },
    imageBox:{
        width:checkDeviceWidth(125),
        height:checkDeviceHeight(80),
        alignItems:'center',
        marginRight:checkDeviceWidth(35),
        justifyContent:'center',
        borderRightWidth:1,
        borderColor:'#ddddde',
    },
    NumberBefore:{
        color:'#333333',
        fontSize:checkDeviceHeight(30),
    },
    textInput:{
        padding:0,
        fontSize:checkDeviceHeight(30),
        flex:1,
    },
    codeBtn:{
        width:checkDeviceWidth(120),
        height:checkDeviceHeight(50),
        borderWidth:1,
        borderColor:'#333333',
        borderRadius:3,
        marginRight:checkDeviceWidth(20),
        justifyContent:'center',
        alignItems:'center',
    },
    information:{
        color:'#333333',
        fontSize:checkDeviceHeight(20),
    },
    changeLogin:{
        color:'#6e7c99',
        fontSize:checkDeviceHeight(28),
        marginBottom:checkDeviceHeight(60),
    },
    loginText:{
        color:'white',
        fontSize:checkDeviceHeight(36),
    },
    passWordRules:{
        fontSize:checkDeviceHeight(24),
        color:'#bebebe',
        marginBottom:checkDeviceHeight(30)
    },
    Login:{
        width:Dimensions.get('window').width - checkDeviceWidth(80),
        height:checkDeviceHeight(90),
        backgroundColor:'#1aad19',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        marginTop:checkDeviceHeight(30),
        marginBottom:checkDeviceHeight(520),
    },
    footer:{
        flexDirection:'row',
        alignItems:'center',
    },
    footerText:{
        color:'#6e7c99',
        fontSize:checkDeviceHeight(28),
    },
});

