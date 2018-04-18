/**
 * Created by Hsu. on 2018/3/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    SectionList
} from 'react-native';
import AppComponent from '../../../../Core/Component/AppComponent';
import MyNavigationBar from '../../../Common/NavigationBar/NavigationBar';
import Icon from 'react-native-vector-icons/FontAwesome';
let currentObj;
let {width, height} = Dimensions.get('window');

let originData = [
    {
        'key':'1',
        'data': [{
            'name': "男",
        },{
            'name': "女",
        }]
    }
];
export default class RadioCollection extends AppComponent {
    constructor(props){
        super(props);
        this._checkIcon = this._checkIcon.bind(this);
        this.state = {
            gender:props.gender
        };
        this.cache = props.gender;
        this.setGender = this.setGender.bind(this);
        this.userController = this.appManagement.getUserLogicInstance();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
    }


    _onTouchOption=(value)=>{
        let {onPress} = this.props;
        onPress && onPress(value);
    };

    _toDoSome = (name)=>{
        switch (name){
            case '女':
                this.setState({
                    gender:2
                });
                break;
            case '男':
                this.setState({
                    gender:1
                });
                break;
            default:
                break;
        }
    };

    setGender = ()=>{
        if(this.state.gender != this.cache){
            this.userController.modifyGender(this.state.gender);
            this.props.onChangeGender(this.state.gender);
        }
        this.route.pop(this.props)
    };

    _renderSection = ()=>{
        return <View style={styles.sectionHead}/>
    };

    _checkIcon = (name) =>{
        if((this.state.gender == 1 && name == "男") || (this.state.gender == 2 && name == "女")){
            return <View style={styles.itemRightBox}>
                <Icon name="check" size={35} color="#fff" style={styles.arrow}/>
            </View>
        }else{
            return null;
        }
    }


    _renderItem = (info)=>{
        return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this._toDoSome.bind(this,info.item.name)}>
            <View style={styles.itemBox}>
                <View  style={styles.itemLeftBox} >
                    <Text style={styles.itemText}>{info.item.name}</Text>
                </View>
                {
                    this._checkIcon(info.item.name)
                }

            </View>
        </TouchableHighlight>
    };

    _renderSeparator = () =>{
        return (
            <View style={styles.ItemSeparatorBox}>
                <View style={styles.ItemSeparator}/>
            </View>
        )
    };


    render(){
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left = {{func:()=>{this.route.pop(this.props)}}}
                    heading={'设置性别'}
                    right={{func:()=>{this.setGender()},text:'完成'}}
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
    container:{
        backgroundColor:'#ebebeb',
        flex:1,
    },
    SectionListBox:{
        backgroundColor:'#fff',
    },
    sectionHead:{
        height:20,
        backgroundColor:'#ebebeb',
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
    arrow:{
        fontSize:20,
        color:'#aaa',
        marginLeft:15
    },

});