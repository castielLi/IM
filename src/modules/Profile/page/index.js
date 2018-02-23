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
import Features from '../../Common/menu/features';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import LoginController from '../../../TSController/LoginController';
import UserController from '../../../TSController/UserController';
import IMControlelr from '../../../TSController/IMLogic/IMControllerLogic'
import AppManagement from '../../../App/AppManagement'
import PlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder'

let loginController = undefined;
let userController = undefined;
let currentAccount = undefined;
let imController = undefined;


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
        marginHorizontal:15,
        height:0,
        borderBottomWidth:1,
        borderBottomColor:'#eee',
    },
    ItemSeparatorBox:{
        flex:1,
        height:1,
        backgroundColor: '#eee',
    },
    arrow:{
        fontSize:20,
        color:'#aaa'
    },
});
class Profile extends AppComponent {
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

    toDoSome = (name)=>{
        switch (name){
            case '头像':
                this.route.push(this.props,{key: 'Profile',routeId: 'HeadImage',params:{"data":this.props.headImagePath}});
                break;
            default:
                alert('未开发');
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
        return <View style={styles.sction}></View>
    }
    _renderSeparator = () =>{
        return <View style={styles.ItemSeparator}></View>
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
                <Features ref={e => this.features = e} navigator={this.props.navigator}/>
            </View>
        )
        //this.features.getWrappedInstance().changeFeatureState()
    }

    _fillingValue=(info)=>{
        switch (info.item.name){
            case '头像':
                return (
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <PlaceHolder style={styles.topPic}
                                     imageUrl ={this.props.headImagePath}
                        />
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                );
            default:
                return(
                    <View>
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                )
        }
    }
}




const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(featuresAction, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);