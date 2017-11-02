
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
import MyNavigationBar from '../../../Core/Component/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';

import IM from '../../../Core/IM';
import User from '../../../Core/User';
import {bindActionCreators} from 'redux';


let {height,width} = Dimensions.get('window');

let currentObj = undefined;
let im = new IM();
let user = new User();
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


    render() {
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
                            alert('发布成功');
                            //返回
                            this.setState({rightButtonText:'编辑'})
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

    accountName:state.loginStore.accountMessage.nick,
    accountId:state.loginStore.accountMessage.accountId
});

const mapDispatchToProps = dispatch => ({


});

 export default connect(mapStateToProps, mapDispatchToProps)(GroupAnnouncement);