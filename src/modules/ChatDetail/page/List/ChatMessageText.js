/**
 * Created by Hsu. on 2017/9/8.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
} from 'react-native';
import EMOJI_ENUM from '../EnterTool/EmojiEnum';
import stringToContentArray from './stringToContentArrayMethod';

let {width, height} = Dimensions.get('window');

export default class ChatMessageText extends Component {
    constructor(props){
        super(props)

    }

    static defaultProps = {
    };

    static propTypes = {
    };

    render() {
        let {data,style} = this.props;
        let {Sender,Data,Receiver} = data.message.Data.Data;
        let dataArr = stringToContentArray(Data)
        return(
            <View style={[style,styles.bubble]}>
                <Text style={styles.contentText}>
                    {
                        dataArr.map((v,i)=>{
                            if (v["Content"] != null) {//文本
                                return <Text key={i}>{v["Content"]}</Text>
                            }
                            else if (v["Resources"] != null) {//emoji
                                if(!EMOJI_ENUM[v["Resources"]]){
                                    return <Text key={i}>{v["Resources"]}</Text>
                                }
                                return <Image
                                            key = {i}
                                            style = {styles.emoji}
                                            source={EMOJI_ENUM[v["Resources"]]}
                                          />
                            }
                        })
                    }
                </Text>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    bubble:{
        maxWidth:width-100,
        justifyContent:'center',
        borderRadius:5,
        paddingHorizontal:10,
        paddingVertical:10,
    },
    contentText:{
        includeFontPadding:false,
        fontSize:16,
        lineHeight:20,
    },
    emoji:{
        width:50,
        height:50,
        resizeMode:'cover'
    }
});


