import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    TextInput,
    Dimensions,
    FlatList
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as unReadMessageActions from '../../MainTabbar/reducer/action';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import UserController from '../../../TSController/UserController';
import CheckBox from '../../Common/Component/CheckBox';

let userController = undefined;
let {height, width} = Dimensions.get('window');
let currentObj = undefined;
let currentAccount = undefined;

class DeleteGroupMember extends AppComponent {

    constructor(props) {
        super(props);
        this.state={
            data:[],
            refresh:false
        };
        this.CheckBoxData = [];
        this.selectData = [];
        currentObj = this;
        userController =  this.appManagement.getUserLogicInstance();
        currentAccount = userController.getCurrentAccount();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        userController = undefined;
    }
    componentWillMount(){
        userController.getGroupMembersInfo(this.props.groupId,(result)=>{
            this.setState({
                data:result
            })
        })
    }

    // _renderAvator= (HeadImageUrl)=>{
    //     if(!HeadImageUrl||HeadImageUrl === ''){
    //         return <Image style = {styles.pic} source = {require('../resource/avator.jpg')}></Image>
    //     }else{
    //         return <Image style = {styles.pic} source = {{uri:HeadImageUrl}}></Image>
    //     }
    // }

    choose = (Account,index) =>{
        this.CheckBoxData[index].onChange();//改变选中框样式
        let Sub = this.selectData.indexOf(Account);
        if(Sub !== -1){
            this.selectData.splice(Sub,1);
        }else{
            this.selectData.push(Account);
        }

        if(this.state.refresh != (this.selectData.length != 0)){
            this.setState({
                refresh:!this.state.refresh
            })
        }
    };

    _renderItem = (info) => {
        let txt = '  ' + info.item.Nickname;
        let path = userController.getAccountHeadImagePath(info.item.Account);
        if(info.item.Account === currentAccount.Account) return null;
        return (
            <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{this.choose(info.item.Account,info.index)}}>
                <View style={styles.itemView}>
                    <View style={styles.itemBox}>
                        <ImagePlaceHolder style={styles.pic} imageUrl ={path}/>
                        <Text style={styles.itemText}>{txt}</Text>
                    </View>
                    <CheckBox ref={e=>this._initCheckBoxData(e)} checked={2}/>
                </View>
            </TouchableHighlight>
        )
    };

    /*记录checkBox*/
    _initCheckBoxData=(checkBox)=>{
        if(checkBox!=null){
            this.CheckBoxData.push(checkBox);
        }
    };

    _renderSeparator=()=>{
        return <View style={styles.ItemSeparator}/>
    };


    //定义上导航的右按钮
    _removeGroupMember=()=> {
        let {groupId,navigator} = this.props;
        let AccountStr = this.selectData.join(',');
        currentObj.showLoading();
        userController.removeGroupMember(groupId,AccountStr,(result)=>{
            currentObj.hideLoading();
            if(result &&　result.Result == 1){
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
                    params:{"groupId":groupId},

                },index)
            }else{
                alert('移除群成员失败');
            }

        });
    };

    _rightButton = ()=>{
        this.confirm('确定要删除指定成员？','','确定',this._removeGroupMember,'取消')
    };


    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'取消'}}
                    heading={'删除群成员'}
                    right={{func:()=>{this._rightButton()},text:'完成',disabled:!this.state.refresh}}
                />
                {/*<View style={styles.listHeaderBox}>*/}
                    {/*<TextInput*/}
                        {/*style={styles.search}*/}
                        {/*underlineColorAndroid = 'transparent'*/}
                        {/*placeholder = '搜索'*/}
                        {/*autoFocus = {false}*/}
                        {/*defaultValue = {this.state.text}*/}
                        {/*onChangeText={(t)=>{*/}
                            {/*this.setState({text:t,data:this.state.data.concat()})*/}
                        {/*}*/}
                        {/*}*/}
                    {/*>*/}
                    {/*</TextInput>*/}
                {/*</View>*/}
                <FlatList
                    ref={(flatList)=>this._flatList = flatList}
                    renderItem={this._renderItem}
                    data={this.state.data}
                    ItemSeparatorComponent={this._renderSeparator}
                />

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
    itemView:{
        backgroundColor:'#fff',
        flexDirection:'row',
        height:54,
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:15,
    },
    itemBox:{
        flexDirection:'row',
        alignItems:'center',
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
        borderRadius:20
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
    },
})

const mapStateToProps = state => ({

    accountName:state.loginStore.accountMessage.Nickname,
    accountId:state.loginStore.accountMessage.Account,
});

const mapDispatchToProps = (dispatch) => {
    return{

        ...bindActionCreators(unReadMessageActions, dispatch),
    }};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteGroupMember);