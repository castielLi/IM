
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
    StatusBar
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
import Features from '../../Common/menu/features';

import MyNavigationBar from '../../../Core/Component/NavigationBar'
import IM from '../../../Core/IM'
let {height,width} = Dimensions.get('window');
let im = new IM();

class Me extends ContainerComponent {
    constructor(props){
        super(props);

        this.state = {
            showFeatures:false,//显示功能块组件

        };
    }


    loginOut = ()=>{
        this.props.signOut();
    }
    csFunc = (x)=>{
        alert('测试执行成功'+x)
    }

    changeShowFeature=(newState)=>{
        this.setState({showFeatures:newState});
    }
    render() {
        return (
            <View style={styles.container}>
                {/*<StatusBar*/}
                    {/*translucent={false}*/}
                    {/*animated={false}*/}
                    {/*hidden={false}*/}
                    {/*backgroundColor="blue"*/}
                    {/*barStyle="light-content" />*/}
                <MyNavigationBar
                    left = {'云信'}
                    right={[
                        {func:()=>{alert('搜索')},icon:'search'},
                        {func:()=>{this.setState({showFeatures:!this.state.showFeatures})},icon:'list-ul'}
                        ]}
                />
                <Text>{"你的账户："+this.props.accountId}</Text>
                <Text onPress={this.loginOut}>退出登录</Text>
                {
                    this.state.showFeatures?<Features changeShowFeature = {this.changeShowFeature} showFeatures = {this.state.showFeatures} navigator={this.props.navigator}></Features>:null
                }
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