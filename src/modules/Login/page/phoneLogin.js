import React, {
	Component
} from 'react';
import {
	View,
	TextInput,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
	Alert,
	AsyncStorage,
	Keyboard,
	Platform,
	KeyboardAvoidingView
} from 'react-native';
import {
	checkDeviceHeight,
	checkDeviceWidth
} from '../../../Core/Helper/UIAdapter';
import {
	Navigator
} from 'react-native-deprecated-custom-components';
import Main from './main';
import {
	connect
} from 'react-redux';
import checkReg from './regExp';
import Confirm from './confirm';
import ContentPage from './contentPage';
import emailLogin from './emailLogin';
import findPassword from './findPassword';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {
	bindActionCreators
} from 'redux';
import * as Actions from '../reducer/action';
import * as recentListActions from '../../../Core/Redux/RecentList/action';
import * as relationActions from '../../../Core/Redux/contact/action';

import IM from '../../../Core/IM'
import User from '../../../Core/UserGroup'
import {
	setMyAccoundId
} from '../../../Core/IM/action/receiveHandleMessage';
import RNFS from 'react-native-fs'
import UUIDGenerator from 'react-native-uuid-generator';
import * as ApplyFriendAction from '../../../Core/Redux/applyFriend/action'
import * as unReadMessageAction from '../../MainTabbar/reducer/action'
let currentObj = undefined;

class PhoneLogin extends ContainerComponent {
	componentWillUnmount() {
		// sqLite.close();

	}
	constructor(props) {
			super(props);

			this.state = {
				phoneText: '', //账号框的内容
				passWordText: '', //密码框的内容
				showConfirm: false, //是否显示确认电话号码组件 false:不显示 true:显示
				textMessage: true, //true表示密码登录，false表示短信验证登录
			};
			this.addUser = this.addUser.bind(this)
			currentObj = this;
		}
		//当点击短信验证的时候检测手机号码的方法
	changeShowConfirm = () => {
		if ((/^1[34578]\d{9}$/.test(this.state.phoneText))) {
			this.setState({
				showConfirm: true,
			});
		} else {
			alert('手机号码错误');
		}
	}

	//子组件修改showConfirm
	cancelSend = (hideConfirm) => {
		this.setState({
			showConfirm: hideConfirm
		})
	}
	componentWillUpdate() {

		if (!this.state.textMessage) {
			this._textInput.setNativeProps({
				maxLength: 6
			})
		} else if (this.state.textMessage) {
			this._textInput.setNativeProps({
				maxLength: 16
			})
		}

	}


