
import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TextInput,
    InteractionManager,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableHighlight,
    Dimensions,
    Switch,
    ScrollView,
    Keyboard
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserController from '../../../TSController/UserController';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import AppPageMarkEnum from '../../../App/Enum/AppPageMarkEnum'
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';
let userController = undefined;


let {height,width} = Dimensions.get('window');
let currentObj;

export default class Search extends AppComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        this.state = {
            text:'',
            searchResult:[]
        }
        currentObj = this;
        userController =  UserController.getSingleInstance();
        this._goToChatDetail = this._goToChatDetail.bind(this);
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(()=> {
            if(this._TextInput){
                this._TextInput.focus();
            }
        });
    }

    _refreshUI(type,params){
        //这里如果没有点击通讯录界面是不会进行初始化的，不会初始化就会导致下层通知上层的时候不会显示contact 申请的红点
        switch (type){
            case AppPageMarkEnum.SearchByKeyword:
                currentObj.setState({
                    searchResult:params
                })
                break;
        }
    }

    searchInfo = (keyword)=>{
        Keyboard.dismiss();
        userController.searchUserOrGroupByKeyword(keyword)
    }

    _goToChatDetail(info){
        let type = info.group ? 'group' : 'private';
        this.route.push(this.props, {
            key: 'ChatDetail',
            routeId: 'ChatDetail',
            params: {
                client: info.chatId,
                type: type,
                Nick: info.name,
            }
        });
    }

    _renderItem = (info) => {
        let path = "";
        let name = info.remark != "" ? info.remark:info.name;
        if(!info.group) {
            path = userController.getAccountHeadImagePath(info.chatId);
        }
        return (
            <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>{this._goToChatDetail(info)}}>
                <View  style={styles.itemBox} >
                    { info.group?<ImagePlaceHolder style = {styles.pic} imageUrl = {require('../resource/groupAvator.png')}/>:
                        <ImagePlaceHolder styles={styles.pic} imageUrl ={path}/>}
                    <Text style={styles.itemText}>{name}</Text>
                </View>
            </TouchableHighlight>
        )
    };

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{
                        this.route.pop(this.props);
                    }}}
                    heading={"搜索"} />
                <View style={styles.listHeaderBox}>
                    <View style={styles.searchBox}>
                        <Icon name="search" size={20} color="#aaa" />
                        <TextInput
                            ref={e=>this._TextInput = e}
                            style={styles.search}
                            underlineColorAndroid = 'transparent'
                            placeholder = '好友昵称/好友云信号/群昵称'
                            defaultValue = {this.state.text}
                            onChangeText={(v)=>{this.setState({text:v})}}
                        >
                        </TextInput>
                        {this.state.text === ''?null:<Icon name="times-circle" size={20} color="#aaa" onPress={()=>{this.setState({text:'',searchResult:[]})}}/>}


                    </View>

                </View>

                {this.state.text === ''?null:<TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>this.searchInfo(this.state.text)}>
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
                <ScrollView>
                    {
                        this.state.searchResult.map((item,index)=>{
                            return this._renderItem(item)
                        })
                    }
                </ScrollView>

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
    ic:{
        width:40,
        height:40,
        borderRadius:20
    },
    itemText:{
        textAlignVertical: 'center',
        color: '#000',
        fontSize: 15,
        marginLeft:10
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
        fontSize:16
    },
    itemBox:{
        height:60,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        marginTop:1
    },
    resultItemBox:{
        height:60,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        marginTop:1
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
