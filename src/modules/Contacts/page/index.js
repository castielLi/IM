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
    TouchableOpacity,
    InteractionManager
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import {initDataFormate} from './formateData';
import * as featuresAction from '../../Common/menu/reducer/action';
import * as tabBarActions from '../../MainTabbar/reducer/action';
import * as applyActions from '../reducer/action';
import Features from '../../Common/menu/features';
import AppPageMarkEnum from '../../../App/Enum/AppPageMarkEnum';
import TabTypeEnum from '../../../TSController/Enums/TabTypeEnum';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';
import MySectionList from '../../Common/Component/MySectionList/'
let currentObj = undefined;

class Contacts extends AppComponent {

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

			// isShowSearchInput:false,
			text:'',//textInput文字

            contacts:[],
		}
        this.relationStore = [];
        currentObj = this;

        this.userController =  this.appManagement.getUserLogicInstance();
        this.applyController = this.appManagement.getApplyLogicInstance();
	}

    componentDidMount(){
        InteractionManager.runAfterInteractions(()=> {
            this.userController.getUserContactList(false, null);
            this.applyController.getUncheckApplyFriendCount();
        });
    }

    _refreshUI(type,params){
    	//这里如果没有点击通讯录界面是不会进行初始化的，不会初始化就会导致下层通知上层的时候不会显示contact 申请的红点
        switch (type){
            case AppPageMarkEnum.Contacts:
                currentObj.setState({
                    contacts:params
                });
                break;
			case AppPageMarkEnum.UnReadMessage:
                if(params.type == TabTypeEnum.Contact){
                    //显示未读好友申请红点
                    currentObj.props.showUnReadMark();
				}
				break;
			case AppPageMarkEnum.ChangeRemark:
                currentObj.setState({
                    contacts:currentObj.state.contacts
                });
        }
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
        this.applyController = undefined;
    }

    //todo:头像应该还有本地地址
	_renderItem = (info) => {
		let name = info.item.Remark != "" ? info.item.Remark:info.item.Nickname;
		let path = this.userController.getAccountHeadImagePath(info.item.Account);
		// let lastItem = (info.index + 1) == info.section.data.length?true:false;
		return (
			<TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.goToClientInfo.bind(this,info.item.Account)}>
				<View  style={styles.itemBox} >
					<ImagePlaceHolder style={styles.pic} imageUrl ={path}/>
					<Text style={styles.itemText}>{name}</Text>
				</View>
			</TouchableHighlight>
		)

	};
	_sectionComp = (info) => {
		var txt = info.section.key;
		return  <View style={styles.sectionHeaderBox}>
					<Text style={styles.sectionHeader}>{txt}</Text>
				</View>
	};
	_renderHeader = () => {
		return  <View>
					{/*<View style={styles.listHeaderBox}>*/}
						{/*<View style={{flex:1,flexDirection:'row',backgroundColor:'#fff',alignItems:'center',borderRadius:5,}}>*/}
                            {/*{this.state.isShowSearchInput ?*/}
								{/*<TextInput*/}
									{/*style={styles.search}*/}
									{/*underlineColorAndroid='transparent'*/}
									{/*placeholder = '搜索'*/}
									{/*autoFocus = {true}*/}
									{/*defaultValue = {this.state.text}*/}
									{/*onBlur = {()=>{if(this.state.text === ''){this.setState({isShowSearchInput:false})}}}*/}
									{/*onChangeText={(v)=>{*/}
										{/*if(v===''){*/}
											{/*this.setState({isShowSearchInput:false})*/}
										{/*}*/}
                                        {/*this.setState({text:v})*/}
									{/*}*/}
									{/*}*/}
								{/*>*/}
								{/*</TextInput>:*/}
								{/*<TouchableWithoutFeedback onPress={()=>{this.setState({isShowSearchInput:true})}}>*/}
									{/*<View style={styles.searchView}>*/}
										{/*<Icon name="search" size={14} color="#aaa" /><Text style={{color:'#aaa',marginLeft:10,fontSize:14}}>搜索</Text>*/}
									{/*</View>*/}
								{/*</TouchableWithoutFeedback>*/}
                            {/*}*/}
                            {/*{this.state.text === ''?null:<Icon name="times-circle" size={20} color="#aaa" onPress={()=>{this.setState({text:'',isShowSearchInput:false})}} style={{marginHorizontal:10}}/>}*/}
						{/*</View>*/}

					{/*</View>*/}
					<View style={styles.listOtherUseBox}>
						<TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.goToNewFriend}>
							<View  style={styles.itemBox} >
								<Image source={require('../resource/newFriends.png')} style={styles.pic} />
								<Text style={styles.itemText}>新的朋友</Text>
								{this.props.unReadApplyMessageMark?
									<View style={styles.circle}>
										{/*<Text style={{fontSize:12,color:'#fff'}}>{this.props.unDealRequestNumber}</Text>*/}
									</View>:
									null
								}
							</View>
					   </TouchableHighlight>
						<View style={styles.ItemSeparator}/>
					   <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.goToGroupList}>
						   <View  style={styles.itemBox} >
								<Image source={require('../resource/friendsChat.png')} style={styles.pic} />
								<Text style={styles.itemText}>群聊</Text>
						   </View>
					   </TouchableHighlight>
						<View style={styles.ItemSeparator}/>
					   <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('即将推出...')}}>
						   <View  style={styles.itemBox} >
								<Image source={require('../resource/public.png')} style={styles.pic} />
								<Text style={styles.itemText}>公众号</Text>
						   </View>
					   </TouchableHighlight>
					</View>
				</View>
			      			};
	_renderSeparator = () =>{
		return <View style={styles.ItemSeparator}/>
	};
	_renderFooter = () =>{
        let amount = 0;
		for(let i = 0; i< this.relationStore.length;i++){
			amount+= this.relationStore[i].data.length;
		}
		return <View style={styles.listFooterBox}><Text style={styles.listFooter}>{amount+'位联系人'}</Text></View>
	};

    goToGroupList = ()=>{
        this.route.push(this.props,{key:'Contacts',routeId:'GroupList',params:{}});
    };
    goToNewFriend = () =>{
        if(this.props.unDealRequestMark){
            this.props.hideUnDealRequest();
        }
        if(this.props.unReadApplyMessageMark){
            this.props.hideUnReadMark();
        }
        this.route.push(this.props,{key:'NewFriend',routeId:'NewFriend',params:{}});
    };
    goToClientInfo = (Account)=>{
        this.route.push(this.props,{key:'ClientInformation',routeId:'ClientInformation',params:{clientId:Account}});
    };

	render() {
		let objData = initDataFormate(this.state.contacts,this.state.text);
		this.relationStore = objData.SectionArray;
		this.sectionStore = objData.KeyArray;
		return (
			<View style={styles.container}>
				<MyNavigationBar
					left = {'云信'}
					right={[
                        {func:()=>{
                            this.route.push(this.props,{key: 'Search',routeId: 'Search'});
						},icon:'search'},
                        {func:()=>{this.props.showFeatures()},icon:'list-ul'}
                    ]}
				/>
				<MySectionList
					ref={'mySectionList'}
					keyExtractor={(item,index)=>("index"+index+item)}
					renderSectionHeader={this._sectionComp}
					renderItem={this._renderItem}
					sections={this.relationStore}
					keyArray={this.sectionStore}
					ItemSeparatorComponent={this._renderSeparator}
					ListHeaderComponent={this._renderHeader}
					ListFooterComponent = {this._renderFooter}
					stickySectionHeadersEnabled={true}
					viewOffset={22}
				/>
                <Features navigator={this.props.navigator}/>
		    </View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
        backgroundColor: "#fff"
	},
    sectionHeaderBox:{
        height: 22,
        backgroundColor: '#ebebeb',
		paddingLeft:10,
		justifyContent:'center'
    },
	sectionHeader:{
		color: '#989898',
		fontSize: 14,
	},
	itemBox:{
		height: 54,
		flexDirection:'row',
		alignItems:'center',
		paddingHorizontal:15
	},
	pic:{
		width:40,
		height:40,
		borderRadius:20
	},
	itemText:{		
		textAlignVertical: 'center',
		color: '#000',
		fontSize: 15,
		marginLeft:10
	},
	ItemSeparator:{
		// height:1,
		borderBottomColor : '#eee',
		borderBottomWidth:1,
		marginHorizontal:15
		// backgroundColor: '#eee',
	},
	listHeaderBox:{
		backgroundColor: '#ddd',
		height:50,
		padding:10,
	},
	search:{
		flex:1,
        height:30,
		backgroundColor:'#fff',
		color:'#000',
		paddingVertical:0,
        borderRadius:5,
	},
    searchView:{
        flex:1,
		height:30,
        backgroundColor:'#fff',
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
        borderRadius:5,
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
	},
    circle:{
		width:14,
		height:14,
		backgroundColor:'red',
		borderRadius:7,
		justifyContent:'center',
		alignItems:'center',
		position:'absolute',
		right:50,
		bottom:23
	}
})

const mapStateToProps = state => ({
    unDealRequestMark:state.unReadMessageStore.unDealRequestMark,
    unReadApplyMessageMark:state.unReadApplyMessageStore.unReadApplyMessageMark
});

const mapDispatchToProps = (dispatch) => {
  return{

      ...bindActionCreators(featuresAction, dispatch),
      ...bindActionCreators(tabBarActions, dispatch),
	  ...bindActionCreators(applyActions,dispatch)

  }};

 export default connect(mapStateToProps, mapDispatchToProps)(Contacts);