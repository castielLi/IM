/**
 * Created by Hsu. on 2017/9/8.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import ChatMessageText from './ChatMessageText';
import ChatMessageImage from './ChatMessageImage';
import ChatMessageSound from './ChatMessageSound';
import ChatMessageVideo from './ChatMessageVideo';

let {width, height} = Dimensions.get('window');

export default class ChatMessage extends Component {
    constructor(props){
        super(props)

    }

    static defaultProps = {
    };

    static propTypes = {
    };

    typeOption = (data,type,style)=> {
        switch (data.type) {
            case 'text': {
                return (
                    <ChatMessageText
                        data={data}
                        type={type}
                        style={style}
                        navigator={this.props.navigator}
                    />
                )
            }
                break;
            case 'image': {
                return (
                    <ChatMessageImage
                        data={data}
                        type={type}
                        style={style}
                        navigator={this.props.navigator}
                    />
                )
            }
                break;
            case 'audio': {
                return (
                    <ChatMessageSound
                        data={data}
                        type={type}
                        style={style}
                        navigator={this.props.navigator}
                    />
                )
            }
                break;
            case 'video': {
                return (
                    <ChatMessageVideo
                        data={data}
                        type={type}
                        style={style}
                        navigator={this.props.navigator}
                    />
                )
            }
                break;
            default:
                return null;
                break;
        }
    };

    render() {
        let {rowData,type,style} = this.props;
        return (
            this.typeOption(rowData,type,style)
        )
    }
}



const styles = StyleSheet.create({

});