
import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Switch
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet'
import * as unReadMessageActions from '../../MainTabbar/reducer/action';
import {bindActionCreators} from 'redux';

import UserController from '../../../TSController/UserController';
import IMControllerLogic from '../../../TSController/IMLogic/IMControllerLogic';
let userController = undefined;
let imControllerLogic = undefined;

let currentObj = undefined;
const options = ['取消','确认删除']
const title = '你确定要删除这位好友么'

class InformationSetting extends AppComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        this.handlePress = this.handlePress.bind(this);
        this.state = {
            notSeeHisZoom:false,
            notSeeMyZoom:false,
            joinBlackList:false,
        }
        currentObj = this;
        userController = UserController.getSingleInstance();
        imControllerLogic = IMControllerLogic.getSingleInstance();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }

    componentWillMount(){
        userController.getUserInfo(this.props.clientId,false,(result)=>{
            let BlackList = result.BlackList ? true : false;
            this.setState({
                joinBlackList:BlackList,
            })
        });
        userController.getUserSetting(this.props.clientId,(result)=>{
            this.setState({
                notSeeHisZoom:result.ScanZoom,
                notSeeMyZoom:result.ReScanZoom,
            })
        })

    }

    //不然他看我朋友圈
    changeNotSeeMyZoom = (value)=>{
        this.setState({
            notSeeMyZoom:value
        });
        userController.modifyScanZoom(this.props.clientId,value)
    };
    //不看她朋友圈
    changeNotSeeHisZoom = (value)=>{
        this.setState({
            notSeeHisZoom:value
        });
        userController.modifyReScanZoom(this.props.clientId,value)
    };
    //黑名单
    changeJoinBlackList = (value)=>{
        this.setState({
            joinBlackList:value
        });
        userController.setBlackList(this.props.clientId,value,(result)=>{
        });
    };


    handlePress(i){
        let {clientId,type} = this.props;
        //删除好友
        if(1 == i){
            currentObj.showLoading();
            userController.removeFriend(this.props.clientId,(result)=>{
                currentObj.hideLoading();
                let pages = currentObj.props.navigator.getCurrentRoutes();
                let target = pages[pages.length - 3];
                currentObj.route.popToSpecialRoute(currentObj.props,target);
            });
            //删除会话列表对应会话
            imControllerLogic.removeConverse(this.props.clientId,false)
        }

    }

    showActionSheet() {
        this.ActionSheet.show()
    }

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    heading={"资料设置"}
                    left={{func:()=>{this.route.pop(this.props)},text:'详细资料'}}
                />
                <View>
                    {/*<TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>this._goToRemarkInfo()} style={{marginTop:15}}>*/}
                        {/*<View  style={styles.remarksBox}>*/}
                            {/*<Text style={styles.remarks}>设置备注和标签</Text>*/}
                            {/*/!*<Text style={styles.arrow}>{'>'}</Text>*!/*/}
                            {/*<Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>*/}
                        {/*</View>*/}
                    {/*</TouchableHighlight>*/}
                    <View style={{marginTop:15,borderBottomWidth:1,borderColor:'#eee'}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>不让他看我朋友圈</Text>
                            <Switch
                                value={this.state.notSeeMyZoom}
                                onValueChange={this.changeNotSeeMyZoom}
                            />
                        </View>
                    </View>
                    <View>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>不看他朋友圈</Text>
                            <Switch
                                value={this.state.notSeeHisZoom}
                                onValueChange={this.changeNotSeeHisZoom}
                            />
                        </View>
                    </View>
                    <View style={{marginTop:15,borderBottomWidth:1,borderColor:'#eee'}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>加入黑名单</Text>
                            <Switch
                                value={this.state.joinBlackList}
                                onValueChange={this.changeJoinBlackList}
                            />
                        </View>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>投诉</Text>
                            <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>this.showActionSheet()} style={styles.sendMessageBox}>
                        <Text style={styles.sendMessage}>删除</Text>
                    </TouchableHighlight>
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={title}
                        options={options}
                        cancelButtonIndex={0}
                        destructiveButtonIndex={1}
                        onPress={this.handlePress}
                    />
                </View>
                <Popup ref={ popup => this.popup = popup}/>
                <Loading ref = { loading => this.loading = loading}/>
            </View>
            )
            
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',

    },
    back:{
        flexDirection:'row',
        alignItems:'center',
        flex:1,
        marginLeft: 10,
    },
    rightButton:{
        color: '#ffffff',
        fontSize: 15,
        marginRight: 10,
        textAlignVertical:'center',
    },
    remarksBox:{
        height:50,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    remarks:{
        fontSize:18,
        color:'#000'
    },
    arrow:{
        fontSize:20,
        color:'#aaa'
    },
    sendMessageBox:{
        height:55,
        borderRadius:5,
        marginTop:15,
        marginHorizontal:20,
        backgroundColor:'#dc0000',
        justifyContent:'center',
        alignItems:'center'
    },
    sendMessage:{
        textAlignVertical:'center',
        color:'#fff',
        fontSize:20,
    }
});


const mapStateToProps = state => ({
    accountId:state.loginStore.accountMessage.Account,
});

const mapDispatchToProps = dispatch => ({

    ...bindActionCreators(unReadMessageActions, dispatch),
});

 export default connect(mapStateToProps, mapDispatchToProps)(InformationSetting);