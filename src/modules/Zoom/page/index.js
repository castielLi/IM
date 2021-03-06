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
import AppComponent from '../../../Core/Component/AppComponent';
import {
	checkDeviceHeight,
	checkDeviceWidth
} from '../../../Core/Helper/UIAdapter';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
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
					'icon':'zoom'
				}]
			},
			{
			'key':'2',
			'data': [{
					'name': "扫一扫",
                	'icon':'sao'
				}]
			},
			// {
			// 'key':'3',
			// 'data': [{
			// 		'name': "附近的人",
			// 	}, {
			// 		'name': "购物",
			// 	}]
			// },
			// {
			// 'key':'4',
			// 'data': [{
			// 		'name': "游戏",
			// 	}]
			// },
	];

class Zoom extends AppComponent {
	constructor(props) {
		super(props);
	}

    componentWillUnmount(){
        super.componentWillUnmount();
    }

	componentWillMount(){
        styles = super.componentWillMount(styles)
	}

	itemClick = (info)=>{
		switch (info.item.name){
			case "扫一扫":
                this.route.push(this.props,{key: 'ScanCode',routeId: 'ScanCode',params:{}});
                break;
			default:
				break;
		}
	}

    chooseImage = (name)=>{
        switch (name){
			case '圈子':
                return	<Image source={require('../resource/zoom.png')} style={styles.pic} />;
            case '扫一扫':
                return	<Image source={require('../resource/sao.png')} style={styles.pic} />;
            // case '摇一摇':
            //     return	<Image source={require('../resource/yao.png')} style={styles.pic} />;
            // case '附近的人':
            //     return	<Image source={require('../resource/place.png')} style={styles.pic} />;
            // case '购物':
            //     return	<Image source={require('../resource/shop.png')} style={styles.pic} />;
            // case '游戏':
            //     return	<Image source={require('../resource/game.png')} style={styles.pic} />;
            default:
                break;
		}
	}
	_renderItem = (info)=>{
		return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>this.itemClick(info)}>
					<View style={styles.itemBox}>
						<View  style={styles.itemLeftBox} >
							{this.chooseImage(info.item.name)}
							<Text style={styles.itemText}>{info.item.name}</Text>
						</View>
						<Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
					</View>
			   </TouchableHighlight>
	}
	_renderSection = ()=>{
		return <View style={styles.sction}/>
	}
	_renderSeparator = () =>{
		return <View style={styles.ItemSeparator}/>
	}
	render() {
		let PopContent = this.PopContent;
		return (
			<View style = {styles.container}>
				<MyNavigationBar
					left = {'云信'}
					right = {[
                        {func:()=>{
                            this.route.push(this.props,{key: 'Search',routeId: 'Search'});
						},icon:'search'},
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
let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ebebeb"
    },
    sction:{
        height:20
    },
    itemBox:{
        height:40,
        flexDirection:'row',
        paddingHorizontal:15,
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    itemLeftBox:{
        height:30,
        flexDirection:'row',
        alignItems:'center',

    },
    pic:{
        width:25,
        height:25,
        resizeMode:'contain',
        marginRight:15
    },
    itemText:{
        fontSize:15,
        color:'#000',
        textAlignVertical:'center'
    },
    ItemSeparator:{
        height:1,
        backgroundColor: '#eee',
    },
    arrow:{
        fontSize:15,
        color:'#aaa'
    },
});

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return{
        ...bindActionCreators(featuresAction, dispatch)

    }};

export default connect(mapStateToProps, mapDispatchToProps)(Zoom);

