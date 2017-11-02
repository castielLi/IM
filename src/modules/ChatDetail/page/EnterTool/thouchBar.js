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
    }
    this.setEmoji = this.setEmoji.bind(this);

  }  

  setEmoji(emojiText,emojiId){
    this.setState({
      emojiText,
      emojiId
    })
  }



  render() {
    return (
      <View style={styles.thouchBarBox} >
        <ThouchBarBoxTopBox ref={e => this.bar = e} emojiText={this.state.emojiText} emojiId={this.state.emojiId}  client={this.props.client}  type={this.props.type}></ThouchBarBoxTopBox>
        <ThouchBarBoxBottomBox setEmoji={this.setEmoji}  textInputData={this.state.textInputData} client={this.props.client}  type={this.props.type}></ThouchBarBoxBottomBox>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  thouchBarBox: {
    backgroundColor: '#eee',
  }
});

