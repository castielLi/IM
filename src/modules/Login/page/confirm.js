import React,{Component}from 'react';
import {View,TextInput,Text,Image,TouchableOpacity,StyleSheet,Dimensions,Alert}from 'react-native';
import {checkDeviceHeight,checkDeviceWidth} from './check';
export default class Confirm extends Component {
	cancel = ()=>{
		let showConfirm = false;
		this.props.cancelSend(showConfirm);
	}

	sure = ()=>{
		let showConfirm = false;
		//发送短信



		this.props.cancelSend(showConfirm);
		alert('发送成功');
	}
	render(){
		return (
			<View style = {styles.backContainer}>
				<View style = {styles.confirmBox}>
					<View style = {styles.confirmContent}>
						<Text style = {styles.confirmNum}>确认手机号码</Text>
						<Text style = {styles.confirmText}>我们将发送验证码短信到下面的手机号码:</Text>
						<Text style = {styles.phoneNumber}>{'+86'+ this.props.phoneText}</Text>
						<View style = {styles.confirmBtn}>
							<TouchableOpacity onPress = {()=>{this.sure()}}><Text style = {styles.sure}>确定</Text></TouchableOpacity>
							<TouchableOpacity onPress = {()=>{this.cancel()}}><Text style = {styles.cancel}>取消</Text></TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	backContainer:{
		position:'absolute',
		width:Dimensions.get('window').width,
		height:Dimensions.get('window').height,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'rgba(153,153,153,0.6)',
	},
	confirmBox:{
		width:checkDeviceWidth(535),
		height:checkDeviceHeight(350),
		backgroundColor:'#ffffff'
	},
	confirmContent:{
		marginLeft:checkDeviceWidth(40),
		marginRight:checkDeviceWidth(40),
	},
	confirmNum:{
		marginTop:checkDeviceHeight(40),
		marginBottom:checkDeviceHeight(40),
		fontSize:checkDeviceHeight(36),
		color:'#333333',
	},
	confirmText:{
		marginBottom:checkDeviceHeight(15),
		fontSize:checkDeviceHeight(30),
		color:'#808080',
	},
	phoneNumber:{
		marginBottom:checkDeviceHeight(65)-30,
		color:'#333333',
		fontSize:checkDeviceHeight(30),
	},
	confirmBtn:{
		flexDirection:'row',
		justifyContent:'flex-end',
	},
	sure:{
		marginRight:checkDeviceWidth(40),
		fontSize:checkDeviceHeight(30),
		color:'#1aad19',
	},
	cancel:{
		color:'#808080',
		fontSize:checkDeviceHeight(30),
	},
})