/**
 * Created by Hsu. on 2017/9/8.
 */
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
} from 'react-native';


import AppComponent from '../../../../Core/Component/AppComponent';
import {Navigator,} from 'react-native-deprecated-custom-components';

let {width, height} = Dimensions.get('window');
export default class ChatMessageImage extends PureComponent {
    constructor(props){
        super(props);
    }

    //重新构建路径
    rebuildPath=(LocalSource)=>{
        if(LocalSource.indexOf('file:') == -1){
            LocalSource = 'file://'+LocalSource;
        }
        return LocalSource;
    };

    defaultPicture=(data)=>{
        let {LocalSource,RemoteSource} = data.message;
        let {status} = data;
        if(status == 4 || status == 2){
            return(
                <Image
                    resizeMode={Image.resizeMode.cover}
                    source={require('../../resource/avator.jpg')}
                    style={[styles.imageStyle]}
                />
            )
        }
        return (
            <Image
                resizeMode={Image.resizeMode.cover}
                source={{uri:LocalSource}}
                style={[styles.imageStyle]}
            />
        )
    };
    render() {
        let {data, style} = this.props;
        data.message.LocalSource = this.rebuildPath(data.message.LocalSource);
        return(
            <View style={[style,styles.bubble]}>
                {this.defaultPicture(data)}
            </View>
        )
    }
}



const styles = StyleSheet.create({
    bubble:{
        backgroundColor:'transparent'
    },
    imageStyle:{
        height:100,
        width:100,
    }
});
