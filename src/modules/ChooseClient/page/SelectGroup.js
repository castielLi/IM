/**
 * Created by Hsu. on 2018/2/28.
 */
import React, {Component} from 'react';
import {StyleSheet,Image,AsyncStorage,Platform,Alert,FlatList,TouchableHighlight,View,Text,Dimensions} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import UserController from '../../../TSController/UserController'
import IMControllerLogic from '../../../TSController/IMLogic/IMControllerLogic'
import AppPageMarkEnum from '../../../App/AppPageMarkEnum'
import {Navigator} from 'react-native-deprecated-custom-components';

let userController = undefined;
let imLogicController = undefined;
let {width,height} = Dimensions.get('window');
export default class SelectGroup extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
            GroupsData: [],
        };
        userController = UserController.getSingleInstance();
        imLogicController = IMControllerLogic.getSingleInstance();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    componentDidMount() {
        userController.getGroupContactList(false,(contacts)=>{
            this.setState({
                GroupsData:contacts
            })
        });
    }

    /*生成key值*/
    _keyExtractor = (item, index) => {
        return index;
    };
    /*渲染每个记录*/
    _renderItem = (item) => { //item:{item:{},index:number,separators:{}}
        let content = item.item;
        let index = item.index;
        return (
            <TouchableHighlight style={styles.itemTouch} underlayColor={'#333'} onPress={()=>this._itemTouch(content)}>
                <View style={styles.itemView}>
                    <View style={styles.itemContent}>
                        {this._renderAvator(content.HeadImagePath, content.HeadImageUrl)}
                        <View style={styles.itemTextView}>
                            <Text style={styles.itemText}  numberOfLines={1}>{content.Name}</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    };
    /*渲染分隔线组件不会出现在第一行之前和最后一行之后*/
    _renderSeparator = () => {
        return (
            <View style={styles.separator}/>
        )
    };

    render(){
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)}}}
                    heading={'选择群聊'}
                />
                <FlatList
                    data={this.state.GroupsData}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    ListHeaderComponent={this._renderHeader}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._renderSeparator}
                />
            </View>
        )
    }

    /*渲染头像*/
    _renderAvator = (HeadImagePath, HeadImageUrl, group) => {
        if (HeadImagePath != null && HeadImagePath != '') {
            return <Image style={styles.itemImage} source={{uri: HeadImagePath}}/>
        }
        if (HeadImageUrl != null && HeadImageUrl != '') {
            return <Image style={styles.itemImage} source={{uri: HeadImageUrl}}/>
        }
        return <Image style={styles.itemImage} source={require('../resource/groupHeader.png')}/>
    };

    /*item点击事件*/
    _itemTouch=(content)=>{
        this.route.push(this.props, {
            key: 'ChatDetail',
            routeId: 'ChatDetail',
            params: {
                client: content.Id,
                type: 'group',
                Nick: content.Name
            }
        });
    };
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    itemTouch:{
    },
    itemView:{
        backgroundColor:'#fff',
        flexDirection:'row',
        paddingVertical:8,
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:15
    },
    itemContent:{
        flexDirection:'row',
        alignItems:'center',
    },
    itemImage:{
        width:40,
        height:40
    },
    itemTextView:{
        marginLeft:15,
        justifyContent:'center',
        height:40
    },
    itemText:{
        color:'#000',
        fontWeight:'normal',
        fontSize:16,
        textAlignVertical:'center',
        includeFontPadding:false,
        maxWidth:width-170,
    },
    separator:{
        marginHorizontal:15,
        height:0,
        borderBottomWidth:1,
        borderBottomColor:'#dedede'
    }
});