/**
 * Created by apple on 2018/2/22.
 */
/*
 * Created by Hsu. on 2017/9/8.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Modal,
    Easing,
    Dimensions,
    Image,
    TouchableOpacity,
    Platform
} from 'react-native';
var ImagePicker = require('react-native-image-picker');
import ImageZoom from 'react-native-image-pan-zoom';
let {width, height} = Dimensions.get('window');
import MyNavigationBar from '../../../Common/NavigationBar/NavigationBar'
import {connect} from 'react-redux';
import ActionSheet from 'react-native-actionsheet'
import {bindActionCreators} from 'redux';

import AppComponent from '../../../../Core/Component/AppComponent'
import UserController from '../../../../TSController/UserController'
let userController = undefined;

let currentObj = undefined;

const options = ['取消','拍照','从手机相册选择','保存图片']
const title = '更改你的头像'

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

class HeadImage extends AppComponent {
    constructor(props) {
        super(props);
        this.handlePress = this.handlePress.bind(this);
        currentObj = this;
        userController = UserController.getSingleInstance();
    }

    componentWillMount(){

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

            let data = Platform.OS === 'ios' ? response.data : response.data;
            userController.modifyHeadImage(data,(success)=>{
                console.log("修改头像已经" + success);
                currentObj.props.onChangeHeader(success);

            })
        }
    }

    useCamera() {
        ImagePicker.launchCamera(cameraOptions, this.imagePikerCallBack);
    }

    useLocal() {
        ImagePicker.launchImageLibrary(cameraOptions, this.imagePikerCallBack);
    }

    headImageSetting(){
        this.ActionSheet.show()
    }

    handlePress(i){
        if(i == 1){
            this.useCamera();
        }else if(i == 2){
            this.useLocal();
        }
    }

    render() {
        let {chatId,type,data} = this.props;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left = {{func:()=>{
                        this.route.pop(this.props)
                    },text:"个人信息"}}
                    right={{func:()=>{this.headImageSetting()},text:'设置'}}
                    heading={"头像"}
                />
                <ImageZoom cropWidth={width}
                           cropHeight={height}
                           imageWidth={width}
                           imageHeight={height}
                           leaveStayTime={150}
                           leaveDistance={20}
                           onClick={()=>this.route.pop(this.props)}
                >
                    <Image style={{width,height,resizeMode: 'contain'}}
                           source={{uri:this.props.data+"?v="+new Date().getTime()}}/>
                </ImageZoom>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={title}
                    options={options}
                    cancelButtonIndex={0}
                    onPress={this.handlePress}
                />
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    download:{
        height:30,
        width:100,
        borderWidth:1,
        borderColor:'#fff',
        position:'absolute',
        bottom:50,
        left:(width-100)/2,
        justifyContent:'center',
        alignItems:'center'
    },
    downloadText:{
        color:'#fff',
        fontSize:14,
    },
})
const mapStateToProps = state => ({
    imageModalStore: state.imageModalStore
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(HeadImage);