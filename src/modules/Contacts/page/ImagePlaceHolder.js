/**
 * Created by apple on 2018/2/13.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
} from 'react-native';


export default class ImagePlaceHolder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show:true
        }
    }

    render() {
        return (
            <View>
                <Image source={{uri:this.props.imageUrl}} style={ this.state.show?[styles.pic]:[styles.hide]}
                   onError={()=>{
                       this.setState({
                           show:false
                       })
                   }}
                />
                <Image source={require('../resource/avator.jpg')} style={this.state.show?[styles.hide]:styles.pic}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    hide:{
        display:"none"
    },
    pic:{
        width:40,
        height:40,
        resizeMode:'stretch'
    }
});