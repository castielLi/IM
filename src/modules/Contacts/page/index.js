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
	Dimensions,
    TouchableOpacity
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as recentListActions from '../../RecentList/reducer/action';
import * as contactsActions from '../reducer/action';
import User from '../../../Core/User';
import MyNavigationBar from '../../../Core/Component/NavigationBar';
import {initSection,initDataFormate} from './formateData';
var {height, width} = Dimensions.get('window');
import Features from '../../Common/menu/features';

class Contacts extends ContainerComponent {

	constructor(props) {
		super(props);
		this.state={
			data:[
				{key:'',
				data:[]}
			],
			sections:[],
			totalItemLength:0,
			//右边title导航
			rightSectionItemModalIndex:'',

            showFeatures:false,//显示功能块组件
		}
        this.relationStore = []
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
		if(this.relationStore.length === 0){
			return null
		}else{
            let sections = initSection(this.relationStore)
            let array = new Array();
            for (let i = 0; i < sections.length; i++) {
                array.push(
					<View key={i}>
						<TouchableWithoutFeedback
							onPressIn={this.onPressRightSectionItemIn.bind(this,i)}
							onPressOut={this.onPressRightSectionItemOut}
							//pointerEvents="none"
							ref={'sectionItem' + i}>
							<View style={styles.rightSectionView}>
								<Text style={styles.rightSectionItem}>{sections[i]}</Text>
							</View>
						</TouchableWithoutFeedback>
                        {i===this.state.rightSectionItemModalIndex?<Text style={styles.rightSectionItemModal}>{sections[i]}</Text>:null}
					</View>)
            }
            return array;
		}
    }

	goToChat = (item)=>{
		//this.route.push(this.props,{key:'ChatDetail',routeId:'ChatDetail',params:{client:item.name,type:item.type}});
        this.route.push(this.props,{key:'ClientInformation',routeId:'ClientInformation',params:{hasRelation:true,Relation:item}});

    }
	_renderItem = (info) => {
		var txt = '  ' + info.item.Nick;
		return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.goToChat.bind(this,info.item)}>
					<View  style={styles.itemBox} >
						<Image source={{uri:info.item.avator}} style={styles.pic} ></Image>
						<Text style={styles.itemText}>{txt}</Text>
					</View>
			   </TouchableHighlight>
	}

	_sectionComp = (info) => {
		var txt = info.section.key;
		return <Text style={styles.sectionHeader}>{txt}</Text>
	}
    goToNewFriend = () =>{
        this.route.push(this.props,{key:'NewFriend',routeId:'NewFriend',params:{}});

    }
	_renderHeader = () => {
		return  <View>
					<View style={styles.listHeaderBox}>
						<TextInput
							style={styles.search}
							underlineColorAndroid = 'transparent'
						>
						</TextInput>
					</View>
					<View style={styles.listOtherUseBox}>
						<TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.goToNewFriend}>
							<View style={styles.ItemSeparator}>
								<View  style={styles.itemBox} >
									<Image source={require('../resource/newFriends.png')} style={styles.pic} ></Image>
									<Text style={[styles.itemText,{paddingLeft:10}]}>新的朋友</Text>
								</View>
							</View>
					   </TouchableHighlight>
					   <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{

                           this.route.push(this.props,{key:'Contacts',routeId:'GroupList',params:{}});
					   }}>
						   <View style={styles.ItemSeparator}>
								<View  style={styles.itemBox} >
								<Image source={require('../resource/friendsChat.png')} style={styles.pic} ></Image>
								<Text style={[styles.itemText,{paddingLeft:10}]}>群聊</Text>
							</View>
							</View>
					   </TouchableHighlight>
					   <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('message')}}>
						   <View style={styles.ItemSeparator}>
								<View  style={styles.itemBox} >
								<Image source={require('../resource/public.png')} style={styles.pic} ></Image>
								<Text style={[styles.itemText,{paddingLeft:10}]}>公众号</Text>
							</View>
							</View>
					   </TouchableHighlight>
					   <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('message')}}>
						   <View style={styles.ItemSeparator}>
								<View  style={styles.itemBox} >
								<Image source={require('../resource/logo.png')} style={styles.pic} ></Image>
								<Text style={[styles.itemText,{paddingLeft:10}]}>标签</Text>
								</View>
							</View>
					   </TouchableHighlight>
					</View>
				</View>
			      			}
	_renderSeparator = () =>{
		return <View style={styles.ItemSeparator}><Text></Text></View>
	}
	_renderFooter = () =>{
		return <View style={styles.listFooterBox}><Text style={styles.listFooter}>{this.props.relationStore.length+'位联系人'}</Text></View>
	}
    goToAddFriends = ()=>{
        this.route.push(this.props,{key:'AddFriends',routeId:'AddFriends',params:{}});

    }
		//定义上导航的右按钮
	_rightButton() {
			return <TouchableOpacity onPress={this.goToAddFriends}>
						<Text style={styles.moreUse}>+</Text>
			       </TouchableOpacity>
		}


    changeShowFeature=(newState)=>{
        this.setState({showFeatures:newState});
    }
	render() {
		this.relationStore = initDataFormate('private',this.props.relationStore);
		return (
			<View style={styles.container}>
				<MyNavigationBar
					left = {'云信'}
					right={[
                        {func:()=>{alert('搜索')},icon:'search'},
                        {func:()=>{this.setState({showFeatures:!this.state.showFeatures})},icon:'list-ul'}
                    ]}
				/>
			    <SectionList
			      ref={'mySectionList'}
			      keyExtractor={(item,index)=>("index"+index+item)}
			      renderSectionHeader={this._sectionComp}
			      renderItem={this._renderItem}
			      sections={this.relationStore}
			      ItemSeparatorComponent={this._renderSeparator}
			      ListHeaderComponent={this._renderHeader}
				  ListFooterComponent = {this._renderFooter}
				  stickySectionHeadersEnabled={true}
				/>
				<View style={styles.rightSection}>
					{this._getSections()}
				</View>
                {
                    this.state.showFeatures?<Features changeShowFeature = {this.changeShowFeature} showFeatures = {this.state.showFeatures} navigator={this.props.navigator}></Features>:null
                }
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
		flex:1,
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
		// height:1,
		borderBottomColor : '#eee',
		borderBottomWidth:1
		// backgroundColor: '#eee',
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
    moreUse:{
		color:'#fff',
		fontSize:30,
		textAlignVertical:'center',
		marginRight:20
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
		fontSize: 15,
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

const mapStateToProps = state => ({
    relationStore: state.relationStore
});

const mapDispatchToProps = (dispatch) => {
  return{
    ...bindActionCreators(recentListActions, dispatch),
      ...bindActionCreators(contactsActions, dispatch),

  }};

 export default connect(mapStateToProps, mapDispatchToProps)(Contacts);