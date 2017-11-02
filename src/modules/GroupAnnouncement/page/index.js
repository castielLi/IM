
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
    Switch,
    ListView,
    ScrollView
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../../Core/Component/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';

import IM from '../../../Core/IM';
import User from '../../../Core/User';
import {bindActionCreators} from 'redux';


let {height,width} = Dimensions.get('window');

let currentObj = undefined;
let im = new IM();
let user = new User();
class GroupAnnouncement extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.state = {

        };

        currentObj = this;
    }


    componentWillMount(){

    }






    render() {
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'返回'}}
                    heading={"群公告"}
                />
                <ScrollView>
                    <View style={styles.box}>
                        <Text style={styles.content}>{this.props.Description}</Text>
                    </View>
                </ScrollView>
            </View>
            )
            
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',

    },
    box:{
        flex:1,
        padding:10
    },
    content:{
        color: '#000',
        fontSize: 16,
    },



});


const mapStateToProps = state => ({

    accountName:state.loginStore.accountMessage.nick,
    accountId:state.loginStore.accountMessage.accountId
});

const mapDispatchToProps = dispatch => ({


});

 export default connect(mapStateToProps, mapDispatchToProps)(GroupAnnouncement);