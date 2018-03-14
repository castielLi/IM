
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
import Features from '../../Common/menu/features';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
// import LoginController from '../../../TSController/LoginController';
import UserController from '../../../TSController/UserController';
// import IMControlelr from '../../../TSController/IMLogic/IMControllerLogic';
import AppManagement from '../../../App/AppManagement';
import AppPageMarkEnum from '../../../App/Enum/AppPageMarkEnum'
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';
import {LogoutState} from '../../../App/AppManagementState'

// let loginController = undefined;
let userController = undefined;
let currentAccount = undefined;
let headImagePath = undefined;
// let imController = undefined;
let currentObj = undefined;
let appManagement = undefined;


var originData = [
    {
        'key':'1',
        'data': [{
            'name': "钱包",
        }]
    },
    {
        'key':'2',
        'data': [{
            'name': "卡包",
        }, {
            'name': "收藏",
        }, {
            'name': "相册",
        }, {
            'name': "表情",
        }]
    },
    {
        'key':'3',
        'data': [{
            'name': "退出登录",
        }]
    },

]


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
        marginRight:15
    },
    topInfo:{
        height:60,
        justifyContent:'center',
    },
    headerText:{
        fontSize:16,
        color:'#000',
        textAlignVertical:'center',
        includeFontPadding:false
    },
    itemSmallText:{
        fontSize:14,
        color:'#989898',
        textAlignVertical:'center',
        includeFontPadding:false,
        marginTop:2
    },
    sction:{
        height:20
    },
    itemBox:{
        height:40,
        flexDirection:'row',
        paddingHorizontal:15,
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    itemLeftBox:{
        height:30,
        flexDirection:'row',
        alignItems:'center',

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
    ItemSeparator:{
        height:1,
        backgroundColor: '#eee',
    },
    arrow:{
        fontSize:20,
        color:'#aaa'
    },
});
class Me extends AppComponent {
    constructor(props){
        super(props);

        // loginController = new LoginController();
        // imController = IMControlelr.getSingleInstance();
        userController = UserController.getSingleInstance();
        currentAccount = userController.getCurrentAccount();
        headImagePath = userController.getAccountHeadImagePath(currentAccount.Account)
        appManagement = new AppManagement();
        this.state = {
            showFeatures:false,//显示功能块组件
            headImageUrl:headImagePath,
            name : currentAccount.Nickname
        };

        currentObj = this;
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    _refreshUI(type,param){
        console.log("Me")
        switch (type){
            case AppPageMarkEnum.ChangeHeadImage:
                currentObj.setState({
                    headImageUrl:param,
                });
                break;
            case AppPageMarkEnum.ChangeNickname:
                currentObj.setState({
                    name:param
                });
                break;
            break;
        }
    }


    loginOut = ()=>{
        let logoutState = new LogoutState();
        logoutState.stateOpreation(appManagement);
        this.route.ToLogin(this.props);
    }

    toDoSome = (name)=>{
        if(name == '退出登录'){
            this.loginOut();
        }
    }

    chooseImage = (name)=>{
        switch (name){
            case '钱包':
                return <Image source={require('../resource/package.png')} style={styles.pic} />;
            case '卡包':
                return <Image source={require('../resource/pack.png')} style={styles.pic} />;
            case '收藏':
                return <Image source={require('../resource/souc.png')} style={styles.pic} />;
            case '相册':
                return <Image source={require('../resource/photo.png')} style={styles.pic} />;
            case '表情':
                return <Image source={require('../resource/smile.png')} style={styles.pic} />;
            case '退出登录':
                return <Image source={require('../resource/set.png')} style={styles.pic} />;
        }
    };

    _goToProfile = ()=>{
        this.route.push(this.props,{key:'Profile',routeId:'Profile'});
    };

    _renderItem = (info)=>{
        return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.toDoSome.bind(this,info.item.name)}>
            <View style={styles.itemBox}>
                <View  style={styles.itemLeftBox} >
                    {this.chooseImage(info.item.name)}
                    <Text style={styles.itemText}>{info.item.name}</Text>
                </View>
                {/*<Text style={styles.arrow}>{'>'}</Text>*/}
                <View>
                    <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                </View>

            </View>
        </TouchableHighlight>
    };
    _renderSection = ()=>{
        return <View style={styles.sction}/>
    };
    _renderSeparator = () =>{
        return <View style={styles.ItemSeparator}/>
    };
    _renderHeader =()=>{
        return (
            <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this._goToProfile}>
                <View style={styles.topBox}>
                    <View  style={styles.topLeftBox} >
                        <ImagePlaceHolder style={styles.topPic} imageUrl ={this.state.headImageUrl}/>
                        <View style={styles.topInfo}>
                            <Text style={styles.headerText}>{this.state.name}</Text>
                            <Text style={styles.itemSmallText}>{'云信号：'+currentAccount.Account}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Icon name="qrcode" size={25} color="#aaa" style={{textAlignVertical:'center',marginRight:10}}/>
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                </View>
            </TouchableHighlight>
        )
    };

    render() {
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left = {'云信'}
                    right={[
                        {func:()=>{alert('搜索')},icon:'search'},
                        {func:()=>{this.props.showFeatures()},icon:'list-ul'}
                        ]}
                />
                <SectionList
                    keyExtractor={(item,index)=>("index"+index+item)}
                    ListHeaderComponent={this._renderHeader}
                    renderSectionHeader={this._renderSection}
                    renderItem={this._renderItem}
                    sections={originData}
                    ItemSeparatorComponent={this._renderSeparator}
                    stickySectionHeadersEnabled={false}
                />
                <Features ref={e => this.features = e} navigator={this.props.navigator}/>
            </View>
            )
    }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(featuresAction, dispatch)
});

 export default connect(mapStateToProps, mapDispatchToProps)(Me);