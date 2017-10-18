
import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    Image,
    TouchableHighlight,
    Dimensions,
    AsyncStorage,
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNFS from 'react-native-fs'
import * as loginStoreAction from '../../Login/reducer/action';
import * as chatRecordStoreAction from '../../../Core/IM/redux/action';
import {bindActionCreators} from 'redux';
import {closeImDb} from '../../../Core/IM/StoreSqlite';
import {closeAccountDb} from '../../../Core/User/StoreSqlite';

import MyNavigationBar from '../../../Core/Component/NavigationBar'
import NavigationBar from 'react-native-navbar';

let {height,width} = Dimensions.get('window');

class Me extends ContainerComponent {
    constructor(props){
        super(props);
    }


    loginOut = ()=>{
        AsyncStorage.setItem('account','');
        RNFS.moveFile('/data/data/com.im/databases/IM.db','/data/data/com.im/files/'+this.props.accountId+'/database/IM.db');

        this.props.signOut();
        this.props.clearChatRecord();
        closeImDb();
        closeAccountDb();
        this.route.push(this.props,{
            key:'Login',
            routeId: 'Login'
        });
    }
    csFunc = (x)=>{
        alert('测试执行成功'+x)
    }
    render() {
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    heading={'测试tile'}
                    left={{func:()=>{this.csFunc('需要的参数')},text:'注释'}}
                    right={[
                        {func:()=>{this.csFunc('需要的参数')},icon:'search'},
                        {func:()=>{this.csFunc('需要的参数')},icon:'angle-left'}
                        ]}
                />
                <Text>{"你的账户："+this.props.accountId}</Text>
                <Text onPress={this.loginOut}>退出登录</Text>
            </View>
            )
            
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',

    }
});


const mapStateToProps = state => ({
    accountId:state.loginStore.accountMessage.accountId
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(loginStoreAction, dispatch),
    ...bindActionCreators(chatRecordStoreAction, dispatch),

});

 export default connect(mapStateToProps, mapDispatchToProps)(Me);