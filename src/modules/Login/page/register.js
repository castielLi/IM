import React,{Component}from 'react';
import {View,TextInput,Text,Image,TouchableOpacity,StyleSheet,Dimensions,Alert,Keyboard}from 'react-native';
import {checkDeviceHeight,checkDeviceWidth} from '../../../Core/Helper/UIAdapter';
import {
    Navigator
} from 'react-native-deprecated-custom-components';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import Confirm from './confirm';

let currentObj = undefined;

export default class Register extends ContainerComponent {

	constructor(){
		super();

        this.state = {
            nickNameText:'',
            phoneText:'',
            passWordText:'',
            codeText:'',
            showConfirm:false,//是否显示确认电话号码组件 false:不显示 true:显示
        }

        currentObj = this;
	}



	getValidateCode = () =>{
        if(!this.state.phoneText){
            this.alert("电话号码不能为空!")
            return;
        }

        this.showLoading();
        this.fetchData("POST","Member/GetMobileCaptchaForRegistion",function(result){
            currentObj.hideLoading()
        	if(!result.success) {
                currentObj.alert(result.errorMessage,"错误");
            }
		},{"PhoneNumber":this.state.phoneText})
	}

	register=()=>{

		if((/^1[34578]\d{9}$/.test(this.state.phoneText)) && this.state.passWordText&&this.state.nickNameText){
			// this.setState({
			// 	showConfirm:true,
			// });

            this.showLoading();
            this.fetchData("POST","Member/RegistByMobilePhone",function(result){
                currentObj.hideLoading()
                if(!result.success) {
                    currentObj.alert(result.errorMessage,"错误");
                }else{
                    currentObj.route.replaceTop(currentObj.props,{
                        key:'Login',
                        routeId: 'PhoneLogin'
					})
				}
            },{"PhoneNumber":this.state.phoneText,"Nickname":this.state.nickNameText,"Captcha":this.state.codeText,"Password":this.state.phoneText})

		}else{
			alert('信息不能为空!');
		}
	}
	cancelSend = (hideConfirm)=>{
		this.setState({
			showConfirm:hideConfirm
		})
	}
	render(){
        let Popup = this.PopContent;
        let Loading = this.Loading;

		return (
			<View style={styles.container}>
				<View style = {styles.Title}>
					<TouchableOpacity style={styles.goBackBtn}  onPress = {()=>{this.route.pop(this.props);}}>
						<Text style = {styles.goBack}>返回</Text>
					</TouchableOpacity>
					<Text style = {styles.phoneTitle}>手机号注册</Text>
				</View>
				<View style={styles.content}>
					<View style={styles.inputBox}>
						<View style={styles.imageBox}>
							<Text style = {styles.nickName}>昵称</Text>
						</View>
						<TextInput 
							style = {[styles.textInput,{marginLeft:-10}]}
							placeholderTextColor = '#bebebe' 
							placeholder = '例如：王凯'
							onChangeText={(Text)=>{this.setState({nickNameText:Text})}}
							underlineColorAndroid= {'transparent'}
						></TextInput>
					</View>
					<TouchableOpacity onPress={()=>{Alert.alert('更换地区')}}>
						<View style = {styles.area}>
							<Text style = {styles.areaTitle}>国家/地区</Text>
							<Text style = {styles.country}>中国+86</Text>
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
						placeholderTextColor = '#bebebe' 
						placeholder = '请输入手机号码' 
						onChangeText={(Text)=>{this.setState({phoneText:Text})}}
						underlineColorAndroid= {'transparent'}></TextInput>
						
					</View>
					<View style = {styles.inputBox}>
						<View style={styles.imageBox}>
							<Image style = {[styles.loginImage,{width:checkDeviceWidth(35),}]} source = {require('../resource/password.png')}></Image>
						</View>	
						<TextInput
						maxLength = {16}
						style = {[styles.textInput,{marginLeft:-10}]} 
						placeholderTextColor = '#bebebe' 
						secureTextEntry = {true} 
						placeholder = '请输入密码' 
						onChangeText={(Text)=>{this.setState({passWordText:Text})}}
						underlineColorAndroid= {'transparent'}></TextInput>
					</View>
					<View style = {styles.inputBox}>
						<View style={styles.imageBox}>
							<Image style = {[styles.loginImage,{width:checkDeviceWidth(35),}]} source = {require('../resource/code.png')}></Image>
						</View>	
						<TextInput
						maxLength = {6}
						style = {[styles.textInput,{marginLeft:-10}]} 
						placeholderTextColor = '#bebebe' 
						placeholder = '请输入验证码' 
						onChangeText={(Text)=>{this.setState({codeText:Text})}}
						underlineColorAndroid= {'transparent'}></TextInput>
						<TouchableOpacity style = {styles.codeBtn} onPress = {()=>{this.getValidateCode()}}>
							<Text style= {styles.information}>获取验证码</Text>
						</TouchableOpacity>
					</View>
					<Text style={{fontSize:checkDeviceHeight(24),color:'#bebebe'}}>密码由8-12位组成, 其中最少包括一个字母和数字，不能使用符号</Text>
					{
						this.state.phoneText && this.state.passWordText&&this.state.codeText&&this.state.nickNameText?
						(
							<TouchableOpacity activeOpacity = {0.8} style={styles.register} onPress = {()=>this.register()}>
								<Text style = {styles.registerText}>注册</Text>
							</TouchableOpacity>)
						:(
							<Image style={[styles.register,{backgroundColor:'transparent'}]} source = {require('../resource/notregister.png')}></Image>
							)
					}
					<View>
						<Text style = {styles.explanation}>
							点击上面的“注册”按钮,即表示你同意
							<Text style={styles.protocol}>《APP软件许可及服务协议》</Text>和<Text style = {styles.protocol}>《APP隐私政策》</Text>
						</Text>
					</View>
				</View>
				{/*{*/}
					{/*this.state.showConfirm?*/}
					{/*<Confirm */}
					{/*phoneText = {this.state.phoneText}*/}
					{/*cancelSend = {this.cancelSend}*/}
					{/*></Confirm>:null*/}
				{/*}*/}
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
	Title:{
		flexDirection:'row',
		width:Dimensions.get('window').width,
		justifyContent:'center',
		paddingTop:checkDeviceHeight(35),
		marginBottom:checkDeviceHeight(50),
	},
	goBack:{
		fontSize:checkDeviceHeight(32),
		color:'#0ebe0c',
	},
	goBackBtn:{
		position:'absolute',
		left:0,
		marginTop:checkDeviceHeight(35),
		marginLeft:checkDeviceWidth(20),
		alignSelf:'flex-start',
	},
	phoneTitle:{
		color:'#333333',
		fontSize:checkDeviceHeight(32),
		alignSelf:'center',
	},
	content:{
		alignItems:'center',
		width:Dimensions.get('window').width - checkDeviceHeight(80),
		flex:1,
	},
	nickName:{
		fontSize:checkDeviceHeight(30),
		color:'#333333',
	},
	area:{
		width:Dimensions.get('window').width - checkDeviceHeight(80),
		flexDirection:'row',
		marginBottom:checkDeviceWidth(30),
		alignItems:'center',
	},
	inputBox:{
		height:checkDeviceHeight(80),
		width:Dimensions.get('window').width - checkDeviceHeight(80),
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
		height:checkDeviceHeight(90),
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
	registerText:{
		color:'white',
		fontSize:checkDeviceHeight(36),
	},
	register:{
		width:Dimensions.get('window').width - checkDeviceHeight(80),
		height:checkDeviceHeight(90),
		backgroundColor:'#1aad19',
		justifyContent:'center',
		alignItems:'center',
		borderRadius:10,
		marginBottom:checkDeviceHeight(45),
		marginTop:checkDeviceHeight(60),
	},
	explanation:{
		color:'#cecece',
		fontSize:checkDeviceHeight(28),
	},
	protocol:{
		color:'#4a5b80'
	},
})