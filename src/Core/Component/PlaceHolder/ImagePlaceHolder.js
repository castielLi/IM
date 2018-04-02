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
            show:false
        };
        this.success = true;
    }

    shouldComponentUpdate(nextProps, nextState) {
        // alert(JSON.stringify(nextProps)+JSON.stringify(nextState))
        // alert(nextProps.imageUrl+'****'+this.props.imageUrl)
        // if(nextProps.imageUrl != this.props.imageUrl){
            //alert(nextProps.imageUrl+'****'+this.props.imageUrl)
            // this.newUrl = true;
        // }
        if(nextProps.imageUrl != this.props.imageUrl || nextState.show != this.state.show){
            return true;
        }else{
            return false;
        }
    }

    // componentWillReceiveProps() {
    //      this.newUrl = true;
    // }

    render() {
        let _style = this.props.style ? this.props.style : styles.avatar;
        // alert(this.props.imageUrl + "?v=" + new Date().getTime()+this.state.show)
        // let _default = require('./resource/avator.jpg');
        let url = (typeof this.props.imageUrl === 'string') ? {uri:this.props.imageUrl } : this.props.imageUrl;
        return (
            <View>
                {this.state.show ? null : <Image source={require('./resource/avator.jpg')} style={[_style,{position:'absolute'}]}/>}
                <Image source={url} style={_style}
                       onError={()=>{
                           {/*this.success = false;*/}
                           if(this.state.show){
                               this.setState({
                                   show:false
                               })
                           }
                       }}
                       onLoad={()=>{
                           {/*this.success = true;*/}
                           if(!this.state.show){
                               this.setState({
                                   show:true
                               })
                           }
                       }}
                />
                {/*<Image source={(this.state.show || this.newUrl) ? {uri:this.props.imageUrl} : _default}*/}
                       {/*style={_style}*/}
                       {/*onError={()=>{*/}
                           {/*this.newUrl = false;*/}
                           {/*this.setState({*/}
                               {/*show:false*/}
                           {/*});*/}
                       {/*}}*/}
                {/*/>*/}
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
    }
});