
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
import MyNavigationBar from '../../../Core/Component/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';

let {height,width} = Dimensions.get('window');

class NewFriend extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);

    }
    //定义上导航的左按钮
    _leftButton() {
        return  <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>this.route.pop(this.props)}>
            <View style={styles.back}>

                <View style={{justifyContent: 'center'}}>
                    <Icon name="angle-left" size={35} color="#fff" style={{textAlignVertical:'center',marginRight:8}}/>
                </View>

                    <View style={{justifyContent: 'center'}}>
                        <Text style={{fontSize:14,textAlignVertical:'center',color:'#fff'}}>{'通讯录'}</Text>
                    </View>

            </View>
        </TouchableOpacity>
    }
    //定义上导航的标题
    _title() {
        return {
            title: "新的朋友",
            tintColor:'#fff',
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'通讯录'}}
                    heading={"新的朋友"} />
                <View>
                    <View style={styles.listHeaderBox}>
                        <TextInput
                            style={styles.search}
                            underlineColorAndroid = 'transparent'
                        >
                        </TextInput>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.itemBox}>
                            <View style={styles.basicBox}>
                                <Image style={styles.headPic} source={require('../resource/other.jpg')}></Image>
                                <View style={styles.basicBoxRight}>
                                    <Text style={styles.name}>张彤</Text>
                                    <Text style={styles.description}>我是张彤</Text>
                                </View>
                            </View>
                            <Text style={styles.arrow}>{'已添加'}</Text>
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
        flexDirection:'row',
        flex:1,
        marginLeft: 10,
    },
    rightButton:{
        color: '#ffffff',
        fontSize: 15,
        marginRight: 10,
        textAlignVertical:'center',
    },

    listHeaderBox:{
        backgroundColor: '#ddd',
        alignItems: 'center',
        height:50,
        padding:10
    },
    search:{
        flex:1,
        width:width-20,
        backgroundColor:'#fff',
        borderRadius:5,
        color:'#000'
    },
    itemBox:{
        height:60,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    basicBox:{
        flexDirection:'row',
    },
    basicBoxRight:{
        marginLeft:15,
    },
    headPic:{
        height:40,
        width:40
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
    
});

const mapDispatchToProps = dispatch => ({

});

 export default connect(mapStateToProps, mapDispatchToProps)(NewFriend);