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
import Icon from 'react-native-vector-icons/FontAwesome';

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
        this.inputView.setNativeProps({
            style:styles.inputViewChecked
        })
    };
    _onBlur=()=>{
        this.inputView.setNativeProps({
            style:styles.inputViewDefault
        })
    };

   _modifyRemark=()=>{
       let {account} = this.props;
        userController.modifyRemark(account,this.state.remark);
        this.route.pop(this.props);
    };

    render(){
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)}}}
                    heading={'备注信息'}
                    right={{func:()=>{this._modifyRemark()},text:'完成'}}
                />
                <View style={styles.RemarkModule}>
                    <Text style={styles.titleName}>备注名</Text>
                    <View ref={e=>this.inputView = e} style={styles.inputViewDefault}>
                        <TextInput
                            style={styles.inputBox}
                            underlineColorAndroid="transparent"
                            onBlur={()=>this._onBlur()}
                            onFocus={()=>this._onFocus()}
                            onChangeText={(v)=>{this.setState({remark:v})}}
                            value={this.state.remark}
                        />
                        {this.state.remark.length ?
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                                <Icon
                                    name="remove"
                                    size={24}
                                    color="#aaa"
                                    onPress={()=>{this.setState({remark:''})}}
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
        paddingVertical:0,
    },
    inputIcon:{
        flex:1,
        textAlignVertical:'center',
        paddingHorizontal:10
    }
});