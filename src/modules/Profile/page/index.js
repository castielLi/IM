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
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';
import AppPageMarkEnum from '../../../App/Enum/AppPageMarkEnum';

let currentObj = undefined;



class Profile extends AppComponent {
    constructor(props){
        super(props);
        this.imController = this.appManagement.getIMLogicInstance();
        this.userController = this.appManagement.getUserLogicInstance();
        this.currentAccount = this.userController.getCurrentAccount();
        this.headImagePath = this.userController.getAccountHeadImagePath(this.currentAccount.Account)
        this.state = {
            showFeatures:false,//显示功能块组件
            headImageUrl:this.headImagePath,
            currentAccount:this.currentAccount,
            nickname:this.currentAccount.Nickname
        };
        currentObj = this;

        this.originData = [
            {
                'key':'1',
                'data': [{
                    'name': currentObj.Localization.Profile.avator,
                },{
                    'name': currentObj.Localization.Profile.nick,
                }, {
                    'name': currentObj.Localization.Profile.QRCode,
                }, {
                    'name': currentObj.Localization.Profile.more,
                }]
            },
            {
                'key':'2',
                'data': [{
                    'name': this.Localization.Profile.address,
                }]
            },
        ];
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
        this.imController = undefined;
    }

    _refreshUI(type,param){
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
            case this.Localization.Profile.avator:
                this.route.push(this.props,{key: 'Profile',routeId: 'HeadImage'});
                break;
            case this.Localization.Profile.nick:
                this.route.push(this.props,{key: 'Profile',routeId: 'NickName',params:{}});
                break;
            case this.Localization.Profile.QRCode:
                this.route.push(this.props,{key: 'Profile',routeId: 'QRCode',params:{nickname,headImageUrl}});
                break;
            case this.Localization.Profile.more:
                this.route.push(this.props,{key: 'Profile',routeId: 'MoreSetting',params:{"account":this.state.currentAccount}});
                break;
            default:
                break;
        }
    };

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
            case this.Localization.Profile.avator:
                return (
                    <View style={styles.itemRightBox}>
                        <ImagePlaceHolder style={styles.topPic}
                                          imageUrl ={this.state.headImageUrl}
                        />
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                );
            case this.Localization.Profile.nick:
                return(
                    <View style={styles.itemRightBox}>
                        <Text style={styles.itemText}>{this.state.nickname}</Text>
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                )
            case this.Localization.Profile.cloudId:
                return(
                    <View style={styles.itemRightBox}>
                        <Text style={styles.itemText}>{this.state.currentAccount.Account}</Text>
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                )
            case this.Localization.Profile.QRCode:
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
                    heading={this.Localization.Profile.Title}
                />

                <SectionList
                    keyExtractor={(item,index)=>("index"+index+item)}
                    // ListHeaderComponent={this._renderHeader}
                    renderSectionHeader={this._renderSection}
                    renderItem={this._renderItem}
                    sections={this.originData}
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
        backgroundColor:'#eee',
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