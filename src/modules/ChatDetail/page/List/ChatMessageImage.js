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

        // this.Size = {
        //     width : 0,
        //     height: 0,
        // }

        this.state = {
            Size: {
                width: 0,
                height: 0,
            }
        }
    }

    static defaultProps = {
    };

    static propTypes = {
    };

    getImageSize = (uri)=>{
        Image.getSize(uri, (w, h) => {
            // this.Size = {width,height}

            this.setState({
                Size : {width:w,height:h}
            })
            //alert(this.Size.width+"22")
        })
    }

    localSourceObj = (Source)=>{
        return {uri:Source}
    }

    goToGallery = (path,url,data)=>{
        this.route.push(this.props,{key: 'Gallery',routeId: 'Gallery',params:{"path":path,"url":url,"message":data},sceneConfig:Navigator.SceneConfigs.FloatFromBottomAndroid});
    }
    render() {
        let {data, style} = this.props;
        let {localSource,remoteSource} = data.message;

        return(
            <View style={[style,styles.bubble]}>
                <Thouch onPress={()=>this.goToGallery(localSource,remoteSource,data)}>
                    <Image
                        resizeMode={Image.resizeMode.cover}
                        source={this.localSourceObj(localSource)}
                        style={[styles.imageStyle]}
                    />
                </Thouch>
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