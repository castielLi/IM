/**
 * Created by Hsu. on 2017/9/8.
 */
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
} from 'react-native';

let {width, height} = Dimensions.get('window');

export default class ChatMessageSound extends PureComponent {
    constructor(props){
        super(props);
        this.state={
            hidden:true
        };
    }

    changeVolumeHidden = (value)=>{
        this.setState({
            hidden:value
        })
    };

    getSoundTime = (Time)=>{
        let soundWidth = 70;
        if(Time>5){
            soundWidth = (width-260)*((Time-5)/55)+70;
        }
        return soundWidth;
    };

    render() {
        let {data,style,sender} = this.props;
        let {LocalSource,RemoteSource,Time} = data.message;
        let {status} = data;
        let soundObjConfig = this.getSoundTime(Time);

        if(status == 4){
            return(
                <View style={styles.defaultSound}>
                    <Text style={styles.defaultText}>音频下载中...</Text>
                </View>
            )
        }if(status == 2){
            return(
                <View style={styles.defaultSound}>
                    <Text style={styles.defaultText}>音频重新下载中...</Text>
                </View>
            )
        }else{
            if(sender){
                return(
                    <View style={[style,{width:soundObjConfig},styles.bubble]}>
                        <View style={styles.rightText}>
                            <Text>{Time}"</Text>
                        </View>
                        {
                            this.state.hidden?null: <Image source={require('../../resource/volumeRight.png')} style={styles.img}/>
                        }
                    </View>
                )
            }else{
                return(
                    <View style={[style,{width:soundObjConfig},styles.bubble]}>
                        {
                            this.state.hidden?null: <Image source={require('../../resource/volumeLeft.png')} style={styles.img}/>
                        }
                        <View style={styles.leftText}>
                            <Text>{Time}"</Text>
                        </View>
                    </View>
                )
            }
        }
    }
}



const styles = StyleSheet.create({
    bubble:{
        flex:1,
        maxWidth:width-100,
        borderRadius:5,
        paddingHorizontal:10,
        paddingVertical:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
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
    },
    img:{
        alignItems: 'flex-end',
        height:18,
        width:14,
    },
    leftText:{
        alignItems:'flex-end',
        flex:1
    },
    rightText:{
        alignItems:'flex-start',
        flex:1
    }
});