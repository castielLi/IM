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
    }

    render() {
        let _style = this.props.style ? this.props.style : styles.avatar;
        let url = (typeof this.props.imageUrl === 'string') ? {uri:this.props.imageUrl } : this.props.imageUrl;
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
                       }}
                       onLoad={()=>{
                           // this.defaultImage.setNativeProps({
                           //     style:styles.hide
                           // })
                           // this.image.setNativeProps({
                           //     style:_style
                           // })
                       }}
                />
                <Image
                    ref={ defaultImage => this.defaultImage = defaultImage}
                    source={require('./resource/avator.jpg')} style={styles.defaultAvator}/>

            </View>
        );
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