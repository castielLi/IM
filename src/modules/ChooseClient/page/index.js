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
import uuidv1 from 'uuid/v1';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as recentListActions from '../../Contacts/reducer/action';
import * as Actions from '../../../Core/IM/redux/chat/action';
import User from '../../../Core/User';
import IM from '../../../Core/IM';
import MyNavigationBar from '../../../Core/Component/NavigationBar';
import {initSection,initDataFormate,initFlatListData} from './formateData';
import RelationModel from '../../../Core/User/dto/RelationModel'
import {startChatRoomMessage,buildInvationGroupMessage,buildInvationSendMessageToRudexMessage} from '../../../Core/IM/action/createMessage';
var {height, width} = Dimensions.get('window');

let currentObj = undefined;
let user = new User();
let im = new IM();
let title = null;

class ChooseClient extends ContainerComponent {

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
            relationStore:initDataFormate('private',props.relationStore),
		}
		this._rightButton = this._rightButton.bind(this);
		currentObj = this;
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
            let sections = initSection(this.state.relationStore)
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
    choose=(item,hasMember)=>{
    	if(hasMember) return;
		//改变选中颜色{RelationId:true,RelationId:false...}
		this.state.chooseObj[item.RelationId] = !this.state.chooseObj[item.RelationId];
		let obj = {...this.state.chooseObj};
		this.setState({
            chooseObj:obj
		})
		//对象转为所需数组
		let arr = Object.keys(obj);
		let needArr = [];
		let concatList = initFlatListData('private',this.props.relationStore,'');
		for(let i=0;i<arr.length;i++){
			//已选中 选项
			if(obj[arr[i]]){
				for(let j=0;j<concatList.length;j++){
					if(concatList[j].RelationId === arr[i]){
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
				<View style={[styles.circle,{backgroundColor:this.state.chooseObj[info.item.RelationId]?'green':'transparent'}]}/>
			)
		}else{
    		if(hasMember){
    			return <View style={[styles.circle,{backgroundColor:'red'}]}/>
			}else{
    			return <View style={[styles.circle,{backgroundColor:this.state.chooseObj[info.item.RelationId]?'green':'transparent'}]}/>
			}
		}
	}

    _renderAvator= (Obj)=>{
        if(Obj){
            if((!Obj.LocalImage||Obj.LocalImage === ' ')&&!Obj.avator){
                return 	<Image style = {styles.pic} source = {require('../resource/avator.jpg')}></Image>

            }
            return 	<Image style = {styles.pic} source = {{uri:(Obj.LocalImage&&Obj.LocalImage!==' ')?Obj.LocalImage:Obj.avator}}></Image>

        }else{
            return null
        }
    }
	_renderItem = (info) => {
		var txt = '  ' + info.item.Nick;
		let hasMember;
        if(this.hasGroup){
            hasMember = this.props.members.indexOf(info.item.RelationId);
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
		let nicks = "";
		//拼接选中用户id
		for(let item in chooseArr){
			accounts+= chooseArr[item].RelationId+",";

			if(item < chooseArr.length - 1){
				nicks += chooseArr[item].Nick+",";
			}else{
				nicks += chooseArr[item].Nick;
			}
		}
		accounts += currentObj.props.accountId;

		//已有群 添加新成员

		if(this.hasGroup) {
            currentObj.showLoading()
            this.fetchData("POST", "Member/AddGroupMember", function (result) {
                currentObj.hideLoading();
                if (result.success) {
                    if (result.data.Data == null) {
                        alert("返回群数据出错")
                        return;
                    }

                    //向添加的用户发送邀请消息
                    let sendMessage = buildInvationGroupMessage(currentObj.props.accountId,result.data.Data,text);
                    im.addMessage(sendMessage);
                    currentObj.props.addMessage(sendMessage);

                } else {
                    alert(result.errorMessage);
                    return;
                }
            }, {"Operater": this.props.accountId, "GroupId": this.props.groupId, "Accounts": accounts});
        }
        //未有群 创建群
        else{

        	if(chooseArr.length == 1){
                this.route.push(this.props,{key:'ChatDetail',routeId:'ChatDetail',params:{client:chooseArr[0],type:'private'}});
                return;
			}

            currentObj.showLoading()
            this.fetchData("POST","Member/CreateGroup",function(result){
                currentObj.hideLoading();

                console.log(result);

                if(result.success){

                    if(result.data.Data == null){
                        alert("返回群数据出错")
                        return;
                    }
                    let relation = new RelationModel();
                    relation.RelationId = result.data.Data;
                    relation.owner = currentObj.props.accountId;
                    relation.Nick = currentObj.props.accountName + "发起的群聊";
                    relation.Type = 'chatroom';
                    relation.show = 'false';

                    //添加关系到数据库
					user.AddNewRelation(relation);
                    user.AddNewGroupToGroup(relation);
                    //todo 添加群聊关系到redux
                    currentObj.props.addRelation(relation);
					//todo 模拟一条消息，xx邀请xx和xx加入群聊
					let messageId = uuidv1();
					//创建群组消息
					let text = nicks;

					//todo：lizongjun 现在不需要自己发送消息，后台统一发送
                    //向添加的用户发送邀请消息
                    // let sendMessage = buildInvationGroupMessage(currentObj.props.accountId,result.data.Data,text);
                    // im.addMessage(sendMessage);

					//更新redux message
					let reduxMessage = buildInvationGroupMessage(currentObj.props.accountId,result.data.Data,text);
                    reduxMessage = buildInvationSendMessageToRudexMessage(reduxMessage);
					currentObj.props.addMessage(reduxMessage);


                    currentObj.route.push(currentObj.props,{key:'ChatDetail',routeId:'ChatDetail',params:{client:result.data.Data,type:"chatroom"}});

                }else{
                    alert(result.errorMessage);
                    return;
                }

            },{"Operater":this.props.accountId,"Name":this.props.accountName + "发起的群聊","Accounts":accounts})
		}
	}


	render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
		let chooseArr = this.state.chooseArr;
        this.relationFlatListStore = initFlatListData('private',this.props.relationStore,this.state.text);


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
    relationStore: state.relationStore,
	accountName:state.loginStore.accountMessage.nick,
    accountId:state.loginStore.accountMessage.accountId,
});

const mapDispatchToProps = (dispatch) => {
  return{
      ...bindActionCreators(recentListActions, dispatch),
      ...bindActionCreators(Actions, dispatch),

  }};

 export default connect(mapStateToProps, mapDispatchToProps)(ChooseClient);