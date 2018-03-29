import React, { Component } from 'react';
import {  
  StyleSheet,  
  Text,  
  TextInput,  
  View,
  Dimensions,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  PixelRatio,
  Platform,
    CameraRoll
} from 'react-native';  
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import {
    connect
} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action';
import CameraConfig from './cameraConfig';
import IMController from '../../../../TSController/IMLogic/IMControllerLogic'
import AppComponent from '../../../../Core/Component/AppComponent';
const pxToPt = px=>PixelRatio.roundToNearestPixel(px);
var ImagePicker = require('react-native-image-picker');
var {width} = Dimensions.get('window');

let imController = undefined;

var options = {
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
let videoOptions = {
    mediaType: 'video',
    videoQuality: Platform.OS != 'ios' ? CameraConfig.VEDIO_QUALITY_HIGH : CameraConfig.VEDIO_QUALITY_LOW,
    durationLimit:CameraConfig.VEDIO_MAX_TIME,
    storageOptions: {
        skipBackup: true,
        path: 'video'//存放位置
    }
}

class MoreUseBox extends AppComponent {
    constructor(props) {
        super(props);
        this.useCamera = this.useCamera.bind(this);
        this.useLocal = this.useLocal.bind(this);
        this.useCameraVideo = this.useCameraVideo.bind(this);
        this.useLocalVideo = this.useLocalVideo.bind(this);
        this.imagePikerCallBack = this.imagePikerCallBack.bind(this);

        imController = IMController.getSingleInstance();
        this.useCamera = this.useCamera.bind(this);
        this.useLocal = this.useLocal.bind(this);
        this.useCameraVideo = this.useCameraVideo.bind(this);
        this.useLocalVideo = this.useLocalVideo.bind(this);
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
            //console.log(response.uri)// 选择本地content://media/external/images/media/30；拍照file:///storage/emulated/0/Pictures/image-ad930ba1-fc6f-44c5-afb4-dda910fccc8c.jpg
            //console.log(response.path)  //response.path限android,可得到图片的绝对路径
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };

            //初始化消息
            let responsePath = Platform.OS === 'ios' ? response.uri : 'file://' + response.path;

            imController.SendFile(1, responsePath);
            this.appManagement.setAndroidChoosePhotoOrVideo(false);
        }
    }


    useCamera() {
        this.appManagement.setAndroidChoosePhotoOrVideo(true);
        ImagePicker.launchCamera(options, this.imagePikerCallBack);
    }

    useLocal() {
        this.appManagement.setAndroidChoosePhotoOrVideo(true);
        ImagePicker.launchImageLibrary(options, this.imagePikerCallBack);
    }

    useCameraVideo() {
        this.appManagement.setAndroidChoosePhotoOrVideo(true);
        ImagePicker.launchCamera(videoOptions, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('UserGroup cancelled video picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('UserGroup tapped custom button: ', response.customButton);
            }
            else {
                let responsePath = Platform.OS === 'ios' ? response.uri : 'file://' + response.path;

                imController.SendFile(2,responsePath);
                this.appManagement.setAndroidChoosePhotoOrVideo(false);
            }
        });
    }

    useLocalVideo() {
        this.appManagement.setAndroidChoosePhotoOrVideo(true);
        ImagePicker.launchImageLibrary(videoOptions, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('UserGroup cancelled video picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('UserGroup tapped custom button: ', response.customButton);
            }
            else {
                let responsePath = Platform.OS === 'ios' ? response.uri : 'file://' + response.path;

                imController.SendFile(2,responsePath);
                this.appManagement.setAndroidChoosePhotoOrVideo(false);
            }
        });
    }

    render() {
        return (
            <View style={styles.ThouchBarBoxBottomBox}>
                <Swiper style={styles.wrapper} showsButtons={false} activeDotColor={'#434343'} loop={false}>
                    <TouchableWithoutFeedback>
                        <View style={styles.swiperSlide}>
                            <View style={styles.plusItemBox}>
                                <TouchableHighlight style={styles.plusItemImgBox} underlayColor={'#bbb'}
                                                    activeOpacity={0.5} onPress={this.useLocal}>
                                    <Icon name="picture-o" size={30} color="#aaa"/>
                                </TouchableHighlight>
                                <Text style={styles.plusItemTit}>照片</Text>
                            </View>
                            <View style={styles.plusItemBox}>
                                <TouchableHighlight style={styles.plusItemImgBox} underlayColor={'#bbb'}
                                                    activeOpacity={0.5} onPress={this.useLocalVideo}>
                                    <Icon name="picture-o" size={30} color="#aaa"/>
                                </TouchableHighlight>
                                <Text style={styles.plusItemTit}>视频</Text>
                            </View>
                            <View style={styles.plusItemBox}>
                                <TouchableHighlight style={styles.plusItemImgBox} underlayColor={'#bbb'}
                                                    activeOpacity={0.5} onPress={this.useCamera}>
                                    <Icon name="camera" size={30} color="#aaa"/>
                                </TouchableHighlight>
                                <Text style={styles.plusItemTit}>拍照</Text>
                            </View>
                            <View style={styles.plusItemBox}>
                                <TouchableHighlight style={styles.plusItemImgBox} underlayColor={'#bbb'}
                                                    activeOpacity={0.5} onPress={this.useCameraVideo}>
                                    <Icon name="camera" size={30} color="#aaa"/>
                                </TouchableHighlight>
                                <Text style={styles.plusItemTit}>录像</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Swiper>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  ThouchBarBoxBottomBox:{
    height:230,
    borderColor:'#ccc',
    borderTopWidth:1
  },
  wrapper:{
    //flex:1,
  },
  swiperSlide:{
    //flex:1,
    flexWrap:'wrap',
    flexDirection:'row',
  },
  plusItemBox:{
    width:pxToPt(60),
    height:pxToPt(70),
    marginTop:20,
    marginHorizontal:(width-4*pxToPt(60))/8,
    alignItems:'center',
  },
  plusItemImgBox:{
    height:pxToPt(50),
    width:pxToPt(50),
    borderRadius:pxToPt(10),
    borderColor:'#ccc',
    borderWidth:pxToPt(1), 
    justifyContent:'center',
    alignItems:'center'
  },
  img:{
    height:pxToPt(25),
    width:pxToPt(25),
    resizeMode:'stretch',
    margin:10
  },
  plusItemTit:{
    fontSize:12,
    color:'#bbb'
  }
});

const mapStateToProps = state => ({
    thouchBarStore: state.thouchBarStore,
    accountId:state.loginStore.accountMessage.Account
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch),

});

 export default connect(mapStateToProps, mapDispatchToProps)(MoreUseBox);