
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
import {bindActionCreators} from 'redux';
import {closeImDb} from '../../../Core/IM/StoreSqlite';
import {closeAccountDb} from '../../../Core/User/StoreSqlite';

let {height,width} = Dimensions.get('window');

class Me extends ContainerComponent {
    constructor(props){
        super(props);
    }


    loginOut = ()=>{
        AsyncStorage.setItem('accountId','');
        if(Platform.OS === 'android'){
            RNFS.moveFile('/data/data/com.im/databases/Account.db','/data/data/com.im/files/'+this.props.accountId+'/Account.db');
            RNFS.moveFile('/data/data/com.im/databases/IM.db','/data/data/com.im/files/'+this.props.accountId+'/IM.db');
        }


        this.props.signOut();
        closeImDb();
        closeAccountDb();
        this.route.push(this.props,{
            key:'Login',
            routeId: 'Login'
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <Text onPress={this.loginOut}>退出登录</Text>
            </View>
            )
            
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        justifyContent:'center',
        alignItems:'center'
    }
});


const mapStateToProps = state => ({
    accountId:state.loginStore.accountMessage.accountId
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(loginStoreAction, dispatch),

});

 export default connect(mapStateToProps, mapDispatchToProps)(Me);