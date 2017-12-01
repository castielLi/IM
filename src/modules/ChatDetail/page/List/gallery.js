/*
 * Created by Hsu. on 2017/9/8.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Modal,
    Easing,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';


import ImageViewer from 'react-native-image-zoom-viewer';
import ImageZoom from 'react-native-image-pan-zoom';
let {width, height} = Dimensions.get('window');

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action'
import * as commonActions from '../../../../Core/Redux/chat/action';
import ContainerComponent from '../../../../Core/Component/ContainerComponent'
// import IM from '../../../../Core/IM';
import chatController from '../../../../Logic/chatController';

const images = [{
    url: 'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg'
}, {
    url: 'http://img2.ph.126.net/bkaOfRyDoyddXri0GjpWjA==/6630608169839463386.jpg'
}, {
    url: 'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg'
}]

const uri = 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460';

let ChatController = new chatController();

class Gallery extends ContainerComponent {
    constructor(props) {
        super(props);
        this.state = {
            // uri : props.uri,
            // isShow : props.isShow,
            progress:0,
            download:false,
            path:props.Path,
            thumbnail:props.Path.indexOf('/thumbnail') !== -1 ? true : false
            //thumbnail:props.Remote.indexOf('#imageView2') !== -1 ? true : false
        }
    }
    // componentWillReceiveProps(newProps){
    //     this.setState({
    //         uri : newProps.uri,
    //         isShow : newProps.isShow,
    //     });
    // }

    // shouldComponentUpdate(newProps,nextState){
    //     if(newProps.isShow == this.props.isShow){
    //         return false
    //     }
    //     return true;
    // }

    // modalClose = ()=>{
    //     // this.setState({
    //     //     isShow : false,
    //     // })
    //     this.props.hideImageModal();
    // }
    componentWillMount(){

    }

    downOriginalImage = (Path,Remote,MSGID,Sender)=>{
        // let im = new IM();
        let currentObj = this;
        //let url = Remote.match(/([\s\S]*)#imageView2/)[1];

        let pathA = Path.match(/([\s\S]*)\/thumbnail/)[1];
        let pathB = Path.slice(Path.lastIndexOf('/'));
        let path = pathA+pathB;

        ChatController.manualDownloadResource(Remote,path,function () {

            //todo:修改数据库和修改redux的Local保存原图地址
            //todo:缩略图有自己的文件夹，目前下载原图后没有删除缩略图
            ChatController.updateMessageLocalSource(MSGID,path);
            currentObj.props.updateMessagePath(MSGID,path,Sender);
            //todo:图片下载成功后会覆盖之前的缩略图，但是不会刷新需要重新开启APP，所以采用不同的路径
            //currentObj.props.updateMessageUrl(MSGID,url,Sender);
            //im.updateMessageRemoteSource(MSGID,url);
            //ChatController.updateMessageRemoteSource(MSGID,url);
            currentObj.setState({
                path,
                download:false,
                thumbnail:false,
            })
        },function (percent) {
            currentObj.setState({
                progress:Math.ceil(percent * 100),
                download:true,
            });
        })
    }
    render() {
        let {Path,Remote,MSGID,Sender} = this.props;
        return (
            <View style={styles.container}>
                {/*<ImageViewer*/}
                    {/*imageUrls={this.props.imageModalStore.urls} // 照片路径*/}
                    {/*enableImageZoom={true} // 是否开启手势缩放*/}
                    {/*index={0} // 初始显示第几张*/}
                    {/*onClick={()=>this.modalClose()}*/}
                    {/*//onChange={(index) => {}} // 图片切换时触发*/}
                {/*/>*/}

                <ImageZoom cropWidth={width}
                           cropHeight={height}
                           imageWidth={width}
                           imageHeight={height}
                           leaveStayTime={150}
                           leaveDistance={20}
                           onClick={()=>this.route.pop(this.props)}
                >
                    <Image style={{width,height,resizeMode: 'contain'}}
                           source={{uri:this.state.path}}/>
                </ImageZoom>
                {this.state.thumbnail ?
                    <TouchableOpacity style={styles.download} onPress={()=>this.downOriginalImage(Path,Remote,MSGID,Sender)}>
                        {this.state.download ?
                            <Text style={styles.downloadText}>{this.state.progress}</Text> :
                            <Text style={styles.downloadText}>下载原图</Text>}
                    </TouchableOpacity> : null
                }
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    download:{
        height:30,
        width:100,
        borderWidth:1,
        borderColor:'#fff',
        position:'absolute',
        bottom:50,
        left:(width-100)/2,
        justifyContent:'center',
        alignItems:'center'
    },
    downloadText:{
        color:'#fff',
        fontSize:14,
    },
})
const mapStateToProps = state => ({
    imageModalStore: state.imageModalStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions,dispatch),
    ...bindActionCreators(commonActions,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);