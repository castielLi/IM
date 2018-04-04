import React,{Component}from 'react';
import {View,TextInput,Text,Image,TouchableOpacity,
    StyleSheet,Dimensions,Alert,Keyboard,KeyboardAvoidingView,TouchableWithoutFeedback}from 'react-native';
import {checkDeviceHeight,checkDeviceWidth} from '../../../Core/Helper/UIAdapter';
import {connect} from 'react-redux';
import checkReg from './regExp';
import Confirm from './confirm';
import AppComponent from '../../../Core/Component/AppComponent';
import {bindActionCreators} from 'redux';
import * as Actions from '../reducer/action';
import Touch from '../../Common/Thouch/index';
import LoginController from '../../../TSController/LoginController';
let loginController = undefined;
let currentObj = undefined;
class PhoneLogin extends AppComponent {
    componentWillUnmount() {
        // sqLite.close();
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
        currentObj = this;

        loginController = new LoginController();
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

        if(!this.state.textMessage){
            this._textInput.setNativeProps({maxLength:6})
        }else if(this.state.textMessage){
            this._textInput.setNativeProps({maxLength:16})
        }
    }

    componentWillUnmount(){
       super.componentWillUnmount();
    }


    addUser = ()=>{

        if(!checkReg(1,this.state.phoneText)){
            this.alert("账号格式不正确")
            return;
        }

        //登录api
        currentObj.showLoading();
        Keyboard.dismiss();//关闭软键盘

        loginController.login(currentObj.state.phoneText,currentObj.state.passWordText,(response)=>{
            currentObj.hideLoading()
            if(response.Result !== 1){
                switch (response.Result){
                    case 1001:
                        currentObj.alert("账号或者密码错误","错误");
                        break;
                    case 1002:
                        currentObj.alert("账号被冻结,请您联系工作人员","错误");
                        break;
                    case 1003:
                        currentObj.alert("账号或者密码错误","错误");
                        break;
                    case 6001:
                        currentObj.alert("网络出现故障，请检查当前设备网络连接状态","错误");
                        break;
                    default:
                        currentObj.alert("登录请求出错","错误");
                        break;
                }
                return;
            }
            this.props.signDoing();
            this.setState({
                phoneText:"",
                passWordText:""
            })
            this.phone.setNativeProps({text:""})
            this._textInput.setNativeProps({text:""})
            this.appManagement.systemLogin();
        });
    }

    render(){
        let Popup = this.PopContent;
        let Loading = this.Loading;

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<KeyboardAvoidingView behavior="position" style={styles.container}   keyboardVerticalOffset={-150}>
				<View  style  = {styles.content}>
					<Text style= {styles.loginTitle}>使用手机号登录</Text>
					<TouchableOpacity>
						<View style = {styles.area}>
							<Text style = {styles.areaTitle}>国家/地区</Text>
							<Text style = {styles.country}>中国</Text>
							<Image style= {styles.rightLogo} source = {require('../resource/jiantou.png')}/>
						</View>
					</TouchableOpacity>
					<View style= {styles.inputBox}>
						<View style={styles.imageBox}>
							<Image style = {styles.loginImage} source = {require('../resource/ipone.png')}/>
						</View>
						<Text style = {styles.NumberBefore}>+86</Text>
						<TextInput
                            ref={element => {
                                this.phone = element
                            }}
							style = {styles.textInput}
							keyboardType = {'numeric'}
							maxLength = {11}
							placeholderTextColor = '#cecece'
							placeholder = '请输入手机号码'
							underlineColorAndroid= {'transparent'}
							onChangeText={(Text)=>{this.setState({phoneText:Text})}}
						/>
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
						/>
                        {
                            !this.state.textMessage?(
								<TouchableOpacity style = {styles.codeBtn} onPress = {()=>{this.changeShowConfirm()}}>
									<Text style= {styles.information}>获取验证码</Text>
								</TouchableOpacity>):null
                        }
					</View>
					<TouchableOpacity activeOpacity = {0.8} style={[styles.Login,{backgroundColor:this.state.phoneText && this.state.passWordText?'#1aad19':'#ccc'}]} onPress = {()=>{this.addUser()}} disabled={!(this.state.phoneText && this.state.passWordText)}>
						<Text style = {styles.loginText}>登录</Text>
					</TouchableOpacity>


					<View style= {styles.footer}>
						{/*<TouchableOpacity onPress = {()=>{this.route.push(this.props,{key:'FindPassword',routeId: 'FindPassword'})}} activeOpacity = {0.8}><Text style= {styles.footerText}>忘记密码</Text></TouchableOpacity>*/}
						<Touch onPress = {()=>{this.route.push(this.props,{key:'FindPassword',routeId: 'FindPassword'});}} activeOpacity = {0.8}>
                            <Text style= {[styles.footerText,{marginRight:checkDeviceWidth(110)}]}>忘记密码</Text>
                        </Touch>
                        <Touch onPress = {()=>{this.route.push(this.props,{key:'Register',routeId: 'Register'})}} activeOpacity = {0.8}>
                            <Text style= {styles.footerText}>注册账号</Text>
                        </Touch>
                    </View>
				</View>
                {
                    this.state.showConfirm?
						<Confirm
							phoneText = {this.state.phoneText}
							cancelSend = {this.cancelSend}
						/>:null
                }
				<Popup ref={ popup => this.popup = popup}/>
				<Loading ref = { loading => this.loading = loading}/>
			</KeyboardAvoidingView>
            </TouchableWithoutFeedback>

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
        marginTop:checkDeviceHeight(70),
        color:'#333333',
        marginBottom:checkDeviceHeight(110),
    },
    content:{
        alignItems:'center',
        flex:1,
        paddingHorizontal:checkDeviceWidth(40)
    },
    area:{
        width:Dimensions.get('window').width - checkDeviceWidth(80),
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
        color:'#fff',
        fontSize:checkDeviceHeight(36),
    },
    Login:{
        width:Dimensions.get('window').width - checkDeviceWidth(80),
        height:checkDeviceHeight(90),
        backgroundColor:'#1aad19',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        marginBottom:checkDeviceHeight(40),
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

        ...bindActionCreators(Actions, dispatch)

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PhoneLogin);
