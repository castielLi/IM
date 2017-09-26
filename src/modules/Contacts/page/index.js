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
	TextInput,
	Dimensions
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
var {height, width} = Dimensions.get('window');
export default class Contacts extends ContainerComponent {

	constructor(props) {
		super(props);
	}

	_renderItem = (info) => {
		var txt = '  ' + info.item.title;
		return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('message')}}>
					<View  style={styles.itemBox} >
						<Image source={require('../resource/other.jpg')} style={styles.pic} ></Image>
						<Text style={styles.itemText} keys={info.index}>{txt}</Text>
					</View>
			   </TouchableHighlight>
	}

	_sectionComp = (info) => {
		var txt = info.section.key;
		return <Text style={styles.sectionHeader} keys={info.index}>{txt}</Text>
	}

	render() {
		var sections = [{
			key: "A",
			data: [{
				title: "阿童木",
				pic:''
			}, {
				title: "阿玛尼",
				pic:''
			}, {
				title: "爱多多",
				pic:''
			}]
		}, {
			key: "B",
			data: [{
				title: "表哥",
				pic:''
			}, {
				title: "贝贝",
				pic:''
			}, {
				title: "表弟",
				pic:''
			}, {
				title: "表姐",
				pic:''
			}, {
				title: "表叔",
				pic:''
			}]
		}, {
			key: "C",
			data: [{
				title: "成吉思汗",
				pic:''
			}, {
				title: "超市快递",
				pic:''
			}]
		}, {
			key: "W",
			data: [{
				title: "王磊",
				pic:''
			}, {
				title: "王者荣耀",
				pic:''
			}, {
				title: "往事不能回味",
				pic:''
			}, {
				title: "王小磊",
				pic:''
			}, {
				title: "王中磊",
				pic:''
			}, {
				title: "王大磊",
				pic:''
			}]
		}, ];

		return (
			<View style={styles.container}>
			    <SectionList
			      renderSectionHeader={this._sectionComp}
			      renderItem={this._renderItem}
			      sections={sections}
			      ItemSeparatorComponent={() => <View style={styles.ItemSeparator}><Text></Text></View>}
			      ListHeaderComponent={() => <View style={styles.listHeaderBox}>
			      								<TextInput
			      									style={styles.search}
			      									underlineColorAndroid = 'transparent'
			      								>
			      									<Icon name="search" size={16} color="#aaa" />
			      								</TextInput>
			      							</View>}
				  ListFooterComponent = {
					() => <View style={styles.listFooterBox}><Text style={styles.listFooter}>23位联系人</Text></View>
				  }
				/>
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
	}
})