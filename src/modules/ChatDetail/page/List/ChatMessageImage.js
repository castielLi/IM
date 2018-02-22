/**
 * Created by Hsu. on 2017/9/8.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action'
import AppComponent from '../../../../Core/Component/AppComponent'
import Thouch from '../../../Common/Thouch/index'
import {
    Navigator,
} from 'react-native-deprecated-custom-components';

let {width, height} = Dimensions.get('window');

class ChatMessageImage extends AppComponent {
    constructor(props){
        super(props)
        this.state = {
            Size: {
                width: 0,
                height: 0,
            }
        }
    }
    getImageSize = (uri)=>{
        Image.getSize(uri, (w, h) => {
            // this.Size = {width,height}
            this.setState({
                Size : {width:w,height:h}
            })
            //alert(this.Size.width+"22")
        })
    }
    //重新构建路径
    rebuildPath(LocalSource){
        if(LocalSource.indexOf('file:') == -1){
            LocalSource = 'file://'+LocalSource;
        }
        return LocalSource;
    }

    defaultPicture(data){
        let {LocalSource,RemoteSource} = data.message;
        // if(LocalSource.indexOf('file:') == -1){
        //     LocalSource = 'file://'+LocalSource;
        // }
        let {status} = data;

        if(status == 4){
            return(
                <Image
                    resizeMode={Image.resizeMode.cover}
                    source={require('../../resource/avator.jpg')}
                    style={[styles.imageStyle]}
                />
            )
        }
        return (
            <Image
                resizeMode={Image.resizeMode.cover}
                source={{uri:LocalSource}}
                style={[styles.imageStyle]}
            />
        )
    }
    goToGallery = (chatId,type,data)=>{
        this.route.push(this.props,{key: 'Gallery',routeId: 'Gallery',params:{"chatId":chatId,"type":type,"data":data,},sceneConfig:Navigator.SceneConfigs.FloatFromBottomAndroid});
    }
    render() {
        let {data, style} = this.props;
        data.message.LocalSource = this.rebuildPath(data.message.LocalSource);
        return(
            <View style={[style,styles.bubble]}>
                {/*<Thouch onPress={()=>this.goToGallery(this.props.chatId,this.props.type,data)}>*/}
                    {this.defaultPicture(data)}
                {/*</Thouch>*/}
            </View>
        )
    }
}



const styles = StyleSheet.create({
    bubble:{
        backgroundColor:'transparent'
    },
    imageStyle:{
        height:100,
        width:100,
    }
});

const mapStateToProps = state => ({
    imageModalStore: state.imageModalStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageImage);