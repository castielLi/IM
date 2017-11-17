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
    TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action'
import ContainerComponent from '../../../../Core/Component/ContainerComponent'
import {
    Navigator,
} from 'react-native-deprecated-custom-components';

let {width, height} = Dimensions.get('window');

class ChatMessageImage extends ContainerComponent {
    constructor(props){
        super(props)

        // this.Size = {
        //     width : 0,
        //     height: 0,
        // }

        this.state = {
            Size: {
                width: 0,
                height: 0,
            }
        }
    }

    static defaultProps = {
    };

    static propTypes = {
    };

    getImageSize = (uri)=>{
        Image.getSize(uri, (w, h) => {
            // this.Size = {width,height}

            this.setState({
                Size : {width:w,height:h}
            })
            //alert(this.Size.width+"22")
        })
    }

    localSourceObj = (Source)=>{
        return {uri:Source}
    }

    goToCes = (path,Remote,MSGID,Sender)=>{
        this.route.push(this.props,{key: 'Gallery',routeId: 'Gallery',params:{"path":path,"Remote":Remote,"MSGID":MSGID,"Sender":Sender},sceneConfig:Navigator.SceneConfigs.FloatFromBottomAndroid});
    }
    render() {
        let {data, style} = this.props;
        let {MSGID} = data.message;
        let {Sender,Receiver} = data.message.Data.Data;
        let {LocalSource,RemoteSource} = data.message.Resource[0];
        //let uri = LocalSource.substr(7);

        console.log(LocalSource,RemoteSource)
        // this.Size = Image.getSize(LocalSource, (width, height) => {
        //     return {width,height}
        // })
        //this.getImageSize(LocalSource || RemoteSource)
        //alert(this.Size.width+"11")

        return(
            <View style={[style,styles.bubble]}>
                <TouchableOpacity onPress={()=>this.goToCes(LocalSource,RemoteSource,MSGID,Sender)}>
                    <Image
                        resizeMode={Image.resizeMode.cover}
                        source={this.localSourceObj(LocalSource)}
                        style={[styles.imageStyle]}
                    />
                </TouchableOpacity>
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

const mapStateToProps = state => ({
    imageModalStore: state.imageModalStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageImage);