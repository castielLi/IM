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
    Modal
} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';

let {width, height} = Dimensions.get('window');

class Player extends Component {
    constructor(props){
        super(props)
        this.state = {
            isShow : false,
            url: ''
        }
    }

    static defaultProps = {
    };

    static propTypes = {

    };
    componentWillReceiveProps(newProps){
        let {url,isShow} = newProps.mediaPlayerStore;
        this.setState({
            url,
            isShow,
        });
    }

    // pause(){
    //     this.setState({
    //         playing: !this.state.playing,
    //     })
    // }
    // defaultControlsView = () => {
    //     let playButton = (<View style={{backgroundColor:'rgba(0,0,0,0.5)'}}><Icon.Button opacity={1} style={[styles.playButton,styles.button]} size={10} onPress={this.pause.bind(this)} name="play" color='#fff' /></View>);
    //     let pauseButton = (<View style={{backgroundColor:'rgba(0,0,0,0.5)'}}><Icon.Button opacity={1} style={[styles.playButton,styles.button]} size={10} onPress={this.pause.bind(this)} name="pause" color='#fff' /></View>);
    //     let playOrPause = this.state.playing ? pauseButton : playButton;
    //     return (
    //         <View>
    //             <View style={[styles.buttonBox,{backgroundColor:'rgba(0,0,0,0)'},this.state.customButtonStyle]}><Bars size={10} color={this.state.loadingColor}  /></View>
    //             <View style={[styles.bottomBox,this.state.bottomBoxStyle]}>
    //                 <View hidden={true} style={styles.playButtonBox}>
    //                     {playOrPause}
    //                 </View>
    //                 <Text style={styles.time}>{this.state.video.time}</Text>
    //                 <Slider maximumValue={0.97} thumbTouchSize={this.state.thumbTouchSize} thumbTintColor='#fff' thumbStyle={styles.thumbStyle} style={[styles.sliderStyle,this.state.customTrackStyle]} trackStyle={[styles.trackStyle,this.state.customTrackStyle]} value={this.state.progress} onValueChange={this.seek.bind(this)} />
    //                 <Text style={styles.time}>{this.state.video.duration}</Text>
    //                 <View style={{backgroundColor:'rgba(0,0,0,0.5)'}}><Icon.Button opacity={1} style={styles.playButton} size={10} onPress={this.fullscreen.bind(this)} name="expand" color='#fff' /></View>
    //             </View>
    //
    //         </View>
    //     );
    // }
    render() {
        if(this.state.isShow){
            return(
                <Modal style={styles.container} animationType={'fade'}>
                    <TouchableOpacity style={{width:40,height:40,backgroundColor:'red',position:'absolute',top:0,left:0}} onPress={()=>{this.props.hideMediaPlayer()}}/>
                    <Video
                        ref={(ref) => {
                            this.video = ref
                        }}
                        //来自本地的MP4视频
                        source={{uri:this.state.url}}
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
                    {/*{this.defaultControlsView()}*/}
                </Modal>
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
        width:width,
        height:height
    },


    // vlcplayer:{
    //     width:playerDefaultWidth,
    //     height:playerDefaultHeight,
    //     backgroundColor:'black',
    //     //  transform:[{rotate:'90deg'}]
    // },
    // buttonBox:{
    //     position:'absolute',
    //     top:-(playerDefaultHeight),
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     width:playerDefaultWidth,
    //     height:playerDefaultHeight
    // },
    // playButton:{
    //     width:20,
    //     height:20,
    //     backgroundColor:'rgba(0,0,0,1)'
    // },
    // playButtonBox:{
    //     width:20,
    //     height:20
    // },
    // bottomBox:{
    //     width:playerDefaultWidth,
    //     height:20,
    //     left:0,
    //     top:-20,
    //     position:'absolute',
    //     alignItems: 'flex-start',
    //     justifyContent: 'flex-start',
    //     flexDirection: 'row',
    // },
    // sliderStyle:{
    //     height:20,
    //     width:playerDefaultWidth-120,
    //     backgroundColor:'rgba(0,0,0,0.5)'
    // },
    // trackStyle:{
    //     width:playerDefaultWidth-120,
    //     height:2
    // },
    // thumbStyle:{
    //     backgroundColor:'#fff',
    //     width:10,
    //     height:10
    // },
    // time:{
    //     color:'#fff',
    //     width:40,
    //     textAlign: 'center',
    //     justifyContent: 'center',
    //     height:20,
    //     paddingTop:5,
    //     fontSize:8,
    //     backgroundColor:'rgba(0,0,0,0.5)'
    // },
    // button:{
    //     backgroundColor:'rgba(0,0,0,1)'
    // }
});

const mapStateToProps = state => ({
    mediaPlayerStore: state.mediaPlayerStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);