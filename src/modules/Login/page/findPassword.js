import React,{Component}from 'react';
import {View,TextInput,Text,Image,Keyboard,TouchableOpacity,StyleSheet,Dimensions,Alert,KeyboardAvoidingView}from 'react-native';
import {checkDeviceHeight,checkDeviceWidth} from '../../../Core/Helper/UIAdapter';
import Confirm from './confirm';
import AppComponent from '../../../Core/Component/AppComponent';
import LoginController from '../../../TSController/LoginController';
let loginController = undefined;
let currentObj = undefined;



export default class FindPassword extends AppComponent {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	phoneText:'',//账号框的内容
		validateText:'',//密码框的内容
		textMessage:true,//true表示密码登录，false表示短信验证登录
	  };
	  currentObj = this;
	  loginController = new LoginController();
	}
	//当点击短信验证的时候检测手机号码的方法
    sendValidate=()=>{
		if((/^1[34578]\d{9}$/.test(this.state.phoneText))){
			this.showLoading();
            loginController.ForgetPassword(this.state.phoneText,(response)=>{
                this.hideLoading();
                if (response.success){
                    this.alert("发送短信成功","");
                }else
                    this.alert("发送短信失败，请重新点击发送","错误");
            });
		}else{
			alert('手机号码错误');
		}
	}

	confirm(){
        if((/^1[34578]\d{9}$/.test(this.state.phoneText))){
            if(this.state.validateText != ""){
                this.showLoading();
                loginController.RetrievePassword(this.state.phoneText,this.state.validateText,(response)=>{
                    this.hideLoading();
                    if (response.success){
                        this.route.replaceTop(this.props,{key:'ResetPassword',routeId:'ResetPassword',params:{"validateKey":response.data.Data,"phone":this.state.phoneText}
						})
                    }else
                        this.alert("无效验证码","错误");
				});
			}else{
                alert('验证码不能为空');
			}
        }else{
            alert('手机号码错误');
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

	addUser = ()=>{

	}
	
	render(){
        let Popup = this.PopContent;
        let Loading = this.Loading;
		return (

				<View style= {styles.container}>
					<TouchableOpacity style={styles.goBackBtn}  onPress = {()=>{Keyboard.dismiss();this.route.pop(this.props)}}><Text style = {styles.goBack}>返回</Text></TouchableOpacity>
					<View style = {styles.content}>
						<Text style= {styles.loginTitle}>找回密码</Text>
						<TouchableOpacity>
							<View style = {styles.area}>
								<Text style = {styles.areaTitle}>国家/地区</Text>
								<Text style = {styles.country}>中国</Text>
								<Image style= {styles.rightLogo} source = {require('../resource/jiantou.png')}/>
							</View>
						</TouchableOpacity>
						<View style= {styles.inputBox}>
							<View style={styles.imageBox}>
								<Image style = {styles.loginImage} source = {require('../resource/ipone.png')}></Image>
							</View>
							<Text style = {styles.NumberBefore}>+86</Text>
							<TextInput
								style = {styles.textInput}
								maxLength = {11}
								keyboardType = {'numeric'}
								placeholderTextColor = '#cecece'
								placeholder = '请输入手机号码'
								underlineColorAndroid= {'transparent'}
								onChangeText={(Text)=>{this.setState({phoneText:Text})}}
							></TextInput>

						</View>
						<View style = {styles.inputBox}>
							<View style={styles.imageBox}>
								<Image style = {[styles.loginImage,{width:checkDeviceWidth(35),marginLeft:5}]} source = {require('../resource/code.png')}></Image>
							</View>
							<TextInput
								ref = {(c)=>{this._textInput = c}}
								maxLength = {16}
								keyboardType = {'numeric'}
								style = {[styles.textInput,{marginLeft:-10,}]}
								placeholderTextColor = '#cecece'
								secureTextEntry = {true}
								placeholder = '请输入验证码'
								underlineColorAndroid= {'transparent'}
								onChangeText={(Text)=>{this.setState({validateText:Text})}}
							></TextInput>
							<TouchableOpacity style = {styles.codeBtn} onPress = {()=>{this.sendValidate()}}>
								<Text style= {styles.information}>获取验证码</Text>
							</TouchableOpacity>
						</View>
                        {
                            this.state.phoneText && this.state.validateText?
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
