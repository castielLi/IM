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


import ViewControl from 'react-native-zoom-view';
import Swiper from 'react-native-swiper'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action'
let {width,height} = Dimensions.get('window');

class ImageModal extends React.Component {
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

    modalClose = ()=>{
        // this.setState({
        //     isShow : false,
        // })
        this.props.hideImageModal();
    }

    renderSwiperItemView() {
        const imgs = [
            'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg',
            'http://img2.ph.126.net/PqPdn4nhTSXTlPfDE_igJg==/6631322852401020356.jpg',
            'http://img1.ph.126.net/Ta6-WaHwuYMSehnn6Xcmyg==/6631426206490316698.jpg',
            'http://img0.ph.126.net/bCkBoPHS4d32mUJPqBIYrQ==/6631803338979839988.jpg',
            'http://img2.ph.126.net/bkaOfRyDoyddXri0GjpWjA==/6630608169839463386.jpg',
            'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg',
            'http://img2.ph.126.net/PqPdn4nhTSXTlPfDE_igJg==/6631322852401020356.jpg',
            'http://img1.ph.126.net/Ta6-WaHwuYMSehnn6Xcmyg==/6631426206490316698.jpg',
            'http://img0.ph.126.net/bCkBoPHS4d32mUJPqBIYrQ==/6631803338979839988.jpg',
            'http://img2.ph.126.net/bkaOfRyDoyddXri0GjpWjA==/6630608169839463386.jpg',
            'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg',
            'http://img2.ph.126.net/PqPdn4nhTSXTlPfDE_igJg==/6631322852401020356.jpg',
            'http://img1.ph.126.net/Ta6-WaHwuYMSehnn6Xcmyg==/6631426206490316698.jpg',
            'http://img0.ph.126.net/bCkBoPHS4d32mUJPqBIYrQ==/6631803338979839988.jpg',
            'http://img2.ph.126.net/bkaOfRyDoyddXri0GjpWjA==/6630608169839463386.jpg',
            'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg',
            'http://img2.ph.126.net/PqPdn4nhTSXTlPfDE_igJg==/6631322852401020356.jpg',
            'http://img1.ph.126.net/Ta6-WaHwuYMSehnn6Xcmyg==/6631426206490316698.jpg',
            'http://img0.ph.126.net/bCkBoPHS4d32mUJPqBIYrQ==/6631803338979839988.jpg',
            'http://img2.ph.126.net/bkaOfRyDoyddXri0GjpWjA==/6630608169839463386.jpg',
            'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg',
            'http://img2.ph.126.net/PqPdn4nhTSXTlPfDE_igJg==/6631322852401020356.jpg',
            'http://img1.ph.126.net/Ta6-WaHwuYMSehnn6Xcmyg==/6631426206490316698.jpg',
            'http://img0.ph.126.net/bCkBoPHS4d32mUJPqBIYrQ==/6631803338979839988.jpg',
            'http://img2.ph.126.net/bkaOfRyDoyddXri0GjpWjA==/6630608169839463386.jpg',
            'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg',
            'http://img2.ph.126.net/PqPdn4nhTSXTlPfDE_igJg==/6631322852401020356.jpg',
            'http://img1.ph.126.net/Ta6-WaHwuYMSehnn6Xcmyg==/6631426206490316698.jpg',
            'http://img0.ph.126.net/bCkBoPHS4d32mUJPqBIYrQ==/6631803338979839988.jpg',
            'http://img2.ph.126.net/bkaOfRyDoyddXri0GjpWjA==/6630608169839463386.jpg',
            'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg',
            'http://img2.ph.126.net/PqPdn4nhTSXTlPfDE_igJg==/6631322852401020356.jpg',
            'http://img1.ph.126.net/Ta6-WaHwuYMSehnn6Xcmyg==/6631426206490316698.jpg',
            'http://img0.ph.126.net/bCkBoPHS4d32mUJPqBIYrQ==/6631803338979839988.jpg',
            'http://img2.ph.126.net/bkaOfRyDoyddXri0GjpWjA==/6630608169839463386.jpg',
            'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg',
            'http://img2.ph.126.net/PqPdn4nhTSXTlPfDE_igJg==/6631322852401020356.jpg',
            'http://img1.ph.126.net/Ta6-WaHwuYMSehnn6Xcmyg==/6631426206490316698.jpg',
            'http://img0.ph.126.net/bCkBoPHS4d32mUJPqBIYrQ==/6631803338979839988.jpg',
            'http://img2.ph.126.net/bkaOfRyDoyddXri0GjpWjA==/6630608169839463386.jpg',
            'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg',
            'http://img2.ph.126.net/PqPdn4nhTSXTlPfDE_igJg==/6631322852401020356.jpg',
            'http://img1.ph.126.net/Ta6-WaHwuYMSehnn6Xcmyg==/6631426206490316698.jpg',
            'http://img0.ph.126.net/bCkBoPHS4d32mUJPqBIYrQ==/6631803338979839988.jpg',
            'http://img2.ph.126.net/bkaOfRyDoyddXri0GjpWjA==/6630608169839463386.jpg',
        ];
        return imgs.map((item,i)=>{
            return (
                <ViewControl
                    key={i}
                    cropWidth={width}
                    cropHeight={height}
                    imageWidth={width}
                    imageHeight={height}
                    onClick={()=>{alert(1)}}
                >
                    <Image
                        style={{
                            width:width,
                            height:height,
                            resizeMode: 'contain'
                        }}
                        source={{
                            uri:item
                        }}/>
                </ViewControl>
            )
        })
    }
    render() {
        console.log(this.props)
        console.log(this.state.uri,this.state.isShow)
        return (
            <Swiper
                    loop={false}
                    showsPagination={false}>
                    {this.renderSwiperItemView()}
                </Swiper>

        );
    }

}

const mapStateToProps = state => ({
    imageModalStore: state.imageModalStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageModal);