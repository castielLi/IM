/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { PureComponent } from 'react';
import {
StyleSheet,
View,
} from 'react-native';

import ThouchBarBoxTopBox from './thouchBarBoxTopBox';
import ThouchBarBoxBottomBox from './thouchBarBoxBottomBox';


export default class ThouchBar extends PureComponent {
  constructor(props) {  
    super(props);
    this.state = {
      emojiText:'',
      emojiId:'',
        textInputData:'',//输入框数据
    }
    this.setEmoji = this.setEmoji.bind(this);

  }  

  setEmoji(emojiText,emojiId){
    this.setState({
      emojiText,
      emojiId
    })
  }

    setTextInputData=(data)=>{
        this.setState({
            textInputData:data
        })
    }
    _onSubmitEditing=()=> {
        this.bar.getWrappedInstance()._onSubmitEditing();
    }
  render() {
    return (
      <View style={styles.thouchBarBox} >
        <ThouchBarBoxTopBox ref={e => this.bar = e} emojiText={this.state.emojiText} emojiId={this.state.emojiId}  client={this.props.client} type={this.props.type} Nick={this.props.Nick} HeadImageUrl={this.props.HeadImageUrl} setTextInputData={this.setTextInputData}></ThouchBarBoxTopBox>
        <ThouchBarBoxBottomBox setEmoji={this.setEmoji}  client={this.props.client} type={this.props.type} Nick={this.props.Nick} HeadImageUrl={this.props.HeadImageUrl} textInputData={this.state.textInputData} _onSubmitEditing={this._onSubmitEditing}></ThouchBarBoxBottomBox>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  thouchBarBox: {
    backgroundColor: '#eee',
  }
});

