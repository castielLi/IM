
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
import Icon from 'react-native-vector-icons/FontAwesome';


let {height,width} = Dimensions.get('window');

class SearchNewFriend extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.state = {
            text:''
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
            title: "新的朋友",
            tintColor:'#fff',
        }
    }

    backToAddFriends = ()=>{
        this.route.pop(this.props);

    }
    render() {
        return (
            <View style={styles.container}>
                <View>
                    <View style={[styles.listHeaderBox,{paddingTop:Platform.OS === 'ios'?36:10}]}>
                        <View style={styles.searchBox}>
                            <Icon name="search" size={20} color="#aaa" />
                            <TextInput
                                style={styles.search}
                                underlineColorAndroid = 'transparent'
                                autoFocus = {true}
                                placeholder = '微信号/手机号'
                                onChangeText={(v)=>{this.setState({text:v})}}
                            >
                            </TextInput>
                        </View>
                        <Text style={styles.cancel} onPress={this.backToAddFriends}>取消</Text>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')}>
                        <View  style={styles.itemBox}>
                            <View style={styles.greenBox}>
                                <Icon name="search" size={20} color="#fff" />
                            </View>
                            <Text style={{marginLeft:10}}>
                                <Text style={{fontSize:18,color:'#000'}}>搜索：</Text>
                                <Text style={{fontSize:16,color:'green'}}>{this.state.text}</Text>
                            </Text>
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
    cancel:{
        width:60,
        textAlignVertical:'center',
        textAlign:'center',
        fontSize:18,
        color:'green'
    },
    search:{
        flex:1,
        backgroundColor:'#fff',
        color:'#000',
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
    
});

const mapDispatchToProps = dispatch => ({

});

 export default connect(mapStateToProps, mapDispatchToProps)(SearchNewFriend);