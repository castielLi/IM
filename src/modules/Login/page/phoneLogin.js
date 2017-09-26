import React,{Component}from 'react';
import {View,TextInput,Text,Image,TouchableOpacity,StyleSheet,Dimensions,Alert,AsyncStorage}from 'react-native';
import {checkDeviceHeight,checkDeviceWidth} from './check';
import {
    Navigator
} from 'react-native-deprecated-custom-components';
import Main from './main';
import {connect} from 'react-redux';
import checkReg from './regExp';
import Confirm from './confirm';
import ContentPage from './contentPage';
import emailLogin from './emailLogin';
import findPassword from './findPassword';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {bindActionCreators} from 'redux';
import * as Actions from '../reducer/action';

class PhoneLogin extends ContainerComponent {
	componentWillUnmount() {
		sqLite.close();
	}
	componentWillMount(){

	}
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	phoneText:'',//账号框的内容
		passWordText:'',//密码框的内容
		showConfirm:false,//是否显示确认电话号码组件 false:不显示 true:显示
		textMessage:true,//true表示密码登录，false表示短信验证登录
	  };
	  this.addUser = this.addUser.bind(this)
	}
	//当点击短信验证的时候检测手机号码的方法
	changeShowConfirm=()=>{
		if((/^1[34578]\d{9}$/.test(this.state.phoneText))){
			this.setState({
				showConfirm:true,
			});
		}else{
			alert('手机号码错误');
		}
	}

	//子组件修改showConfirm
	cancelSend = (hideConfirm)=>{
		this.setState({
			showConfirm:hideConfirm
		})
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
		if(checkReg(1,this.state.phoneText)){
			var userData = [];
			var user = {};
			user.userName = this.state.phoneText;
			user.passWord = this.state.passWordText;
			userData.push(user);
			//登录中
			this.props.signDoing();
			//服务器验证
			//...
			//验证通过
			let account = { accountId:'1',avatar:''};
			//修改loginStore登录状态
			this.props.signIn(account)
			//存储登录状态
            AsyncStorage.setItem('accountId',account.accountId);
			//初始化IM
			//..
			//跳转到最近聊天列表
			this.route.push(this.props,{
				key:'RecentList',
                routeId: 'RecentList'
			});
			
		}
	}
	
	render(){
		return (

			<View style= {styles.container}>
				<TouchableOpacity style={styles.goBackBtn}  onPress = {()=>{this.route.push(this.props,{
					key:'Login',
                	routeId: 'Login',
                	sceneConfig: Navigator.SceneConfigs.FloatFromLeft

				});}}><Text style = {styles.goBack}>返回</Text></TouchableOpacity>
				<View style = {styles.content}>
					<Text style= {styles.loginTitle}>使用手机号登录</Text>	
					<TouchableOpacity onPress={()=>{Alert.alert('更换地区')}}>
						<View style = {styles.area}>
							<Text style = {styles.areaTitle}>国家/地区</Text>
							<Text style = {styles.country}>中国</Text>
							<Image style= {styles.rightLogo} source = {require('../resource/jiantou.png')}></Image>
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
						placeholderTextColor = '#cecece' 
						placeholder = '请输入手机号码' 
						underlineColorAndroid= {'transparent'}
						onChangeText={(Text)=>{this.setState({phoneText:Text})}}
						></TextInput>
						
					</View>
					<View style = {styles.inputBox}>
						<View style={styles.imageBox}>
							{
								this.state.textMessage?(
									<Image style = {[styles.loginImage,{width:checkDeviceWidth(35)}]} source = {require('../resource/password.png')}></Image>
								):(<Image style = {[styles.loginImage,{width:checkDeviceWidth(35),marginLeft:5}]} source = {require('../resource/code.png')}></Image>)
							}
						</View>	
						<TextInput
						ref = {(c)=>{this._textInput = c}}
						maxLength = {16}
						style = {[styles.textInput,{marginLeft:-10,}]} 
						placeholderTextColor = '#cecece' 
						secureTextEntry = {true} 
						placeholder = '请输入密码' 
						underlineColorAndroid= {'transparent'}
						onChangeText={(Text)=>{this.setState({passWordText:Text})}}
						></TextInput>
						{
							!this.state.textMessage?(
								<TouchableOpacity style = {styles.codeBtn} onPress = {()=>{this.changeShowConfirm()}}>
								<Text style= {styles.information}>获取验证码</Text>
								</TouchableOpacity>):null
						}
					</View>
					<TouchableOpacity activeOpacity = {0.8} onPress = {()=>{this.setState({textMessage:!this.state.textMessage})}} >
						{this.state.textMessage?<Text style = {styles.changeLogin}>通过短信验证码登录</Text>:
							<Text style = {styles.changeLogin}>通过密码登录</Text>
						}
					</TouchableOpacity>
					{
						this.state.phoneText && this.state.passWordText?
						(
							<TouchableOpacity activeOpacity = {0.8} style={styles.Login} onPress = {()=>{this.addUser()}}>
								<Text style = {styles.loginText}>登录</Text>
							</TouchableOpacity>)
						:(
							<Image style={[styles.Login,{backgroundColor:'transparent'}]} source = {require('../resource/notLogin.png')}></Image>
							)
					}
				<View style= {styles.footer}>
					<TouchableOpacity onPress = {()=>{this.route.push(this.props,{key:'Login',routeId: 'EmailLogin'})}} activeOpacity = {0.8}><Text style= {[styles.footerText,{marginRight:checkDeviceWidth(110)}]}>其他方式登录</Text></TouchableOpacity>
					<TouchableOpacity onPress = {()=>{this.route.push(this.props,{key:'FindPassword',routeId: 'FindPassword'})}} activeOpacity = {0.8}><Text style= {styles.footerText}>忘记密码</Text></TouchableOpacity>
				</View>
				</View>
				{
					this.state.showConfirm?
					<Confirm 
					phoneText = {this.state.phoneText}
					cancelSend = {this.cancelSend}
					></Confirm>:null
				}
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
	Login:{
		width:Dimensions.get('window').width - checkDeviceWidth(80),
		height:checkDeviceHeight(90),
		backgroundColor:'#1aad19',
		justifyContent:'center',
		alignItems:'center',
		borderRadius:10,
		marginBottom:checkDeviceHeight(460),
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

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = (dispatch) => {
  return{
    ...bindActionCreators(Actions, dispatch),
}};

 export default connect(mapStateToProps, mapDispatchToProps)(PhoneLogin);
