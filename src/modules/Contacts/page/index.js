import React, {
	Component
} from 'react';
import {
	AppRegistry,
	View,
	Text,
	SectionList,
	StyleSheet,
	Image,
	TouchableHighlight,
	TouchableWithoutFeedback,
	TextInput,
	Dimensions
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
var {height, width} = Dimensions.get('window');
var originData = [
		{
			'title':'A',
			'client': [{
					'name': "阿童木",
					'pic':''
				}, {
					'name': "阿玛尼",
					'pic':''
				}, {
					'name': "爱多多",
					'pic':''
				}]
			},
			{
			'title':'B',
			'client': [{
					'name': "办事处",
					'pic':''
				}, {
					'name': "保持",
					'pic':''
				}, {
					'name': "保时捷",
					'pic':''
				}]
			},{
			'title':'C',
			'client': [{
					'name': "参数",
					'pic':''
				}, {
					'name': "处理",
					'pic':''
				}, {
					'name': "长安",
					'pic':''
				}]
			},{
			'title':'D',
			'client': [{
					'name': "德行",
					'pic':''
				}, {
					'name': "地方",
					'pic':''
				}, {
					'name': "德国",
					'pic':''
				}]
			},{
			'title':'E',
			'client': [{
					'name': "任务发图",
					'pic':''
				}, {
					'name': "耳机",
					'pic':''
				}, {
					'name': "二二",
					'pic':''
				}]
			},{
			'title':'F',
			'client': [{
					'name': "分工",
					'pic':''
				}, {
					'name': "返回",
					'pic':''
				}, {
					'name': "发现",
					'pic':''
				}]
			},{
			'title':'G',
			'client': [{
					'name': "分工",
					'pic':''
				}, {
					'name': "返回",
					'pic':''
				}, {
					'name': "发现",
					'pic':''
				}]
			},{
			'title':'H',
			'client': [{
					'name': "分工",
					'pic':''
				}, {
					'name': "返回",
					'pic':''
				}, {
					'name': "发现",
					'pic':''
				}]
			},{
			'title':'I',
			'client': [{
					'name': "index",
					'pic':''
				}, {
					'name': "ice",
					'pic':''
				},]
			},
	]
export default class Contacts extends ContainerComponent {

	constructor(props) {
		super(props);
		this.state={
			data:[
				{key:'',
				data:[]}
			],
			sections:[],
			//右边title导航
			rightSectionItemModalIndex:''
		}

	}
	formateData =(originData)=>{
		var clientInfos = [];
		var clientSections = [];
		originData.forEach((v,i)=>{
			let obj = {};
			obj.key = v.title;
			obj.data = v.client;
			clientInfos.push(obj);
			clientSections.push(v.title); 
		})
		this.setState({
			data:clientInfos,
			sections:clientSections
		})
	}
	onPressRightSectionItemIn = (index) =>{
		this.refs.mySectionList.scrollToLocation({
		animated : true,
		sectionIndex: index,
		itemIndex : 0,
		viewPosition: 0,
		viewOffset : 35
		})
		this.setState({
			rightSectionItemModalIndex:index
		})
	}
	onPressRightSectionItemOut = () =>{
		this.setState({
			rightSectionItemModalIndex:''
		})
	}
	_getSections = ()=>{
        let array = new Array();
        for (let i = 0; i < this.state.sections.length; i++) {
            array.push(
                <View key={i}>
                	<TouchableWithoutFeedback
	                	 onPressIn={this.onPressRightSectionItemIn.bind(this,i)}
	                	 onPressOut={this.onPressRightSectionItemOut}
	                	 //pointerEvents="none"
		                 
		                 ref={'sectionItem' + i}>
	                    <View style={styles.rightSectionView}>
		                    <Text style={styles.rightSectionItem}>{this.state.sections[i]}</Text>
		                    
	                    </View>
	                </TouchableWithoutFeedback>
	                <Text style={[styles.rightSectionItemModal,{right:i===this.state.rightSectionItemModalIndex?50:-999}]}>{this.state.sections[i]}</Text>
                </View>)
        }
        return array;
    }

	componentWillMount(){
		this.formateData(originData);
	}
	_renderItem = (info) => {
		var txt = '  ' + info.item.name;
		return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('message')}}>
					<View  style={styles.itemBox} >
						<Image source={require('../resource/other.jpg')} style={styles.pic} ></Image>
						<Text style={styles.itemText}>{txt}</Text>
					</View>
			   </TouchableHighlight>
	}

	_sectionComp = (info) => {
		var txt = info.section.key;
		return <Text style={styles.sectionHeader}>{txt}</Text>
	}
	_renderHeader = () => {
		return  <View>
					<View style={styles.listHeaderBox}>
						<TextInput
							style={styles.search}
							underlineColorAndroid = 'transparent'
						>
							<Icon name="search" size={16} color="#aaa" />
						</TextInput>
					</View>
					<View style={styles.listOtherUseBox}>
						<TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('message')}}>
							<View>
								<View  style={styles.itemBox} >
									<Image source={require('../resource/newFriends.png')} style={styles.pic} ></Image>
									<Text style={[styles.itemText,{paddingLeft:10}]}>新的朋友</Text>
								</View>
								<View style={styles.ItemSeparator}><Text></Text></View>
							</View>
					   </TouchableHighlight>
					   <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('message')}}>
							<View>
								<View  style={styles.itemBox} >
								<Image source={require('../resource/friendsChat.png')} style={styles.pic} ></Image>
								<Text style={[styles.itemText,{paddingLeft:10}]}>群聊</Text>
							</View>
							<View style={styles.ItemSeparator}><Text></Text></View>
							</View>
					   </TouchableHighlight>
					   <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('message')}}>
							<View>
								<View  style={styles.itemBox} >
								<Image source={require('../resource/public.png')} style={styles.pic} ></Image>
								<Text style={[styles.itemText,{paddingLeft:10}]}>公众号</Text>
							</View>
							<View style={styles.ItemSeparator}><Text></Text></View>
							</View>
					   </TouchableHighlight>
					   <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('message')}}>
							<View>
								<View  style={styles.itemBox} >
								<Image source={require('../resource/logo.png')} style={styles.pic} ></Image>
								<Text style={[styles.itemText,{paddingLeft:10}]}>标签</Text>
							</View>
							<View style={styles.ItemSeparator}><Text></Text></View>
							</View>
					   </TouchableHighlight>
					</View>
				</View>
			      			}
	_renderSeparator = () =>{
		return <View style={styles.ItemSeparator}><Text></Text></View>
	}
	_renderFooter = () =>{
		return <View style={styles.listFooterBox}><Text style={styles.listFooter}>23位联系人</Text></View>
	}
	render() {
		return (
			<View style={styles.container}>
			    <SectionList
			      ref={'mySectionList'}
			      keyExtractor={(item,index)=>("index"+index+item)}
			      renderSectionHeader={this._sectionComp}
			      renderItem={this._renderItem}
			      sections={this.state.data}
			      ItemSeparatorComponent={this._renderSeparator}
			      ListHeaderComponent={this._renderHeader}
				  ListFooterComponent = {this._renderFooter}
				  stickySectionHeadersEnabled={true}
				/>
				<View style={styles.rightSection}>
					{this._getSections()}
				</View>
		    </View>
	);
}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	sectionHeader:{
		height: 30,
		textAlign: 'left', 
		textAlignVertical: 'center', 
		backgroundColor: '#eee', 
		color: '#aaa', 
		fontSize: 16,
		paddingLeft:10
	},
	itemBox:{
		height: 60, 
		flexDirection:'row',
		alignItems:'center',
		paddingLeft:10
	},
	pic:{
		width:40,
		height:40,
		resizeMode:'stretch'
	},
	itemText:{		
		textAlignVertical: 'center', 
		backgroundColor: "#ffffff", 
		color: '#5C5C5C', 
		fontSize: 15
	},
	ItemSeparator:{
		height:1,
		backgroundColor: '#eee', 
	},
	listHeaderBox:{
		backgroundColor: '#ddd', 
		alignItems: 'center', 
		height:50,
		padding:10
	},
	search:{
		flex:1,
		width:width-20,
		backgroundColor:'#fff',
		borderRadius:5,
		color:'#000'
	},
	listFooterBox:{
		borderTopWidth:1,
		borderColor:'#eee',
		backgroundColor: "#ffffff", 
		alignItems: 'center', 
		height: 50
	},
	listFooter:{
		height: 50,
		textAlignVertical: 'center',
		fontSize: 18, 
		color: '#aaa'
	},
	rightSection:{
		position:'absolute',
		right:0,
		top:120,

	},
	rightSectionView:{

	},
	rightSectionItem:{
		fontSize:12,
		color:'#000',
		paddingVertical:5,
		paddingHorizontal:10
	},
	rightSectionItemModal:{
		position:'absolute',
		top:-15,
		right:50,
		width:50,
		height:50,
		backgroundColor:'#ddd',
		borderRadius:10,
		color:'#fff',
		fontSize:20,
		textAlign: 'center', 
		textAlignVertical: 'center', 
	}
})

