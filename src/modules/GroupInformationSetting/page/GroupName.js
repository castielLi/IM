
import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableHighlight,
    Dimensions,
    Switch,
    ListView,
    ScrollView
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';
import UserController from '../../../TSController/UserController';
import AppManagement from '../../../App/AppManagement'

let userController = undefined;

let {height,width} = Dimensions.get('window');

let currentObj = undefined;
let currentAccount = undefined;

class GroupName extends AppComponent {
    constructor(props){
        super(props)
        this.state = {
            // rightButtonText:'',
            rightButtonDisabled:true,
            text:props.Name,
            defaultValue:props.Name,
            // isChangeText:false
        };

        currentObj = this;
        userController =  UserController.getSingleInstance()
        currentAccount = userController.getCurrentAccount();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }


    componentDidMount(){
        // if(this.state.isChangeText===false){
        //     this.setState({rightButtonDisabled:true})
        // }
    }



    _onChangeText=(v)=>{
        // this.setState({isChangeText:true})
        if(this.state.groupName === this.state.text){
            this.setState({text:v,rightButtonDisabled:true})
        }else{
            this.setState({text:v,rightButtonDisabled:false})
        }
    }
    ClearText(){
        this.setState({text:'',rightButtonDisabled:true})
    }

    toChangeName = ()=>{
        let {Id,navigator} = this.props;
        currentObj.showLoading();

        userController.updateGroupName(currentAccount.Account,Id,this.state.text,(result)=>{
            currentObj.hideLoading();
            if(result.Result == 1){

                if(currentObj.props.UpdateHeadName != undefined){
                    currentObj.props.UpdateHeadName(currentObj.state.text);
                }
                //路由跳转
                let routes = navigator.getCurrentRoutes();
                let index;
                for (let i = 0; i < routes.length; i++) {
                    if (routes[i]["key"] == "GroupInformationSetting") {
                        index = i;
                        break;
                    }
                }
                //跳转到群设置
                currentObj.route.replaceAtIndex(currentObj.props,{
                    key:'GroupInformationSetting',
                    routeId: 'GroupInformationSetting',
                    params:{"groupId":Id,onUpdateHeadName:currentObj.props.UpdateHeadName},

                },index)
            }else{
                alert('修改失败');
            }
        });
    }

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'取消'}}
                    heading={"修改群名称"}
                    right={{func:()=>{
                            this.toChangeName();
                    },text:'完成',disabled:this.state.rightButtonDisabled}}
                />
                <View style={styles.box}>
                        <View style={styles.titleBox}>
                            <Text style={styles.title}>群聊名称</Text>
                        </View>
                        <View style={styles.inputBox}>
                            <TextInput
                                underlineColorAndroid = {'transparent'}
                                autoFocus = {true}
                                value={this.state.text}
                                maxLength = {20}
                                onChangeText={(v)=>{this._onChangeText(v)}}
                                style={styles.input}
                            >
                            </TextInput>
                            <Icon name="times-circle" size={20} color="#aaa" onPress={()=>{this.ClearText()}} style={{marginHorizontal:10}}/>
                        </View>


                </View>
                <Popup ref={ popup => this.popup = popup}/>
                <Loading ref = { loading => this.loading = loading}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',

    },
    box:{
        flex:1,
    },
    titleBox:{
       height:50,
        paddingLeft:10,
        justifyContent:'center',
    },
    title:{
        color: '#aaa',
        fontSize: 14,
    },
    inputBox:{
        height:50,
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center'
    },
    input:{
        flex:1,
        height:50,
        padding:0,
        paddingHorizontal:10,
        backgroundColor:'#fff'
    }

});


const mapStateToProps = state => ({
});
const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(GroupName);