/*
 * Created by Hsu. on 2017/9/8.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Modal,
    Easing,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';

import ImageZoom from 'react-native-image-pan-zoom';
let {width, height} = Dimensions.get('window');

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action'

import AppComponent from '../../../../Core/Component/AppComponent'

class Gallery extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
            progress:0,
            download:false,
            path:props.data.message.LocalSource,
            thumbnail:props.data.message.LocalSource.indexOf('/thumbnail') !== -1 ? true : false
            //thumbnail:props.Remote.indexOf('#imageView2') !== -1 ? true : false
        }
        this.imControllerLogic = this.appManagement.getIMLogicInstance();
    }

    componentWillMount(){

    }

    componentWillUnmount(){
        this.imControllerLogic = undefined;
    }

    downOriginalImage = (chatId,type,data)=>{
        let currentObj = this;
        let group = type == 'group' ? true : false;
        let {messageId,message} = data;
        // let pathA = Path.match(/([\s\S]*)\/thumbnail/)[1];
        // let pathB = Path.slice(Path.lastIndexOf('/'));
        // let path = pathA+pathB;

        this.imControllerLogic.manualDownloadResource(chatId,messageId,group,message)
    }
    render() {
        let {chatId,type,data} = this.props;
        return (
            <View style={styles.container}>
                <ImageZoom cropWidth={width}
                           cropHeight={height}
                           imageWidth={width}
                           imageHeight={height}
                           leaveStayTime={150}
                           leaveDistance={20}
                           onClick={()=>this.route.pop(this.props)}
                >
                    <Image style={{width,height,resizeMode: 'contain'}}
                           source={{uri:this.state.path}}/>
                </ImageZoom>
                {this.state.thumbnail ?
                    <TouchableOpacity style={styles.download} onPress={()=>this.downOriginalImage(chatId,type,data)}>
                        {this.state.download ?
                            <Text style={styles.downloadText}>{this.state.progress}</Text> :
                            <Text style={styles.downloadText}>下载原图</Text>}
                    </TouchableOpacity> : null
                }
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    download:{
        height:30,
        width:100,
        borderWidth:1,
        borderColor:'#fff',
        position:'absolute',
        bottom:50,
        left:(width-100)/2,
        justifyContent:'center',
        alignItems:'center'
    },
    downloadText:{
        color:'#fff',
        fontSize:14,
    },
})
const mapStateToProps = state => ({
    imageModalStore: state.imageModalStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions,dispatch),

});

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);