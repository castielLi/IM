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
import Video from 'react-native-video';

let {width, height} = Dimensions.get('window');

class Player extends Component {
    constructor(props){
        super(props)
        this.state = {
            isShow : false,
            uri: ''
        }
    }

    static defaultProps = {
    };

    static propTypes = {

    };
    componentWillReceiveProps(newProps){
        this.setState({
            uri : newProps.uri,
            isShow : newProps.isShow,
        });
    }

    render() {
        if(this.state.isShow){
            return(
                <View style={styles.container}>
                    <TouchableOpacity style={{width:40,height:40,backgroundColor:'red'}} onPress={()=>{this.props.hideMediaPlayer()}}/>
                    <Video
                        ref={(ref) => {
                            this.video = ref
                        }}
                        //来自本地的MP4视频
                        source={{uri:this.state.uri}}
                        //1.0表示默认速率
                        rate={1.0}
                        //图片等比例缩放
                        resizeMode='contain'
                        //是否重复播放
                        repeat={false}
                        //默认音量
                        volume={1.0}
                        //是否暂停
                        paused={false}
                        // 当app转到后台运行的时候，播放是否暂停
                        playInBackground={false}
                        // onLoadStart={this.loadStart} // 当视频开始加载时的回调函数
                        // onLoad={this.setDuration}    // 当视频加载完毕时的回调函数
                        // onEnd={this.onEnd}           // 当视频播放完毕后的回调函数
                        // onError={this.videoError}    // 当视频不能加载，或出错后的回调函数
                        // onProgress={this.setTime}    //  进度控制，每250ms调用一次，以获取视频播放的进度
                        style={styles.player}
                    />
                </View>
            )
        }else{
            return null;
        }
    }
}



const styles = StyleSheet.create({
    container:{
      flex:1
    },
    player:{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    }
});

const mapStateToProps = state => ({
    mediaPlayerStore: state.mediaPlayerStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);