/**
 * Created by Hsu. on 2017/10/20.
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
    Switch
} from 'react-native';

import ContainerComponent from '../../Core/Component/ContainerComponent';
import MyNavigationBar from '../../Core/Component/NavigationBar';


export default class Validate extends ContainerComponent {
    constructor(props){
        super(props)
    }

    static defaultProps = {

    };

    static propTypes = {

    };



    goToSearchNewFriend = () =>{
        this.route.push(this.props,{key:'SearchNewFriend',routeId:'SearchNewFriend',params:{}});

    }

    render() {
        return(
            <View style={styles.container}>
                <MyNavigationBar
                    heading={'验证申请'}
                    left={{func:()=>{this.route.pop(this.props)}}}

                />
                <View>
                    <View>
                        <Text>你需要发送验证申请，等对方通过</Text>
                        <View>
                            <TextInput/>
                            <Text>X</Text>
                        </View>
                    </View>
                    <View>
                        <Text>朋友圈权限</Text>
                        <View>
                            <Text>不让他(她)看我的朋友圈</Text>
                            <Switch/>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{

    },
});