/**
 * Created by apple on 2018/3/16.
 */
/**
 * Created by Hsu. on 2018/3/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Modal,
    View,
    TouchableHighlight,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    SectionList,
    Platform
} from 'react-native';
import AppComponent from '../../../../Core/Component/AppComponent';
import MyNavigationBar from '../../../Common/NavigationBar/NavigationBar';
import Icon from 'react-native-vector-icons/FontAwesome';
var ImagePicker = require('react-native-image-picker');
let currentObj;
let {width, height} = Dimensions.get('window');

let originData = [
    {
        'key':'1',
        'data': [{
            'name': "从手机相册选择",
        },{
            'name': "拍一张",
        },{
            'name':'清除背景图片'
        }]
    }
];

var cameraOptions = {
    allowsEditing:true,//允许编辑image
    quality:CameraConfig.PHOTO_QUALITY,
    maxWidth:CameraConfig.PHOTO_MAX_WIDTH,
    maxHeight:CameraConfig.PHOTO_MAX_HEIGHT,
    mediaType: 'photo',
    storageOptions: {
        skipBackup: true,
        path: 'images'//存放位置
    }
}

export default class GroupBackgroundImage extends AppComponent {
    constructor(props){
        super(props);
        this.useCamera = this.useCamera.bind(this);
        this.useLocal = this.useLocal.bind(this);
        this._toDoSome = this._toDoSome.bind(this);
        this.imController = this.appManagement.getIMLogicInstance();
        currentObj = this;
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.imController = undefined;
    }

    imagePikerCallBack(response) {
        if (response.didCancel) {//如果用户取消上传
            console.log('UserGroup cancelled image picker');
        }
        else if (response.error) {//如果有错
            console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {//如果点击了自定义按钮
            console.log('UserGroup tapped custom button: ', response.customButton);
        }
        else {

            let responsePath = Platform.OS === 'ios' ? response.uri : 'file://' + response.path;
            currentObj.imController.setConversationBackgroundImage(responsePath);
        }
    }

    useCamera() {
        ImagePicker.launchCamera(cameraOptions, this.imagePikerCallBack);
    }

    useLocal() {
        ImagePicker.launchImageLibrary(cameraOptions, this.imagePikerCallBack);
    }

    _toDoSome = (name)=>{
        switch (name){
            case '拍一张':
                this.useCamera();
                break;
            case '从手机相册选择':
                this.useLocal();
                break;
            case '清除背景图片':
                this.imController.setConversationBackgroundImage("");
                break;
            default:
                break;
        }
    };



    _renderSection = ()=>{
        return <View style={styles.sectionHead}/>
    };


    _renderItem = (info)=>{
        return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this._toDoSome.bind(this,info.item.name)}>
            <View style={styles.itemBox}>
                <View  style={styles.itemLeftBox} >
                    <Text style={styles.itemText}>{info.item.name}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Icon name="angle-right" size={35} color="#aaa" />
                </View>
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
                    heading={'聊天背景'}
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