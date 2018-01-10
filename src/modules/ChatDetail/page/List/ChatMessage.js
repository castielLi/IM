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

    typeOption = (rowData,type,style,chatId)=> {

        // enum MessageType {
        //     TEXT = 1,
        //         FILE = 2
        // }

        let {message,messageType} = rowData;

        switch (messageType) {
            case 1: {
                return (
                    <ChatMessageText
                        data={message} //聊天数据
                        type={type} //聊天类型group/private
                        style={style}
                        chatId={chatId} //chatId
                        navigator={this.props.navigator}
                    />
                )
            }
                break;
            case 2: {
                    // IMAGE = 1,
                    // VIDEO = 2,
                    // AUDIO = 3

                switch (message.Type){
                    case 1:
                        return (
                            <ChatMessageImage
                                data={rowData}
                                type={type}
                                style={style}
                                chatId={chatId}
                                navigator={this.props.navigator}
                            />
                        )
                    case 2:
                        return (
                            <ChatMessageVideo
                                data={rowData}
                                type={type}
                                style={style}
                                chatId={chatId}
                                navigator={this.props.navigator}
                            />
                        )
                    case 3:
                        return (
                            <ChatMessageSound
                                data={rowData}
                                type={type}
                                style={style}
                                chatId={chatId}
                                navigator={this.props.navigator}
                            />
                        )
                    default:
                        break;
                }
            }
            default:
                break;
        }
    };

    render() {
        let {rowData,type,style,chatId} = this.props;
        return (
            this.typeOption(rowData,type,style,chatId)
        )
    }
}



const styles = StyleSheet.create({

});