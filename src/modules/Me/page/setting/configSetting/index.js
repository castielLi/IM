/**
 * Created by apple on 2018/3/19.
 */
import React,{Component}from 'react';
import {View,TextInput,Text,Image,Keyboard,TouchableOpacity,StyleSheet,Dimensions,Alert}from 'react-native';
import {checkDeviceHeight,checkDeviceWidth} from '../../../../../Core/Helper/UIAdapter';
import AppComponent from '../../../../../Core/Component/AppComponent';
import MyNavigationBar from '../../../../Common/NavigationBar/NavigationBar';

export default class ConfigSetting extends AppComponent {
    constructor(props) {
        super(props);

        this.state = {
            configSetting:''
        };

        this.finished = this.finished.bind(this);
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    finished = ()=>{

    }

    render(){
        return (
            <View style= {styles.container}>
                <MyNavigationBar
                    left = {{func:()=>{this.route.pop(this.props)}}}
                    heading={'修改配置文件'}
                    right={{func:this.finished,text:'完成'}}
                />
                <View>
                    <View style={styles.textBox}>
                        <Text style={styles.rowTitle}>输入配置地址</Text>
                    </View>
                    <View style={styles.validateView}>
                        <TextInput
                            autoFocus={true}
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            onChangeText={(v)=>{this.setState({configSetting:v})}}
                            value={this.state.configSetting}
                        />
                        {this.state.configSetting.length ? <Icon name="times-circle" size={20} color="#aaa" onPress={()=>{this.setState({configSetting:''})}} style={{marginRight:10}}/> : null}
                    </View>
                </View>
            </View>

        )
    }

}

function mapStateToProps(store) {
    return {
        loading:store.loginIn.loading
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ebebeb',
    },
    goBack:{
        fontSize:checkDeviceHeight(32),
        color:'#0ebe0c',
    },
    goBackBtn:{
        alignSelf:'flex-start',
        marginLeft:checkDeviceWidth(20),
        marginTop:checkDeviceHeight(35),
    },
    loginTitle:{
        fontSize:checkDeviceHeight(50),
        marginTop:checkDeviceHeight(20),
        color:'#333333',
        marginBottom:checkDeviceHeight(110),
    },
    content:{
        flex:1,
        alignItems:'center',
        width:Dimensions.get('window').width - checkDeviceHeight(80),

    },
    area:{
        width:Dimensions.get('window').width - checkDeviceHeight(80),
        flexDirection:'row',
        marginBottom:checkDeviceWidth(30),
        alignItems:'center',
    },
    inputBox:{
        height:checkDeviceHeight(80),
        width:Dimensions.get('window').width - checkDeviceWidth(80),
        flexDirection:'row',
        alignItems:'center',
        borderRadius:10,
        borderWidth:1,
        borderColor:'#ddddde',
        marginBottom:checkDeviceWidth(30),
    },
    areaTitle:{
        fontSize:checkDeviceHeight(30),
        color:'#333333',
        marginRight:checkDeviceWidth(35),
    },
    country:{
        fontSize:checkDeviceHeight(30),
        color:'#333333',
    },
    rightLogo:{
        width:checkDeviceWidth(15),
        height:checkDeviceHeight(30),
        resizeMode:'contain',
        position:'absolute',
        right:0,
    },
    loginImage:{
        width:checkDeviceWidth(35),
        height:checkDeviceHeight(45),
        borderRightWidth:1,
        borderColor:'#ddddde',
        resizeMode:'stretch',
    },
    imageBox:{
        width:checkDeviceWidth(125),
        height:checkDeviceHeight(80),
        alignItems:'center',
        marginRight:checkDeviceWidth(35),
        justifyContent:'center',
        borderRightWidth:1,
        borderColor:'#ddddde',
    },
    NumberBefore:{
        color:'#333333',
        fontSize:checkDeviceHeight(30),
    },
    textInput:{
        padding:0,
        fontSize:checkDeviceHeight(30),
        flex:1,
    },
    codeBtn:{
        width:checkDeviceWidth(120),
        height:checkDeviceHeight(50),
        borderWidth:1,
        borderColor:'#333333',
        borderRadius:3,
        marginRight:checkDeviceWidth(20),
        justifyContent:'center',
        alignItems:'center',
    },
    information:{
        color:'#333333',
        fontSize:checkDeviceHeight(20),
    },
    changeLogin:{
        color:'#6e7c99',
        fontSize:checkDeviceHeight(28),
        marginBottom:checkDeviceHeight(60),
    },
    loginText:{
        color:'white',
        fontSize:checkDeviceHeight(36),
    },
    passWordRules:{
        fontSize:checkDeviceHeight(24),
        color:'#bebebe',
        marginBottom:checkDeviceHeight(30)
    },
    Login:{
        width:Dimensions.get('window').width - checkDeviceWidth(80),
        height:checkDeviceHeight(90),
        backgroundColor:'#1aad19',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        marginTop:checkDeviceHeight(30),
        marginBottom:checkDeviceHeight(470),
    },
    footer:{
        flexDirection:'row',
        alignItems:'center',
    },
    footerText:{
        color:'#6e7c99',
        fontSize:checkDeviceHeight(28),
    },
    validateView:{
        height:40,
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
    },
    textInput:{
        flex:1,
        fontSize:17,
        paddingLeft:5,
    },
    textBox:{
        height:30,
        justifyContent:'center'
    },
    rowTitle:{
        fontSize:14,
        color:'#999',

    },
    rowSetting:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#fff',
        height:50,
        paddingHorizontal:15
    },
    rowText:{
        fontSize:16,
        color:'#000',
    },
});
