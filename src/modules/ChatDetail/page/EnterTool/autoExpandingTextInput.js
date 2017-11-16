import React, { Component } from 'react';  
import {  
  StyleSheet,  
  Text,  
  TextInput,  
  View,
  Dimensions,
  PixelRatio,
    Platform
} from 'react-native';  
import {bindActionCreators} from 'redux';
import {
    connect
} from 'react-redux';
import * as Actions from '../../reducer/action';
import * as commonActions from '../../../../Core/Redux/chat/action';
import {createTextMessageObj} from './createMessageObj';
import IM from '../../../../Core/IM/index';
import {addTextMessage} from '../../../../Core/IM/action/createMessage';
const ptToPx = pt=>PixelRatio.getPixelSizeForLayoutSize(pt);
const pxToPt = px=>PixelRatio.roundToNearestPixel(px);

var {height, width} = Dimensions.get('window');
const im = new IM();
let isIos = (Platform.OS === 'ios') ? true : false;
class AutoExpandingTextInput extends Component {  
  constructor(props) {  
    super(props); 
    this.state={
      data:'',
      firstInputHeight:0,
      isFirstInputHeight:true,
      inputHeight:0,
    } 
    this._onChangeText = this._onChangeText.bind(this);
    this._onSubmitEditing = this._onSubmitEditing.bind(this);
    this._onChange = this._onChange.bind(this);
  }  
  
  _onChangeText(data){
   this.state.data = data; 
   this.props.setTextInputData(data)
  }
  //0.45.1 multiline设为true，每次提交_onSubmitEditing会执行两次
  _onSubmitEditing(){
    if(this.state.data){
      //初始化消息
      let message = addTextMessage(this.state.data,this.props.type,this.props.accountId,this.props.client);//(内容，way，发送者，接收者)
      im.addMessage(message,(status,messageId)=>{
        message.MSGID = messageId;
        //更新chatRecordStore
        this.props.addMessage(message);
        this.input.clear();
        if(isIos){
            //发送表情不会获得焦点
            if(!this.props.thouchBarStore.isExpressionPage) this.input.focus();
        }


          this.state.data = '';
        this.props.setTextInputData('');
      });
     
      
      this.setState({
        inputHeight:this.state.firstInputHeight
      })
      this.props.changeThouchBarTopBoxHeight(this.state.firstInputHeight);
    }
    return
  }
  _onChange(event) {
    let height = event.nativeEvent.contentSize.height;
    if(this.state.isFirstInputHeight){
      this.state.firstInputHeight = height;
      this.state.isFirstInputHeight = false;
    } 

    //限制高度 
    if(height>(30+26*3)) return;
    this.setState({
      inputHeight:height
    })
    this.props.changeThouchBarTopBoxHeight(height);
    }
  componentWillMount(){
     this.props.changeThouchBarInit();
  }
  render() {  
    return (  
      <TextInput
       ref={(refInput)=>{this.input = refInput}}
       onFocus = {this.props.focusInput}
       onChangeText = {this._onChangeText}
       onSubmitEditing = {this._onSubmitEditing}   //0.45.1 multiline为true，并且blurOnSubmit为false时，ios点击确定会换行而不触发onSubmitEditing；Android无论怎么样点击确定都会触发onSubmitEditing
       blurOnSubmit = {isIos?true:false}// 提交失去焦点
       underlineColorAndroid = {'transparent'}  
       multiline={true}
       enablesReturnKeyAutomatically = {true} //ios专用  如果为true，键盘会在文本框内没有文字的时候禁用确认按钮
       returnKeyType='send'
       //onChange={this._onChange}
       maxLength = {150}
       defaultValue={this.state.data}  
       onContentSizeChange={this._onChange} //0.45.1 TextInput组件onContentSizeChange属性不可用
       style={[styles.textInputStyle,{height:Math.max(pxToPt(40),pxToPt(this.state.inputHeight)),left:this.props.thouchBarStore.isRecordPage?-999:(Platform.OS === 'android'?65:50)}]}
       >  
      </TextInput>  
    );  
  }


  componentWillReceiveProps(nextProps){
    if(nextProps.emojiText&&nextProps.emojiId!==this.props.emojiId){    
      this.state.data = this.state.data+nextProps.emojiText   //输入框添加emoji文字成功，但是onChange事件无法监听到，输入框高度无法改变
      this.props.setTextInputData(true)
    }
  }
}  
  
const styles = StyleSheet.create({  
  textInputStyle:{ 
    position:'absolute',
    left:Platform.OS === 'android'?90:50,
      bottom: Platform.OS === 'android'?pxToPt(6):pxToPt(10),
    fontSize:20, 
    lineHeight:20, 
    width:Platform.OS === 'android'?width-185:width-140,
    height:40,
    borderColor:'#ccc',
    borderWidth:pxToPt(1),   
    backgroundColor:'#fff',  
    borderRadius:5,
    //overflow:'hidden',
    padding:0,
    paddingLeft:5,
    paddingRight:5,
    textAlignVertical: 'center',
    fontSize:16,
  },

});  

const mapStateToProps = state => ({
    thouchBarStore: state.thouchBarStore,
    accountId:state.loginStore.accountMessage.accountId
});

const mapDispatchToProps = (dispatch) => {
  return{
    ...bindActionCreators(Actions, dispatch),
    ...bindActionCreators(commonActions,dispatch)
}};

 export default connect(mapStateToProps, mapDispatchToProps,null,{withRef : true})(AutoExpandingTextInput);
