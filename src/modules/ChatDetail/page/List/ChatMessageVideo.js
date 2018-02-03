/**
 * Created by Hsu. on 2017/11/6.
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
import * as Actions from '../../reducer/action';
import RNFS from 'react-native-fs';

import AppComponent from '../../../../Core/Component/AppComponent'
import Thouch from '../../../Common/Thouch/index'
import {
    Navigator,
} from 'react-native-deprecated-custom-components';
import IMControllerLogic from '../../../../TSController/IMLogic/IMControllerLogic';
let imControllerLogic = undefined;

let {width, height} = Dimensions.get('window');

class ChatMessageVideo extends AppComponent {
    constructor(props){
        super(props)
        this.state = {
            progress:props.data.sourceRate,
            play:false,
            download:false,
        }

        imControllerLogic = IMControllerLogic.getSingleInstance();
    }
    componentWillReceiveProps(nextProps){
        let sourceRate = nextProps.data.sourceRate;
        let status = nextProps.data.status;
        // let download = sourceRate && sourceRate != 1 ? true : false;
        let download = status && status == 4 ? true : false;
        this.setState({
            download,
            progress:sourceRate
        })
    }

    playVideo = (Local,Remote,data)=>{
        let currentObj = this;
        let {messageId,message} = data;
        let group = this.props.type == 'group' ? true : false;
        RNFS.exists(Local).then((success) => {
            if(!success){
                imControllerLogic.manualDownloadResource(this.props.chatId,messageId,group,message);
            }
            else{
                this.route.push(this.props,{key: 'Player',routeId: 'Player',params:{"path":Local},sceneConfig:Navigator.SceneConfigs.FloatFromBottomAndroid});
            }
        }).catch((err) => {
            console.log(err.message);
        });
    };
    render() {
        let {data, style} = this.props;
        let {LocalSource,RemoteSource} = data.message;
        return(
            <View style={[styles.bubble]}>
                <Thouch onPress={()=>this.playVideo(LocalSource,RemoteSource,data)} disabled={this.state.download}>
                    <Image source={require('../../resource/play.png')} style={{width:70,height:70}}/>
                    {this.state.download ?
                        <View style={styles.progressView}>
                            <Text style={styles.progressText}>{Math.ceil(this.state.progress)}%</Text>
                        </View> :null
                    }
                </Thouch>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bubble:{
        backgroundColor:'transparent'
    },
    progressView:{
        position:'absolute',
        width:70,
        height:70,
        backgroundColor:'rgba(0,0,0,.5)',
        alignItems:'center',
        justifyContent:'center'
    },
    progressText:{
        color:'#fff'
    }

});

const mapStateToProps = state => ({
    mediaPlayerStore: state.mediaPlayerStore,
    loginStore:state.loginStore.accountMessage.Account,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions,dispatch),

});

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageVideo);