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
} from '../../../Core/Helper/UIAdapter';
import IM from '../../../Core/IM';
import MyNavigationBar from '../../../Core/Component/NavigationBar';
import Features from '../../Common/menu/features';
import Icon from 'react-native-vector-icons/FontAwesome';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as featuresAction from '../../Common/menu/reducer/action';

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


let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    sction:{
        height:30
    },
    itemBox:{
        height:50,
        flexDirection:'row',
        paddingHorizontal:15,
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    itemLeftBox:{
        height:40,
        flexDirection:'row',
        alignItems:'center',

    },
    pic:{
        width:30,
        height:30,
        resizeMode:'stretch',
        marginRight:15
    },
    itemText:{
        fontSize:20,
        color:'#000',
        textAlignVertical:'center'
    },
    ItemSeparator:{
        height:1,
        backgroundColor: '#eee',
    },
    arrow:{
        fontSize:20,
        color:'#aaa'
    },
});


class Zoom extends ContainerComponent {
	constructor(props) {
		super(props);
		this.state = {
			
		};
	}

	componentWillMount(){
        styles = super.componentWillMount(styles)
	}

	changeShowFeature=(newState)=>{
		this.setState({showFeatures:newState});
	}
	_renderItem = (info)=>{
		return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('未开发')}}>
					<View style={styles.itemBox}>
						<View  style={styles.itemLeftBox} >
							<Image source={require('../resource/logo.png')} style={styles.pic} ></Image>
							<Text style={styles.itemText}>{info.item.name}</Text>
						</View>
						{/*<Text style={styles.arrow}>{'>'}</Text>*/}
						<Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
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
				<MyNavigationBar
					left = {'云信'}
					right = {[
                        {func:()=>{alert('搜索')},icon:'search'},
                        {func:()=>{this.props.showFeatures()},icon:'list-ul'}
                    ]}
				/>
				<SectionList
			      keyExtractor={(item,index)=>("index"+index+item)}
			      renderSectionHeader={this._renderSection}
			      renderItem={this._renderItem}
			      sections={originData}
			      ItemSeparatorComponent={this._renderSeparator}
				  stickySectionHeadersEnabled={false} 
				/>
				<Features navigator={this.props.navigator}/>

			</View>
		)
	}
}


const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return{
        ...bindActionCreators(featuresAction, dispatch)

    }};

export default connect(mapStateToProps, mapDispatchToProps)(Zoom);

