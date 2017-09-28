/**
 * Created by Hsu. on 2017/9/8.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import Sound from 'react-native-sound';

let {width, height} = Dimensions.get('window');
let stopSoundObj = null;

export default class ChatMessageSound extends Component {
    constructor(props){
        super(props)
    }

    static defaultProps = {
    };

    static propTypes = {
    };

    playSound = (SoundUrl) => {
        const callback = (error, sound) => {
            if (error) {
                Alert.alert('error', error.message);
            }
            if(stopSoundObj){
                stopSoundObj.stop(()=>{
                    if(stopSoundObj && sound._filename == stopSoundObj._filename){
                        stopSoundObj = null;
                        return;
                    }
                    stopSoundObj = sound;
                    sound.play(() => {
                        stopSoundObj = null;
                        sound.release();
                    });

                }).release()
            }
            else{
                stopSoundObj = sound;
                sound.play(() => {
                    stopSoundObj = null;
                    sound.release();
                });
            }
        };
        const sound = new Sound(SoundUrl,'', error => callback(error, sound));
    }

    getSoundTime = (LocalPath)=>{
        let Time = LocalPath.match(/_[0-9]+/)[0].slice(1);
        let LocalSource = LocalPath.replace(/_[0-9]+/,'');
        let soundWidth = 50;
        if(Time>5){
            soundWidth = (width-200)*(Time/55)+50;
        }
        return {Time,LocalSource,soundWidth}
    }
    render() {
        let {data} = this.props;
        let {Sender,Receiver} = data.message.Data.Data;
        let {LocalSource,RemoteSource} = data.message.Resource[0];
        let soundObjConfig = this.getSoundTime(LocalSource || RemoteSource)
        if(!Sender){
            return(
                <View style={[styles.bubbleViewRight,{width:soundObjConfig.soundWidth}]}>
                    <TouchableOpacity onPress={()=>this.playSound(soundObjConfig.LocalSource)}>
                        <Text>{soundObjConfig.Time}"</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else{
            return(
                <View style={styles.bubbleView}>
                    <TouchableOpacity onPress={()=>this.playSound(LocalSource || RemoteSource)}>
                        <Text>播放</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
}



const styles = StyleSheet.create({
    bubbleView:{
        alignSelf:'flex-start',
        marginLeft:10,
        backgroundColor: '#fff',
        maxWidth:width-150,
        padding:12,
        justifyContent:'center',
        borderRadius:5
    },
    bubbleViewRight:{
        alignSelf:'flex-start',
        marginRight:10,
        backgroundColor: '#98E165',
        maxWidth:width-150,
        padding:10,
        justifyContent:'center',
        borderRadius:5
    },
});