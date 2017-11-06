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
    FlatList
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import uuidv1 from 'uuid/v1';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import User from '../../../Core/User';
import IM from '../../../Core/IM';
import MyNavigationBar from '../../../Core/Component/NavigationBar';


var {height, width} = Dimensions.get('window');

let currentObj = undefined;
let user = new User();
let im = new IM();
let title = null;

class DeleteGroupMember extends ContainerComponent {

    constructor(props) {
        super(props);
        this.state={
            data:props.realMemberList,
            needData:[],
            text:''
        }
        this.relationStore = []
        this._rightButton = this._rightButton.bind(this);
        currentObj = this;
    }



    componentWillMount(){

    }

    circleStyle = (isChoose)=>{

            return <View style={[styles.circle,{backgroundColor:isChoose?'green':'transparent'}]}/>


    }

    _renderAvator= (HeadImageUrl)=>{
        if(!HeadImageUrl||HeadImageUrl === ' '){
            return <Image style = {styles.pic} source = {require('../resource/avator.jpg')}></Image>
        }else{
            return <Image style = {styles.pic} source = {{uri:HeadImageUrl}}></Image>
        }
    }

    choose = (item) =>{
        //修改this.state.needData
        if(!item.isChoose){
            this.state.needData.push(item.Account)
            this.setState({
                needData:this.state.needData.concat()
            })
        }else{
            for(let j=0;j<this.state.needData.length;j++){
                if(this.state.needData[j]==item.Account){
                    this.state.needData.splice(j,1);
                    j--;
                }
            }
            this.setState({
                needData:this.state.needData.concat()
            })
        }
        //this.state.needData组成字符串发送请求
        let needStr = '';
        this.state.needData.forEach((value,index)=>{
            needStr+=value+','
        })
        if(needStr[needStr.length-1] == ','){
            needStr = needStr.substring(0,needStr.length-1);
        }

        this.needStr = needStr;
        //修改this.state.data
        for(let i=0;i<this.state.data.length;i++){
            if(this.state.data[i].Account === item.Account){
                this.state.data[i].isChoose = !item.isChoose;
                break;
            }
        }
        this.setState({
            data:this.state.data.concat(),

        })

    }

    _renderItem = (info) => {
        var txt = '  ' + info.item.Nickname;
        if(info.item.Account === this.props.accountId) return null;
        return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{this.choose(info.item)}}>
            <View  style={styles.itemBox} >
                {this.circleStyle(info.item.isChoose)}
                {this._renderAvator(info.item.HeadImageUrl)}
                <Text style={styles.itemText}>{txt}</Text>
            </View>
        </TouchableHighlight>
    }


    //定义上导航的右按钮
    _rightButton() {
        let {accountId,ID,navigator} = this.props;
        currentObj.showLoading()
        this.fetchData("POST","Member/RemoveGroupMember",function(result){
            currentObj.hideLoading()
            if(!result.success){
                alert(result.errorMessage);
                return;
            }
            if(result.data.Data){
                let routes = navigator.getCurrentRoutes();
                let index;
                for (let i = 0; i < routes.length; i++) {
                    if (routes[i]["key"] == "GroupInformationSetting") {
                        index = i;
                        break;
                    }
                }
                //跳转到群设置
                currentObj.route.replaceAtIndex(currentObj.props,{
                    key:'GroupInformationSetting',
                    routeId: 'GroupInformationSetting',
                    params:{"groupId":ID}
                },index)
            }else{
                alert("http请求出错")
            }


        },{"Operater":accountId,"GroupId":ID,"Accounts":this.needStr})

    }


    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        let needData = this.state.needData;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'取消'}}
                    heading={title}
                    right={{func:()=>{this._rightButton()},text:'完成',disabled:needData.length>0?false:true}}
                />
                <View style={styles.listHeaderBox}>
                    <TextInput
                        style={styles.search}
                        underlineColorAndroid = 'transparent'
                        placeholder = '搜索'
                        autoFocus = {false}
                        defaultValue = {this.state.text}
                        onChangeText={(t)=>{
                            let data = [];
                            data = this.props.realMemberList.filter((v,i)=>{
                                return v.Nickname.indexOf(t) >= 0;
                            })
                            this.setState({text:t,data})
                        }
                        }
                    >
                    </TextInput>
                </View>
                <FlatList
                    ref={(flatList)=>this._flatList = flatList}
                    renderItem={this._renderItem}
                    data={this.state.data}>
                </FlatList>

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
        paddingLeft:10,
        borderBottomWidth:1,
        borderColor:'#aaa'
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteGroupMember);