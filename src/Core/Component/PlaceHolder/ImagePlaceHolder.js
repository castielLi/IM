/**
 * Created by apple on 2018/2/13.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    Platform,
} from 'react-native';
import {
    checkDeviceHeight,
    checkDeviceWidth
} from '../../Helper/UIAdapter';
export default class ImagePlaceHolder extends Component {

    constructor(props) {
        super(props);
        this.state={
            newImage:false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.imageUrl !== nextProps.imageUrl && typeof nextProps.imageUrl === 'string') {
            // let _style = this.props.style ? this.props.style : styles.avatar;
            // this.defaultImage.setNativeProps({
            //     style:styles.hide
            // })
            // this.image.setNativeProps({
            //     style:_style
            // })
            this.setState({
                newImage:true
            })
        }
    }

    shouldComponentUpdate(nextProps,nextState){
        if (this.props.imageUrl != nextProps.imageUrl) {
            return true;
        }else{
            return false;
        }
    }

    render() {
        let _style = this.props.style ? this.props.style : styles.avatar;
        let url = (typeof this.props.imageUrl === 'string') ? {uri:this.props.imageUrl } : this.props.imageUrl;

        if(this.state.newImage){
            return (
                <View style={[_style]}>
                    <Image source={url} style={[_style,{display:"flex"}]}
                           onError={()=>{
                               this.defaultImage.setNativeProps({
                                   style:_style
                               })
                               this.image.setNativeProps({
                                   style:styles.hide
                               })
                               console.log("加载新下载资源失败！！！！")
                           }}
                           onLoad={()=>{
                               this.defaultImage.setNativeProps({
                                   style:styles.hide
                               })
                               console.log("加载新下载资源成功！！！！")
                           }}
                    />
                    <Image
                        ref={ defaultImage => this.defaultImage = defaultImage}
                        source={require('./resource/avator.jpg')} style={styles.defaultAvator}/>
                </View>
            );
        }else{
            return (
                <View>
                    <Image ref={ image => this.image = image}
                           source={url} style={[_style]}
                           onError={()=>{
                               this.defaultImage.setNativeProps({
                                   style:_style
                               })
                               this.image.setNativeProps({
                                   style:styles.hide
                               })
                               console.log("加载资源失败！！！！")
                           }}
                           onLoad={()=>{
                               // this.defaultImage.setNativeProps({
                               //     style:styles.hide
                               // })
                               // this.image.setNativeProps({
                               //     style:_style
                               // })
                               console.log("加载资源成功！！！！")
                           }}
                    />
                    <Image
                        ref={ defaultImage => this.defaultImage = defaultImage}
                        source={require('./resource/avator.jpg')} style={styles.defaultAvator}/>

                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    hide:{
        display:"none"
    },
    avatar: {
        height: checkDeviceHeight(100),
        width: checkDeviceHeight(100),
        borderRadius: checkDeviceHeight(50),
    },
    defaultAvator:{
        height: 0,
        width: 0,
    }
});