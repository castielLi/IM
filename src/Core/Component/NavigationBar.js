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
                <View style={styles.back}>
                    <View style={{justifyContent: 'center'}}>
                        <Text style={{fontSize:14,textAlignVertical:'center',color:'#fff'}}>{left}</Text>
                    </View>
                </View>
            )
        }
        else{
            return(
                <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>letf.func}>
                    <View style={styles.back}>
                        <View style={{justifyContent: 'center'}}>
                            <Icon name="angle-left" size={35} color="#fff" style={{textAlignVertical:'center',marginRight:8}}/>
                        </View>
                        {letf.text ?
                            <View style={{justifyContent: 'center'}}>
                                <Text style={{fontSize:14,textAlignVertical:'center',color:'#fff'}}>{left.text}</Text>
                            </View> : null
                        }
                    </View>
                </TouchableOpacity>
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
        right.map((item,index)=>{
            return (
                <TouchableOpacity key={index} style={{justifyContent:'center'}} onPress={()=>item.func}>
                    <View style={styles.back}>
                        <View style={{justifyContent: 'center'}}>
                            <Icon name={item.icon} size={35} color="#fff" style={{textAlignVertical:'center',marginRight:8}}/>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        })


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

});