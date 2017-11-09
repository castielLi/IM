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
import netWorking from '../../../../Core/Networking/Network';
import RNFS from 'react-native-fs';
import IM from '../../../../Core/IM'

let im = new IM();

let {width, height} = Dimensions.get('window');

class ChatMessageVideo extends Component {
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
        let network = new netWorking();
        let currentObj = this;
        RNFS.exists(Local).then((success) => {
            if(!success){
                //todo:先下载视频，获取路径
                let ME = this.props.loginStore;
                let type = data.message.type;
                let chatType = this.props.type;
                let {Receiver,Sender} = data.message.Data.Data;
                let otherID = Receiver == ME ? Sender : Receiver;
                let format = Remote.slice(Remote.lastIndexOf('.'));
                let filePath = `${RNFS.DocumentDirectoryPath}/${ME}/${type}/chat/${chatType}-${otherID}/${new Date().getTime()}${format}`
                network.methodDownloadWithProgress(Remote,filePath,function () {

                    // im.updateMessageRemoteUrl(messageId,url)

                    currentObj.setState({
                        download:false,
                    })
                },function (percent) {
                    currentObj.setState({
                        progress:percent,
                        download:true,
                    });
                })
            }
            else{
                this.props.showMediaPlayer(Local)
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    downloadProgress = (progress)=>{

    }
    render() {
        let {data, style} = this.props;
        let {LocalSource,RemoteSource} = data.message.Resource[0];
        return(
            <View style={[styles.bubble]}>
                <TouchableOpacity onPress={()=>{this.playVideo(LocalSource,RemoteSource,data)}} disabled={this.state.download}>
                    <Image source={require('../../resource/play.png')} style={{width:70,height:70}}/>
                    {this.state.download ?
                        <View style={styles.progressView}>
                            <Text style={styles.progressText}>{this.state.progress}%</Text>
                        </View> :null
                    }
                </TouchableOpacity>
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
    loginStore:state.loginStore.accountMessage.accountId,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageVideo);