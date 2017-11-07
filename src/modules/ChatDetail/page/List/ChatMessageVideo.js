/**
 * Created by Hsu. on 2017/11/6.
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
import * as Actions from '../../reducer/action';

let {width, height} = Dimensions.get('window');

class ChatMessageVideo extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    static defaultProps = {
    };

    static propTypes = {
    };



    render() {
        let {data, style} = this.props;
        let {LocalSource,RemoteSource} = data.message.Resource[0];
        return(
            <View style={[styles.bubble]}>
                <TouchableOpacity onPress={()=>{this.props.showMediaPlayer(LocalSource)}}>
                    <Text>播放视频</Text>
                </TouchableOpacity>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    bubble:{
        backgroundColor:'transparent'
    },
});

const mapStateToProps = state => ({
    mediaPlayerStore: state.mediaPlayerStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageVideo);