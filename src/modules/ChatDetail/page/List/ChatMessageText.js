/**
 * Created by Hsu. on 2017/9/8.
 */
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableHighlight
} from 'react-native';
import EMOJI_ENUM from '../EnterTool/EmojiEnum';
import stringToContentArray from './stringToContentArrayMethod';
import Thouch from '../../../Common/Thouch/index'

let {width, height} = Dimensions.get('window');

export default class ChatMessageText extends PureComponent {
    constructor(props){
        super(props)

    }

    static defaultProps = {
    };

    static propTypes = {
    };

    render() {
        let {data,style} = this.props;
        let dataArr = stringToContentArray(data)
        return(

                <View style={[styles.bubble,style]}>
                        {
                            dataArr.map((v,i)=>{
                                if (v["Content"] != null) {//文本
                                    return <Text collapsable={false} key={i} style = {styles.contentText}>{v["Content"]}</Text>
                                }
                                else if (v["Resources"] != null) {//emoji
                                    if(!EMOJI_ENUM[v["Resources"]]){
                                        return <Text collapsable={false} key={i} style = {styles.contentText}>{v["Resources"]}</Text>
                                    }
                                    return <Image
                                        key = {i}
                                        style = {styles.emoji}
                                        source={EMOJI_ENUM[v["Resources"]]}
                                    />
                                }
                            })
                        }
                </View>
        )
    }
}



const styles = StyleSheet.create({
    bubble:{
        maxWidth:width-100,
        borderRadius:5,
        paddingHorizontal:10,
        flexDirection:'row',
        flexWrap:'wrap',
        alignItems:'center',
        paddingVertical:10
    },
    contentText:{
        includeFontPadding:false,
        fontSize:16,
        color:'#000',
        fontWeight:'normal',
        textAlignVertical:'center',
    },
    emoji:{
        width:20,
        height:20,
    }
});


