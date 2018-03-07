/**
 * Created by Hsu. on 2018/3/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import AppComponent from '../../../../Core/Component/AppComponent';
import MyNavigationBar from '../../../Common/NavigationBar/NavigationBar';
import UserController from '../../../../TSController/UserController';
import Icon from 'react-native-vector-icons/FontAwesome';
let currentObj;
let userController = undefined;

export default class Signature extends AppComponent {
    constructor(props){
        super(props);
        userController = UserController.getSingleInstance();
        this.state = {
            Signature: props.Signature,
            Confirm:true,
        }
        this.cache = props.Signature;
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    _onFocus=()=>{
        this.inputView.setNativeProps({
            style:styles.inputViewChecked
        })
    };
    _onBlur=()=>{
        this.inputView.setNativeProps({
            style:styles.inputViewDefault
        })
    };

    _onChangeText=(text)=>{
        let Confirm = true;
        if(text != this.cache){
            Confirm = false;
        }
        this.setState({
            Signature:text,
            Confirm
        })
    };

    _onChangeSize=(e)=>{
        this._TextInput.setNativeProps({
            style:[styles.inputBox,{height:e.nativeEvent.contentSize.height}]
        })
    };

    _modifySignature=()=>{
        let {onPress} = this.props;
        // userController.modifyRemark(this.state.Signature);
        onPress && onPress(this.state.Signature);
        this.route.pop(this.props);
    };

    render(){
        let {Signature,Confirm} = this.state;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)}}}
                    heading={'个性签名'}
                    right={{func:()=>{this._modifySignature()},text:'完成',disabled:Confirm}}
                />
                <View style={styles.RemarkModule}>
                    <View ref={e=>this.inputView = e} style={styles.inputViewDefault}>
                        <TextInput
                            ref={e=>this._TextInput = e}
                            style={styles.inputBox}
                            underlineColorAndroid="transparent"
                            onBlur={this._onBlur}
                            onFocus={this._onFocus}
                            onChangeText={this._onChangeText}
                            onContentSizeChange={this._onChangeSize}
                            value={Signature}
                            autoFocus={true}
                            multiline={true}
                        />
                        {(Signature && Signature.length) ?
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                                <Icon
                                    name="remove"
                                    size={24}
                                    color="#aaa"
                                    onPress={()=>this._onChangeText('')}
                                    style={styles.inputIcon}
                                />
                            </View> : null
                        }
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
    RemarkModule:{
        paddingHorizontal:15,
        marginTop:10,
    },
    inputViewDefault:{
        paddingTop:10,
        borderBottomWidth:1,
        borderBottomColor:'#eee',
        flexDirection:'row'
    },
    inputViewChecked:{
        paddingTop:10,
        borderBottomWidth:1,
        borderBottomColor:'#62b900',
        flexDirection:'row'
    },
    inputBox:{
        fontSize:16,
        flex:1,
        paddingRight:0,
        paddingBottom:5
    },
    inputIcon:{
        flex:1,
        textAlignVertical:'center',
        paddingHorizontal:10
    }
});