	addUser = () => {

		if (!checkReg(1, this.state.phoneText)) {
			this.alert("账号格式不正确")
			return;
		}

		//登录api

		UUIDGenerator.getRandomUUID().then((uuid) => {

			currentObj.showLoading();
			Keyboard.dismiss(); //关闭软键盘
			currentObj.fetchData("POST", "/Member/Login", function(result) {
				//todo: 存储用户信息


				if (!result.success) {
					currentObj.hideLoading()

					if (result.errorCode == 1003) {
						currentObj.alert("账号或者密码错误", "错误");
					} else {
						alert(result.errorMessage);
					}
					return;
				}


				currentObj.setFetchAuthorization(result.data.Data["SessionToken"])


				//登录中
				currentObj.props.signDoing();
				//服务器验证
				//...
				//验证通过
				let account = {
					accountId: result.data.Data["Account"],
					SessionToken: result.data.Data["SessionToken"],
					IMToken: result.data.Data["IMToken"],
					gender: result.data.Data["Gender"],
					nick: result.data.Data["Nickname"],
					avator: result.data.Data["HeadImageUrl"],
					phone: result.data.Data["PhoneNumber"],
					device: "Mobile",
					deviceId: "1"
				};

				//存储登录状态
				AsyncStorage.setItem('account', JSON.stringify(account));
				setMyAccoundId(account.accountId);
				//修改loginStore登录状态
				currentObj.props.signIn(account);
				//如果是ios
				if (Platform.OS === 'ios') {
					//初始化im
					let im = new IM();
					im.setSocket(account.accountId, account.device, account.deviceId, account.IMToken);
					im.initIMDatabase(account.accountId)
					dealCommon();
					//如果是android
				} else {


					let ImDbPath = '/data/data/com.im/files/' + account.accountId + '/database/IM.db';
					let AccountDbPath = '/data/data/com.im/files/' + account.accountId + '/database/Account.db';
					let GroupDbPath = '/data/data/com.im/files/' + account.accountId + '/database/Group.db';
					//文件夹判断是否是第一次登录
					RNFS.exists(ImDbPath).then((bool) => {
						if (bool) {
							//若不是
							//根据accountId在对应文件夹中找数据库文件，移动我数据库文件至databases
							RNFS.copyFile(ImDbPath, '/data/data/com.im/databases/IM.db').then(() => {
								RNFS.copyFile(AccountDbPath, '/data/data/com.im/databases/Account.db').then(() => {
									RNFS.copyFile(GroupDbPath, '/data/data/com.im/databases/Group.db').then(() => {
										//初始化im
										let im = new IM();
										im.setSocket(account.accountId, account.device, account.deviceId, account.IMToken);
										dealCommon();
									})
								})
							});
							//若是第一次登陆
						} else {
							//初始化im
							let im = new IM();
							im.setSocket(account.accountId, account.device, account.deviceId, account.IMToken);
							im.initIMDatabase(account.accountId);
							dealCommon();
						}

					})
				}
				//创建文件夹
				let avatorPath = RNFS.DocumentDirectoryPath + '/' + account.accountId + '/image/avator';
				RNFS.mkdir(avatorPath);
				//删除Account.db

				let AccountPath = "";

				if (Platform.OS === 'android') {

					AccountPath = '/data/data/com.im/databases/Account.db';
				} else {

					AccountPath = RNFS.DocumentDirectoryPath + "/" + account.accountId + "/database/Account.db";
				}



				function dealCommon() {
					//初始化用户系统
					let user = new User();
					let im = new IM();
					user.initIMDatabase(account.accountId);

					currentObj.fetchData("POST", "/Member/GetContactList", function(result) {


						if (!result.success) {
							currentObj.hideLoading();
							alert("初始化account出错" + result.errorMessage);
							return;
						}

						//初始化applyFriendStore
						im.getAllApplyFriendMessage(function(result) {

							currentObj.props.initFriendApplication(result);
							let unUnDealRequestCount = 0;
							result.forEach((v, i) => {
								if (v.status == "wait") {
									unUnDealRequestCount++
								}
							})
							currentObj.props.initUnDealRequestNumber(unUnDealRequestCount);
						})

						//添加名单
						user.initRelations(result.data.Data["FriendList"], result.data.Data["BlackList"], function() {
							user.getAllRelation((data) => {
								user.initGroup(result.data.Data["GroupList"], function() {


									user.getAllGroupFromGroup(function(results) {
										currentObj.hideLoading();

										data = results.reduce(function(prev, curr) {
											prev.push(curr);
											return prev;
										}, data);
										currentObj.props.initRelation(data);
										//初始化recentListStore
										im.getChatList((chatListArr) => {
											let needArr = [];
											//初始化unReadMessageStore
											let unReadMessageCount = 0;
											chatListArr.forEach((v, i) => {
												if (v.unReadMessageCount) {
													unReadMessageCount += v.unReadMessageCount;
												}
												for (let m = 0; m < data.length; m++) {
													if (v.Client == data[m].RelationId) {
														v.Nick = data[m].Nick;
														v.localImage = data[m].localImage;
														v.avator = data[m].avator;
														break;
													}
												}
											})

											needArr = chatListArr.concat();
											currentObj.props.initRecentList(needArr);

											currentObj.props.initUnReadMessageNumber(unReadMessageCount)
										})
										currentObj.route.push(currentObj.props, {
											key: 'MainTabbar',
											routeId: 'MainTabbar'
										});
									})
								})
							})
						})

					}, {
						"Account": currentObj.state.phoneText
					})
				}

			}, {
				"Account": currentObj.state.phoneText,
				"DeviceNumber": "1",
				"DeviceType": "1",
				"Key": currentObj.state.phoneText,
				"LoginIP": "192.168.0.103",
				"Password": currentObj.state.passWordText,
				"Session": uuid
			})


		});
	}

