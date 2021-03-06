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
import CheckBox from '../../Common/Component/CheckBox';
import * as SelectAction from '../reducer/action';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';
let {width,height} = Dimensions.get('window');
class GroupsChoose extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
            GroupsData: [],
        };
        this.CheckBoxData = [];//选择框组件
        this.HasData = 0;//是否有选择数据
        this.userController = this.appManagement.getUserLogicInstance();
        this.imLogicController = this.appManagement.getIMLogicInstance();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.userController = undefined;
        this.imLogicController = undefined;
    }

    componentDidMount() {
        this.userController.getGroupContactList(false,(contacts)=>{
            this.setState({
                GroupsData:contacts
            })
        });
    }

    /*生成key值*/
    _keyExtractor = (item, index) => {
        return index;
    };
    /*渲染每个记录*/
    _renderItem = (item) => { //item:{item:{},index:number,separators:{}}
        let content = item.item;
        let index = item.index;
        let checked = this.props.selectRecord[content.Id] ? 1 : 2;
        return (
            <TouchableHighlight style={styles.itemTouch} underlayColor={'#333'} onPress={()=>this._itemTouch(content,index)}>
                <View style={styles.itemView}>
                    <View style={styles.itemContent}>
                        <ImagePlaceHolder style={styles.itemImage} imageUrl = {require('../../Common/resource/groupAvator.png')}/>
                        <View style={styles.itemTextView}>
                            <Text style={styles.itemText}  numberOfLines={1}>{content.Name}</Text>
                        </View>
    </View>
        {this.props.optionsType ? <CheckBox ref={e=>this._initCheckBoxData(e)} checked={checked}/> : null}
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
        heading={'选择群聊'}
        right={{func:()=>{this._forwardMessage()},text:optionText}}
        />
        <FlatList
        data={this.state.GroupsData}
        extraData={{data:this.state,props:this.props}}
        keyExtractor={this._keyExtractor}
        ListHeaderComponent={this._renderHeader}
        renderItem={this._renderItem}
                    ItemSeparatorComponent={this._renderSeparator}
                />
            </View>
        )
    }

    /*渲染头像*/
    // _renderAvator = (HeadImagePath, HeadImageUrl, group) => {
    //     if (HeadImagePath != null && HeadImagePath != '') {
    //         return <Image style={styles.itemImage} source={{uri: HeadImagePath}}/>
    //     }
    //     if (HeadImageUrl != null && HeadImageUrl != '') {
    //         return <Image style={styles.itemImage} source={{uri: HeadImageUrl}}/>
    //     }
    //     return <Image style={styles.itemImage} source={require('../resource/groupAvator.png')}/>
    // };

    /*item点击事件*/
    _itemTouch=(content,index)=>{
        let RecordDto = {};
        RecordDto.receiveId = content.Id;
        RecordDto.group = true;
        let TargetDto = {};
        TargetDto.name = content.Name;
        TargetDto.headImage = content.HeadImagePath;
        this.props.changTargetInfo(content.Id,TargetDto);
        if(this.props.optionsType){
            //加入redux缓存记录等待统一发送
            this.props.changeSelectRecord(RecordDto);
            //改变选中框样式
            this.CheckBoxData[index].onChange();
        }else{
            //调用发送方法
            // this.imLogicController.ForwardMessage(this.props.rowData,[RecordDto]);
            this.route.pop(this.props);
            this.props.forwardMethod(RecordDto);
        }
    };

    /*发送转发*/
    _forwardMessage=()=>{
        //是否有选中用户
        if(this.HasData){
            // let SelectRecord = Object.values(this.props.selectRecord);
            // this.imLogicController.ForwardMessage(this.props.rowData,SelectRecord);
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
    _initCheckBoxData=(checkBox)=>{
        if(checkBox!=null){
            this.CheckBoxData.push(checkBox);
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
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
});

const mapDispatchToProps = (dispatch) => {
    return{
        ...bindActionCreators(SelectAction, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsChoose);