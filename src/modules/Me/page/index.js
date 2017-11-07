
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
import * as loginStoreAction from '../../Login/reducer/action';
import * as chatRecordStoreAction from '../../../Core/IM/redux/chat/action';
import * as featuresAction from '../../Common/menu/reducer/action';
import {bindActionCreators} from 'redux';
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
                        {func:()=>{this.props.showFeatures()},icon:'list-ul'}
                        ]}
                />
                <Text>{"你的账户："+this.props.accountId}</Text>
                <Text onPress={this.loginOut}>退出登录</Text>
                <Features ref={e => this.features = e} navigator={this.props.navigator}/>
            </View>
            )
            //this.features.getWrappedInstance().changeFeatureState()
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
    ...bindActionCreators(featuresAction, dispatch)
});

 export default connect(mapStateToProps, mapDispatchToProps)(Me);