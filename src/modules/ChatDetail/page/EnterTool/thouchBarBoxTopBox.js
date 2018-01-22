import React, {
  Component
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  PixelRatio,
  Modal,
  PanResponder,

} from 'react-native';
import {
  connect
} from 'react-redux';
import RNFS from 'react-native-fs';
import Audio from './Audio.js';
import uuidv1 from 'uuid/v1';
import {
  bindActionCreators
} from 'redux';
import * as Actions from '../../reducer/action';
import Icon from 'react-native-vector-icons/FontAwesome';
import AutoExpandingTextInput from './autoExpandingTextInput';
import IMController from '../../../../TSController/IMLogic/IMControllerLogic';


const ptToPx = pt => PixelRatio.getPixelSizeForLayoutSize(pt);
const pxToPt = px => PixelRatio.roundToNearestPixel(px);

var imController = undefined
var {
  height,
  width
} = Dimensions.get('window');
var audio, startTime, recordTimer, modalTimer,checkMaxRecordTimeInterval,delayStopTimer;
class ThouchBarBoxTopBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            speakTxt: '按住说话',
            sendMessage: {
                data: '',
                from: '',
                id: '',
                uri: '',
                type: ''
            },
            fileName: '',
            thouchBarTopBoxHeight: 0,
            isShowModal: false,
            recordingModalStatus: 0, //0:录音中 1:时间太短 2：取消发送,
            isOnPressSpeakBox: false, //按下录音按钮
            textInputData: '',//输入框数据

        };
        this.shouldPressSpeakBox = true;
        this.changeThouchBarTopBoxHeight = this.changeThouchBarTopBoxHeight.bind(this);
        this.toRecord = this.toRecord.bind(this);
        this.toExpression = this.toExpression.bind(this);
        this.toPlus = this.toPlus.bind(this);
        this.renderVoiceButton = this.renderVoiceButton.bind(this);
        this.rendersmileButton = this.rendersmileButton.bind(this);
        this.renderPlusButton = this.renderPlusButton.bind(this);
        this.renderEnterBox = this.renderEnterBox.bind(this);
        this._onPressIn = this._onPressIn.bind(this);
        this._onPressOut = this._onPressOut.bind(this);
        this._onPressCancel = this._onPressCancel.bind(this);
        this.renderModalBoxContent = this.renderModalBoxContent.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this._onRequestClose = this._onRequestClose.bind(this);

        imController = IMController.getSingleInstance();
    }

    changeThouchBarTopBoxHeight(height) {
        this.setState({
            thouchBarTopBoxHeight: height
        })
    }

    toRecord() {
        if (this.props.thouchBarStore.isRecordPage) {
            //this.input.focus();
            this.focus();
        } else {
            //this.input.blur();
            this.blur();
        }
        this.props.pressRecord();
    }

    toExpression() {
        if (this.props.thouchBarStore.isExpressionPage) {
            //this.input.focus();
            this.focus();
        } else if (!this.props.thouchBarStore.isRecordPage && !this.props.thouchBarStore.isExpressionPage) {
            //this.input.blur();
            this.blur();
        }
        this.props.pressExpression();
    }

    toPlus() {
        if (this.props.thouchBarStore.isPlusPage) {
            //this.input.focus();
            this.focus();
        } else if (!this.props.thouchBarStore.isRecordPage && !this.props.thouchBarStore.isPlusPage) {
            //this.input.blur();
            this.blur();
        }
        this.props.pressPlus();
    }

    renderVoiceButton() {
        if (this.props.thouchBarStore.isRecordPage) {
            return (
                <Icon name="keyboard-o" size={20} color="#aaa"/>
            )
        } else {
            return (
                <Icon name="feed" size={20} color="#aaa"/>
            )
        }
    }

    rendersmileButton() {
        if (this.props.thouchBarStore.isExpressionPage) {
            return (
                <Icon name="keyboard-o" size={20} color="#aaa"/>
            )
        } else {
            return (
                <Icon name="smile-o" size={20} color="#aaa"/>
            )
        }
    }

    renderPlusButton() {
        return (
            <Icon name="plus" size={20} color="#aaa"/>
        )
    }

    _onPressIn() {
        if (!this.shouldPressSpeakBox) {
            return;
        }
        clearInterval(checkMaxRecordTimeInterval);
        clearTimeout(recordTimer);
        //开始录音
        let fileName = uuidv1();
        this.state.fileName = fileName;
        startTime = Date.now();
        recordTimer = setTimeout(() => {
            audio = new Audio(this.account.accountId, this.props.client, this.props.type, fileName);
            audio._record();
        }, 200)
        this.setState({
            isShowModal: true,
            recordingModalStatus: 0,
            speakTxt: '松开结束'
        })
        //录音超过60秒自动结束
        checkMaxRecordTimeInterval = setInterval(() => {
            if (Date.now() - startTime > 60000) {
                this._onPressOut();
                clearInterval(checkMaxRecordTimeInterval)
            }
        }, 1000)
    }

    _onPressOut() {
        this.shouldPressSpeakBox = false;
        clearInterval(checkMaxRecordTimeInterval)
        //针对点了立即放的情况
        if (Date.now() - startTime < 200) {
            startTime = 0;
            // 不录音
            clearTimeout(recordTimer);
            this.setState({
                recordingModalStatus: 1
            })
            this.shouldPressSpeakBox = true;
            //延迟一秒隐藏Modal
            modalTimer = setTimeout(() => {
                this.setState({
                    isShowModal: false,
                })
            }, 1000)
            return;
        }


        this.setState({
            isShowModal: false,
        })
        let stop = () => {
            audio && audio._stop((currentTime) => {
                let counTime;
                if (currentTime) {
                    if (currentTime > 60) {
                        counTime = 60;
                    }
                    counTime = currentTime;
                } else {
                    counTime = 1;
                }
                //初始化消息
                // let message = addResourceMessage('audio',this.props.type, [{
                //   FileType: ResourceTypeEnum.audio,
                //   LocalSource: this.audioPath + '/' + this.state.fileName + '.aac',
                //   RemoteSource: '',
                //     Time:counTime?counTime:1
                // }], this.props.accountId,this.props.client);//(资源类型，way，资源，发送者，接收者)
                //   //发送消息到IM
                //   chatController.addMessage(message, (results) => {
                //
                // }, [(tips) => {
                //   console.log(tips)
                // }]);
                let Path = this.audioPath + '/' + this.state.fileName + '.aac';
                let time = counTime ? counTime : 1;
                imController.SendFile(3, Path, time);
                //
                this.shouldPressSpeakBox = true;
            });
        }
        //延迟执行audio._stop
        delayStopTimer = setTimeout(stop, 800)
        //发送
        this.setState({
            speakTxt: '按住说话',
            isOnPressSpeakBox: false
        })
    }

    _onPressCancel() {
        this.shouldPressSpeakBox = false;
        clearInterval(checkMaxRecordTimeInterval)
        //结束录音
        let stop = () => {
            audio._stop((currentTime) => {
                //删除该录音文件
                RNFS.unlink(this.audioPath + '/' + this.state.fileName + '.aac')
            });
            this.shouldPressSpeakBox = true;
            this.setState({
                isShowModal: false,
                speakTxt: '按住说话'
            })
        }
        //延迟执行audio._stop
        delayStopTimer = setTimeout(stop, 800)
    }

    _onRequestClose() {
        this.setState({
            isShowModal: false,
        })
    }

    //获取TextInput组件方法
    focus() {
        this.input.getWrappedInstance().input.focus();
    }

    blur() {
        this.input.getWrappedInstance().input.blur();
    }

    _onSubmitEditing = () => {
        this.input.getWrappedInstance()._onSubmitEditing();
    }

    renderEnterBox() {
        return (
            <View style={{overflow: "hidden", flex: 1}}>
              <View ref={(com) => this.re = com} {...this._gestureHandlers} style={[styles.speakBox, {
                  left: this.props.thouchBarStore.isRecordPage ? (Platform.OS === 'android' ? 65 : 50) : -999,
                  backgroundColor: this.state.isOnPressSpeakBox ? '#bbb' : 'transparent'
              }]}>
                <Text style={styles.speakTxt}>{this.state.speakTxt}</Text>
              </View>
              <AutoExpandingTextInput ref={e => this.input = e} getInputObject={this.getInputObject}
                                      changeThouchBarTopBoxHeight={this.changeThouchBarTopBoxHeight}
                                      emojiText={this.props.emojiText} emojiId={this.props.emojiId}
                                      setTextInputData={this.setTextInputData} client={this.props.client}
                                      type={this.props.type} Nick={this.props.Nick}
                                      HeadImageUrl={this.props.HeadImageUrl}></AutoExpandingTextInput>
            </View>
        )
    }

    componentDidMount() {
        setTimeout(() => {
            //获取speakBox相对屏幕顶端偏移
            this.re.measure((x, y, w, h, l, t) => {
                this.speakBoxOffsetY = t
            })
        })
    }

    componentWillMount() {
        this._gestureHandlers = {
            onStartShouldSetResponder: () => {
                if (!this.shouldPressSpeakBox) {
                    return false;
                } else {
                    return true
                }
            },  //对触摸进行响应
            onMoveShouldSetResponder: () => {
                if (!this.shouldPressSpeakBox) {
                    return false;
                } else {
                    return true
                }
            },  //对滑动进行响应
            onResponderTerminationRequest: () => false,// 有其他组件请求接替响应者，当前View拒绝放权
            //激活时做的动作
            onResponderGrant: () => {
                // if(!this.shouldPressSpeakBox){
                //     return;
                // }
                this.setState({
                    isOnPressSpeakBox: true
                })
                this._onPressIn();
            },
            //移动时作出的动作
            onResponderMove: (e) => {
                // if(!this.shouldPressSpeakBox){
                //     return;
                // }
                if (e.nativeEvent.pageY < this.speakBoxOffsetY) {
                    this.setState({
                        recordingModalStatus: 2,
                    })
                } else {
                    this.setState({
                        recordingModalStatus: 0,
                    })
                }
            },
            //动作释放后做的动作
            onResponderRelease: () => {
                // if(!this.shouldPressSpeakBox){
                //     return;
                // }
                this.setState({
                    isOnPressSpeakBox: false
                })
                if (this.state.recordingModalStatus === 0) {
                    this._onPressOut();
                } else if (this.state.recordingModalStatus === 2) {
                    this._onPressCancel();
                }
            },
        }
        this._noGesture = {
            onStartShouldSetResponder: () => {
                return false;
            },
            onMoveShouldSetResponder: () => {
                return false;
            },
        }

        this.account = imController.getCurrentAccount();

        let audioPath = RNFS.DocumentDirectoryPath + '/' + this.account.accountId + '/chat/' + this.props.type + '-' + this.props.client + '/audio/';
        this.audioPath = audioPath;
    }

    renderModal() {
        //if(this.state.isShowModal){
        return <Modal
            animationType='fade'
            transparent={true}
            onRequestClose={() => {
            }}
            visible={this.state.isShowModal}
        >
          <View style={styles.recordingModalBox} {...this._noGesture}>
            <View style={styles.recordingModal}>
                {this.renderModalBoxContent()}
            </View>
          </View>
        </Modal>
        // }else{
        //   return null;
        // }
    }

    renderModalBoxContent() {
        if (this.state.recordingModalStatus === 0) {
            return <View style={styles.recordingModalItem}>
              <Icon name="microphone" size={80} color="#eee"/>
              <Text style={styles.recordingModalText} onPress={() => {
                  alert('程序没有卡')
              }}>手指上滑，取消发送</Text>
            </View>
        } else if (this.state.recordingModalStatus === 1) {
            return <View style={styles.recordingModalItem}>
              <Icon name="exclamation" size={80} color="#eee"/>
              <Text style={styles.recordingModalText}>录音时间太短</Text>
            </View>
        } else if (this.state.recordingModalStatus === 2) {
            return <View style={styles.recordingModalItem}>
              <Icon name="undo" size={80} color="#eee"/>
              <Text style={styles.recordingModalText}>松开手指，取消发送</Text>
            </View>
        }
    }

    setTextInputData = (data) => {
        this.setState({
            textInputData: data
        })
        this.props.setTextInputData(data);
    }

    render() {
        return (
            <View>
              <View
                  style={[styles.thouchBarBoxTop, {height: this.props.thouchBarStore.isRecordPage ? pxToPt(52) : Math.max(pxToPt(52), pxToPt(this.state.thouchBarTopBoxHeight + 20))}]}>
                  {this.renderEnterBox()}
                <TouchableHighlight style={[styles.button, styles.voiceButton]} underlayColor={'#bbb'}
                                    activeOpacity={0.5} onPress={this.toRecord}>
                    {this.renderVoiceButton()}
                </TouchableHighlight>
                <TouchableHighlight style={[styles.button, styles.smileButton]} underlayColor={'#bbb'}
                                    activeOpacity={0.5} onPress={this.toExpression}>
                    {this.rendersmileButton()}
                </TouchableHighlight>
                  {this.state.textInputData && Platform.OS === 'android' ?
                      <TouchableHighlight style={[styles.sendButton]} underlayColor={'#bbb'} activeOpacity={0.5}
                                          onPress={this._onSubmitEditing}>
                        <Text style={styles.sendButtonTxt}>发送</Text>
                      </TouchableHighlight> :
                      <TouchableHighlight style={[styles.button, styles.plusButton]} underlayColor={'#bbb'}
                                          activeOpacity={0.5} onPress={this.toPlus}>
                          {this.renderPlusButton()}
                      </TouchableHighlight>
                  }


              </View>
                {this.renderModal()}
            </View>

        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        //console.log(nextProps.emojiId,this.props.emojiId)
        if (nextProps.thouchBarStore.isRecordPage !== this.props.thouchBarStore.isRecordPage || nextProps.thouchBarStore.isExpressionPage !== this.props.thouchBarStore.isExpressionPage || nextProps.thouchBarStore.isPlusPage !== this.props.thouchBarStore.isPlusPage || nextProps.emojiText !== this.props.emojiText || nextProps.emojiId !== this.props.emojiId || nextState.thouchBarTopBoxHeight !== this.state.thouchBarTopBoxHeight || nextState.speakTxt !== this.state.speakTxt || nextState.isShowModal !== this.state.isShowModal || nextState.recordingModalStatus !== this.state.recordingModalStatus || nextState.textInputData !== this.state.textInputData) {
            return true
        }
        return false;
    }

    componentWillUpdate() {
        console.log('will update')
    }
}

