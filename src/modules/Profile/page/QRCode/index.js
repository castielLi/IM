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
                <QRCode
                    value={this.state.code}
                    size={200}
                    bgColor='black'
                    fgColor='white'/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1
    }
});

const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps,mapDispatchToProps)(QRCodeContent);