/**
 * Created by apple on 2018/2/13.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
} from 'react-native';
import {
    checkDeviceHeight,
    checkDeviceWidth
} from '../../../Core/Helper/UIAdapter';

export default class ImagePlaceHolder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show:true
        }
    }

    render() {
        let _style = this.props.style ? this.props.style : this.styles.avatar;
        return (
            <View>
                <Image source={{uri:this.props.imageUrl}} style={ this.state.show?_style:[styles.hide]}
                       onError={()=>{
                           this.setState({
                               show:false
                           })
                       }}
                />
                <Image source={require('../resource/avator.jpg')} style={this.state.show?[styles.hide]:_style}/>
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
        resizeMode: 'cover',
    }
});