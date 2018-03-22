/**
 * Created by apple on 2018/2/9.
 */
import React, {Component} from 'react';
import {StyleSheet,Image,TouchableHighlight,View,Text,Dimensions} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import UserController from '../../../TSController/UserController';
import IMControllerLogic from '../../../TSController/IMLogic/IMControllerLogic';
import CheckBox from '../../Common/Component/CheckBox';
import * as SelectAction from '../reducer/action';
import {SectionDataFormate} from '../../Common/Helper/DataFromate/SectionListData';
import MySectionList from '../../Common/Component/MySectionList/';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';

let userController = undefined;
let imLogicController = undefined;
let {width,height} = Dimensions.get('window');

class ContactsChoose extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
            ContactsData: [],
        };
        // this.CheckBoxData = {};//选择框组件
        this.HasData = 0;//是否有选择数据
        this.ContactsData = [];//分组集合和数据
        userController = UserController.getSingleInstance();
        imLogicController = IMControllerLogic.getSingleInstance();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    componentDidMount() {
        userController.getUserContactList(false,(contacts)=>{
            this.setState({
                ContactsData:contacts
            })
        });
    }


    /*生成key值*/
    _keyExtractor = (item, index) => {
        return index;
    };
    /*渲染头部*/
    _renderHeader = () => {
        return (
            <View style={styles.headerView}>
                <Text style={styles.headerText}>通讯录列表</Text>
            </View>
        )
    };
    /*渲染分组头部*/
    _renderItemHeader=(item)=>{
        let content = item.section.key;
        return (
            <View style={styles.itemHeaderView}>
                <Text style={styles.itemHeaderText}>{content}</Text>
            </View>
        )
    }
    /*渲染每个记录*/
    _renderItem = (item) => { //item:{item:{},index:number,section:{本分组数据：key,data},separators:{}}
        let content = item.item;
        let index = item.index;
        let key = item.section.key;
        let checked = this.props.selectRecord[content.Account] ? 1 : 2;
        let name = content.Remark != "" ? content.Remark:content.Nickname;
        let path = userController.getAccountHeadImagePath(content.Account);
        return (
            <TouchableHighlight style={styles.itemTouch} underlayColor={'#333'} onPress={()=>this._itemTouch(content,index,key)}>
                <View style={styles.itemView}>
                    <View style={styles.itemContent}>
                        <ImagePlaceHolder style={styles.itemImage} imageUrl ={path}/>
                        <View style={styles.itemTextView}>
                            <Text style={styles.itemText}  numberOfLines={1}>{name}</Text>
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
        //将数据处理为SectionList所需要的格式
        let optionText = this.props.optionsType ? '单选' : '多选';
        this.HasData = Object.keys(this.props.selectRecord).length;
        optionText = this.HasData ? '发送('+this.HasData+')' : optionText;
        this.ContactsData = SectionDataFormate(this.state.ContactsData);
        this.CheckBoxData = [];
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)}}}
                    heading={'选择联系人'}
                    right={{func:()=>{this._forwardMessage()},text:optionText}}
                />
                <MySectionList
                    ref={e=>this._SectionList = e}
                    sections={this.ContactsData.SectionArray}
                    keyArray={this.ContactsData.KeyArray}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    ListHeaderComponent={this._renderHeader}
                    renderSectionHeader={this._renderItemHeader}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._renderSeparator}
                    stickySectionHeadersEnabled={true}
                    viewOffset={22}
                />
            </View>
        )
    }

    /*渲染头像*/
    // _renderAvator = (localUri, remoteUri, group) => {
    //     if (localUri != null && localUri != '') {
    //         return <Image style={styles.itemImage} source={{uri: localUri}}/>
    //     }
    //     if (remoteUri != null && remoteUri != '') {
    //         return <Image style={styles.itemImage} source={{uri: remoteUri}}/>
    //     }
    //     return <Image style={styles.itemImage} source={require('../resource/avator.jpg')}/>
    // };

    /*item点击事件*/
    _itemTouch=(content,index,key)=>{
        let RecordDto = {};
        RecordDto.receiveId = content.Account;
        RecordDto.group = false;
        let TargetDto = {};
        TargetDto.name = content.Nickname;
        TargetDto.headImage = content.HeadImagePath;
        this.props.changTargetInfo(content.Account,TargetDto);
        if(this.props.optionsType){
            //加入redux缓存记录等待统一发送
            this.props.changeSelectRecord(RecordDto);
            //改变选中框样式
            // this.CheckBoxData[key][index].onChange();
        }else{
            //调用发送方法
            // imLogicController.ForwardMessage(this.props.rowData,[RecordDto]);
            this.route.pop(this.props);
            this.props.forwardMethod(RecordDto);
        }
    };

    /*发送转发*/
    _forwardMessage=()=>{
        //是否有选中用户
        if(this.HasData){
            // let SelectRecord = Object.values(this.props.selectRecord);
            // imLogicController.ForwardMessage(this.props.rowData,SelectRecord);
            this.route.pop(this.props);
            this.props.forwardMethod();
        }else{
            //没有选择用户切换类型
            if(this.props.optionsType){
                this.CheckBoxData = [];
            }
            this.props.changeOptionsType();
        }
    };

    /*记录checkBox*/
    _initCheckBoxData=(checkBox,key)=>{
        if(checkBox!=null){
            if(!this.CheckBoxData[key]){
                this.CheckBoxData[key] = [];
            }
            this.CheckBoxData[key].push(checkBox);
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    headerView:{
    },
    headerText:{
    },
    itemHeaderView:{
        backgroundColor:'#dedede',
        justifyContent:'center',
        paddingLeft:15,
        paddingVertical:2
    },
    itemHeaderText:{
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
        paddingLeft:15,
        paddingRight:45
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
});

const mapDispatchToProps = (dispatch) => {
    return{
        ...bindActionCreators(SelectAction, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactsChoose);