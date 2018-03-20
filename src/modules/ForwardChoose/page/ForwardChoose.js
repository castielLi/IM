/**
 * Created by apple on 2018/2/9.
 */
/**
 * Created by apple on 2017/6/6.
 */

import React, {Component} from 'react';
import {StyleSheet,FlatList,TouchableHighlight,View,Text,Dimensions} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import IMControllerLogic from '../../../TSController/IMLogic/IMControllerLogic'
import AppPageMarkEnum from '../../../App/Enum/AppPageMarkEnum';
import CheckBox from '../../Common/Component/CheckBox';
import * as SelectAction from '../reducer/action';
import ForwardConfirm from './ForwardConfirm';
import UserController from '../../../TSController/UserController';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';

let userController = undefined;
let imLogicController = undefined;
let currentObj = undefined;
let {width,height} = Dimensions.get('window');

class ForwardChoose extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
            ConversationData: [],//最近会话记录
        };
        // this.CheckBoxData = [];//选择框组件
        this.HasData = 0;//是否有选择数据
        this.RecordDto = null;//是有单选记录
        currentObj = this;
        userController = UserController.getSingleInstance();
        imLogicController = IMControllerLogic.getSingleInstance();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        //初始化缓存数据
        this.props.initSelect();
    }

    componentDidMount() {
        imLogicController.getConversationList();
    }

    _refreshUI(type, params) {
        if (type == AppPageMarkEnum.ConversationList) {
            currentObj.setState({
                ConversationData: params
            })
        }
    }

    /*生成key值*/
    _keyExtractor = (item, index) => {
        return index;
    };
    /*渲染头部*/
    _renderHeader = () => {
        return (
            <View style={styles.headerView}>
                <Text style={styles.headerText}>最近聊天会话</Text>
            </View>
        )
    };
    /*渲染每个记录*/
    _renderItem = (item) => { //item:{item:{},index:number,separators:{}}
        let content = item.item;
        let index = item.index;
        let checked = this.props.selectRecord[content.chatId] ? 1 : 2;
        return (
            <TouchableHighlight style={styles.itemTouch} underlayColor={'#333'} onPress={()=>this._itemTouch(content,index)}>
                <View style={styles.itemView}>
                    <View style={styles.itemContent}>
                        {this._renderAvator(content.chatId,content.group)}
                        <View style={styles.itemTextView}>
                            <Text style={styles.itemText}  numberOfLines={1}>{content.name}</Text>
                        </View>
                    </View>
                    {this.props.optionsType ? <CheckBox checked={checked}/> : null}
                </View>
            </TouchableHighlight>
        )
    };
    /*渲染分隔线组件不会出现在第一行之前和最后一行之后*/
    _renderSeparator = () => {
        return (
            <View style={styles.separator}/>
        )
    };

    render(){
        let optionText = this.props.optionsType ? '单选' : '多选';
        this.HasData = Object.keys(this.props.selectRecord).length;
        optionText = this.HasData ? '发送('+this.HasData+')' : optionText;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)}}}
                    heading={'选择'}
                    right={{func:()=>{this._navigationBtn()},text:optionText}}
                />
                <View style={styles.headerMenuView}>
                    <TouchableHighlight style={styles.menuTouch} underlayColor={'#333'} onPress={() => {this._goToContacts()}}>
                        <View style={styles.optionView}>
                            <Text style={styles.optionText}>选择好友</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={[styles.menuTouch, styles.optionMiddle]} underlayColor={'#333'} onPress={() => {this._goToGroups()}}>
                        <View style={styles.optionView}>
                            <Text style={styles.optionText}>选择群聊</Text>
                        </View>
                    </TouchableHighlight>
                    {/*<TouchableHighlight style={styles.menuTouch} underlayColor={'#333'} onPress={() => {}}>*/}
                        {/*<View style={styles.optionView}>*/}
                            {/*<Text style={styles.optionText}>创建群聊</Text>*/}
                        {/*</View>*/}
                    {/*</TouchableHighlight>*/}
                </View>
                <FlatList
                    data={this.state.ConversationData}
                    extraData={{data:this.state,props:this.props}}
                    keyExtractor={this._keyExtractor}
                    ListHeaderComponent={this._renderHeader}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._renderSeparator}
                />
                <ForwardConfirm
                    ref={e=>this._confirm = e}
                    confirm={this.forwardMessage}
                    cancel={this.onCancel}
                    rowData={this.props.rowData}
                    targetInfo={this.props.targetInfo}
                />
            </View>
        )
    }

    /*渲染头像*/
    _renderAvator = (Account, group) => {
        if (group) {
            return <ImagePlaceHolder style={styles.itemImage} imageUrl = {require('../../Common/resource/groupAvator.png')}/>

        } else {
            let path = userController.getAccountHeadImagePath(Account);
            return <ImagePlaceHolder style={styles.itemImage} imageUrl ={path}/>
        }
    };

    /*路由跳转*/
    _goToContacts =()=>{
        this.route.push(this.props,{
            key: 'ContactsChoose',
            routeId: 'ContactsChoose',
            params:{rowData:this.props.rowData,forwardMethod:this.forwardConfirm},
            // sceneConfig:{...Navigator.SceneConfigs.FloatFromBottom,gestures: null}
            });
    };
    _goToGroups =()=>{
        this.route.push(this.props,{
            key: 'GroupsChoose',
            routeId: 'GroupsChoose',
            params:{rowData:this.props.rowData,forwardMethod:this.forwardConfirm},
            // sceneConfig:{...Navigator.SceneConfigs.FloatFromBottom,gestures: null}
            });
    };
    _goToCreateGroup =()=>{

    };

    /*item点击事件*/
    _itemTouch=(content,index)=>{
        let RecordDto = {};
        RecordDto.receiveId = content.chatId;
        RecordDto.group = content.group;
        let TargetDto = {};
        TargetDto.name = content.name;
        TargetDto.headImage = content.HeadImageUrl;
        this.props.changTargetInfo(content.chatId,TargetDto);
        if(this.props.optionsType){
            //加入redux缓存记录等待统一发送
            this.props.changeSelectRecord(RecordDto);
            //改变选中框样式
            // this.CheckBoxData[index].onChange();
        }else{
            //调用发送方法
            // imLogicController.ForwardMessage(this.props.rowData,[RecordDto]);
            // this.route.pop(this.props);
            this.forwardConfirm(RecordDto);
        }
    };

    /*确认发送方法*/
    forwardMessage=()=>{
        if(this.props.optionsType && this.HasData){
            let SelectRecord = Object.values(this.props.selectRecord);
            imLogicController.ForwardMessage(this.props.rowData,SelectRecord);
        }else{
            imLogicController.ForwardMessage(this.props.rowData,[this.RecordDto]);
        }
        this.route.pop(this.props);
    };

    /*取消发送方法*/
    onCancel=()=>{
        if(!this.props.optionsType){
            this.props.initSelect();
        }
    };

    /*显示确认组件*/
    forwardConfirm=(RecordDto)=>{
        if(RecordDto){
            this.RecordDto = RecordDto;
        }
        this._confirm.onChange();
    };

    /*导航右侧按钮点击事件*/
    _navigationBtn=()=>{
        //是否有选中用户
        if(this.HasData){
            // let SelectRecord = Object.values(this.props.selectRecord);
            // imLogicController.ForwardMessage(this.props.rowData,SelectRecord);
            // this.route.pop(this.props);
            this.forwardConfirm();
        }else{
            //没有选择用户切换类型
            if(this.props.optionsType){
                this.CheckBoxData = [];
            }
            this.props.changeOptionsType();
        }
    };

    /*记录checkBox*/
    _initCheckBoxData=(checkBox)=>{
        if(checkBox!=null){
            this.CheckBoxData.push(checkBox);
        }
    };
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    headerMenuView:{
    },
    menuTouch:{
    },
    optionView:{
        height:50,
        paddingVertical:8,
        justifyContent:'center',
        paddingLeft:15,
        backgroundColor:'#fff'
    },
    optionText:{
        color:'#000',
        fontWeight:'normal',
        fontSize:16,
        textAlignVertical:'center',
        includeFontPadding:false
    },
    optionMiddle:{
        borderColor:'#dedede',
        borderTopWidth:1,
        borderBottomWidth:1
    },
    headerView:{
        backgroundColor:'#dedede',
        justifyContent:'center',
        paddingLeft:15,
        paddingVertical:2
    },
    headerText:{
        color:'#666',
        fontSize:14,
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false
    },
    itemTouch:{
    },
    itemView:{
        backgroundColor:'#fff',
        flexDirection:'row',
        paddingVertical:8,
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:15
    },
    itemContent:{
        flexDirection:'row',
        alignItems:'center',
    },
    itemImage:{
        width:40,
        height:40,
        borderRadius:20
    },
    itemTextView:{
        marginLeft:15,
        justifyContent:'center',
        height:40
    },
    itemText:{
        color:'#000',
        fontWeight:'normal',
        fontSize:16,
        textAlignVertical:'center',
        includeFontPadding:false,
        maxWidth:width-170,
    },
    separator:{
        marginHorizontal:15,
        height:0,
        borderBottomWidth:1,
        borderBottomColor:'#dedede'
    }
});

const mapStateToProps = state => ({
    selectRecord:state.selectRecordStore.selectRecord,
    optionsType:state.selectRecordStore.optionsType,
    targetInfo:state.selectRecordStore.targetInfo,
});

const mapDispatchToProps = (dispatch) => {
    return{
        ...bindActionCreators(SelectAction, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ForwardChoose);