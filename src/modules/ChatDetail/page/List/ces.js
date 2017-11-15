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
    TouchableWithoutFeedback
} from 'react-native';


import ImageViewer from 'react-native-image-zoom-viewer';
import ImageZoom from 'react-native-image-pan-zoom';
let {width, height} = Dimensions.get('window');

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action'

const images = [{
    url: 'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg'
}, {
    url: 'http://img2.ph.126.net/bkaOfRyDoyddXri0GjpWjA==/6630608169839463386.jpg'
}, {
    url: 'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg'
}]

const uri = 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460';

class Ces extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uri : props.uri,
            isShow : props.isShow,
        }
    }
    componentWillReceiveProps(newProps){
        this.setState({
            uri : newProps.uri,
            isShow : newProps.isShow,
        });
    }

    // shouldComponentUpdate(newProps,nextState){
    //     if(newProps.isShow == this.props.isShow){
    //         return false
    //     }
    //     return true;
    // }

    modalClose = ()=>{
        // this.setState({
        //     isShow : false,
        // })
        this.props.hideImageModal();
    }
    render() {
        console.log(this.props)
        console.log(this.state.uri,this.state.isShow)
        return (
            <Modal onRequestClose={()=>{}} animationType={'fade'} visible={this.props.imageModalStore.isShow}>
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
                           onClick={()=>this.modalClose()}
                >
                    <Image style={{width,height,resizeMode: 'contain'}}
                           source={{uri:this.props.imageModalStore.url}}/>
                </ImageZoom>
            </Modal>
        );
    }

}

const mapStateToProps = state => ({
    imageModalStore: state.imageModalStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Ces);