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
    Alert,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import ChatMessageText from './ChatMessageText';
import ChatMessageImage from './ChatMessageImage';
import ChatMessageSound from './ChatMessageSound';
import ChatMessageVideo from './ChatMessageVideo';
import ReactNativeComponentTree from 'react-native/Libraries/Renderer/shims/ReactNativeComponentTree';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import {
    Navigator,
} from 'react-native-deprecated-custom-components';
import IMControllerLogic from '../../../../TSController/IMLogic/IMControllerLogic';
let imControllerLogic = undefined;
let stopSoundObj = null;

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
        imControllerLogic = IMControllerLogic.getSingleInstance();
    }

    static defaultProps = {
    };

    static propTypes = {
    };

   //  //Image
   //  _goToGallery = (chatId,type,data)=>{
   //      this.route.push(this.props,{key: 'Gallery',routeId: 'Gallery',params:{"chatId":chatId,"type":type,"data":data,},sceneConfig:Navigator.SceneConfigs.FloatFromBottomAndroid});
   //  }
   //  //Audio
   //  _playSound = (SoundUrl) => {
   //      if (Platform.OS === 'ios') {
   //          Sound.enable(true);
   //      }
   //      const callback = (error, sound) => {
   //          if (error) {
   //              Alert.alert('error', error.message);
   //          }
   //          if(stopSoundObj){
   //              stopSoundObj.stop(()=>{
   //                  if(stopSoundObj && sound._filename == stopSoundObj._filename){
   //                      stopSoundObj = null;
   //                      return;
   //                  }
   //                  stopSoundObj = sound;
   //                  sound.play(() => {
   //                      stopSoundObj = null;
   //                      sound.release();
   //                  });
   //
   //              }).release()
   //          }
   //          else{
   //              stopSoundObj = sound;
   //              sound.play(() => {
   //                  stopSoundObj = null;
   //                  sound.release();
   //              });
   //          }
   //      };
   //      const sound = new Sound(SoundUrl,'', error => callback(error, sound));
   //  };
   //  //video
   // _playVideo = (Local,Remote,data)=>{
   //      let currentObj = this;
   //      let {messageId,message} = data;
   //      let group = this.props.type == 'group' ? true : false;
   //      RNFS.exists(Local).then((success) => {
   //          if(!success){
   //              imControllerLogic.manualDownloadResource(this.props.chatId,messageId,group,message);
   //          }
   //          else{
   //              this.route.push(this.props,{key: 'Player',routeId: 'Player',params:{"path":Local},sceneConfig:Navigator.SceneConfigs.FloatFromBottomAndroid});
   //          }
   //      }).catch((err) => {
   //          console.log(err.message);
   //      });
   //  };

    componentWillMount(){
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: ()=> true,
            onPanResponderGrant: (evt, gestureState)=>{
                this._top = this.state.top
                this._left = this.state.left
                this.setState({bg: 'red'})
                // console.log(ReactNativeComponentTree.getInstanceFromNode(evt.currentTarget));
                // console.log(ReactNativeComponentTree.getInstanceFromNode(evt.target));
                let currentTarget = evt.currentTarget;
                this.press_time = new Date().getTime();
                this.long_press_timeout = setTimeout(()=>{
                    UIManager.measure(currentTarget, (x, y, width, height, left, top) => {
                        let popupMenu = {top,left,componentWide:width,componentHeight:height};
                        this.props.onPress(popupMenu);
                    });
                },300);

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
                // alert(evt.target)
                let currentTime = new Date().getTime();
                if(currentTime - this.press_time >300){

                }else{
                    clearTimeout(this.long_press_timeout);

                }
                // UIManager.measure(evt.currentTarget, (x, y, width, height, left, top) => {
                //     clearTimeout(this.long_press_timeout);
                //     console.log(top + "    " + left)
                //     // alert(top + "    " + left)
                // });

            }
        })
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
                                onLongPress={this._OnLongPress()}
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

    menu(){
        this.Touch.measure((x, y, width, height, left, top) => {
            alert(top + "    " + left)
        })
    }

    _OnLongPress(){
        // let {onLongPress} = this.props;
        // this.chat.measure(this.target, (x, y, width, height, left, top) => {
        //     clearTimeout(this.long_press_timeout);
        //     alert(top + "    " + left)
        // });
        // onLongPress && onLongPress();
    }
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