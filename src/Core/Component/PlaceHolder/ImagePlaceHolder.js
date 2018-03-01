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
        this.state = {
            show:true
        }
        this.newUrl = true;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.imageUrl != this.props.imageUrl || nextState.show != this.state.show){
            return true;
        }else{
            return false;
        }
    }

    componentWillReceiveProps() {
        this.newUrl = true;
    }

    render() {
        let _style = this.props.style ? this.props.style : this.styles.avatar;
        // alert(this.props.imageUrl + "?v=" + new Date().getTime()+this.state.show)
        let _default = require('./resource/avator.jpg');
        return (
            <View>
                {/*<Image source={{uri:  Platform.OS==='ios'?this.props.imageUrl:this.props.imageUrl + "?v=" + new Date().getTime()}} style={ this.state.show?_style:[styles.hide]}*/}
                       {/*onError={()=>{*/}
                           {/*this.setState({*/}
                               {/*show:false*/}
                           {/*})*/}
                       {/*}}*/}
                {/*/>*/}
                {/*<Image source={require('./resource/avator.jpg')} style={this.state.show?[styles.hide]:_style}/>*/}

                <Image source={(this.state.show || this.newUrl) ? {uri:this.props.imageUrl} : _default}
                       style={_style}
                       onError={()=>{
                           this.setState({
                               show:false
                           });
                           this.newUrl = false;
                       }}
                />
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