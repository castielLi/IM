/**
 * Created by Hsu. on 2017/9/8.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableHighlight,
    PanResponder,
    UIManager,
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
        this.state = {
            bg: 'white',
            top: 0,
            left: 0
        }
        this.long_press_timeout = -1;
    }

    static defaultProps = {
    };

    static propTypes = {
    };

    componentWillMount(){
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: ()=> true,
            onPanResponderGrant: (evt, gestureState)=>{
                this._top = this.state.top
                this._left = this.state.left
                this.setState({bg: 'red'})
                this.e = evt;
                this.long_press_timeout = setTimeout(()=>{
                            // let popupMenu = {top,left,componentWide:1};
                            this.props.onpress();
                    },1500);

            },
            onPanResponderMove: (evt,gs)=>{
                console.log(gs.dx+' '+gs.dy)
                this.setState({
                    top: this._top+gs.dy,
                    left: this._left+gs.dx
                })
            },
            onPanResponderRelease: (evt,gs)=>{
                this.setState({
                    bg: 'white',
                    top: this._top+gs.dy,
                    left: this._left+gs.dx
                })
                alert(evt.target)
                UIManager.measure(evt.target, (x, y, width, height, left, top) => {
                    clearTimeout(this.long_press_timeout);
                    console.log(top + "    " + left)
                });

            }
        })
    }

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

    menu(){
        this.Touch.measure((x, y, width, height, left, top) => {
            alert(top + "    " + left)
        })
    }

    render() {
        let {rowData,type,style,chatId} = this.props;
        return (
            <View {...this._panResponder.panHandlers}>
                {this.typeOption(rowData,type,style,chatId)}
            </View>
        )
    }
}



const styles = StyleSheet.create({

});