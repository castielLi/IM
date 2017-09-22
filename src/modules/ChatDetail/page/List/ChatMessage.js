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

import ChatMessageText from './ChatMessageText';
import ChatMessageImage from './ChatMessageImage';
import ChatMessageSound from './ChatMessageSound';

let {width, height} = Dimensions.get('window');

export default class ChatMessage extends Component {
    constructor(props){
        super(props)

    }

    static defaultProps = {
    };

    static propTypes = {
    };

    typeOption = (data)=> {
        let {type,Data} = data.message;
        let {userID} = this.props;
        let isMe = Data.Data.Sender == '1';
        switch (type) {
            case 'text': {
                return (
                    <ChatMessageText
                        data={data}
                        isMe={isMe}
                    />
                )
            }
                break;
            case 'image': {
                return (
                    <ChatMessageImage
                        data={data}
                        isMe={isMe}
                    />
                )
            }
                break;
            case 'audio': {
                return (
                    <ChatMessageSound
                        data={data}
                        isMe={isMe}
                    />
                )
            }
                break;
        }
    };

    render() {
        let {rowData} = this.props;
        return (
            this.typeOption(rowData)
        )
    }
}



const styles = StyleSheet.create({

});