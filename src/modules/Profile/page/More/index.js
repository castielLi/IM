/**
 * Created by Hsu. on 2018/3/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    SectionList,
    TouchableHighlight,
} from 'react-native';
import AppComponent from '../../../../Core/Component/AppComponent';
import MyNavigationBar from '../../../Common/NavigationBar/NavigationBar';
import UserController from '../../../../TSController/UserController';
import RadioCollection from './RadioCollection';
let currentObj;
let userController = undefined;
let originData = [
    {
        'key':'1',
        'data': [{
            'name': "性別",
        },{
            'name': "地区",
        }, {
            'name': "个性签名",
        }]
    }
];

export default class MoreSetting extends AppComponent {
    constructor(props){
        super(props);
        userController = UserController.getSingleInstance();
        this.state = {
        }
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    _renderSection = ()=>{
        return <View style={styles.sectionHead}/>
    };

    _renderItem = (info)=>{
        return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this._toDoSome.bind(this,info.item.name)}>
            <View style={styles.itemBox}>
                <View  style={styles.itemLeftBox} >
                    <Text style={styles.itemText}>{info.item.name}</Text>
                </View>
                {this._fillingValue(info)}
            </View>
        </TouchableHighlight>
    };

    _renderSeparator = () =>{
        return <View style={styles.ItemSeparator}/>
    };

    _fillingValue=(info)=>{
        switch (info.item.name){
            case '性別':
                return (
                    <View style={styles.itemRightBox}>
                        <Text style={styles.itemContent}>男</Text>
                    </View>
                );
            case '地区':
                return(
                    <View style={styles.itemRightBox}>
                        <Text style={styles.itemContent}>中国 重庆</Text>
                    </View>
                );
            case '个性签名':
                return(
                    <View style={styles.itemRightBox}>
                        <Text style={styles.itemContent}>{false ? '' : '未填写'}</Text>
                    </View>
                );
        }
    };

    _toDoSome = (name)=>{
        switch (name){
            case '性別':
                // this._RadioCollection.onChange();
                break;
            case '地区':
                // this.route.push(this.props,{key: 'Profile',routeId: 'NickName',params:{}});
                break;
            case '个性签名':
                // this.route.push(this.props,{key: 'Profile',routeId: 'Signature',params:{Signature:''}});
                break;
            default:
                break;
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <MyNavigationBar
                    left = {{func:()=>{this.route.pop(this.props)}}}
                    heading={'更多信息'}
                />
                <View style={styles.SectionListBox}>
                    <SectionList
                        keyExtractor={(item,index)=>("index"+index+item)}
                        // ListHeaderComponent={this._renderHeader}
                        renderSectionHeader={this._renderSection}
                        renderItem={this._renderItem}
                        sections={originData}
                        ItemSeparatorComponent={this._renderSeparator}
                        stickySectionHeadersEnabled={false}
                    />
                </View>
                <RadioCollection ref={e=>this._RadioCollection = e}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#eee',
        flex:1,
    },
    SectionListBox:{
        backgroundColor:'#fff',
    },
    sectionHead:{
        height:20,
        backgroundColor:'#eee',
    },
    ItemSeparator:{
        marginHorizontal:15,
        height:0,
        borderBottomWidth:1,
        borderBottomColor:'#eee',
    },
    itemBox:{
        minHeight:40,
        flexDirection:'row',
        paddingHorizontal:15,
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff',
        paddingVertical:8
    },
    itemLeftBox:{
        height:30,
        flexDirection:'row',
        alignItems:'center',

    },
    itemRightBox:{
        flexDirection:'row',
        alignItems:'center'
    },
    itemText:{
        color:'#000',
        fontSize:16,
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false
    },
    itemContent:{
        color:'#999',
        fontSize:14,
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false
    }

});