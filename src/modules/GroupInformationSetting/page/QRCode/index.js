/**
 * Created by apple on 2018/3/15.
 */
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
import ImagePlaceHolder from '../../../../Core/Component/PlaceHolder/ImagePlaceHolder';

class GroupQRCodeContent extends AppComponent {
    constructor(props){
        super(props)
    }

    componentWillMount(){

    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }



    render() {
        let imageUrl = require('../../resource/groupAvator.png');
        return(
            <View style={styles.container}>
                <MyNavigationBar
                    heading={'群二维码'}
                    left={{func:()=>{this.route.pop(this.props)}}}
                />
                <View style={styles.Box}>
                    <View style={styles.QRCodeBox}>
                        <View style={styles.userInfo}>
                            <ImagePlaceHolder style = {styles.userHeadImage} imageUrl = {imageUrl}/>
                            <View style={styles.userDataBox}>
                                <Text style={styles.userName}>{this.props.name}</Text>
                            </View>
                        </View>
                        <View style={styles.QRCode}>
                            <QRCode
                                value={this.props.groupId}
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
export default connect(mapStateToProps,mapDispatchToProps)(GroupQRCodeContent);