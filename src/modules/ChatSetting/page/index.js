
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
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import NavigationBar from 'react-native-navbar';

let {height,width} = Dimensions.get('window');

class ChatSetting extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.state = {
            isStickyChat:false,//置顶聊天
            notDisturb:false,//消息免打扰
        }
    }
    //定义上导航的左按钮
    _leftButton() {
        return  <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>this.route.pop(this.props)}>
            <Text style={styles.back}>{'< 返回'}</Text>
        </TouchableOpacity>
    }
    //定义上导航的标题
    _title() {
        return {
            title: "聊天设置",
            tintColor:'#fff',
        }
    }

    changeIsStickyChat = ()=>{
        this.setState({
            isStickyChat:!this.state.isStickyChat
        })
    }
    changeNotDisturb = ()=>{
        this.setState({
            notDisturb:!this.state.notDisturb
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    tintColor="#38373d"
                    leftButton={this._leftButton()}
                    title={this._title()} />
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
                    <View>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>消息免打扰</Text>
                            <Switch
                                value={this.state.notDisturb}
                                onValueChange={this.changeNotDisturb}
                            ></Switch>
                        </View>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>设置当前聊天背景</Text>
                            <Text style={styles.arrow}>{'>'}</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>清空聊天记录</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>投诉</Text>
                            <Text style={styles.arrow}>{'>'}</Text>
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