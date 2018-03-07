/**
 * Created by Hsu. on 2018/3/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Modal,
    View,
    TouchableHighlight,
    Text,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import AppComponent from '../../../../Core/Component/AppComponent';
import MyNavigationBar from '../../../Common/NavigationBar/NavigationBar';
import UserController from '../../../../TSController/UserController';
import Icon from 'react-native-vector-icons/FontAwesome';
let currentObj;
let userController = undefined;
let {width, height} = Dimensions.get('window');

export default class RadioCollection extends AppComponent {
    constructor(props){
        super(props);
        this.state = {
            visible:false
        }
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    static defaultProps = {
        defaultValue:1
    };
    static propTypes={
        onPress: React.PropTypes.func,
    };

    onChange=()=>{
        this.setState({
            visible:!this.state.visible
        })
    };

    _onTouchOption=(value)=>{
        let {onPress} = this.props;
        onPress && onPress(value);
        this.onChange();
    };

    _radioIcon=(value)=>{
        let defaultValue = this.props.defaultValue;
        if(defaultValue == value){
            return <Icon style={styles.radioIcon} name="dot-circle-o" size={20} color="#62b900"/>
        }else {
            return <Icon style={styles.radioIcon} name="circle-o" size={20} color="#999"/>
        }
    };

    render(){
        return (
            <Modal
                animationType='none'
                transparent={true}
                onRequestClose={()=>{}}
                visible={this.state.visible}
            >
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={()=>this.onChange()}>
                        <View style={{position: 'absolute',top: 0,left: 0,width,height}}/>
                    </TouchableWithoutFeedback>
                    <View style={styles.radioModel}>
                        <Text style={styles.title}>性别</Text>
                        <View style={styles.radioBox}>
                            <TouchableHighlight style={styles.radioItemTouch} underlayColor={'#eee'} activeOpacity={0.5} onPress={()=>this._onTouchOption(1)}>
                                <View style={styles.radioItem}>
                                    <Text style={styles.radioText}>男</Text>
                                    {this._radioIcon(1)}
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor={'#eee'} activeOpacity={0.5} onPress={()=>this._onTouchOption(2)}>
                                <View style={styles.radioItem}>
                                    <Text style={styles.radioText}>女</Text>
                                    {this._radioIcon(2)}
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'rgba(0,0,0,.5)',
        justifyContent:'center',
        alignItems:'center'
    },
    radioModel:{
        padding:30,
        backgroundColor:'#fff',
        width:width-100
    },
    title:{
        color:'#000',
        fontSize:24,
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false
    },
    radioBox:{
        marginVertical:15
    },
    radioItemTouch:{
        borderBottomWidth:1,
        borderBottomColor:'#EEE'
    },
    radioItem:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:10,
        paddingVertical:15
    },
    radioText:{
        color:'#000',
        fontSize:18,
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false
    },
    radioIcon:{
        textAlignVertical:'center',
    }

});