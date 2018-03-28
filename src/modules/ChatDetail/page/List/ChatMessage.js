/**
 * Created by Hsu. on 2017/9/8.
 */
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableHighlight,
    PanResponder,
    UIManager,
    Alert,
    Platform,
} from 'react-native';
import {connect} from 'react-redux';
import ChatMessageText from './ChatMessageText';
import ChatMessageImage from './ChatMessageImage';
import ChatMessageSound from './ChatMessageSound';
import ChatMessageVideo from './ChatMessageVideo';
import AppComponent from '../../../../Core/Component/AppComponent'

let {width, height} = Dimensions.get('window');

export default class ChatMessage extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            bg: 'white',
            top: 0,
            left: 0
        };
        this.long_press_timeout = -1;
        this.chatContent = null;
    }

    static defaultProps = {
    };

    static propTypes = {
    };

    componentWillMount(){
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: ()=> false,
            onPanResponderGrant: (evt, gestureState)=>{
                // this._top = this.state.top
                // this._left = this.state.left
                // this.setState({bg: 'red'})
                let currentTarget = evt.currentTarget;
                this.press_time = new Date().getTime();
                this.long_press_timeout = setTimeout(()=>{
                    UIManager.measure(currentTarget, (x, y, width, height, left, top) => {
                        // let popupMenu = {top,left,componentWidth:width,componentHeight:height};
                        // this.props.onPress(popupMenu);
                        let popupMenu = {top,left,componentWidth:width,componentHeight:height};
                        this.props.onPress(popupMenu,this.props.rowData);
                    });   
                }, Platform.OS==='ios'?1500:500);

            },
            onPanResponderMove: (evt,gs)=>{
                // console.log(gs.dx+' '+gs.dy)
                // this.setState({
                //     top: this._top+gs.dy,
                //     left: this._left+gs.dx
                // })
            },
            onPanResponderRelease: (evt,gs)=>{
                // this.setState({
                //     bg: 'white',
                //     top: this._top+gs.dy,
                //     left: this._left+gs.dx
                // })
                // alert(evt.target)
                let currentTime = new Date().getTime();
                if(currentTime - this.press_time >500){
                }else{
                    clearTimeout(this.long_press_timeout);
                    let rowData = this.props.rowData;
                    let {message,messageType} = rowData;
                    //如果在下载状态禁止点击
                    if(rowData.status == 4) return;
                    switch (messageType) {
                        case 1:

                            break;
                        case 2: {
                            switch (message.Type){
                                case 1:
                                    this.props.goToGallery(this.props.chatId,this.props.type,rowData);
                                    break;
                                case 2:
                                    this.props.playVideo(message.LocalSource,message.RemoteSource,rowData);
                                    break;
                                case 3:
                                    this.props.playSound(message.LocalSource,this.chatContent,message.Time);
                                    break;
                                default:
                                    break;
                            }
                        }
                        default:
                            break;
                    }
                }
                // UIManager.measure(evt.currentTarget, (x, y, width, height, left, top) => {
                //     clearTimeout(this.long_press_timeout);
                //     console.log(top + "    " + left)
                //     // alert(top + "    " + left)
                // });
            },
            onShouldBlockNativeResponder:()=> false,
            onPanResponderTerminate:()=> {
                clearTimeout(this.long_press_timeout);
                return true;
            },
            onPanResponderTerminationRequest:()=>true,
        })
    }

    componentDidMount() {

    }

    componentWillUnmount(){
    }

    setSoundChatVolumeHidden = (value)=>{
        this.chatContent.changeVolumeHidden(value)
    }

    typeOption = (rowData)=> {
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
                            {...this.props}
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
                                // onLongPress={this._OnLongPress()}
                                {...this.props}
                            />
                        )
                    case 2:
                        return (
                            <ChatMessageVideo
                                data={rowData}
                                {...this.props}
                            />
                        )
                    case 3:
                        return (
                            <ChatMessageSound
                                ref = { chatContent => this.chatContent = chatContent}
                                data={rowData}
                                {...this.props}
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

    // menu(){
    //     this.Touch.measure((x, y, width, height, left, top) => {
    //         alert(top + "    " + left)
    //     })
    // }

    // _OnLongPress(){
        // let {onLongPress} = this.props;
        // this.chat.measure(this.target, (x, y, width, height, left, top) => {
        //     clearTimeout(this.long_press_timeout);
        //     alert(top + "    " + left)
        // });
        // onLongPress && onLongPress();
    // }
    render() {
        // let {rowData,type,style,chatId} = this.props;
        return (
            <View ref={(e)=>this.chat = e} {...this._panResponder.panHandlers} collapsable={false}>
                {this.typeOption(this.props.rowData)}
            </View>
        )
    }
}



const styles = StyleSheet.create({

});