/**
 * Created by apple on 2018/3/16.
 */
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
import Icon from 'react-native-vector-icons/FontAwesome';
let originData = [
    {
        'key':'1',
        'data': [{
            'name': "修改密码",
        },{
            'name': "设置服务器地址",
        }]
    }
];

export default class Setting extends AppComponent {
    constructor(props){
        super(props);
        this._toDoSome = this._toDoSome.bind(this);
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
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Icon name="angle-right" size={35} color="#aaa" />
                </View>
            </View>
        </TouchableHighlight>
    };

    _renderSeparator = () =>{
        return(
            <View style={styles.ItemSeparatorBox}>
                <View style={styles.ItemSeparator}/>
            </View>
        )


    };

    _toDoSome = (name)=>{
        switch (name){
            case '修改密码':
                this.route.push(this.props,{key: 'Me',routeId: 'ChangePassword',params:{}});
                break;
            case '设置服务器地址':
                this.route.push(this.props,{key: 'Me',routeId: 'ConfigSetting',params:{}});
                break;
            default:
                break;
        }
    };

    loginOut = ()=>{
        this.appManagement.systemLogout();
        this.route.ToLogin(this.props);
    };


    render() {
        return(
            <View style={styles.container}>
                <MyNavigationBar
                    left = {{func:()=>{this.route.pop(this.props)}}}
                    heading={'设置'}
                />
                <SectionList
                    keyExtractor={(item,index)=>("index"+index+item)}
                    renderSectionHeader={this._renderSection}
                    renderItem={this._renderItem}
                    sections={originData}
                    ItemSeparatorComponent={this._renderSeparator}
                    stickySectionHeadersEnabled={false}
                />
                <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.loginOut} style={[styles.sendMessageBox,{marginBottom:20}]}>
                    <Text style={styles.sendMessage}>退出登录</Text>
                </TouchableHighlight>
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
    sendMessage:{
        textAlignVertical:'center',
        color:'#fff',
        fontSize:20,
    },
    sectionHead:{
        height:20,
        backgroundColor:'#eee',
    },
    ItemSeparatorBox:{
        backgroundColor: '#fff',
    },
    ItemSeparator:{
        height:1,
        backgroundColor:'#eee',
        marginHorizontal:15
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
    sendMessageBox:{
        height:55,
        borderRadius:5,
        marginTop:15,
        marginHorizontal:20,
        backgroundColor:'#dc0000',
        justifyContent:'center',
        alignItems:'center'
    }

});