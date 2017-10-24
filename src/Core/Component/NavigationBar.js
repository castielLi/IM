/**
 * Created by Hsu. on 2017/10/18.
 */
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

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class MyNavigationBar extends Component {
    constructor(props){
        super(props)
    }

    static defaultProps = {
    };

    static propTypes = {
    };


    _leftButton = ()=>{
        let {left} = this.props;
        if(!left){
            return null;
        }
        else if(typeof left == 'string'){
            return(
                <View style={styles.leftTextView}>
                    <Text style={styles.leftTextContent}>{left}</Text>
                </View>
            )
        }
        else{
            return(

                <View style={styles.justifyCenter}>
                    <TouchableOpacity style={styles.leftView} onPress={left.func} disabled={left.disabled?true:false}>
                        <Icon name="angle-left" size={35} color="#fff" style={styles.leftIcon}/>
                        {left.text ?
                                <Text style={styles.leftText}>{left.text}</Text> : null
                        }
                    </TouchableOpacity>

                </View>
            )
        }
    };

    _title = ()=>{
        let {heading} = this.props;
        if(!heading){
            return null;
        }
        return {
            title: heading,
            tintColor:'#fff',
        }
    };

    _rightButton = ()=>{

        let {right} = this.props;
        if(!right){
            return null;
        }
        if(right instanceof Array){
            return(
                <View style={styles.rightView}>
                    {right.map((item,index)=>

                        <TouchableOpacity key={index} style={styles.justifyCenter} onPress={item.func} disabled={item.disabled?true:false}>
                            <View style={styles.rightBox}>
                                <Icon name={item.icon} size={25} color="#fff"/>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        else if(right instanceof Object)
        {
            return(
                <TouchableOpacity style={styles.justifyCenter} onPress={right.func} disabled={right.disabled?true:false}>
                    <View style={styles.rightBox}>
                        <Text style={{color:'#fff'}}>{right.text}</Text>
                    </View>
                </TouchableOpacity>
            )
        }

    };

    render() {
        return (
            <NavigationBar
                tintColor="#38373d"
                leftButton={this._leftButton()}
                title={this._title()}
                rightButton={this._rightButton()}
                {...this.props}
            />
        )
    }
}

const styles = StyleSheet.create({
    justifyCenter:{
        justifyContent:'center'
    },
    leftTextView:{
        justifyContent: 'center',
        marginLeft:11
    },
    leftTextContent:{
        fontSize:17,
        textAlignVertical:'center',
        color:'#fff',
        fontWeight:'500',
        letterSpacing:0.5
    },
    leftView:{
        alignItems:'center',
        flexDirection:'row',
        flex:1,
        paddingHorizontal:15
    },
    leftBox:{
        justifyContent: 'center',
        alignItems:'center',
        flex:1,
        paddingLeft:15,
        paddingRight:8
    },
    leftIcon:{
        textAlignVertical:'center',
    },
    leftText:{
        fontSize:14,
        textAlignVertical:'center',
        color:'#fff',
        marginLeft:5
    },
    rightView:{
        alignItems:'center',
        flexDirection:'row'
    },
    rightBox:{
        justifyContent: 'center',
        alignItems:'center',
        flex:1,
        paddingHorizontal:15
    }
});