const styles = StyleSheet.create({
  thouchBarBox: {
    width,
    backgroundColor: '#eee',
  },
  thouchBarBoxTop: {
    height: pxToPt(52), //62

  },
  button: {
    position: 'absolute',
    height: Platform.OS === 'android'?pxToPt(40):pxToPt(30),
    width: Platform.OS === 'android'?pxToPt(40):pxToPt(30),
    borderWidth: pxToPt(1),
    borderColor: '#aaa',
    borderRadius: pxToPt(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  voiceButton: {
    bottom: Platform.OS === 'android'?pxToPt(6):pxToPt(10),
    left: Platform.OS === 'android'?15:5,
  },
  smileButton: {
    bottom: Platform.OS === 'android'?pxToPt(6):pxToPt(10),
    right: Platform.OS === 'android'?70:50,
  },
  plusButton: {
    bottom: Platform.OS === 'android'?pxToPt(6):pxToPt(10),
    right: Platform.OS === 'android'?15:5,
  },
    sendButton:{
        position: 'absolute',
        height: pxToPt(40),
        width: pxToPt(55),
        backgroundColor:'#3399ff',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: pxToPt(6),
        right: 5,
        borderRadius:4
    },
    sendButtonTxt:{
      color:'#fff'
    },
  speakBox: {
    position: 'absolute',
    height: pxToPt(40),
    width: Platform.OS === 'android'?width-185:width-140,
    left: Platform.OS === 'android'?90:50,
      bottom: Platform.OS === 'android'?pxToPt(6):pxToPt(10),
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: pxToPt(1),
    justifyContent: 'center',
  },
  speakTxt: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },


  //录音modal
  recordingModalBox: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  recordingModal: {
    height: pxToPt(200),
    width: pxToPt(200),
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius:10
  },
  recordingModalItem: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center'
  },
  recordingModalText: {
    color: '#eee',
    marginTop: 40,
    fontSize:20,
  }
});

const mapStateToProps = state => ({
  thouchBarStore: state.thouchBarStore,
  accountId:state.loginStore.accountMessage.Account
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(Actions, dispatch),

});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(ThouchBarBoxTopBox);