/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
StyleSheet,
View,
} from 'react-native';

import ThouchBarBoxTopBox from './thouchBarBoxTopBox';
import ThouchBarBoxBottomBox from './thouchBarBoxBottomBox';


export default class ThouchBar extends Component {
  constructor(props) {  
    super(props);
    this.state = {
      emojiText:'',
      emojiId:'',
      textInputData:''
    }  
    this.setTextInputData = this.setTextInputData.bind(this);
    this.setEmoji = this.setEmoji.bind(this);
    this._onSubmitEditing = this._onSubmitEditing.bind(this);
  }  

  setEmoji(emojiText,emojiId){
    this.setState({
      emojiText,
      emojiId
    })
  }
  setTextInputData(data){
    this.setState({
     textInputData:data
    })
  }
  _onSubmitEditing(){
    this.bar.getWrappedInstance()._onSubmitEditing();
  }
  componentWillMount(){
      this._gestureHandlers = {
          onStartShouldSetResponder: () => true,  //对触摸进行响应
          onMoveShouldSetResponder: ()=> true,  //对滑动进行响应

          //激活时做的动作
          onResponderGrant: (e)=>{
              console.log(e.nativeEvent.identifier)
          },
          //移动时作出的动作
          onResponderMove: (e)=>{
              console.log(e.nativeEvent.identifier)
          },
          //动作释放后做的动作
          onResponderRelease: (e)=>{
              console.log(e.nativeEvent.identifier)
          },
      }
  }
  render() {
    return (
      <View style={styles.thouchBarBox}  {...this._gestureHandlers}>
        <ThouchBarBoxTopBox ref={e => this.bar = e} emojiText={this.state.emojiText} emojiId={this.state.emojiId} setTextInputData={this.setTextInputData} client={this.props.client}  type={this.props.type}></ThouchBarBoxTopBox>
        <ThouchBarBoxBottomBox setEmoji={this.setEmoji} _onSubmitEditing={this._onSubmitEditing} textInputData={this.state.textInputData} client={this.props.client}  type={this.props.type}></ThouchBarBoxBottomBox>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  thouchBarBox: {
    backgroundColor: '#eee',
  }
});

