
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
import LoginController from '../../../TSController/LoginController';
import UserController from '../../../TSController/UserController';
import IMControlelr from '../../../TSController/IMLogic/IMControllerLogic'
import AppManagement from '../../../App/AppManagement'

let loginController = undefined;
let userController = undefined;
let currentAccount = undefined;
let imController = undefined;


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
        backgroundColor: "#f2f2f2"
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
    itemSmallText:{
        fontSize:14,
        color:'#000',
        textAlignVertical:'center'
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
    headerText:{
        fontSize:24,
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

        this.state = {
            showFeatures:false,//显示功能块组件

        };

        loginController = new LoginController();
        imController = IMControlelr.getSingleInstance();
        userController = UserController.getSingleInstance();
        currentAccount = userController.getCurrentAccount();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }


    loginOut = ()=>{
        loginController.logOut();
        imController.logout();
        AppManagement.AppLogout();

        //关闭数据库
        // userController.logout();
        this.route.ToLogin(this.props);
    }

    changeShowFeature=(newState)=>{
        this.setState({showFeatures:newState});
    }

    toDoSome = (name)=>{
        if(name == '退出登录'){
            this.loginOut();
        }
    }

    chooseImage = (name)=>{
        if(name == '钱包'){
            return	<Image source={require('../resource/package.png')} style={styles.pic} ></Image>
        }else if(name == '卡包'){
            return	<Image source={require('../resource/pack.png')} style={styles.pic} ></Image>
        }else if(name == '收藏'){
            return	<Image source={require('../resource/souc.png')} style={styles.pic} ></Image>
        }else if(name == '相册'){
            return	<Image source={require('../resource/photo.png')} style={styles.pic} ></Image>
        }else if(name == '表情'){
            return	<Image source={require('../resource/smile.png')} style={styles.pic} ></Image>
        }else if(name == '退出登录'){
            return	<Image source={require('../resource/set.png')} style={styles.pic} ></Image>
        }
    }

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
    }
    _renderSection = ()=>{
        return <View style={styles.sction}></View>
    }
    _renderSeparator = () =>{
        return <View style={styles.ItemSeparator}></View>
    }
    _renderHeader =()=>{
        return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{alert('未开发')}}>
            <View style={styles.topBox}>
                <View  style={styles.topLeftBox} >
                    {currentAccount.HeadImageUrl&&currentAccount.HeadImageUrl!==''?
                        <Image source={{uri:currentAccount.HeadImageUrl}} style={styles.topPic} ></Image>:
                        <Image source={require('../resource/avator.jpg')} style={styles.topPic} ></Image>
                    }
                    <View style={{height:60,justifyContent:'space-between'}}>
                        <Text style={styles.headerText}>{currentAccount.Nickname}</Text>
                        <Text style={styles.itemSmallText}>{'微信号：'+currentAccount.Account}</Text>
                    </View>
                </View>
                {/*<Text style={styles.arrow}>{'>'}</Text>*/}
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Icon name="qrcode" size={35} color="#aaa" style={{textAlignVertical:'center',marginRight:10}}/>
                    <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>

                </View>
            </View>
        </TouchableHighlight>
    }
    render() {
        return (
            <View style={styles.container}>
                {/*<StatusBar*/}
                    {/*translucent={false}*/}
                    {/*animated={false}*/}
                    {/*hidden={false}*/}
                    {/*backgroundColor="blue"*/}
                    {/*barStyle="light-content" />*/}
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
            //this.features.getWrappedInstance().changeFeatureState()
    }
}




const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(featuresAction, dispatch)
});

 export default connect(mapStateToProps, mapDispatchToProps)(Me);