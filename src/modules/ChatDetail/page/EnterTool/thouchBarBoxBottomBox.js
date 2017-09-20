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
import * as commonActions from '../../../../Core/IM/redux/action';
const ptToPx = pt=>PixelRatio.getPixelSizeForLayoutSize(pt);
const pxToPt = px=>PixelRatio.roundToNearestPixel(px);


var {height, width} = Dimensions.get('window');
  


class ThouchBarBoxBottomBox extends Component {  
  constructor(props) {  
    super(props); 

  }
  

render(){
   let {isExpressionPage,isPlusPage} = this.props.thouchBarStore;
    if(isExpressionPage){
      return(
          <ExpressionBox setEmoji={this.props.setEmoji} _onSubmitEditing={this.props._onSubmitEditing} textInputData={this.props.textInputData} client={this.props.client}></ExpressionBox>
        )
    }else if(isPlusPage){
      return(
        <MoreUseBox client={this.props.client}></MoreUseBox>
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
    ...bindActionCreators(commonActions,dispatch)
});

 export default connect(mapStateToProps, mapDispatchToProps)(ThouchBarBoxBottomBox);