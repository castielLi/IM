/**
 * Created by Hsu. on 2018/3/1.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Modal,
    TextInput,
    Dimensions,
    Image,
    TouchableHighlight
} from 'react-native';

import AppComponent from '../../../../Core/Component/AppComponent'
let {width, height} = Dimensions.get('window');

export default class ApplyModal extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
            value:'',
            isShowModal:false,
        }
    }

    static defaultProps = {
    };
    static propTypes={
        onConfirm: React.PropTypes.func,
        onCancel: React.PropTypes.func
    };

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.value != this.state.value || nextState.isShowModal != this.state.isShowModal){
            return true;
        }else{
            return false;
        }
    }

    onChange=()=>{
        this.setState({
            isShowModal:!this.state.isShowModal,
            value:'',
        })
    };
    //确认
    _onConfirm=()=>{
        this.props.onConfirm && this.props.onConfirm(this.state.value);
        this.onChange();
    };
    //取消
    _onCancel=()=>{
        this.props.onCancel && this.props.onCancel();
        this.onChange();
    };

    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                onRequestClose={()=>{}}
                visible={this.state.isShowModal}
            >
                <View style={styles.validateModalBox}>
                    <View style={styles.validateModal}>
                        <Text style={styles.modalTitle}>验证申请</Text>
                        <Text style={styles.modalSubTitle}>你需要发送验证请求，并在对方通过后你才能成为朋友</Text>
                        <TextInput
                            style={styles.modalInput}
                            underlineColorAndroid="transparent"
                            placeholder={'最多50个字'}
                            maxLength={50}
                            value={this.state.value}
                            onChangeText={(v)=>{this.setState({value:v})}}
                        />
                        <View style={styles.modalButtonBox}>
                            <TouchableHighlight onPress={()=>this._onCancel()} underlayColor={'#eee'} style={styles.modalTouch}>
                                <View style={styles.modalButton}>
                                    <Text style={styles.modalButtonTxt}>
                                        取消
                                    </Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={()=>this._onConfirm()} underlayColor={'#eee'} style={styles.modalTouch}>
                                <View style={styles.modalButton}>
                                    <Text style={[styles.modalButtonTxt,styles.modalTextColor]}>
                                        发送
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

}
const styles = StyleSheet.create({
    validateModalBox: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    validateModal: {
        width: 350,
        backgroundColor: '#fff',
        padding:15,
        borderRadius:2,
    },
    modalTitle:{
        fontSize:20,
        color:'#000',
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false
    },
    modalSubTitle:{
        color:'#000',
        fontSize:16,
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false,
        marginTop:15
    },
    modalInput:{
        height:40,
        borderBottomColor:'#62b900',
        borderBottomWidth:1,
        padding:0,
        paddingHorizontal:5,
        marginTop:10
    },
    modalButtonBox:{
        backgroundColor:'#fff',
        flexDirection:'row',
        justifyContent:'flex-end',
        paddingTop:10,
    },
    modalTouch:{
        borderRadius:2
    },
    modalButton:{
        paddingHorizontal:10,
        paddingVertical:4,
        justifyContent:'center',
        alignItems:'center',
    },
    modalButtonTxt:{
        fontSize:16,
        color:'#666',
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false,
    },
    modalTextColor:{
        color:'#62b900',
    }
})