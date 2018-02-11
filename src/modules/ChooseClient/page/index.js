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
    FlatList,
    TouchableOpacity
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import AppManagement from '../../../App/AppManagement'
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import {initDataFormate,initFlatListData} from './formateData';
var {height, width} = Dimensions.get('window');
let currentObj = undefined;
let title = null;
let currentAccount = undefined;

import UserController from '../../../TSController/UserController';
let userController = undefined;

class ChooseClient extends AppComponent {

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

			chooseArr:[],//选择的好友的id
            chooseObj:[],//选择的好友的id
			text:'',//输入框文字,
            isShowFlatList:false,
            relationStore:[],
            sectionStore:[],

            contacts:[]

        }
        this.splNeedArr = [];
		this._rightButton = this._rightButton.bind(this);
		currentObj = this;

        userController =  UserController.getSingleInstance();
        currentAccount = userController.getCurrentAccount()
	}

    componentWillUnmount(){
        super.componentWillUnmount();
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
		if(this.state.relationStore.length === 0){
			return null
		}else{
            let sections = this.state.sectionStore;
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

    componentWillMount(){
		if(this.props.members){
			this.hasGroup = true;
			title = '选中联系人'
		}
		else{
			title = '发起群聊'
		}
	}
	componentDidMount(){

		userController.getUserContactList(false,(contact)=>{
            let contacts = contact;
            let data = initDataFormate(contact);
            let relationStore = data.needArr;
            let sectionStore = data.sectionArr;
            currentObj.setState({
                contacts,
                sectionStore,
                relationStore
            })
		});
	}
    choose=(item,hasMember)=>{
    	if(hasMember) return;
		//改变选中颜色{Account:true,Account:false...}
		this.state.chooseObj[item.Account] = !this.state.chooseObj[item.Account];
		let obj = {...this.state.chooseObj};
		this.setState({
            chooseObj:obj
		})
		//对象转为所需数组
		let arr = Object.keys(obj);
		let needArr = [];
		let concatList = initFlatListData(this.state.contacts,'');
		for(let i=0;i<arr.length;i++){
			//已选中 选项
			if(obj[arr[i]]){
				for(let j=0;j<concatList.length;j++){
					if(concatList[j].Account === arr[i]){
                        needArr.push(concatList[j]);
                        break;
					}
				}
			}
		}
        this.setState({
            chooseArr:needArr,
			isShowFlatList:false,
			text:'',
            relationStore:this.state.relationStore.concat()
        })
	}

    circleStyle = (info,hasMember)=>{
    	if(!this.hasGroup){
    		return (
				<View style={[styles.circle,{backgroundColor:this.state.chooseObj[info.item.Account]?'green':'transparent'}]}/>
			)
		}else{
    		if(hasMember){
    			return <View style={[styles.circle,{backgroundColor:'red'}]}/>
			}else{
    			return <View style={[styles.circle,{backgroundColor:this.state.chooseObj[info.item.Account]?'green':'transparent'}]}/>
			}
		}
	}

    _renderAvator= (Obj)=>{
        if(Obj){
            if((!Obj.LocalImage||Obj.LocalImage === '')&&!Obj.avator){
                return 	<Image style = {styles.pic} source = {require('../resource/avator.jpg')}></Image>

            }
            return 	<Image style = {styles.pic} source = {{uri:(Obj.LocalImage&&Obj.LocalImage!=='')?Obj.LocalImage:Obj.avator}}></Image>

        }else{
            return null
        }
    }
	_renderItem = (info) => {
		var txt = '  ' + info.item.Nickname;
		let hasMember;
        if(this.hasGroup){
            hasMember = this.props.members.indexOf(info.item.Account);
            hasMember !== -1 ? hasMember = true : hasMember = false;
		}
		return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{this.choose(info.item,hasMember)}}>
					<View  style={[styles.itemBox,this.state.isShowFlatList?{borderBottomWidth:1,borderColor:'#bbb'}:{}]} >
						{this.circleStyle(info,hasMember)}
                        {this._renderAvator(info.item)}
						{/*<Image source={{uri:info.item.avator}} style={styles.pic} ></Image>*/}
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
    	if(this.hasGroup) return null;
		return  <View>
					<View style={styles.listOtherUseBox}>

					   <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('message')}}>
						   <View style={styles.ItemSeparator}>
								<View  style={styles.itemBox} >
								<Text style={[styles.itemText,{paddingLeft:10}]}>选择一个群</Text>
							</View>
							</View>
					   </TouchableHighlight>
					   <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('message')}}>
						   <View style={styles.ItemSeparator}>
								<View  style={styles.itemBox} >
								<Text style={[styles.itemText,{paddingLeft:10}]}>面对面建群</Text>
								</View>
							</View>
					   </TouchableHighlight>
					</View>
				</View>
			      			}
	_renderSeparator = () =>{
		return <View style={styles.ItemSeparator}><Text></Text></View>
	}

    goToAddFriends = ()=>{
        this.route.push(this.props,{key:'AddFriends',routeId:'AddFriends',params:{}});

    }
		//定义上导航的右按钮
	_rightButton() {

        let chooseArr = this.state.chooseArr;
		let accounts = "";
		let Nicks = "";
		let splNeedArr = [];
		//拼接选中用户id

		if(chooseArr.length == 1){
            accounts+= chooseArr[0].Account;
            Nicks += chooseArr[0].Nickname;
		}else{
            for(let item in chooseArr){

                splNeedArr.push({Account:chooseArr[item].Account});
                if(item < chooseArr.length - 1){
                    Nicks += chooseArr[item].Nickname+",";
                    accounts+= chooseArr[item].Account+",";
                }else{
                    Nicks += chooseArr[item].Nickname;
                    accounts+= chooseArr[item].Account;
                }
            }
		}

		this.splNeedArr = splNeedArr;
		// accounts += currentAccount.Account;

		//已有群 添加新成员

		if(this.hasGroup) {
            currentObj.showLoading();

			//参数：发起人id,群id,添加成员昵称,添加成员id字符串(xx,xx,xx),
			userController.addGroupMember(this.props.groupId,Nicks,accounts,(result)=>{
                currentObj.hideLoading();
                if(result.Result == 1){
                    let routes = currentObj.props.navigator.getCurrentRoutes();
                    let index;
                    for (let i = 0; i < routes.length; i++) {
                        if (routes[i]["key"] == "GroupInformationSetting") {
                            index = i;
                            break;
                        }
                    }
                    currentObj.route.replaceAtIndex(currentObj.props,{
                        key:'GroupInformationSetting',
                        routeId: 'GroupInformationSetting',
                        params:{"groupId":currentObj.props.groupId,onUpdateHeadName:currentObj.props.UpdateHeadName},

                    },index)
				}else{
                    alert('添加成员失败');
                }
			});

        }
        //未有群 创建群
        else{
            // if(chooseArr.length > 0)
            //     accounts += "," + currentAccount.Account;
            // else
            //     accounts += currentAccount.Account;
            //


        	if(chooseArr.length == 1){
                this.route.push(this.props,{key:'ChatDetail',routeId:'ChatDetail',params:{client:chooseArr[0].Account,type:'private',Nick:chooseArr[0].Nick}});
                return;
			}
            currentObj.showLoading();
			let groupName = currentAccount.Nickname + "发起的群聊";
			userController.createGroup(groupName,accounts,(result,message,mockType)=>{
                currentObj.hideLoading();
				if(result.Result == 1){
                    currentObj.route.push(currentObj.props,{key:'ChatDetail',routeId:'ChatDetail',params:{client:result.Data,type:"group",Nick:groupName}});

				}else{
                    alert('创建失败');
				}
			});
		}
	}

	render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
		let chooseArr = this.state.chooseArr;
        this.relationFlatListStore = initFlatListData(this.state.contacts,this.state.text);


		return (
			<View style={styles.container}>
				<MyNavigationBar
					left={{func:()=>{this.route.pop(this.props)},text:'取消'}}
					heading={title}
					right={{func:()=>{this._rightButton()},text:'完成',disabled:chooseArr.length>0?false:true}}
				/>
				<View style={styles.listHeaderBox}>
					<TextInput
						style={styles.search}
						underlineColorAndroid = 'transparent'
						placeholder = '搜索'
						autoFocus = {false}
						defaultValue = {this.state.text}
						onChangeText={(v)=>{
                            this.setState({text:v,isShowFlatList:v?true:false})
                        }
						}
					>
					</TextInput>
				</View>
				{this.state.isShowFlatList?
					<FlatList
						ref={(flatList)=>this._flatList = flatList}
						renderItem={this._renderItem}
						data={this.relationFlatListStore}>
					</FlatList>:
					<SectionList
						ref={'mySectionList'}
						keyExtractor={(item,index)=>("index"+index+item)}
						renderSectionHeader={this._sectionComp}
						renderItem={this._renderItem}
						sections={this.state.relationStore}
						ItemSeparatorComponent={this._renderSeparator}
						ListHeaderComponent={this._renderHeader}
						stickySectionHeadersEnabled={true}
					/>
				}
                {this.state.isShowFlatList?
					null:
					<View style={styles.rightSection}>
                        {this._getSections()}
					</View>
                }


				<Popup ref={ popup => this.popup = popup}/>
				<Loading ref = { loading => this.loading = loading}/>
		    </View>
	);
}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:"white"
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
    circle:{
		width:20,
		height:20,
		borderWidth:1,
		borderColor:'#aaa',
		backgroundColor:'green',
		borderRadius:15
	},
	pic:{
		width:40,
		height:40,
		resizeMode:'stretch',
		marginLeft:10
	},
	itemText:{		
		textAlignVertical: 'center',
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
		color:'#000',
        padding:0,
        paddingHorizontal:10
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

});

const mapDispatchToProps = (dispatch) => {
  return{


  }};

 export default connect(mapStateToProps, mapDispatchToProps)(ChooseClient);