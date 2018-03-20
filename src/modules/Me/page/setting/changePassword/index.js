import React,{Component}from 'react';
import {View,TextInput,Text,Image,Keyboard,TouchableOpacity,StyleSheet,Dimensions,Alert}from 'react-native';
import {checkDeviceHeight,checkDeviceWidth} from '../../../../../Core/Helper/UIAdapter';
import {
    Navigator
} from 'react-native-deprecated-custom-components';
import AppComponent from '../../../../../Core/Component/AppComponent';
import MyNavigationBar from '../../../../Common/NavigationBar/NavigationBar';
import UserController from '../../../../../TSController/UserController';
import Icon from 'react-native-vector-icons/FontAwesome';

let userController = undefined;

export default class ChangePassword extends AppComponent {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	phoneText:'',//账号框的内容
		oldPassWord:'',//旧密码
		newPassWord:'',//新密码
        confirmPassWord:'',//确认密码
		showConfirm:false,//是否显示确认电话号码组件 false:不显示 true:显示
		textMessage:true,//true表示密码登录，false表示短信验证登录
	  };
        userController = UserController.getSingleInstance();
	  this.finished = this.finished.bind(this);
	}

    componentWillUnmount(){
        super.componentWillUnmount();
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

    finished = ()=>{
    	let {oldPassWord,newPassWord,confirmPassWord} = this.state;
		if(newPassWord === confirmPassWord){
			//修改数据库里面的对应账号的密码
			userController.modifyPassword(oldPassWord,newPassWord,(result)=>{
				if(result &&　result.Result === 1){
                    //修改成功，页面跳转到登录页面
                    // alert('密码修改成功，请重新登录!');
                    Keyboard.dismiss();
                    this.route.push(this.props,{
                        key:'Login',
                        routeId: 'PhoneLogin',
                        sceneConfig: Navigator.SceneConfigs.FloatFromLeft
                    });
				}else{
                    alert('修改密码失败'+JSON.stringify(result));
				}
			});
		}else {
			alert('两次输入密码不匹配');
		}

		
	}

	render(){
		return (
			<View style= {styles.container}>
				<MyNavigationBar
					left = {{func:()=>{this.route.pop(this.props)}}}
					heading={'修改密码'}
					right={{func:this.finished,text:'完成'}}
				/>
				<View>
					<View style={styles.textBox}>
						<Text style={styles.rowTitle}>输入旧的密码</Text>
					</View>
					<View style={styles.validateView}>
						<TextInput
							autoFocus={true}
							style={styles.textInput}
							underlineColorAndroid="transparent"
							onChangeText={(v)=>{this.setState({oldPassWord:v})}}
							value={this.state.oldPassWord}
						/>
                        {this.state.oldPassWord.length ? <Icon name="times-circle" size={20} color="#aaa" onPress={()=>{this.setState({oldPassWord:''})}} style={{marginRight:10}}/> : null}
					</View>
				</View>

				<View>
					<View style={styles.textBox}>
						<Text style={styles.rowTitle}>输入新的密码</Text>
					</View>
					<View style={styles.validateView}>
						<TextInput
							ref=""
							style={styles.textInput}
							underlineColorAndroid="transparent"
							onChangeText={(v)=>{this.setState({newPassWord:v})}}
							value={this.state.newPassWord}
						/>
                        {this.state.newPassWord.length ? <Icon name="times-circle" size={20} color="#aaa" onPress={()=>{this.setState({newPassWord:''})}} style={{marginRight:10}}/> : null}
					</View>
				</View>

				<View>
					<View style={styles.textBox}>
						<Text style={styles.rowTitle}>再次输入新密码</Text>
					</View>
					<View style={styles.validateView}>
						<TextInput
							style={styles.textInput}
							underlineColorAndroid="transparent"
							onChangeText={(v)=>{this.setState({confirmPassWord:v})}}
							value={this.state.confirmPassWord}
						/>
                        {this.state.confirmPassWord.length ? <Icon name="times-circle" size={20} color="#aaa" onPress={()=>{this.setState({confirmPassWord:''})}} style={{marginRight:10}}/> : null}
					</View>
				</View>

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
		backgroundColor:'#ebebeb',
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
        flex:1,
		alignItems:'center',
		width:Dimensions.get('window').width - checkDeviceHeight(80),

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
		width:checkDeviceWidth(35),
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
		marginBottom:checkDeviceHeight(470),
	},
	footer:{
		flexDirection:'row',
		alignItems:'center',
	},
	footerText:{
		color:'#6e7c99',
		fontSize:checkDeviceHeight(28),
	},
    validateView:{
        height:40,
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
    },
    textInput:{
        flex:1,
        fontSize:17,
        paddingLeft:5,
    },
    textBox:{
        height:30,
        justifyContent:'center'
    },
    rowTitle:{
        fontSize:14,
        color:'#999',

    },
    rowSetting:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#fff',
        height:50,
        paddingHorizontal:15
    },
    rowText:{
        fontSize:16,
        color:'#000',
    },
});
