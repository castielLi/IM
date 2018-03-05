/**
 * Created by apple on 2018/3/5.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Switch,Keyboard
} from 'react-native';
import {connect} from 'react-redux';
import AppComponent from '../../../../Core/Component/AppComponent';
import QRCode from 'react-native-qrcode';
import MyNavigationBar from '../../../Common/NavigationBar/NavigationBar';
import UserController from '../../../../TSController/UserController';
let currentObj;
let userController = undefined;

class QRCodeContent extends AppComponent {
    constructor(props){
        super(props)
        userController = UserController.getSingleInstance();
        this.state = {
            code:"wg003722"
        }
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }



    render() {
        return(
            <View style={styles.container}>
                <MyNavigationBar
                    heading={'二维码'}
                    left={{func:()=>{this.route.pop(this.props)}}}
                />
                <View style={styles.Box}>
                    <View style={styles.QRCodeBox}>
                        <View style={styles.userInfo}>
                            <Image style={styles.userHeadImage}/>
                            <View style={styles.userDataBox}>
                                <Text style={styles.userName}>Z</Text>
                                <Text style={styles.address}>中国</Text>
                            </View>
                        </View>
                        <View style={styles.QRCode}>
                            <QRCode
                                value={this.state.code}
                                size={250}
                                bgColor='black'
                                fgColor='white'/>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#2c2c2c',
        flex:1,
    },
    Box:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    QRCodeBox:{
        padding:10,
        backgroundColor:'#fff'
    },
    userInfo:{
        flexDirection:'row'
    },
    userHeadImage:{
        width:50,
        height:50,
    },
    userDataBox:{
        marginLeft:10,
        justifyContent:'center'
    },
    userName:{

    }
});

const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps,mapDispatchToProps)(QRCodeContent);