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
            soundWidth = (width-260)*((Time-5)/55)+50;
        }
        return {Time,LocalSource,soundWidth}
    }
    render() {
        let {data,style} = this.props;
        let {Sender,Receiver} = data.message.Data.Data;
        let {LocalSource,RemoteSource} = data.message.Resource[0];
        //console.log(LocalSource,RemoteSource)
        let soundObjConfig = this.getSoundTime(LocalSource || RemoteSource)

        return(
            <View style={[style,{width:soundObjConfig.soundWidth},styles.bubble]}>
                <TouchableOpacity onPress={()=>this.playSound(soundObjConfig.LocalSource)}>
                    <Text>{soundObjConfig.Time}"</Text>
                </TouchableOpacity>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    bubble:{
        maxWidth:width-150,
        padding:12,
        justifyContent:'center',
        borderRadius:5
    },
});