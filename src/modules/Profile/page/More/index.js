/**
 * Created by Hsu. on 2018/3/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    SectionList,
    TouchableHighlight,
} from 'react-native';
import AppComponent from '../../../../Core/Component/AppComponent';
import MyNavigationBar from '../../../Common/NavigationBar/NavigationBar';
import RadioCollection from './RadioCollection';
let currentObj;
let originData = [
    {
        'key':'1',
        'data': [{
            'name': "性別",
        },{
            'name': "地区",
        }, {
            'name': "个性签名",
        }]
    }
];

export default class MoreSetting extends AppComponent {
    constructor(props){
        super(props);
        this.userController = this.appManagement.getUserLogicInstance();
        this.state = {
            gender:props.account.Gender,
            signature:props.signature,
            address:props.address
        }
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
    }

    _renderSection = ()=>{
        return <View style={styles.sectionHead}/>
    };

    _renderItem = (info)=>{
        return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this._toDoSome.bind(this,info.item.name)}>
            <View style={styles.itemBox}>
                <View  style={styles.itemLeftBox} >
                    <Text style={styles.itemText}>{info.item.name}</Text>
                </View>
                {this._fillingValue(info)}
            </View>
        </TouchableHighlight>
    };

    _renderSeparator = () =>{
        return(
            <View style={styles.ItemSeparatorBox}>
                <View style={styles.ItemSeparator}/>
            </View>
        )


    };

    _genderType = ()=>{
        switch (this.state.gender){
            case 1:
                return '男';
            case 2:
                return '女';
            default:
                return '未设置';
        }
    };

    _fillingValue=(info)=>{
        switch (info.item.name){
            case '性別':
                return (
                    <View style={styles.itemRightBox}>
                        <Text style={styles.itemContent}>{this._genderType()}</Text>
                    </View>
                );
            case '地区':
                return(
                    <View style={styles.itemRightBox}>
                        <Text style={styles.itemContent}>中国 重庆</Text>
                    </View>
                );
            case '个性签名':
                return(
                    <View style={styles.itemRightBox}>
                        <Text style={styles.itemContent}>{this.state.signature ? this.state.signature : '未填写'}</Text>
                    </View>
                );
        }
    };

    _toDoSome = (name)=>{
        switch (name){
            case '性別':
                this.route.push(this.props,{key: 'Profile',routeId: 'GenderChange',params:{"gender":this.state.gender,onPress:this.onChangGender}});
                break;
            case '地区':
                // this.route.push(this.props,{key: 'Profile',routeId: 'NickName',params:{}});
                break;
            case '个性签名':
                this.route.push(this.props,{key: 'Profile',routeId: 'Signature',params:{Signature:this.state.signature,onPress:this.onChangSignature}});
                break;
            default:
                break;
        }
    };

    onChangGender=(gender)=>{
        this.setState({
            gender
        })
    };
    onChangSignature=(signature)=>{
        this.setState({
            signature
        })
    };
    onChangAddress=(address)=>{
        this.setState({
            address
        })
    };

    render() {
        return(
            <View style={styles.container}>
                <MyNavigationBar
                    left = {{func:()=>{this.route.pop(this.props)}}}
                    heading={'更多信息'}
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
        backgroundColor:'#eee',
        flex:1,
    },
    SectionListBox:{
        backgroundColor:'#fff',
    },
    sectionHead:{
        height:20,
        backgroundColor:'#eee',
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
    }

});