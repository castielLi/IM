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
  PixelRatio,
    Platform
} from 'react-native';
import Swiper from 'react-native-swiper';
const pxToPt = px=>PixelRatio.roundToNearestPixel(px);
let {width} = Dimensions.get('window');
  
let phizData = [
    [
        {name:'[微笑]',url:require('../../resource/phiz/1.png')},
        {name:'[发呆]',url:require('../../resource/phiz/2.png')},
        {name:'[大笑]',url:require('../../resource/phiz/3.png')},
        {name:'[白眼]',url:require('../../resource/phiz/4.png')},
        {name:'[流汗]',url:require('../../resource/phiz/5.png')},
        {name:'[1]',url:require('../../resource/phiz/6.png')},
        {name:'[闭嘴]',url:require('../../resource/phiz/7.png')},
        {name:'[酷]',url:require('../../resource/phiz/8.png')},
        {name:'[囧]',url:require('../../resource/phiz/9.png')},
        {name:'[喜欢]',url:require('../../resource/phiz/10.png')},
        {name:'[3]',url:require('../../resource/phiz/11.png')},
        {name:'[害羞]',url:require('../../resource/phiz/12.png')},
        {name:'[4]',url:require('../../resource/phiz/13.png')},
        {name:'[流泪]',url:require('../../resource/phiz/14.png')},
        {name:'[寒]',url:require('../../resource/phiz/15.png')},
        {name:'[发怒]',url:require('../../resource/phiz/16.png')},
        {name:'[5]',url:require('../../resource/phiz/17.png')},
        {name:'[6]',url:require('../../resource/phiz/18.png')},
        {name:'[爱心]',url:require('../../resource/phiz/19.png')},
        {name:'[心碎]',url:require('../../resource/phiz/20.png')},
        {name:'[花]',url:require('../../resource/phiz/21.png')},
        {name:'[7]',url:require('../../resource/phiz/22.png')},
        {name:'[拳头]',url:require('../../resource/phiz/23.png')},
        {name:'[8]',url:require('../../resource/phiz/24.png')},
        {name:'[OK]',url:require('../../resource/phiz/25.png')},
        {name:'[9]',url:require('../../resource/phiz/28.png')},
        {name:'[强]',url:require('../../resource/phiz/29.png')},
        {name:'[弱]',url:require('../../resource/phiz/30.png')},
    ],
    [
        {name:'[握手]',url:require('../../resource/phiz/32.png')},
        {name:'[10]',url:require('../../resource/phiz/33.png')},
        {name:'[胜利]',url:require('../../resource/phiz/34.png')},
        {name:'[礼物]',url:require('../../resource/phiz/35.png')},
        {name:'[咖啡]',url:require('../../resource/phiz/36.png')},
        {name:'[饭]',url:require('../../resource/phiz/37.png')},
        {name:'[足球]',url:require('../../resource/phiz/38.png')},
        {name:'[啤酒]',url:require('../../resource/phiz/39.png')},
        {name:'[太阳]',url:require('../../resource/phiz/40.png')},
    ]
    ];

export default class ExpressionBox extends Component {  
  constructor(props) {  
    super(props); 
    this.onPressEmoji = this.onPressEmoji.bind(this);
  }
  
onPressEmoji(emojiText){
  this.props.setEmoji(emojiText,Date.now())
}


render(){

      return(
          <View style={styles.ThouchBarBoxBottomBox}>
              <Swiper style={styles.wrapper} showsButtons={false} activeDotColor={'#434343'} loop={false} autoplay={false}>
                  {/*<TouchableWithoutFeedback>*/}
                     {/*<View style={styles.swiperSlide}>*/}
                          {/*/!*<TouchableWithoutFeedback onPress={this.onPressEmoji.bind(this,'[微笑]')}>*!/*/}
                            {/*/!*<Image source={require('../../resource/phiz/1.png')} style={styles.img}/>*!/*/}
                          {/*/!*</TouchableWithoutFeedback>*!/*/}
                         {/*{phizData.map((current,index)=>{*/}
                             {/*return (*/}
                                 {/*<TouchableWithoutFeedback onPress={this.onPressEmoji.bind(this,current.name)}>*/}
                                     {/*<Image source={current.url} style={styles.img}/>*/}
                                 {/*</TouchableWithoutFeedback>*/}
                             {/*)*/}
                         {/*})}*/}
                     {/*</View>*/}
                  {/*</TouchableWithoutFeedback>*/}
                  {
                      phizData.map((current,index)=>{
                          return (
                              <TouchableWithoutFeedback>
                                  <View style={styles.swiperSlide}>
                                      {current.map((current,index)=>{
                                          return (
                                              <TouchableWithoutFeedback onPress={this.onPressEmoji.bind(this,current.name)}>
                                                  <Image source={current.url} style={styles.img}/>
                                              </TouchableWithoutFeedback>
                                          )
                                      })}
                                  </View>
                              </TouchableWithoutFeedback>
                          )
                      })
                  }
              </Swiper>

              {Platform.OS === 'ios'?
                  <View style={styles.sendBox}>

                          <TouchableWithoutFeedback onPress={this.props._onSubmitEditing}>
                          <View style={[styles.send,{backgroundColor:this.props.textInputData?'#3399ff':'#fff'}]}>
                              <Text style={[styles.sendText,{color:this.props.textInputData?'#fff':'#aaa'}]}>发送</Text>
                          </View>
                      </TouchableWithoutFeedback>

                  </View>:
                      null
                      }
        </View>
        )
    }
}

const styles = StyleSheet.create({
  ThouchBarBoxBottomBox:{
    height:230,
    borderColor:'#ccc',
    borderTopWidth:1
  },
  wrapper:{
    flex:1,
  },
  swiperSlide:{
    flex:1,
    flexWrap:'wrap',
    flexDirection:'row',
  },
  plusItemBox:{
    width:pxToPt(60),
    height:pxToPt(70),
    marginTop:20,
    marginHorizontal:(width-4*pxToPt(60))/8,
    alignItems:'center',
  },
  plusItemImgBox:{
    height:pxToPt(50),
    width:pxToPt(50),
    borderRadius:pxToPt(10),
    borderColor:'#ccc',
    borderWidth:pxToPt(1), 
    justifyContent:'center',
    alignItems:'center'
  },
  img:{
    height:pxToPt(30),
    width:pxToPt(30),
    margin:10
  },
  plusItemTit:{
    fontSize:12,
    color:'#bbb'
  },
  sendBox:{
    height:40,
    backgroundColor:'#fff',
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
  },
  send:{
    width:60,
    height:40,
    justifyContent:'center',
    alignItems:'center'
  },
  sendText:{
    color:'#aaa'
  }
});
