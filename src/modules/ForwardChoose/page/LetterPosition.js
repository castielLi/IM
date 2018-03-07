/**
 * Created by Hsu. on 2018/3/7.
 */
import React, {Component} from 'react';
import {StyleSheet,Image,Modal,Platform,Alert,PanResponder,TouchableHighlight,View,Text,Dimensions} from 'react-native';
import UserController from '../../../TSController/UserController';
import IMControllerLogic from '../../../TSController/IMLogic/IMControllerLogic';

let userController = undefined;
let imLogicController = undefined;
let {width,height} = Dimensions.get('window');
let LetterSet = ['~','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#'];
export default class LetterPosition extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.currentLetter = null;
        this.height = null;
        this.singleHeight = null;

        userController = UserController.getSingleInstance();
        imLogicController = IMControllerLogic.getSingleInstance();
    }

    static defaultProps = {
        visible: false
    };
    static propTypes = {
        visible: React.PropTypes.bool,
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
                let a = Math.floor(e.nativeEvent.locationY/this.singleHeight);
                if(a != this.currentLetter){
                    this.currentLetter = a;
                    this._SelectText.onChangeShow(LetterSet[a])
                }
                this._LetterPosition.setNativeProps({
                    style:[styles.container,styles.focusContainer]
                });
            },
            //移动时作出的动作
            onPanResponderMove: (e,g)=>{
                let a = Math.floor((e.nativeEvent.locationY+g.dy)/this.singleHeight);
                alert(e.nativeEvent.locationY+'/'+g.dy)
                if(a >= 0 && a != this.currentLetter){
                    this.currentLetter = a;
                    this._SelectText.onChangeText(LetterSet[a]);
                    // alert(LetterSet[a])
                }
            },
            //离开时
            onPanResponderRelease:(e)=>{
                this._SelectText.onChangeHide('')
                this._LetterPosition.setNativeProps({
                    style:styles.container
                });

            },
        })
    }

    _onLayout=(e)=>{
        this.height = e.nativeEvent.layout.height;
        this.singleHeight = this.height/LetterSet.length
    }

    render() {
        return (
            <View style={styles.containerBox}>
                <View ref={e=>this._LetterPosition = e} style={styles.container} {...this._panResponder.panHandlers}
                      onLayout={this._onLayout}>
                    {LetterSet.map((value,index)=>{
                        return (
                            <View style={styles.letterItem}>
                                <Text style={styles.letterText}>{value}</Text>
                            </View>
                        )
                    })}
                </View>
                <SelectText ref={e=>this._SelectText=e}/>
            </View>
        )
    }
}


class SelectText extends Component{
    constructor(props) {
        super(props);
        this.state = {
            text:'',
            show:false,
        };
    }

    onChangeText=(value)=>{
        this.setState({
            text:value
        })
    };

    onChangeShow=(value)=>{
        this.setState({
            show:true,
            text:value
        })
    };

    onChangeHide=()=>{
        this.setState({
            show:false,
            text:''
        })
    }

    render() {
        if(!this.state.show){
            return null;
        }
        return (
            <View style={{position:'absolute', left:0}}>
               <View style={{width:60,height:60,backgroundColor:'rgba(0,0,0,.3)',justifyContent:'center', alignItems:'center'}}>
                   <Text>{this.state.text}</Text>
               </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerBox:{
        position:'absolute',
        right:0,
        top:0,
        bottom:0,
        left:0
    },
    container:{
        position:'absolute',
        right:0,
        top:0,
        bottom:0,
        width:25,
        backgroundColor:'rgba(0,0,0,0)',
    },
    focusContainer:{
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