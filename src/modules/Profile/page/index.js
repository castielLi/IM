/**
 * Created by apple on 2018/2/22.
 */

import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    Image,
    TouchableHighlight,
    Dimensions,
    AsyncStorage,
    StatusBar,
    SectionList
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import * as featuresAction from '../../Common/menu/reducer/action';
import {bindActionCreators} from 'redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import LoginController from '../../../TSController/LoginController';
import UserController from '../../../TSController/UserController';
import IMControlelr from '../../../TSController/IMLogic/IMControllerLogic';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';
import AppPageMarkEnum from '../../../App/AppPageMarkEnum';

let loginController = undefined;
let userController = undefined;
let currentAccount = undefined;
let imController = undefined;
let headImagePath = undefined;
let currentObj = undefined;


var originData = [
    {
        'key':'1',
        'data': [{
            'name': "头像",
        },{
            'name': "名字",
        }, {
            'name': "云信号",
        }, {
            'name': "我的二维码",
        }, {
            'name': "更多",
        }]
    },
    {
        'key':'2',
        'data': [{
            'name': "我的地址",
        }]
    },
];

class Profile extends AppComponent {
    constructor(props){
        super(props);

        loginController = new LoginController();
        imController = IMControlelr.getSingleInstance();
        userController = UserController.getSingleInstance();
        currentAccount = userController.getCurrentAccount();
        headImagePath = userController.getAccountHeadImagePath(currentAccount.Account)
        this.state = {
            showFeatures:false,//显示功能块组件
            headImageUrl:headImagePath,
            currentAccount:currentAccount,
            nickname:currentAccount.Nickname
        };
        currentObj = this;
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    _refreshUI(type,param){
        console.log("Profile")
        switch (type){
            case AppPageMarkEnum.ChangeHeadImage:
                currentObj.setState({
                    headImageUrl:param,
                });
                break;
            case AppPageMarkEnum.ChangeNickname:
                currentObj.setState({
                    nickname:param
                })
        }
    }

    toDoSome = (name)=>{
        let {nickname,headImageUrl} = this.state;
        switch (name){
            case '头像':
                this.route.push(this.props,{key: 'Profile',routeId: 'HeadImage'});
                break;
            case '名字':
                this.route.push(this.props,{key: 'Profile',routeId: 'NickName',params:{}});
                break;
            case '我的二维码':
                this.route.push(this.props,{key: 'Profile',routeId: 'QRCode',params:{nickname,headImageUrl}});
                break;
            case '更多':
                this.route.push(this.props,{key: 'Profile',routeId: 'MoreSetting',params:{}});
                break;
            default:
                break;
        }
    }

    _renderItem = (info)=>{
        return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.toDoSome.bind(this,info.item.name)}>
            <View style={styles.itemBox}>
                <View  style={styles.itemLeftBox} >
                    <Text style={styles.itemText}>{info.item.name}</Text>
                </View>
                {this._fillingValue(info)}
            </View>
        </TouchableHighlight>
    }
    _renderSection = (info)=>{
        if(info.section.key == 1){
            return null;
        }
        return <View style={styles.sction}/>
    }
    _renderSeparator = () =>{
        return (
            <View style={styles.ItemSeparatorBox}>
                <View style={styles.ItemSeparator}/>
            </View>
        )
    }

    _fillingValue=(info)=>{
        switch (info.item.name){
            case '头像':
                return (
                    <View style={styles.itemRightBox}>
                        <ImagePlaceHolder style={styles.topPic}
                                          imageUrl ={this.state.headImageUrl}
                        />
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                );
            case '名字':
                return(
                    <View style={styles.itemRightBox}>
                        <Text style={styles.itemText}>{this.state.nickname}</Text>
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                )
            case '云信号':
                return(
                    <View style={styles.itemRightBox}>
                        <Text style={styles.itemText}>{this.state.currentAccount.Account}</Text>
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                )
            case '我的二维码':
                return(
                    <View style={styles.itemRightBox}>
                        <Icon name="qrcode" size={35} color="#fff" style={styles.arrow}/>
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                )
            default:
                return(
                    <View style={styles.itemRightBox}>
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left = {{func:()=>{
                        this.route.pop(this.props)
                    }}}
                    heading={'个人信息'}
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
    container: {
        flex: 1,
        backgroundColor: "#ebebeb"
    },
    topBox:{
        height:80,
        flexDirection:'row',
        paddingHorizontal:15,
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    topLeftBox:{
        height:70,
        flexDirection:'row',
        alignItems:'center',

    },
    topPic:{
        width:60,
        height:60,
        resizeMode:'stretch',
    },
    itemSmallText:{
        fontSize:14,
        color:'#000',
        textAlignVertical:'center'
    },
    sction:{
        height:20
    },
    sctionBottom:{
        height:1
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
    pic:{
        width:25,
        height:25,
        resizeMode:'contain',
        marginRight:15
    },
    itemText:{
        fontSize:15,
        color:'#000',
    },
    headerText:{
        fontSize:24,
        color:'#000',

    },
    ItemSeparatorBox:{
        backgroundColor: '#fff',
    },
    ItemSeparator:{
        height:1,
        backgroundColor:'#d9d9d9',
        marginHorizontal:15
    },
    arrow:{
        fontSize:20,
        color:'#aaa',
        marginLeft:15
    },
});

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(featuresAction, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);