
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
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import SettingController from '../../../Logic/Setting/settingController';
let settingController = undefined;
let {height,width} = Dimensions.get('window');

let currentObj = undefined;
class GroupAnnouncement extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.state = {
            rightButtonText:'',
            rightButtonDisabled:false,
            text:'',
            isChangeText:false
        };

        currentObj = this;
        settingController = new SettingController();
    }


    componentDidMount(){
        this.setState({
            text:this.props.Description
        })
        if(this.props.Owner===this.props.accountId){
            this.setState({
                rightButtonText:'编辑'
            })
        }
    }



    _onChangeText=(v)=>{
        this.setState({isChangeText:true})
        if(v === this.state.text||v === ''){
            this.setState({text:v,rightButtonDisabled:true})
        }else{
            this.setState({text:v,rightButtonDisabled:false})
        }

    }

    toChangeDiscription = ()=>{
        let {accountId,ID,navigator} = this.props;
        currentObj.showLoading();
        let params = {"Operater":accountId,"GroupId":ID,"Desc":this.state.text};
        settingController.toChangeDiscription(params,(result)=>{
            currentObj.hideLoading()
            if(!result.success){
                alert(result.errorMessage);
                return;
            }
            if(result.data.Data){
                let routes = navigator.getCurrentRoutes();
                let index;
                for (let i = 0; i < routes.length; i++) {
                    if (routes[i]["key"] == "GroupInformationSetting") {
                        index = i;
                        break;
                    }
                }
                // alert('发布成功');
                //跳转到群设置
                currentObj.route.replaceAtIndex(currentObj.props,{
                    key:'GroupInformationSetting',
                    routeId: 'GroupInformationSetting',
                    params:{"groupId":ID}
                },index)
            }else{
                alert("http请求出错")
            }
        })
    }

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'返回'}}
                    heading={"群公告"}
                    right={{func:()=>{
                        if(this.state.rightButtonText ==='编辑'){
                            this.setState({rightButtonText:'完成'})
                            if(this.state.isChangeText===false){
                                this.setState({rightButtonDisabled:true})
                            }
                        }else if (this.state.rightButtonText ==='完成'){
                            this.confirm('是否立即发布？','','确定',this.toChangeDiscription,'取消')
                        }
                    },text:this.state.rightButtonText,disabled:this.state.rightButtonDisabled}}
                />
                    <View style={styles.box}>
                        {this.state.rightButtonText ==='编辑'||this.state.rightButtonText ===''?
                            <Text style={styles.content}>{this.state.text}</Text>:
                            <TextInput
                                underlineColorAndroid = {'transparent'}
                                multiline={true}
                                autoFocus = {true}
                                defaultValue={this.state.text}
                                maxLength = {150}
                                onChangeText={(v)=>{this._onChangeText(v)}}
                                style={{flex:1,paddingVertical:0, overflow:'hidden',textAlignVertical: 'top',}}
                            >
                            </TextInput>
                        }
                        {this.props.Owner===this.props.accountId?null:
                            <View style={{height:50,justifyContent:'center',alignItems:'center'}}>
                                <Text>仅群主可编辑</Text>
                            </View>
                        }

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
        padding:10,
    },
    content:{
        color: '#000',
        fontSize: 16,
        flex:1
    },



});


const mapStateToProps = state => ({

    accountName:state.loginStore.accountMessage.Nickname,
    accountId:state.loginStore.accountMessage.Account
});

const mapDispatchToProps = dispatch => ({


});

 export default connect(mapStateToProps, mapDispatchToProps)(GroupAnnouncement);