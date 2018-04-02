/**
 * Created by Hsu. on 2017/11/6.
 */
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
} from 'react-native';

import AppComponent from '../../../../Core/Component/AppComponent';
import IMControllerLogic from '../../../../TSController/IMLogic/IMControllerLogic';
let imControllerLogic = undefined;

let {width, height} = Dimensions.get('window');

export default class ChatMessageVideo extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            progress:props.data.sourceRate,
            download:false,
        };
        imControllerLogic = IMControllerLogic.getSingleInstance();
    }
    componentWillReceiveProps(nextProps){
        let sourceRate = nextProps.data.sourceRate;
        let status = nextProps.data.status;
        // let download = sourceRate && sourceRate != 1 ? true : false;
        let download = status && status == 4 ? true : false;
        this.setState({
            download,
            progress:sourceRate
        });
    }

    videoRender = (status,LocalSource,RemoteSource,data)=>{
        switch (status){
            case 4:
            case 3:
            case 2:
                return <View >
                    <Image source={require('../../resource/download.png')} style={{width:70,height:40}}/>
                    {this.state.download ?
                        <View style={styles.progressView}>
                            <Text style={styles.progressText}>{Math.ceil(this.state.progress)}%</Text>
                        </View> :null
                    }
                </View>
            case 5:
            case 0:
            case 1:
                return <View >
                    <Image source={require('../../resource/play.png')} style={{width:70,height:40}}/>
                </View>
        }
    };

    render() {
        let {data, style} = this.props;
        let {LocalSource,RemoteSource} = data.message;
        let {status} = data;
        return(
            <View style={[style,styles.bubble]}>
                {
                    this.videoRender(status,LocalSource,RemoteSource,data)
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bubble:{
        backgroundColor:'transparent'
    },
    progressView:{
        position:'absolute',
        width:70,
        height:40,
        backgroundColor:'rgba(0,0,0,.5)',
        alignItems:'center',
        justifyContent:'center'
    },
    progressText:{
        color:'#fff'
    }

});