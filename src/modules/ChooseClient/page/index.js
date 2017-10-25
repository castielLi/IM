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
import User from '../../../Core/User';
import MyNavigationBar from '../../../Core/Component/NavigationBar';
import {initSection,initDataFormate} from './formateData';
import RelationModel from '../../../Core/User/dto/RelationModel'
var {height, width} = Dimensions.get('window');

let currentObj = undefined;
let user = new User();
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
		}
        this.relationStore = []
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

    componentWillMount(){
		if(this.props.members){
			this.hasGroup = true;
			title = '选中联系人'
		}
		else{
			title = '发起群聊'
		}
	}
    choose=(item)=>{
		//改变选中颜色{RelationId:true,RelationId:false...}
		this.state.chooseObj[item.RelationId] = !this.state.chooseObj[item.RelationId];
		let obj = {...this.state.chooseObj};
		this.setState({
            chooseObj:obj
		})
		//对象转为所需数组
		let arr = Object.keys(obj);
		let needArr = [];
		for(let i=0;i<arr.length;i++){
			//已选中 选项
			if(obj[arr[i]]) needArr.push(arr[i])
		}
        this.setState({
            chooseArr:needArr
        })
	}
	_renderItem = (info) => {
		var txt = '  ' + info.item.Nick;
		return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{this.choose(info.item)}}>
					<View  style={styles.itemBox} >
						<View style={[styles.circle,{backgroundColor:this.state.chooseObj[info.item.RelationId]?'green':'transparent'}]}></View>
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
		//拼接选中用户id
		for(let item in chooseArr){
			if((item*1 + 1) == chooseArr.length){
				accounts += chooseArr[item];
			}else{
				accounts+= chooseArr[item]+",";
			}
		}

		//已有群 添加新成员
		if(this.hasGroup) {
            this.fetchData("POST", "Member/AddGroupMember", function (result) {
                if (result.success) {
                    if (result.data.Data == null) {
                        alert("返回群数据出错")
                        return;
                    }
                    alert('添加成员成功了')
                } else {
                    alert(result.errorMessage);
                    return;
                }
            }, {"Operater": this.props.accountId, "GroupId": this.props.groupId, "Accounts": accounts});
        }
        //未有群 创建群
        else{
            //this.showLoading()
            this.fetchData("POST","Member/CreateGroup",function(result){
                //currentObj.hideLoading();

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
                    relation.type = 'chatroom';

                    user.AddNewRelation(relation);

                    //todo 添加群聊到redux

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
		console.log(chooseArr)
		this.relationStore = initDataFormate('private',this.props.relationStore);
		return (
			<View style={styles.container}>
				<MyNavigationBar
					left={{func:()=>{this.route.pop(this.props)},text:'取消'}}
					heading={title}
					right={{func:()=>{this._rightButton()},text:'完成',disabled:chooseArr.length>0?false:true}}
				/>
			    <SectionList
			      ref={'mySectionList'}
			      keyExtractor={(item,index)=>("index"+index+item)}
			      renderSectionHeader={this._sectionComp}
			      renderItem={this._renderItem}
			      sections={this.relationStore}
			      ItemSeparatorComponent={this._renderSeparator}
			      ListHeaderComponent={this._renderHeader}
				  stickySectionHeadersEnabled={true}
				/>
				<View style={styles.rightSection}>
					{this._getSections()}
				</View>
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
    relationStore: state.relationStore,
	accountName:state.loginStore.accountMessage.nick,
    accountId:state.loginStore.accountMessage.accountId,
});

const mapDispatchToProps = (dispatch) => {
  return{


  }};

 export default connect(mapStateToProps, mapDispatchToProps)(ChooseClient);