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

import ContainerComponent from '../../Core/Component/ContainerComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyNavigationBar from '../Common/NavigationBar/NavigationBar';


export default class AddFriends extends ContainerComponent {
    constructor(props){
        super(props)
    }

    static defaultProps = {
        addType:[
            {typeName:'雷达加朋友',intro:'添加身边的朋友',typeID:1,source:require('./resource/radar.png')},
            {typeName:'面对面建群',intro:'与身边的朋友进入同一个群聊',typeID:2,source:require('./resource/face.png')},
            {typeName:'扫一扫',intro:'扫描二维码名片',typeID:3,source:require('./resource/scanning.png')},
            {typeName:'手机联系人',intro:'添加或邀请通讯录中的朋友',typeID:4,source:require('./resource/contact.png')},
            {typeName:'公众号',intro:'获取更多资讯和服务',typeID:5,source:require('./resource/public.png')}
        ]
    };

    static propTypes = {
    };

    _title =  () => {
        return {
            title: "添加朋友",
            tintColor:'#fff',
        }
    }

    goToSearchNewFriend = () =>{
        this.route.push(this.props,{key:'SearchNewFriend',routeId:'SearchNewFriend',params:{}});

    }

    render() {
        return(
            <View style={styles.container}>
                <MyNavigationBar
                    heading={'添加朋友'}
                    left={{func:()=>{this.route.pop(this.props)}}}
                />
                <View>
                    <TouchableWithoutFeedback onPress={this.goToSearchNewFriend}>
                        <View style={styles.searchView}>
                            <View style={styles.search}>
                                <Icon name="search" size={22} color="#66CD00" style={styles.searchIcon}/>
                                <Text style={styles.searchText}>奇信号/QQ号/手机号</Text>
                            </View>
                            <View style={styles.searchLine}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.userInfo}>
                        <Text>我的手机号:{'18580607008'.replace(/(^\d{3}|\d{4}\B)/g,"$1 ")}</Text>
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