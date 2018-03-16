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
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as featuresAction from './reducer/action';

class Features extends ContainerComponent {
    constructor(props){
        super(props);
        this.render = this.render.bind(this);
        this.state = {
			isShow : false,
        }
    }

    componentWillReceiveProps(_props) {
		if(_props.FeaturesStore !== this.state.isShow){

		}
    }
    // shouldComponentUpdate(_props,_state){
		// if(this.state.isShow){
    //         this.setState({
    //             isShow:_props.FeaturesStore
    //         })
		// }
    // }
	changeFeatureState = ()=>{
		//let newState = !this.props.showFeatures;
		//this.props.changeShowFeature(newState);
		// let show = !this.state.isShow;
		// this.setState({
         //    isShow:show
		// })

		this.props.hideFeatures();
	}
    goToChooseClient = ()=>{
        this.route.push(this.props,{key: 'ChooseClient',routeId: 'ChooseClient',params:{}});

    }
    goToAddFriends = ()=>{
        this.route.push(this.props,{key: 'AddFriends',routeId: 'AddFriends',params:{}});

    }

    scanCode = ()=>{
        this.route.push(this.props,{key: 'ScanCode',routeId: 'ScanCode',params:{}});
    }

	render(){
		if(this.props.FeaturesStore){
            return (
				<TouchableHighlight style = {{position:'absolute',width:Dimensions.get('window').width,height:Dimensions.get('window').height}} onPressIn = {()=>{this.changeFeatureState()}}>
					<View style = {styles.container}>
						<TouchableOpacity style = {styles.featureButton} onPress = {()=>{this.changeFeatureState();this.goToChooseClient();}}>
							<View style = {styles.featureBox}>
								<Image style={styles.logo} source = {require('./resource/weChat.png')}/>
								<Text style = {styles.Text}>发起群聊</Text>
							</View>
						</TouchableOpacity>
						{/*<TouchableOpacity style = {styles.featureButton} onPress = {()=>{this.changeFeatureState()}}>*/}
							{/*<View style = {styles.featureBox}>*/}
								{/*<Image style={styles.logo} source = {require('./resource/pay.png')}/>*/}
								{/*<Text style = {styles.Text}>收付款</Text>*/}
							{/*</View>*/}
						{/*</TouchableOpacity>*/}
						<TouchableOpacity style = {styles.featureButton} onPress = {()=>{this.changeFeatureState();this.goToAddFriends();}}>
							<View style = {styles.featureBox}>
								<Image style={styles.logo} source = {require('./resource/addFriends.png')}/>
								<Text style = {styles.Text}>添加朋友</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity style = {styles.featureButton} onPress = {()=>{this.changeFeatureState(); this.scanCode()}}>
							<View style = {styles.featureBox}>
								<Image style={styles.logo} source = {require('./resource/sweep.png')}/>
								<Text style = {styles.Text}>扫一扫</Text>
							</View>
						</TouchableOpacity>
						{/*<TouchableOpacity style = {styles.featureButton} onPress = {()=>{this.changeFeatureState()}}>*/}
							{/*<View style = {[styles.featureBox,{borderBottomWidth:0}]}>*/}
								{/*<Image style={styles.logo} source = {require('./resource/help.png')}/>*/}
								{/*<Text style = {styles.Text}>帮助与反馈</Text>*/}
							{/*</View>*/}
						{/*</TouchableOpacity>*/}
					</View>
				</TouchableHighlight>
            )
		}
		else{
			return null;
		}
	}
}

const styles = StyleSheet.create({
	container:{
		position:'absolute',
		right:0,
		top:checkDeviceHeight(70),
		// height:checkDeviceHeight(450),
		marginRight:checkDeviceWidth(20),
		backgroundColor:'#35343a',
		width:checkDeviceWidth(300)
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
		paddingVertical:8
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

const mapStateToProps = state => ({
    FeaturesStore : state.FeaturesStore.isShow,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(featuresAction, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps,null,{withRef : true})(Features);