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

    typeOption = (data,style)=> {
        let {type} = data.message;
        let chatType =  this.props.type;
        switch (type) {
            case 'text': {
                return (
                    <ChatMessageText
                        data={data}
                        style={style}
                        type={chatType}
                    />
                )
            }
                break;
            case 'image': {
                return (
                    <ChatMessageImage
                        data={data}
                        style={style}
                        type={chatType}
                    />
                )
            }
                break;
            case 'audio': {
                return (
                    <ChatMessageSound
                        data={data}
                        style={style}
                        type={chatType}
                    />
                )
            }
                break;
            case 'video': {
                return (
                    <ChatMessageVideo
                        data={data}
                        style={style}
                        type={chatType}
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
        let {rowData,style} = this.props;
        return (
            this.typeOption(rowData,style)
        )
    }
}



const styles = StyleSheet.create({

});

// const mapStateToProps = (state,props) => ({
//     accountId:state.loginStore.accountMessage.accountId
// });
//
// export default connect(mapStateToProps)(ChatMessage);