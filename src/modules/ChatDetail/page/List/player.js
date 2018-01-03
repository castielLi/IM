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
    Modal,
} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from "react-native-slider";
import AppComponent from '../../../../Core/Component/AppComponent'

let {width, height} = Dimensions.get('window');

class Player extends AppComponent {
    constructor(props){
        super(props)
        this.state = {
            // isShow : false,
            // url: '',

            paused:false,
            video:{time:'00:00',duration:'00:00'},
            progress:0,
            duration:0,
        }
    }

    static defaultProps = {
    };

    static propTypes = {

    };

    slidingStart = ()=>{
        this.setState({
            paused:true,
        })
    }
    slidingComplete =()=>{
        this.setState({
            paused:false,
        })
    }
    defaultControlsBox = ()=>{
        let playButton = (<TouchableOpacity onPress={()=>this.pause()}><Icon size={20} name="play" color='#fff' /></TouchableOpacity>);
        let pauseButton = (<TouchableOpacity onPress={()=>this.pause()}><Icon size={20} name="pause" color='#fff' /></TouchableOpacity>);
        let playOrPause = this.state.paused ? playButton : pauseButton;
        return(
            <View style={{width,height,position:'absolute'}}>
                <View style={{width}}>
                    <TouchableOpacity style={{width:30,height:30,marginLeft:20,marginTop:20}} onPress={()=>{this.route.pop(this.props);this.setState({paused:false})}}>
                        <Icon size={30} name="close" color='#fff' />
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',position:'absolute',bottom:30,width,alignItems:'center',justifyContent:'center',paddingVertical:10}}>
                    <View hidden={true} style={styles.playButtonBox}>
                         {playOrPause}
                    </View>
                    <Text style={styles.time}>{this.state.video.time}</Text>
                    <Slider
                        style={styles.sliderStyle}
                        value={this.state.progress}
                        maximumTrackTintColor={'#666'}
                        minimumTrackTintColor={'#fff'}
                        // thumbTouchSize={{width:25,height:25}}
                        // thumbTintColor={'#fff'}
                        thumbStyle={{backgroundColor:'#fff',width:20,height:20}}
                        minimumValue={0}
                        maximumValue={this.state.duration}
                        onValueChange={(value)=>this.seek(value)}
                        onSlidingStart={()=>this.slidingStart()}
                        onSlidingComplete={()=>this.slidingComplete()}
                    />
                    <Text style={styles.time}>{this.state.video.duration}</Text>
                    <View hidden={true} style={styles.playButtonBox}/>
                </View>
            </View>
        )
    }


    formatTime = (time)=>{
        //四舍五入取整
        let timer = Math.round(time);
        let points,seconds;
        points = Math.floor(timer/60);
        if(points < 10){
            points = '0'+points;
        }
        seconds = timer%60;
        if(seconds < 10){
            seconds = '0'+seconds;
        }
        return points+':'+seconds;
    };
    pause = ()=>{
        this.setState({
            paused:!this.state.paused,
        })
    };
    onEnd = ()=>{
        let duration = this.state.video.duration;
        this.setState({
            video:{time:'00:00',duration},
            progress:0,
            paused:true,
        })
        this.video.seek(0);
    };
    onProgress = (e)=>{
        //alert(JSON.stringify(e))
        let duration = this.state.video.duration;
        let time = this.formatTime(e.currentTime);
        this.setState({
            video:{time,duration},
            progress:e.currentTime,
        })
    };
    setDuration = (e)=>{
        //alert('加载完成:'+JSON.stringify(e))
        let duration = this.formatTime(e.duration);
        this.setState({
            video:{time:null,duration},
            duration:e.duration,
        })
    };

    seek = (value)=>{
        this.video.seek(value);
        let duration = this.state.video.duration;
        let currentTime = value;
        this.setState({video:{time:this.formatTime(currentTime),duration}});
    }
    render() {
            return(
                <View style={styles.container} >
                    <Video
                        ref={(ref) => {
                            this.video = ref
                        }}
                        //来自本地的MP4视频
                        source={{uri:this.props.path}}
                        //1.0表示默认速率
                        rate={1.0}
                        //图片等比例缩放
                        resizeMode='contain'
                        //是否重复播放
                        repeat={false}
                        //默认音量
                        volume={1.0}
                        //是否暂停
                        paused={this.state.paused}
                        // 当app转到后台运行的时候，播放是否暂停
                        playInBackground={false}
                        // onLoadStart={this.loadStart} // 当视频开始加载时的回调函数
                        onLoad={(e)=>this.setDuration(e)}    // 当视频加载完毕时的回调函数
                        onEnd={()=>this.onEnd()}           // 当视频播放完毕后的回调函数
                        // onError={this.videoError}    // 当视频不能加载，或出错后的回调函数
                        onProgress={(e)=>this.onProgress(e)}    //  进度控制，每250ms调用一次，以获取视频播放的进度
                        // onBuffer={this.onBuffer}     // 远程视频缓冲时回调
                        style={styles.player}
                    />
                    {/*{this.defaultControlsView()}*/}
                    {/*<TouchableOpacity style={{width:40,height:40,backgroundColor:'yellow',position:'absolute',top:0,right:0}} onPress={()=>{this.pause()}}/>*/}
                    {this.defaultControlsBox()}
                </View>
            )
    }
}



const styles = StyleSheet.create({
    container:{
      flex:1,
        backgroundColor:'#000'
    },
    player:{
        width:width,
        height:height,
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
    playButtonBox:{
        width:50,
        height:20,
        justifyContent:'center',
        alignItems:'center'
    },
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
    sliderStyle:{
        height:20,
        width:width-200,
    },
    // trackStyle:{
    //     width:playerDefaultWidth-120,
    //     height:2
    // },
    // thumbStyle:{
    //     backgroundColor:'#fff',
    //     width:10,
    //     height:10
    // },
    time:{
        color:'#fff',
        width:50,
        textAlign: 'center',
        justifyContent: 'center',
        height:20,
        fontSize:14,
    },
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