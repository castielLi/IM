import React,{Component} from 'react';
import {
	Image,
	View,
	Text,
	ListView,
	TouchableHighlight,
	TouchableOpacity,
	Platform,
	StyleSheet,
	Alert,
	Dimensions
}from 'react-native';
import {
    checkDeviceHeight,
    checkDeviceWidth
} from '../../../Core/Helper/UIAdapter';
import ContainerComponent from '../../../Core/Component/ContainerComponent';

export default class Features extends ContainerComponent {
    constructor(props){
        super(props);
        this.render = this.render.bind(this);
        this.state = {

        }
    }
	changeFeatureState = ()=>{
		let newState = !this.props.showFeatures;
		this.props.changeShowFeature(newState);
	}
    goToAddFriends = ()=>{
        this.route.push(this.props,{key: 'AddFriends',routeId: 'AddFriends',params:{}});

    }
	render(){
		return (
			<TouchableHighlight style = {{position:'absolute',width:Dimensions.get('window').width,height:Dimensions.get('window').height}} onPressIn = {()=>{this.changeFeatureState()}}>
			<View style = {styles.container}>
				<TouchableOpacity style = {styles.featureButton} onPress = {()=>{this.changeFeatureState()}}>
					<View style = {styles.featureBox}>
						<Image style={styles.logo} source = {require('./resource/weChat.png')}/>
						<Text style = {styles.Text}>发起群聊</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style = {styles.featureButton} onPress = {()=>{this.changeFeatureState()}}>
					<View style = {styles.featureBox}>
						<Image style={styles.logo} source = {require('./resource/pay.png')}/>
						<Text style = {styles.Text}>收付款</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style = {styles.featureButton} onPress = {()=>{this.changeFeatureState();this.goToAddFriends();}}>
					<View style = {styles.featureBox}>
						<Image style={styles.logo} source = {require('./resource/addFriends.png')}/>
						<Text style = {styles.Text}>添加朋友</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style = {styles.featureButton} onPress = {()=>{this.changeFeatureState()}}>
					<View style = {styles.featureBox}>
						<Image style={styles.logo} source = {require('./resource/sweep.png')}/>
						<Text style = {styles.Text}>扫一扫</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style = {styles.featureButton} onPress = {()=>{this.changeFeatureState()}}>
					<View style = {[styles.featureBox,{borderBottomWidth:0}]}>
					<Image style={styles.logo} source = {require('./resource/help.png')}/>
					<Text style = {styles.Text}>帮助与反馈</Text>
				</View>	
				</TouchableOpacity>
			</View>
			</TouchableHighlight>
		)
	}
}

const styles = StyleSheet.create({
	container:{
		position:'absolute',
		right:0,
		top:checkDeviceHeight(70),
		height:checkDeviceHeight(450),
		marginRight:checkDeviceWidth(20),
		backgroundColor:'#35343a',
		width:checkDeviceWidth(400)
	},
	featureButton:{
		flex:1,

	},
	featureBox:{
		flex:1,
		flexDirection:'row',
		borderBottomWidth:1,
		borderColor:'#000000',
		alignItems:'center',
	},

	logo:{
		height:checkDeviceHeight(40),
		width:checkDeviceWidth(40),
		resizeMode:'stretch',
		marginRight:checkDeviceWidth(30),
		marginLeft:checkDeviceWidth(30),
	},
	Text:{
		color:'#ffffff',
		fontSize:checkDeviceHeight(34),
	},

})