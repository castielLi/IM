/**
 * Created by Hsu. on 2018/3/12.
 */
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
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';
import MySectionList from '../../Common/Component/MySectionList/';
import CheckBox from '../../Common/Component/CheckBox';
import {SectionDataFormate} from '../../Common/Helper/DataFromate/SectionListData';

var {height, width} = Dimensions.get('window');
let currentObj = undefined;
let title = null;
let currentAccount = undefined;

import UserController from '../../../TSController/UserController';
let userController = undefined;

class ChooseClientt extends AppComponent {

    constructor(props) {
        super(props);
        this.state={
            contacts:[],
            refresh:false
        };
        this.selectData = [];//选中的用户
        this.defaulData = props.Accounts;//默认选中用户
        this.CheckBoxData = {};
        currentObj = this;
        userController =  UserController.getSingleInstance();
        currentAccount = userController.getCurrentAccount()
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    componentWillMount(){
        if(this.props.build){
            title = '发起群聊'
        }
        else{
            title = '选中联系人'
        }
    }
    componentDidMount(){
        userController.getUserContactList(false,(contacts)=>{
            this.setState({
                contacts
            })
        });
    }

    _sectionComp = (info) => {
        let txt = info.section.key;
        return (
            <View style={styles.sectionHeaderBox}>
                <Text style={styles.sectionHeader}>{txt}</Text>
            </View>
        )
    };
    _renderItem = (info) => {
        let content = info.item;
        let index = info.index;
        let key = info.section.key;
        let name = content.Remark != "" ? content.Remark:content.Nickname;
        let path = userController.getAccountHeadImagePath(content.Account);
        let checked = this.selectData.indexOf(content.Account) != -1 ? 1 : 2;
        if(this.defaulData){
            checked = this.defaulData.indexOf(content.Account) != -1 ? 0 : checked;
        }
        return (
            <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{this._itemTouch(content.Account,index,key)}}>
                <View style={styles.itemView}>
                    <View style={styles.itemContent}>
                        <ImagePlaceHolder style={styles.pic} imageUrl ={path}/>
                        <Text style={styles.itemText}>{name}</Text>
                    </View>
                    <CheckBox ref={e=>this._initCheckBoxData(e,key)} checked={checked}/>
                </View>
            </TouchableHighlight>
        )
    };
    _renderSeparator = () =>{
        return <View style={styles.ItemSeparator}/>
    };
    _renderHeader=()=>{
        if(!this.props.build) return null;
        return (
            <View style={styles.headerModule}>
                <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this._goToSelectGroup}>
                    <View  style={styles.headerBox} >
                        <Text style={styles.headerText}>选择一个群</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    };

    _goToSelectGroup=()=>{
        this.route.push(this.props,{key:'SelectGroup',routeId:'SelectGroup',params:{}});
    };

    /*记录checkBox*/
    _initCheckBoxData=(checkBox,key)=>{
        if(checkBox!=null){
            if(!this.CheckBoxData[key]){
                this.CheckBoxData[key] = [];
            }
            this.CheckBoxData[key].push(checkBox);
        }
    };

    _itemTouch=(Account,index,key)=>{
        // alert(Account+index+key)
        if(this.defaulData.indexOf(Account) !== -1) return;//为默认跳过
        this.CheckBoxData[key][index].onChange();//改变选中框样式
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

    _rightButton=()=>{
        let accountStr = this.selectData.join(',') +','+ this.defaulData.join(',');//'wg003724,wg003723'

        if(this.props.build){
            if((this.selectData.length+this.defaulData.length) == 1){
                let client = this.selectData[0].Account;
                let Nick = this.selectData[0].Remark != '' ?　this.selectData[0].Remark : this.selectData[0].Nickname;
                this.route.push(this.props,{key:'ChatDetail',routeId:'ChatDetail',params:{client,type:'private',Nick}});
                return;
            }
            currentObj.showLoading();
            let groupName = currentAccount.Nickname + "发起的群聊";
            userController.createGroup(groupName,accountStr,(result)=>{
                currentObj.hideLoading();
                if(result.Result == 1){
                    currentObj.route.pushifExistRoute(currentObj.props,{key:'ChatDetail',routeId:'ChatDetail',params:{client:result.Data,type:"group",Nick:groupName}});
                }else{
                    this.alert('创建失败');
                }
            });
        }else{
            currentObj.showLoading();
            userController.addGroupMember(this.props.groupId,accountStr,(result)=>{
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
                    this.alert('添加成员失败');
                }
            });
        }
    };

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        this.contactsData = SectionDataFormate(this.state.contacts);
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'取消'}}
                    heading={title}
                    right={{func:()=>{this._rightButton()},text:'完成',disabled:!this.state.refresh}}
                />
                <View style={styles.listHeaderBox}>
                    <TextInput
                        style={styles.search}
                        underlineColorAndroid = 'transparent'
                        placeholder = '搜索'
                        autoFocus = {false}
                        defaultValue = {this.state.text}
                        onChangeText={(v)=>{this.setState({text:v,isShowFlatList:v?true:false})}}
                    />
                </View>
                <MySectionList
                    ref={'mySectionList'}
                    keyExtractor={(item,index)=>("index"+index+item)}
                    renderSectionHeader={this._sectionComp}
                    renderItem={this._renderItem}
                    sections={this.contactsData.SectionArray}
                    keyArray={this.contactsData.KeyArray}
                    ItemSeparatorComponent={this._renderSeparator}
                    ListHeaderComponent={this._renderHeader}
                    stickySectionHeadersEnabled={true}
                    viewOffset={22}
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
        backgroundColor:"#fff"
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
    ItemSeparator:{
        marginHorizontal:15,
        height:0,
        borderBottomWidth:1,
        borderBottomColor:'#eee'
    },
    headerModule:{
        backgroundColor:'#fff',
    },
    headerBox:{
        justifyContent:'center',
        paddingHorizontal:15,
        minHeight:56,
    },
    headerBoxBorder:{
        borderBottomColor:'#eee',
        borderBottomWidth:1,
    },
    headerText:{
        color:'#000',
        fontSize:16,
        textAlignVertical:'center',
        includeFontPadding:false
    },
    itemView:{
        backgroundColor:'#fff',
        flexDirection:'row',
        paddingVertical:8,
        alignItems:'center',
        justifyContent:'space-between',
        paddingLeft:15,
        paddingRight:45
    },
    itemContent:{
        flexDirection:'row',
        alignItems:'center',
    },
    pic:{
        width:40,
        height:40,
    },
    itemText:{
        textAlignVertical: 'center',
        color: '#000',
        fontSize: 15,
        marginLeft:10
    },

});

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch) => {
    return{


    }};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseClientt);