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
import SystemManager from '../../../../TSController/SystemManager';
import {
    connect
} from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import * as unReadMessageActions from '../../../../modules/MainTabbar/reducer/action';

class Setting extends AppComponent {
    constructor(props){
        super(props);
        this._toDoSome = this._toDoSome.bind(this);
        this.originData = [
            {
                'key':'1',
                'data': [{
                    'name': this.Localization.Setting.changePassword,
                },{
                    'name': this.Localization.Setting.host,
                },{
                    'name': this.Localization.Setting.version,
                }]
            }
        ];
        this._toDoSome = this._toDoSome.bind(this);
        this._fillingValue = this._fillingValue.bind(this);
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
        return(
            <View style={styles.ItemSeparatorBox}>
                <View style={styles.ItemSeparator}/>
            </View>
        )


    };

    _toDoSome = (name)=>{
        switch (name){
            case this.Localization.Setting.changePassword:
                this.route.push(this.props,{key: 'Me',routeId: 'ChangePassword',params:{}});
                break;
            case this.Localization.Setting.host:
                this.route.push(this.props,{key: 'Me',routeId: 'ConfigSetting',params:{}});
                break;
            default:
                break;
        }
    };

    _fillingValue=(info)=>{
        switch (info.item.name){
            case this.Localization.Setting.version:
                return(
                    <View style={styles.itemRightBox}>
                        <Text style={styles.itemContent}>{this.getVersion()}</Text>
                    </View>
                );
            default:
                return(
                    <View style={styles.itemRightBox}>
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                )
        }
    };

    getVersion = ()=>{
        return SystemManager.getCurrentAppVersion();
    }

    loginOut = ()=>{
        this.props.changeUnReadMessageNumber(0);
        this.appManagement.systemLogout();
    };


    render() {
        return(
            <View style={styles.container}>
                <MyNavigationBar
                    left = {{func:()=>{this.route.pop(this.props)}}}
                    heading={this.Localization.Setting.Title}
                />
                <SectionList
                    keyExtractor={(item,index)=>("index"+index+item)}
                    renderSectionHeader={this._renderSection}
                    renderItem={this._renderItem}
                    sections={this.originData}
                    ItemSeparatorComponent={this._renderSeparator}
                    stickySectionHeadersEnabled={false}
                />
                <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.loginOut} style={[styles.sendMessageBox,{marginBottom:20}]}>
                    <Text style={styles.sendMessage}>{this.Localization.Setting.logout}</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#ebebeb',
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
    },
    arrow:{
        fontSize:20,
        color:'#989898',
        marginLeft:15
    },

});

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(unReadMessageActions, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Setting);