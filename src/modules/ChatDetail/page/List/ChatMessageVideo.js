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

    playVideo = (Local,Remote)=>{
        let network = new netWorking();
        let ME = this.props.loginStore;
        let filePath = `${RNFS.DocumentDirectoryPath}/${ME}/${'video'}/chat/${'类型'}-${'对方id'}/${new Date().getTime()}${'格式'}`
        if(!Local && Local === ' '){
            //todo:先下载视频，获取路径
                network.methodDownloadWithProgress(Remote,filePath,function () {
                this.setState({
                    download:false,
                })
            },function (percent) {
                this.setState({
                    progress:percent,
                    download:true,
                });
            })
        }
        else{
            this.props.showMediaPlayer(Local)
        }

        // let progress = 0;
        // let timer = setInterval(()=>{
        //     progress++;
        //     this.setState({
        //         progress,
        //         download:true,
        //     });
        //     if(progress >= 100){
        //         clearInterval(timer)
        //         this.setState({
        //             download:false,
        //         })
        //     }
        // },100)
    }

    downloadProgress = (progress)=>{

    }
    render() {
        let {data, style} = this.props;
        let {LocalSource,RemoteSource} = data.message.Resource[0];
        return(
            <View style={[styles.bubble]}>
                <TouchableOpacity onPress={()=>{this.playVideo(LocalSource,RemoteSource)}} disabled={this.state.download}>
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