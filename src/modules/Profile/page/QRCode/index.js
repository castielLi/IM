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
import ImagePlaceHolder from '../../../../Core/Component/PlaceHolder/ImagePlaceHolder';
let currentObj = undefined;

class QRCodeContent extends AppComponent {
    constructor(props){
        super(props)
        this.userController = this.appManagement.getUserLogicInstance();
        this.state ={
            code:""
        }
    }

    componentDidMount(){
        let currentUser = this.userController.getCurrentAccount();
        let code = this.userController.getAccountQRCode(currentUser.Account)
        this.setState({
            code:code
        })
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
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
                            <ImagePlaceHolder style = {styles.userHeadImage} imageUrl = {this.props.headImageUrl}/>
                            <View style={styles.userDataBox}>
                                <Text style={styles.userName}>{this.props.nickname}</Text>
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
        padding:15,
        backgroundColor:'#fff'
    },
    userInfo:{
        flexDirection:'row'
    },
    userHeadImage:{
        width:54,
        height:54,
        borderRadius: 27,
    },
    userDataBox:{
        marginLeft:10,
        justifyContent:'center'
    },
    userName:{
        color:'#000',
        fontSize:16,
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false
    },
    address:{
        color:'#777',
        fontSize:14,
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false
    },
    QRCode:{
        margin:20
    }
});

const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps,mapDispatchToProps)(QRCodeContent);