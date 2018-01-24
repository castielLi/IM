/**
 * Created by Hsu. on 2017/10/18.
 */
import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableHighlight,
    Dimensions,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as NavigationBottomAction from './reducer/action';

class MyNavigationBar extends Component {
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
                    <TouchableOpacity style={styles.leftView} onPress={()=>{Keyboard.dismiss();left.func();}} disabled={left.disabled?true:false}>
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
        // return {
        //     title: heading,
        //     tintColor:'#fff',
        //     numberOfLines:1
        // }

        return (
                <Text numberOfLines = {1} style={styles.title}>{heading}</Text>

        )
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
                <TouchableOpacity style={styles.justifyCenter} onPress={()=>{Keyboard.dismiss();right.func();}} disabled={right.disabled?true:false}>
                    <View style={styles.rightBox}>
                        <Text style={{color:'#fff'}}>{right.text}</Text>
                    </View>
                </TouchableOpacity>
            )
        }

    };

    render() {
        return (
            <View>
                <NavigationBar
                    tintColor="#38373d"
                    leftButton={this._leftButton()}
                    title={this._title()}
                    rightButton={this._rightButton()}
                    {...this.props}
                >
                </NavigationBar>
                {/*{this.props.NavigationBottomStore ?*/}
                    {/*<View style={{justifyContent:'center',alignItems:'center',height:30}}>*/}
                        {/*<Text style={{}}>Loading...</Text>*/}
                    {/*</View>*/}
                    {/*: null*/}
                {/*}*/}
            </View>
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
    },
    title:{
        fontSize:17,
        textAlignVertical:'center',
        color:'#fff',
        fontWeight:'600',
        maxWidth:200,
    }
});

const mapStateToProps = state => ({
    NavigationBottomStore : state.NavigationBottomStore.isShow,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(NavigationBottomAction, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyNavigationBar);