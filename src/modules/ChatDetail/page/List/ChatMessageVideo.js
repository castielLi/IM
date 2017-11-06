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
import * as Actions from '../../reducer/action'

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
        return(
            <View style={[style,styles.bubble]}>
                <Text>{this.props.data}</Text>
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

});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessageVideo);