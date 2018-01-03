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
import IMController from '../../../../Logic/Im/imController'
let imController = new IMController();

let {width, height} = Dimensions.get('window');

class ChatMessageVideo extends AppComponent {
    constructor(props){
        super(props)
        this.state = {
            progress:0,
            play:false,
            download:false,
        }
    }

    static defaultProps = {
    };

    static propTypes = {
    };

    playVideo = (Local,Remote,data)=>{
        let currentObj = this;
        RNFS.exists(Local).then((success) => {
            if(!success){
                //todo:先下载视频，获取路径
                let ME = this.props.loginStore;
                let type = data.type;
                let chatType = this.props.type;
                let Sender = data.sender.account;
                let Receiver = data.chatId;
                let otherID ="";
                if(chatType == "group"){
                    otherID = Receiver;
                }else{
                    otherID = Receiver == ME ? Sender : Receiver;
                }

                let format = Remote.slice(Remote.lastIndexOf('.'));
                //let messageId = data.messageId;
                let filePath = `${RNFS.DocumentDirectoryPath}/${ME}/${type}/chat/${chatType}-${otherID}/${new Date().getTime()}${format}`

                imController.manualDownloadResource(data,Remote,filePath,function (result) {
                    currentObj.setState({
                        download:false,
                    });
                    if(result){
                        currentObj.route.push(currentObj.props,{key: 'Player',routeId: 'Player',params:{"path":filePath},sceneConfig:Navigator.SceneConfigs.FloatFromBottomAndroid});
                    }
                },function (percent) {
                    currentObj.setState({
                        progress:Math.ceil(percent * 100),
                        download:true,
                    });
                });
            }
            else{
                this.route.push(this.props,{key: 'Player',routeId: 'Player',params:{"path":Local},sceneConfig:Navigator.SceneConfigs.FloatFromBottomAndroid});
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    downloadProgress = (progress)=>{

    }
    render() {
        let {data, style} = this.props;
        let {localSource,remoteSource} = data.message;
        return(
            <View style={[styles.bubble]}>
                <Thouch onPress={()=>this.playVideo(localSource,remoteSource,data)} disabled={this.state.download}>
                    <Image source={require('../../resource/play.png')} style={{width:70,height:70}}/>
                    {this.state.download ?
                        <View style={styles.progressView}>
                            <Text style={styles.progressText}>{this.state.progress}%</Text>
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