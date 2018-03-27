/**
 * Created by Hsu. on 2018/3/27.
 */
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
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserController from '../../../TSController/UserController';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';

let userController = undefined;

let {height,width} = Dimensions.get('window');

let currentObj = undefined;
let currentAccount = undefined;

export default class JoinGroup extends AppComponent {
    constructor(props){
        super(props);
        this.state = {
            members
        };
        currentObj = this;
        userController =  UserController.getSingleInstance();
        currentAccount = userController.getCurrentAccount();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }


    componentDidMount(){
        userController.getGroupMembersInfo(this.props.groupId, (result) => {
            if(result){
                currentObj.setState({
                    members:result,
                })
            }
        });
    }

    _joinGroup=()=>{
        userController.joinGroup(this.props.groupId,this.props.source,(result)=>{
            if(result.Result === 1){
                //跳转界面
            }else{
                alert('加入失败')
            }
        })
    };

    _getInfo = ()=>{
        let membersNumber = this.state.members.length;
        let membersName = '';
        for(current of this.state.members){
            if(current.Remark != ''){
                membersName += current.Remark+'、';
                continue;
            }
            membersName += current.Nickname+'、';
        }
        membersName = membersName.slice(0,-1);
        return {membersNumber,membersName}
    };
    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        let info = this._getInfo();

        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'取消'}}
                    heading={"扫码加群"}
                />
                <View style={styles.content}>
                    <View style={styles.InfoContent}>
                        <ImagePlaceHolder style = {styles.pic} imageUrl = {require('../resource/groupAvator.png')}/>
                        <Text style={styles.membersName} numberOfLines={1}>{info.membersName}</Text>
                        <Text style={styles.membersNumber}>(共{info.membersNumber}人)</Text>
                    </View>
                    <View style={styles.joinContent}>
                        <TouchableHighlight onPress={this._joinGroup}>
                            <View style={touchView}>
                                    <Text style={touchText}>加入群聊</Text>
                            </View>
                        </TouchableHighlight>
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
    InfoContent:{
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:40,
    },
    pic:{
        width:50,
        height:50,
        borderRadius:25
    },
    membersName:{
        fontSize:16,
        color:'#000',
        textAlign:'center',
        includeFontPadding:false,
        maxWidth:200
    },
    membersNumber:{
        fontSize:14,
        color:'#989898',
        textAlign:'center',
        includeFontPadding:false,
    },
    joinContent:{

    },
    touchView:{
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:50,
        paddingVertical:5,
        backgroundColor:'#a0e75b'
    },
    touchText:{
        fontSize:16,
        color:'#fff',
        textAlign:'center',
        includeFontPadding:false
    }
});