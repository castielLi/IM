
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
import Icon from 'react-native-vector-icons/FontAwesome';

import UserController from '../../../TSController/UserController';
let userController = undefined;

let {height,width} = Dimensions.get('window');
let currentObj;

class SearchNewFriend extends AppComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        this.state = {
            text:'',
            searchResult:true
        }
        currentObj = this;
        userController = new UserController();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }


    backToAddFriends = ()=>{
        this.route.pop(this.props);

    }



    searchUser = (keyword)=>{
        if(keyword == this.props.loginStore.Account||keyword == this.props.loginStore.PhoneNumber){
            currentObj.alert("添加好友不允许添加自己","错误");
            return;
        }
        currentObj.showLoading();
        userController.getUserInfo(keyword,true,(result)=>{
            currentObj.hideLoading();
           if(result && result.Result == 1){
               currentObj.route.push(currentObj.props,{key:'ClientInformation',routeId:'ClientInformation',params:{clientId:keyword}});
           }else{
               currentObj.alert("该用户不存在","错误");
           }
        });
    }

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <View>
                    {Platform.OS === 'ios'? <View style={{height:26,backgroundColor:'#ddd'}}></View>:null }
                    <View style={styles.listHeaderBox}>
                        <View style={styles.searchBox}>
                            <Icon name="search" size={20} color="#aaa" />
                            <TextInput
                                style={styles.search}
                                underlineColorAndroid = 'transparent'
                                autoFocus = {true}
                                placeholder = '微信号/手机号'
                                defaultValue = {this.state.text}
                                onChangeText={(v)=>{this.setState({text:v})}}
                            >
                            </TextInput>
                            {this.state.text === ''?null:<Icon name="times-circle" size={20} color="#aaa" onPress={()=>{this.setState({text:''})}}/>}


                        </View>
                        <View style={styles.cancelView}>
                            <Text style={styles.cancel} onPress={this.backToAddFriends}>取消</Text>
                        </View>
                    </View>
                    {this.state.text === ''?null:<TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>this.searchUser(this.state.text)}>
                        <View  style={styles.itemBox}>
                            <View style={styles.greenBox}>
                                <Icon name="search" size={20} color="#fff" />
                            </View>
                            <Text style={{marginLeft:10}}>
                                <Text style={{fontSize:18,color:'#000'}}>搜索：</Text>
                                <Text style={{fontSize:16,color:'green'}}>{this.state.text}</Text>
                            </Text>
                        </View>
                    </TouchableHighlight>}


                    <Popup ref={ popup => this.popup = popup}/>
                    <Loading ref = { loading => this.loading = loading}/>
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

    listHeaderBox:{
        backgroundColor: '#ddd',
        flexDirection:'row',
        height:50,
        padding:10
    },
    searchBox:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        width:width-80,
        backgroundColor:'#fff',
        borderRadius:5,
        paddingHorizontal:10
    },
    cancelView:{
        width:60,
        justifyContent: 'center'
    },
    cancel:{
        width:60,
        textAlignVertical:'center',
        textAlign:'center',
        fontSize:18,
        color:'green'
    },
    search:{
        flex:1,
        height:30,
        backgroundColor:'#fff',
        color:'#000',
        padding:0,
        fontSize:10
    },
    itemBox:{
        height:60,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        borderColor:'#ccc',
        borderTopWidth:1,
        borderBottomWidth:1
    },
    basicBox:{
        flexDirection:'row',
    },
    basicBoxRight:{
        marginLeft:15,
    },
    greenBox:{
        height:40,
        width:40,
        backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5
    },
    name:{
        fontSize:15,
        color:'#000'
    },
    description:{
        fontSize:12,
        color:'#aaa'
    },
    arrow:{
        fontSize:15,
        color:'#aaa'
    },
});


const mapStateToProps = state => ({
    loginStore : state.loginStore.accountMessage,
});

const mapDispatchToProps = dispatch => ({

});

 export default connect(mapStateToProps, mapDispatchToProps)(SearchNewFriend);