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
let currentObj;

class ModifyNickName extends AppComponent {
    constructor(props){
        super(props)
        currentObj = this;
        this.userController = this.appManagement.getUserLogicInstance();
        this.currentAccount = this.userController.getCurrentAccount();
        this.state={
            privilege:false,
            nickname:this.currentAccount.Nickname
        }

    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
    }


    finished = ()=>{
        if(this.state.nickname == ""){
            this.alert(this.Localization.Nickname.errorMessage,this.Localization.Common.Error);
            return;
        }


        if(this.currentAccount.Nickname != this.state.nickname){
            this.userController.modifyNickname(this.state.nickname);
           this.route.pop(this.props);
        }
    }

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return(
            <View style={styles.container}>
                <MyNavigationBar
                    heading={this.Localization.Nickname.Title}
                    left={{func:()=>{this.route.pop(this.props)},text:this.Localization.Common.Cancel}}
                    right={{func:this.finished,text:this.Localization.Common.Complete}}
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