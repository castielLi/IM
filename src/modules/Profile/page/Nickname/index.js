/**
 * Created by apple on 2018/2/23.
 */
/**
 * Created by Hsu. on 2017/10/20.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Switch,Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import AppComponent from '../../../../Core/Component/AppComponent';
import MyNavigationBar from '../../../Common/NavigationBar/NavigationBar';
import UserController from '../../../../TSController/UserController';



let currentObj;
let currentAccount = undefined;
let userController = undefined;

class ModifyNickName extends AppComponent {
    constructor(props){
        super(props)
        currentObj = this;
        userController = UserController.getSingleInstance();
        currentAccount = userController.getCurrentAccount();
        this.state={
            privilege:false,
            nickname:currentAccount.Nickname
        }

    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }


    finished = ()=>{
        if(currentAccount.Nickname != this.state.nickname){
           userController.modifyNickname(this.state.nickname);
        }
    }

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return(
            <View style={styles.container}>
                <MyNavigationBar
                    heading={'设置名字'}
                    left={{func:()=>{this.route.pop(this.props)},text:"取消"}}
                    right={{func:this.finished,text:'完成'}}
                />
                <View style={styles.Box}>
                    <View>
                        <View style={styles.validateView}>
                            <TextInput
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                                onChangeText={(v)=>{this.setState({nickname:v})}}
                                value={this.state.nickname}
                            />
                            {this.state.nickname.length ? <Icon name="times-circle" size={20} color="#aaa" onPress={()=>{this.setState({nickname:''})}} style={{marginRight:10}}/> : null}
                        </View>
                    </View>
                </View>
                <Popup ref={ popup => this.popup = popup}/>
                <Loading ref = { loading => this.loading = loading}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#ddd',
        flex:1
    },
    validateView:{
        height:50,
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center',
    },
    textInput:{
        flex:1,
        fontSize:16,
        paddingLeft:10
    },
    textBox:{
        height:50,
        justifyContent:'center'
    },
    rowTitle:{
        fontSize:14,
        color:'#999',

    },
    rowSetting:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#fff',
        height:50,
        paddingHorizontal:15
    },
    rowText:{
        fontSize:16,
        color:'#000',
    },
});

const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps,mapDispatchToProps)(ModifyNickName);