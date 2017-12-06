/**
 * Created by Hsu. on 2017/9/8.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';

import Sound from 'react-native-sound';
import Thouch from '../../../Common/Thouch/index'

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

    getSoundTime = (Time)=>{
        let soundWidth = 50;
        if(Time>5){
            soundWidth = (width-260)*((Time-5)/55)+50;
        }
        return soundWidth;
    }
    render() {
        let {data,style} = this.props;
        let {localSource,remoteSource,time} = data;
        let soundObjConfig = this.getSoundTime(time);

        return(
            <View style={[style,{width:soundObjConfig},styles.bubble]}>
                <Thouch onPress={()=>this.playSound(localSource)}>
                    <Text>{time}"</Text>
                </Thouch>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    bubble:{
        maxWidth:width-100,
        justifyContent:'center',
        borderRadius:5,
        height:40,
        paddingHorizontal:10,
    },
});