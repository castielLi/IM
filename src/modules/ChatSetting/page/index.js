
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
    Switch
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import IMController from '../../../TSController/IMLogic/IMControllerLogic'
import Icon from 'react-native-vector-icons/FontAwesome';
let imController = undefined;

let {height,width} = Dimensions.get('window');

class ChatSetting extends AppComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        imController = IMController.getSingleInstance();

        let setting = imController.getChatSetting();
        if(setting == undefined){
            this.state = {
                isStickyChat:false,//置顶聊天
                notDisturb:false,//消息免打扰
            }
        }else{
            this.state = {
                isStickyChat:setting.StickToTheTop,//置顶聊天
                notDisturb:setting.NoDisturb,//消息免打扰
            }
        }
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    changeIsStickyChat = ()=>{
        imController.setStickToTheTop(!this.state.isStickyChat);
        this.setState({
            isStickyChat:!this.state.isStickyChat
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)}}}
                    heading={'聊天设置'} />
                <View>
                    <View style={{borderBottomWidth:1,borderColor:'#eee'}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>置顶聊天</Text>
                            <Switch
                                value={this.state.isStickyChat}
                                onValueChange={this.changeIsStickyChat}
                            ></Switch>
                        </View>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>设置当前聊天背景</Text>
                            <Icon name="angle-right" size={20} color="#aaa" />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{
                        imController.removeAllMessage(Id,false);
                        alert("清空聊天记录成功")
                    }} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>清空聊天记录</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>投诉</Text>
                            <Icon name="angle-right" size={20} color="#aaa" />
                        </View>
                    </TouchableHighlight>

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
    back:{
        color: '#ffffff',
        fontSize: 15,
        marginLeft: 10,
        textAlignVertical:'center',
    },
    rightButton:{
        color: '#ffffff',
        fontSize: 15,
        marginRight: 10,
        textAlignVertical:'center',
    },
    remarksBox:{
        height:50,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    remarks:{
        fontSize:18,
        color:'#000'
    },
    arrow:{
        fontSize:20,
        color:'#aaa'
    },
    sendMessage:{
        width:width - 40,
        height:55,
        borderRadius:5,
        backgroundColor:'#dc0000',
        textAlignVertical:'center',
        textAlign:'center',
        color:'#fff',
        fontSize:20,
        alignSelf:'center'
    }
});


const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({

});

 export default connect(mapStateToProps, mapDispatchToProps)(ChatSetting);