	render() {
		let Popup = this.PopContent;
		let Loading = this.Loading;

		return (
			<KeyboardAvoidingView behavior="position" style={styles.container}   keyboardVerticalOffset={-150}>
				<TouchableOpacity style={styles.goBackBtn}  onPress = {()=>{Keyboard.dismiss();this.route.pop(this.props);}}>
				<Text style = {styles.goBack}>返回</Text></TouchableOpacity>
				<View  style  = {styles.content}>
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
						keyboardType = {'numeric'}
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


							<TouchableOpacity activeOpacity = {0.8} style={[styles.Login,{backgroundColor:this.state.phoneText && this.state.passWordText?'#1aad19':'#ccc'}]} onPress = {()=>{this.addUser()}} disabled={!(this.state.phoneText && this.state.passWordText)}>
								<Text style = {styles.loginText}>登录</Text>
							</TouchableOpacity>


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
				<Popup ref={ popup => this.popup = popup}/>
				<Loading ref = { loading => this.loading = loading}/>
			</KeyboardAvoidingView>

		)
	}

}

function mapStateToProps(store) {
	return {
		loading: store.loginIn.loading
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#ffffff',
	},
	goBack: {
		fontSize: checkDeviceHeight(32),
		color: '#0ebe0c',
	},
	goBackBtn: {
		alignSelf: 'flex-start',
		marginLeft: checkDeviceWidth(20),
		marginTop: checkDeviceHeight(35),
	},
	loginTitle: {
		fontSize: checkDeviceHeight(50),
		marginTop: checkDeviceHeight(20),
		color: '#333333',
		marginBottom: checkDeviceHeight(110),
	},
	content: {
		alignItems: 'center',
		flex: 1,
		paddingHorizontal: checkDeviceWidth(40)
	},
	area: {
		width: Dimensions.get('window').width - checkDeviceWidth(80),
		flexDirection: 'row',
		marginBottom: checkDeviceWidth(30),
		alignItems: 'center',
	},
	inputBox: {
		height: checkDeviceHeight(80),
		width: Dimensions.get('window').width - checkDeviceWidth(80),
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ddddde',
		marginBottom: checkDeviceWidth(30),
	},
	areaTitle: {
		fontSize: checkDeviceHeight(30),
		color: '#333333',
		marginRight: checkDeviceWidth(35),
	},
	country: {
		fontSize: checkDeviceHeight(30),
		color: '#333333',
	},
	rightLogo: {
		width: checkDeviceWidth(15),
		height: checkDeviceHeight(30),
		resizeMode: 'contain',
		position: 'absolute',
		right: 0,
	},
	loginImage: {
		width: checkDeviceWidth(25),
		height: checkDeviceHeight(45),
		borderRightWidth: 1,
		borderColor: '#ddddde',
		resizeMode: 'stretch',
	},
	imageBox: {
		width: checkDeviceWidth(125),
		height: checkDeviceHeight(80),
		alignItems: 'center',
		marginRight: checkDeviceWidth(35),
		justifyContent: 'center',
		borderRightWidth: 1,
		borderColor: '#ddddde',
	},
	NumberBefore: {
		color: '#333333',
		fontSize: checkDeviceHeight(30),
	},
	textInput: {
		padding: 0,
		fontSize: checkDeviceHeight(30),
		flex: 1,
	},
	codeBtn: {
		width: checkDeviceWidth(120),
		height: checkDeviceHeight(50),
		borderWidth: 1,
		borderColor: '#333333',
		borderRadius: 3,
		marginRight: checkDeviceWidth(20),
		justifyContent: 'center',
		alignItems: 'center',
	},
	information: {
		color: '#333333',
		fontSize: checkDeviceHeight(20),
	},
	changeLogin: {
		color: '#6e7c99',
		fontSize: checkDeviceHeight(28),
		marginBottom: checkDeviceHeight(60),
	},
	loginText: {
		color: '#fff',
		fontSize: checkDeviceHeight(36),
	},
	Login: {
		width: Dimensions.get('window').width - checkDeviceWidth(80),
		height: checkDeviceHeight(90),
		backgroundColor: '#1aad19',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		marginBottom: checkDeviceHeight(460),
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	footerText: {
		color: '#6e7c99',
		fontSize: checkDeviceHeight(28),
	},
});

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators(Actions, dispatch),
		...bindActionCreators(relationActions, dispatch),
		...bindActionCreators(ApplyFriendAction, dispatch),
		...bindActionCreators(unReadMessageAction, dispatch),
		...bindActionCreators(recentListActions, dispatch),

	}
};

export default connect(mapStateToProps, mapDispatchToProps)(PhoneLogin);