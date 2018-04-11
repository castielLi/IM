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
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';


let {height,width} = Dimensions.get('window');

let currentObj = undefined;

export default class JoinGroup extends AppComponent {
    constructor(props){
        super(props);
        this.state = {
        };
        currentObj = this;
        this.userController =  this.appManagement.getUserLogicInstance();
        this.currentAccount = this.userController.getCurrentAccount();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
    }


    componentDidMount(){

    }

    _joinGroup=()=>{
        this.userController.joinGroup(this.props.groupId,this.props.source,(result)=>{
            if(result.Result === 1){
                //跳转界面
                this.route.push(this.props,{
                    key:'ChatDetail',
                    routeId: 'ChatDetail',
                    params:{"client":this.props.groupId,"type":'group',Nick: this.props.Name}
                });
            }else{
                 // alert('加入失败')
            }
        })
    };

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        let {Name,MemberCount} = this.props;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'取消'}}
                    heading={"加群"}
                />
                <View style={styles.content}>
                    <View style={styles.InfoContent}>
                        <ImagePlaceHolder style = {styles.pic} imageUrl = {require('../resource/groupAvator.png')}/>
                        <Text style={styles.membersName} numberOfLines={1}>{Name}</Text>
                        <Text style={styles.membersNumber}>(共{MemberCount}人)</Text>
                    </View>
                    <View style={styles.joinContent}>
                        <TouchableHighlight onPress={this._joinGroup} style={styles.touch}>
                            <View style={styles.touchView}>
                                    <Text style={styles.touchText}>加入群聊</Text>
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
        maxWidth:200,
        marginTop:10
    },
    membersNumber:{
        fontSize:14,
        color:'#989898',
        textAlign:'center',
        includeFontPadding:false,
        marginTop:10
    },
    joinContent:{
        alignItems:'center'
    },
    touch:{
        borderRadius:5
    },
    touchView:{
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:50,
        paddingVertical:10,
        backgroundColor:'#a0e75b',
        width:200,
        borderRadius:5
    },
    touchText:{
        fontSize:16,
        color:'#fff',
        textAlign:'center',
        includeFontPadding:false
    }
});