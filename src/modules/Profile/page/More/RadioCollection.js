/**
 * Created by Hsu. on 2018/3/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Modal,
    View,
    TouchableHighlight,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    SectionList
} from 'react-native';
import AppComponent from '../../../../Core/Component/AppComponent';
import MyNavigationBar from '../../../Common/NavigationBar/NavigationBar';
import UserController from '../../../../TSController/UserController';
import Icon from 'react-native-vector-icons/FontAwesome';
let currentObj;
let userController = undefined;
let {width, height} = Dimensions.get('window');

let originData = [
    {
        'key':'1',
        'data': [{
            'name': "男",
        },{
            'name': "女",
        }]
    }
];
export default class RadioCollection extends AppComponent {
    constructor(props){
        super(props);
        this._checkIcon = this._checkIcon.bind(this);
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }


    _onTouchOption=(value)=>{
        let {onPress} = this.props;
        onPress && onPress(value);
    };

    _toDoSome = (name)=>{
        switch (name){
            case '女':
                break;
            case '男':
                break;
            default:
                break;
        }
    };

    setGender = ()=>{

    }

    _renderSection = ()=>{
        return <View style={styles.sectionHead}/>
    };

    _checkIcon = (name) =>{
        if((this.props.gender == 1 && name == "男") || (this.props.gender == 0 && name == "女")){
            return <View style={styles.itemRightBox}>
                <Icon name="check" size={35} color="#fff" style={styles.arrow}/>
            </View>
        }else{
            return null;
        }
    }


    _renderItem = (info)=>{
        return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this._toDoSome.bind(this,info.item.name)}>
            <View style={styles.itemBox}>
                <View  style={styles.itemLeftBox} >
                    <Text style={styles.itemText}>{info.item.name}</Text>
                </View>
                {
                    this._checkIcon(info.item.name)
                }

            </View>
        </TouchableHighlight>
    };

    _renderSeparator = () =>{
        return <View style={styles.ItemSeparator}/>
    };


    render(){
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left = {{func:()=>{this.route.pop(this.props)}}}
                    heading={'设置性别'}
                    right={{func:()=>{this.setGender()},text:'完成'}}
                />

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
        alignItems:'center',
        flex:1,
        justifyContent:'flex-end',
        marginLeft:15,
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
        includeFontPadding:false,
        textAlign:'right',
    },
    arrow:{
        fontSize:20,
        color:'#aaa',
        marginLeft:15
    },

});