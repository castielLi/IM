/**
 * Created by Hsu. on 2018/3/7.
 */
import React, {Component} from 'react';
import {StyleSheet,Image,Modal,Platform,UIManager,PanResponder,TouchableHighlight,View,Text,Dimensions} from 'react-native';

let {width,height} = Dimensions.get('window');
let LetterSet = ['~','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#'];
let timer = null;

export default class LetterPosition extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.currentLetter = null;
        this.height = null;
        this.singleHeight = null;
        this.top = null;
    }

    static defaultProps = {
    };
    static propTypes = {
        onPress: React.PropTypes.func
    };

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e) => true,  //对触摸进行响应
            onStartShouldSetPanResponderCapture: ()=> true, //是否要劫持点击事件
            onMoveShouldSetPanResponder: (e) => true,  //对滑动进行响应
            onMoveShouldSetPanResponderCapture: ()=> true, //是否要劫持滑动事件
            //激活时做的动作
            onPanResponderGrant: (e)=>{
                let a = Math.floor((e.nativeEvent.pageY-this.top)/this.singleHeight);
                if(a != this.currentLetter){
                    this.currentLetter = a;
                    timer = setTimeout(()=>{
                        this.props.onChange && this.props.onChange(LetterSet[a],true);
                    },150);
                    this.props.onPress && this.props.onPress(LetterSet[a]);
                }
                this._LetterPosition.setNativeProps({
                    style:styles.focusContainer
                });
                this._LetterView.setNativeProps({
                    style:styles.focusLetterView
                });
            },
            //移动时作出的动作
            onPanResponderMove: (e)=>{
                let a = Math.floor((e.nativeEvent.pageY-this.top)/this.singleHeight);
                if((a >= 0 &&　a<LetterSet.length) && a != this.currentLetter){
                    this.currentLetter = a;
                      this.props.onChangeText && this.props.onChangeText(LetterSet[a]);
                    this.props.onPress && this.props.onPress(LetterSet[a]);
                }
            },
            //离开时
            onPanResponderRelease:(e)=>{
                clearTimeout(timer);
                this.currentLetter = null;
                this.props.onChange && this.props.onChange(null,false);
                this._LetterPosition.setNativeProps({
                    style:styles.container
                });
                this._LetterView.setNativeProps({
                    style:styles.letterView
                });

            },
        })
    }

    _onLayout=(e)=>{
        UIManager.measure(e.target, (x, y, width, height, left, top) => {
            this.height = height;
            this.singleHeight = height/LetterSet.length;
            this.top = top;
        });
    }

    render() {
        return (
            <View ref={e=>this._LetterPosition = e} style={styles.container} {...this._panResponder.panHandlers}
                  onLayout={this._onLayout}>
                <View ref={e=>this._LetterView = e} style={styles.letterView}>
                    {LetterSet.map((value,index)=>{
                        return (
                            <View style={styles.letterItem}>
                                <Text style={styles.letterText}>{value}</Text>
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        right:0,
        top:0,
        bottom:0,
        width:25,
        alignItems:'flex-end'
    },
    focusContainer:{
        width:width,
    },
    letterView:{
        flex:1,
        width:25,
        backgroundColor:'rgba(0,0,0,0)',
    },
    focusLetterView:{
        backgroundColor:'rgba(0,0,0,.4)',
    },
    letterItem:{
        justifyContent:'center',
        alignItems:'center',
        flex:1,
    },
    letterText:{
        color:'#333',
        fontSize:14,
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false,
    }

});