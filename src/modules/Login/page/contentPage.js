import React,{Component}from 'react';
import {View,TextInput,Text,Image,TouchableOpacity,StyleSheet,Dimensions,Alert}from 'react-native';
import SQLite from '../sqlite/sqlite';
import {
    Navigator
} from 'react-native-deprecated-custom-components';
import phoneLogin from './phoneLogin';
let sqlite = new SQLite();
let db;
export default class ContentPage extends Component {
	componentWillUnmount() {
		sqlite.close();
	}
	static navigationOptions ={
		header:null,
	}
	loginOut=()=>{
		this.props.navigator.push({
			sceneConfig: Navigator.SceneConfigs.FloatFromLeft,
			component: phoneLogin,
		});
		sqlite.deleteData();
	}
	render(){
		return (
			<View>
				<Text>呵呵呵呵 登录进来咯</Text>
				<TouchableOpacity onPress = {()=>{this.loginOut()}}><Text>登出</Text></TouchableOpacity>
			</View>

			)
	}
}