/**
 * Created by Hsu. on 2018/2/28.
 */
import React, {Component} from 'react';
import {StyleSheet,FlatList,TouchableHighlight,View,Text,Dimensions} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';

let {width,height} = Dimensions.get('window');
export default class SelectGroup extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
            GroupsData: [],
        };
        this.userController = this.appManagement.getUserLogicInstance();
        this.imLogicController = this.appManagement.getIMLogicInstance();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.userController = undefined;
        this.imLogicController = undefined;
    }

    componentDidMount() {
        this.userController.getGroupContactList(false,(contacts)=>{
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
        return (
            <TouchableHighlight style={styles.itemTouch} underlayColor={'#333'} onPress={()=>this._itemTouch(content)}>
                <View style={styles.itemView}>
                    <View style={styles.itemContent}>
                        <ImagePlaceHolder style = {styles.itemImage} imageUrl = {require('../resource/groupAvator.png')}/>
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

    /*item点击事件*/
    _itemTouch=(content)=>{
        this.route.pushifExistRoute(this.props, {
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
        height:40,
        borderRadius:20
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