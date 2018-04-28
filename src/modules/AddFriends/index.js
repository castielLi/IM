/**
 * Created by Hsu. on 2017/10/9.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback
} from 'react-native';

import AppComponent from '../../Core/Component/AppComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyNavigationBar from '../Common/NavigationBar/NavigationBar';


export default class AddFriends extends AppComponent {
    constructor(props){
        super(props)
        this.userController =  this.appManagement.getUserLogicInstance();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
    }


    static propTypes = {
    };

    _title =  () => {
        return {
            title: this.Localization.AddFriend.AddFriend,
            tintColor:'#fff',
        }
    }

    goToSearchNewFriend = () =>{
        this.route.push(this.props,{key:'SearchNewFriend',routeId:'SearchNewFriend',params:{}});

    }

    render() {
        let AccountObj = this.userController.getCurrentAccount();
        return(
            <View style={styles.container}>
                <MyNavigationBar
                    heading={this.Localization.AddFriend.AddFriend}
                    left={{func:()=>{this.route.pop(this.props)}}}
                />
                <View>
                    <TouchableWithoutFeedback onPress={this.goToSearchNewFriend}>
                        <View style={styles.searchView}>
                            <View style={styles.search}>
                                <Icon name="search" size={22} color="#66CD00" style={styles.searchIcon}/>
                                <Text style={styles.searchText}>{this.Localization.AddFriend.PlaceHolder}</Text>
                            </View>
                            <View style={styles.searchLine}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.userInfo}>
                        <Text>我的手机号:{AccountObj.PhoneNumber.replace(/(^\d{3}|\d{4}\B)/g,"$1 ")}</Text>
                    </View>
                </View>
                <View style={styles.addWayView}>
                    {this.props.addType.map((item,index,arry) =>
                        <TouchableOpacity key={index} style={styles.addWay}>
                            <View style={[styles.addWayBox,{borderBottomWidth:index==arry.length-1 ? 0 : 1,}]}>
                                <Image style={styles.wayIcon} source={item.source}/>
                                <View  style={styles.wayTextView}>
                                    <Text style={styles.wayName}>{item.typeName}</Text>
                                    <Text style={styles.wayIntro}>{item.intro}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#ddd',
        flex:1
    },
    searchView:{
        backgroundColor:'#fff',
        paddingHorizontal:10,
        paddingTop:17,
        paddingBottom:10,
    },
    search:{
        flexDirection:'row',
        alignItems:'center',
    },
    searchIcon:{
        marginLeft:10,
        marginRight:20,
    },
    searchText:{
        color:'#dedede',
    },
    searchLine:{
        marginTop:4,
        borderBottomWidth:1,
        borderColor:'#66CD00',
    },
    userInfo:{
        paddingVertical:20,
        alignItems:'center'
    },
    addWayView:{

    },
    addWay:{
        backgroundColor:'#fff',
        paddingHorizontal:10,
    },
    addWayBox:{
        flexDirection:'row',
        borderColor:"#ddd",
        paddingVertical:12,
    },
    wayIcon:{
        width:40,
        height:40
    },
    wayTextView:{
        marginLeft:10,
        justifyContent:'space-between',
    },
    wayName:{
        fontSize:17,
        includeFontPadding:false,
        color:'#000'
    },
    wayIntro:{
        fontSize:12,
        color:'#999'
    },

    leftButtonView:{
        flexDirection:'row',
    },
    goBackView:{
        paddingHorizontal:10,
        justifyContent:'center'
    },
    goBack:{
        width:15,
        height:15,
    }
});