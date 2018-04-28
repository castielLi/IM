import React,{Component}from 'react';
import {View,TextInput,Text,Image,TouchableOpacity,StyleSheet,Dimensions,Alert,Keyboard,TouchableWithoutFeedback}from 'react-native';
import {checkDeviceHeight,checkDeviceWidth} from '../../../Core/Helper/UIAdapter';
import AppComponent from '../../../Core/Component/AppComponent';
import LoginController from '../../../TSController/LoginController';

let loginController = undefined;
let currentObj = undefined;

export default class Register extends AppComponent {

	constructor(props){
		super(props);

        this.state = {
            NicknameText:'',
            phoneText:'',
            passWordText:'',
            codeText:'',
            showConfirm:false,//是否显示确认电话号码组件 false:不显示 true:显示
        }

        currentObj = this;
        loginController = new LoginController();
        this.register = this.register.bind(this);
        this.getValidateCode = this.getValidateCode.bind(this);
	}

    componentWillUnmount(){
        super.componentWillUnmount();
    }



	getValidateCode = () =>{
        if(!this.state.phoneText){
            this.alert(this.Localization.Register.phoneNumberErrorMessage)
            return;
        }

        this.showLoading();
        loginController.GetCaptcha(this.state.phoneText,(response)=>{
            currentObj.hideLoading();
            switch (response.data.Result){
                case 2:
                    currentObj.alert(this.Localization.Register.phoneNumberErrorInfo);
                    break;
                case 5001:
                    currentObj.alert(this.Localization.Register.maxTimesError);
                    break;
				case 5002:
					currentObj.alert(this.Localization.Register.phoneNumberExist);
					break;
                case 5003:
                    currentObj.alert(this.Localization.Register.phoneNumberNotExist);
                    break;
                case 5004:
                    currentObj.alert(this.Localization.Register.requestErrorMessage);
                    break;

			}
        });
	}

	register=()=>{

		if((/^1[34578]\d{9}$/.test(this.state.phoneText)) && this.state.passWordText&&this.state.NicknameText){

            this.showLoading();

            loginController.Registered(this.state.phoneText,this.state.passWordText,this.state.NicknameText,this.state.codeText,(response)=>{
                currentObj.hideLoading();
                switch (response.data.Result){
                    case 1:
                        Alert.alert(this.Localization.Common.Success,this.Localization.Register.registerSuccess);
                        currentObj.route.pop(currentObj.props)
                        break;
                    case 5005:
                        currentObj.alert(this.Localization.Common.Error,this.Localization.Register.requestErrorMessage);
                        break;

                }
			});
		}else{
            currentObj.alert(this.Localization.Common.Error,this.Localization.Register.EmptyError);
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
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<View style={styles.container}>
				<View style = {styles.Title}>
					<TouchableOpacity style={styles.goBackBtn}  onPress = {()=>{this.route.pop(this.props);}}>
						<Text style = {styles.goBack}>{this.Localization.Common.Back}</Text>
					</TouchableOpacity>
					<Text style = {styles.phoneTitle}>{this.Localization.Register.Title}</Text>
				</View>
				<View style={styles.content}>
					<View style={styles.inputBox}>
						<View style={styles.imageBox}>
							<Text style = {styles.Nickname}>{this.Localization.Register.nick}</Text>
						</View>
						<TextInput 
							style = {[styles.textInput,{marginLeft:-10}]}
							placeholderTextColor = '#bebebe' 
							placeholder = {this.Localization.Register.nickPlaceHolder}
							onChangeText={(Text)=>{this.setState({NicknameText:Text})}}
							underlineColorAndroid= {'transparent'}
						></TextInput>
					</View>
					<TouchableOpacity onPress={()=>{Alert.alert(this.Localization.Register.changeLocation)}}>
						<View style = {styles.area}>
							<Text style = {styles.areaTitle}>{this.Localization.Register.location}</Text>
							<Text style = {styles.country}>{this.Localization.Register.country}</Text>
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
						keyboardType = {'numeric'}
						maxLength = {11}
						placeholderTextColor = '#bebebe' 
						placeholder = {this.Localization.Register.phonePlaceHolder}
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
						placeholder = {this.Localization.Register.passwordPlaceHolder}
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
						placeholder = {this.Localization.Register.validatePlaceHolder}
						keyboardType = {'numeric'}
						onChangeText={(Text)=>{this.setState({codeText:Text})}}
						underlineColorAndroid= {'transparent'}></TextInput>
						<TouchableOpacity style = {styles.codeBtn} onPress = {()=>{this.getValidateCode()}}>
							<Text style= {styles.information}>{this.Localization.Register.getValidateCode}</Text>
						</TouchableOpacity>
					</View>
					<Text style={{fontSize:checkDeviceHeight(24),color:'#bebebe'}}>{this.Localization.Register.passwordInfo}</Text>

							<TouchableOpacity disabled={!(this.state.phoneText && this.state.passWordText&&this.state.codeText&&this.state.NicknameText)} activeOpacity = {0.8} style={[styles.register,{backgroundColor:this.state.phoneText && this.state.passWordText&&this.state.codeText&&this.state.NicknameText?'#1aad19':'#ccc' }]} onPress = {()=>this.register()}>
								<Text style = {[styles.registerText]}>{this.Localization.Register.register}</Text>
							</TouchableOpacity>

					<View>
						<Text style = {styles.explanation}>
                            {this.Localization.Register.info}
							<Text style={styles.protocol}>{this.Localization.Register.protocolInfoTwo}</Text>{this.Localization.Register.plus}<Text style = {styles.protocol}>{this.Localization.Register.protocolInfo}</Text>
						</Text>
					</View>
				</View>
				<Popup ref={ popup => this.popup = popup}/>
				<Loading ref = { loading => this.loading = loading}/>
			</View>
			</TouchableWithoutFeedback>
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
		marginTop:checkDeviceHeight(50),
		marginLeft:checkDeviceWidth(20),
		alignSelf:'flex-start',
	},
	phoneTitle:{
		color:'#333333',
		fontSize:checkDeviceHeight(50),
		alignSelf:'center',
        marginTop:checkDeviceHeight(60),
	},
	content:{
		alignItems:'center',
		width:Dimensions.get('window').width - checkDeviceHeight(80),
		flex:1,
	},
	Nickname:{
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
		resizeMode:'contain',
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