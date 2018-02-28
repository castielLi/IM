/**
 * Created by Hsu. on 2018/2/28.
 */
import React, {Component} from 'react';
import {StyleSheet,Image,TextInput,Platform,Alert,FlatList,TouchableHighlight,View,Text,Dimensions} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import UserController from '../../../TSController/UserController'
import IMControllerLogic from '../../../TSController/IMLogic/IMControllerLogic'
import AppPageMarkEnum from '../../../App/AppPageMarkEnum'
import {Navigator} from 'react-native-deprecated-custom-components';

let userController = undefined;
let imLogicController = undefined;
let {width,height} = Dimensions.get('window');
export default class RemarkInfo extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
            remark:props.remark,
        };
        userController = UserController.getSingleInstance();
        imLogicController = IMControllerLogic.getSingleInstance();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    componentDidMount() {
    }

    _onFocus=()=>{
        this.inputBox.setNativeProps({
            style:styles.inputBoxChecked
        })
    };
    _onBlur=()=>{
        this.inputBox.setNativeProps({
            style:styles.inputBoxDefault
        })
    };


    render(){
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)}}}
                    heading={'备注信息'}
                    right={{func:()=>{this.route.pop(this.props)},text:'完成'}}
                />
                <View style={styles.RemarkModule}>
                    <Text style={styles.titleName}>备注名</Text>
                    <TextInput
                        ref={e=>this.inputBox = e}
                        style={styles.inputBoxDefault}
                        underlineColorAndroid="transparent"
                        onBlur={()=>this._onBlur()}
                        onFocus={()=>this._onFocus()}
                        onChangeText={(v)=>{this.setState({remark:v})}}
                        value={this.state.remark}
                    />
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
        paddingHorizontal:15
    },
    titleName:{
        paddingTop:20,
        color:'#bbb',
        fontWeight:'normal',
        fontSize:16,
        textAlignVertical:'center',
        includeFontPadding:false,
    },
    inputBoxDefault:{
        paddingTop:10,
        borderBottomWidth:1,
        borderBottomColor:'#eee',
        paddingBottom:0,
        fontSize:16,

    },
    inputBoxChecked:{
        paddingTop:10,
        borderBottomWidth:1,
        borderBottomColor:'#62b900',
        paddingBottom:0,
        fontSize:16,
    }
});