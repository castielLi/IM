import React, {
	Component
} from 'react';
import {
	Image,
	View,
	Text,
	ListView,
	TouchableHighlight,
	TouchableOpacity,
	Platform,
	StyleSheet,
	SectionList
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {
	checkDeviceHeight,
	checkDeviceWidth
} from './check';
import IM from '../../../Core/IM';
import NavigationBar from 'react-native-navbar';
import Features from './features';

var originData = [
		{
			'key':'1',
			'data': [{
					'name': "圈子",
				}]
			},
			{
			'key':'2',
			'data': [{
					'name': "扫一扫",
				}, {
					'name': "摇一摇",
				}]
			},
			{
			'key':'3',
			'data': [{
					'name': "附近的人",
				}, {
					'name': "购物",
				}]
			},
			{
			'key':'4',
			'data': [{
					'name': "游戏",
				}]
			},			
	]

export default class Zoom extends ContainerComponent {
	constructor(props) {
		super(props);
		this.state = {
			showFeatures:false,//显示功能块组件 
			
		};
	}

	changeShowFeature=(newState)=>{
		this.setState({showFeatures:newState});
	}
	_rightButton = ()=>{
		return (
                <View style = {styles.RightLogo}>
                    <TouchableOpacity style = {{marginRight:checkDeviceWidth(60)}}>
                        <Image style = {styles.headerLogo} source = {require('../resource/search.png')}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {()=>{this.setState({showFeatures:!this.state.showFeatures})}}>
                        <Image style = {[styles.headerLogo,{marginRight:0}]} source = {require('../resource/features.png')}></Image>
                    </TouchableOpacity>
                </View>
		)
	}
	_renderItem = (info)=>{
		return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('未开发')}}>
					<View  style={styles.itemBox} >
						<Image source={require('../resource/logo.png')} style={styles.pic} ></Image>
						<Text style={styles.itemText}>{info.item.name}</Text>
					</View>
			   </TouchableHighlight>
	}
	_renderSection = ()=>{
		return <View style={styles.sction}></View>
	}
	_renderSeparator = () =>{
		return <View style={styles.ItemSeparator}></View>
	}
	render() {
		let PopContent = this.PopContent;
		return (
			<View style = {styles.container}>
				<NavigationBar
					tintColor = '#38373d'
					leftButton = {<Text style={styles.headerTitle}>云信</Text>}
					rightButton= {this._rightButton()}
				/>
				<SectionList
			      keyExtractor={(item,index)=>("index"+index+item)}
			      renderSectionHeader={this._renderSection}
			      renderItem={this._renderItem}
			      sections={originData}
			      ItemSeparatorComponent={this._renderSeparator}
				  stickySectionHeadersEnabled={false} 
				/>
				{
					this.state.showFeatures?<Features changeShowFeature = {this.changeShowFeature} showFeatures = {this.state.showFeatures}></Features>:null
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f2f2f2"
	},
	headerTitle: {
		color: '#ffffff',
		fontSize: checkDeviceHeight(36),
		marginLeft: checkDeviceWidth(20),
		textAlignVertical:'center',
	},
	RightLogo: {
		marginRight:checkDeviceWidth(40),
		flexDirection: 'row',
		alignItems:'center',
	},
	headerLogo: {
		height: checkDeviceWidth(40),
		width: checkDeviceHeight(40),
		resizeMode: 'stretch',
	},
	sction:{
		height:30
	},
	itemBox:{
		height:60,
		flexDirection:'row',
		alignItems:'center',
		backgroundColor:'#fff'
	},
	pic:{
		width:30,
		height:30,
		resizeMode:'stretch',
		marginHorizontal:20,
	},
	itemText:{
		fontSize:20,
		color:'#000'
	},
	ItemSeparator:{
		height:1,
		backgroundColor: '#eee', 
	},
});


