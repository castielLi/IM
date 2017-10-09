
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
    Dimensions
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import NavigationBar from 'react-native-navbar';

let {height,width} = Dimensions.get('window');

class ClientInformation extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.state = {
            selectedTab: 'home',
            isLogged: false
        }
    }
    //定义上导航的左按钮
    _leftButton() {
        return  <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>this.route.pop(this.props)}>
            <Text style={styles.back}>{'< 通讯录'}</Text>
        </TouchableOpacity>
    }
    //定义上导航的标题
    _title() {
        return {
            title: "详细资料",
            tintColor:'#fff',
        }
    }
    goToInformationSetting= ()=>{
        this.route.push(this.props,{key:'InformationSetting',routeId:'InformationSetting',params:{client:this.props.client,type:this.props.type}});
    }

    _rightButton() {
        return  <TouchableOpacity style={{justifyContent:'center'}} onPress={this.goToInformationSetting}>
            <Text style={styles.rightButton}>{'...'}</Text>
        </TouchableOpacity>
    }
    goToChatDetail = ()=>{
        this.route.push(this.props,{key:'ChatDetail',routeId:'ChatDetail',params:{client:this.props.client,type:this.props.type}});
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    tintColor="#38373d"
                    leftButton={this._leftButton()}
                    rightButton={this._rightButton()}
                    title={this._title()} />
                <View>
                    <View style={styles.basicBox}>
                        <Image style={styles.headPic} source={require('../resource/other.jpg')}></Image>
                        <View style={styles.basicBoxRight}>
                            <Text style={styles.name}>{this.props.client}</Text>
                            <Text style={styles.id}>{'微信号：'+this.props.client}</Text>
                        </View>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>设置备注和标签</Text>
                            <Text style={styles.arrow}>{'>'}</Text>
                        </View>
                    </TouchableHighlight>
                    <View  style={styles.placeBox}>
                        <Text style={styles.address}>地区</Text>
                        <Text style={styles.place}>重庆 大渡口</Text>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('相册')}>
                        <View  style={styles.photoBox}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={styles.address}>个人相册</Text>
                                <View style={styles.photos}>
                                    <Image style={styles.photo} source={require('../resource/other.jpg')}></Image>
                                    <Image style={styles.photo} source={require('../resource/other.jpg')}></Image>
                                    <Image style={styles.photo} source={require('../resource/other.jpg')}></Image>
                                    <Image style={styles.photo} source={require('../resource/other.jpg')}></Image>

                                </View>
                            </View>
                            <Text style={styles.arrow}>{'>'}</Text>

                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('更多')}>
                        <View  style={[styles.remarksBox,{marginTop:0}]}>
                            <Text style={styles.remarks}>更多</Text>
                            <Text style={styles.arrow}>{'>'}</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.goToChatDetail} style={{borderRadius:5,marginTop:15,marginHorizontal:20}}>
                        <Text style={styles.sendMessage}>发消息</Text>
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
    basicBox:{
        marginTop:15,
        height:100,
        paddingVertical:10,
        paddingHorizontal:15,
        backgroundColor:'#fff',
        flexDirection:'row'
    },
    headPic:{
        height:80,
        width:80,
        borderRadius:8,
        //resizeMode:'stretch'
    },
    basicBoxRight:{
        marginLeft:15,
        marginTop:5
    },
    name:{
        fontSize:15,
        color:'#000'
    },
    id:{
        fontSize:12,
        color:'#aaa'
    },
    remarksBox:{
        height:40,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    remarks:{
        fontSize:14,
        color:'#000'
    },
    arrow:{
        fontSize:14,
        color:'#aaa'
    },
    placeBox:{
        marginTop:15,
        height:40,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#eee'
    },
    address:{
        fontSize:14,
        color:'#000',
        width:100
    },
    place:{
        fontSize:14,
        color:'#000'
    },
    photoBox:{
        height:100,
        padding:15,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#eee',
        justifyContent:'space-between'
    },
    photos:{
        flexDirection:'row'
    },
    photo:{
        width:60,
        height:60,
        marginRight:8
    },
    sendMessage:{
        width:width - 40,
        height:50,
        borderRadius:5,
        backgroundColor:'#009600',
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

 export default connect(mapStateToProps, mapDispatchToProps)(ClientInformation);