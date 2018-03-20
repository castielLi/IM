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
    Alert,
    Platform
} from 'react-native';

let {width, height} = Dimensions.get('window');

export default class ChatMessageSound extends Component {
    constructor(props){
        super(props)
        this.state={
            
        }
    }

    static defaultProps = {
    };

    static propTypes = {
    };


    getSoundTime = (Time)=>{
        let soundWidth = 50;
        if(Time>5){
            soundWidth = (width-260)*((Time-5)/55)+50;
        }
        return soundWidth;
    };

    render() {
        let {data,style} = this.props;
        let {LocalSource,RemoteSource,Time} = data.message;
        let {status} = data;
        let soundObjConfig = this.getSoundTime(Time);

        if(status == 4){
            return(
                <View style={styles.defaultSound}>
                    <Text style={styles.defaultText}>音频下载中...</Text>
                </View>
            )
        }else{
            return(
                <View style={[style,{width:soundObjConfig},styles.bubble]}>
                    <Text>{Time}"</Text>
                </View>
            )
        }
    }
}



const styles = StyleSheet.create({
    bubble:{
        maxWidth:width-100,
        borderRadius:5,
        paddingHorizontal:10,
        paddingVertical:10,
        flexDirection:'row',
        flexWrap:'wrap',
        alignItems:'center'
    },
    defaultSound:{
        alignItems:'center',
        justifyContent:'center',
    },
    defaultText:{
        includeFontPadding:false,
        fontSize:16,
        lineHeight:20,
        color:'#000'
    }
});