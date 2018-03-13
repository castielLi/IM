import React, { Component } from 'react';  
import {  
  StyleSheet,  
  Text,  
  TextInput,  
  View,
  Dimensions,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  PixelRatio
} from 'react-native';  
import ExpressionBox from './expressionBox';
import MoreUseBox from './moreUseBox';
import {
    connect
} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../reducer/action';
  


class ThouchBarBoxBottomBox extends Component {  
  constructor(props) {  
    super(props); 

  }
  

render(){
   let {isExpressionPage,isPlusPage} = this.props.thouchBarStore;
    if(isExpressionPage){
      return(
          <ExpressionBox setEmoji={this.props.setEmoji} client={this.props.client} textInputData={this.props.textInputData} _onSubmitEditing={this.props._onSubmitEditing}></ExpressionBox>
        )
    }else if(isPlusPage){
      return(
        <MoreUseBox client={this.props.client} type={this.props.type} Nick={this.props.Nick} HeadImageUrl={this.props.HeadImageUrl}></MoreUseBox>
        )
    }else{
      return(
        null
        )
    }
  }
}

const styles = StyleSheet.create({
  ThouchBarBoxBottomBox:{
    height:230,
    borderColor:'#ccc',
    borderTopWidth:1
  }
});

const mapStateToProps = state => ({
    thouchBarStore: state.thouchBarStore
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(Actions, dispatch),

});

 export default connect(mapStateToProps, mapDispatchToProps)(ThouchBarBoxBottomBox);