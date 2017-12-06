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
import ContainerComponent from '../../../../Core/Component/ContainerComponent'
import Thouch from '../../../Common/Thouch/index'
import {
    Navigator,
} from 'react-native-deprecated-custom-components';

let {width, height} = Dimensions.get('window');

class ChatMessageImage extends ContainerComponent {
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

    goToGallery = (Path,Remote,MSGID,Sender)=>{
        this.route.push(this.props,{key: 'Gallery',routeId: 'Gallery',params:{"Path":Path,"Remote":Remote,"MSGID":MSGID,"Sender":Sender},sceneConfig:Navigator.SceneConfigs.FloatFromBottomAndroid});
    }
    render() {
        let {data, style} = this.props;
        let {localSource,remoteSource} = data;

        return(
            <View style={[style,styles.bubble]}>
                <Thouch onPress={()=>alert('查看大图')}>
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