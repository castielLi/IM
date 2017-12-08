
import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Switch
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet'

import * as unReadMessageActions from '../../MainTabbar/reducer/action';
import {bindActionCreators} from 'redux';
import SettingController from '../../../Logic/Setting/settingController';
import ContactControlller from '../../../Logic/Contact/contactController';


let settingController = new SettingController();
let contactControlller = new ContactControlller();

let currentObj;

const options = ['取消','确认删除']
const title = '你确定要删除这位好友么'

class InformationSetting extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.handlePress = this.handlePress.bind(this);
        this.state = {
            notSeeHisZoom:false,
            notSeeMyZoom:false,
            joinBlackList:false,
        }
        currentObj = this;
    }
    //定义上导航的左按钮
    _leftButton() {
        return  <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>this.route.pop(this.props)}>
            <View style={styles.back}>

                <Icon name="angle-left" size={30} color="#fff" style={{textAlignVertical:'center',marginRight:8}}/>

                <Text style={{fontSize:16,textAlignVertical:'center',color:'#fff'}}>{'详细资料'}</Text>
            </View>
        </TouchableOpacity>
    }
    //定义上导航的标题
    _title() {
        return {
            title: "资料设置",
            tintColor:'#fff',
        }
    }

    componentWillMount(){
        // this.props.changeTabBar(0)

        let setting = settingController.getIsBlackList(this.props.client);
        let value = setting.BlackList == "false"||setting.BlackList == false?false:true;
        this.setState({
            joinBlackList:value,
        })

    }

    changeNotSeeMyZoom = ()=>{
        this.setState({
            notSeeMyZoom:!this.state.notSeeMyZoom
        })
    }
    changeNotSeeHisZoom = ()=>{
        this.setState({
            notSeeHisZoom:!this.state.notSeeHisZoom
        })
    }
    changeJoinBlackList = (value)=>{
        this.setState({
            joinBlackList:value
        })


        currentObj.showLoading()
        if(!value){
            let params = {  "Applicant":currentObj.props.accountId,
                            "Account":currentObj.props.client,
                            "IsDelete":false}
            settingController.removeBlackMember(params,()=>{
                currentObj.hideLoading()
            })

        }else{
            let params = {"Applicant":currentObj.props.accountId,"Account":currentObj.props.client}
            settingController.addBlackMember(params,()=>{
                currentObj.hideLoading()
            })
        }


    }


    handlePress(i){
        let {client,type,accountId} = this.props;
        //删除好友
        if(1 == i){
            currentObj.showLoading();
            let params = {"Applicant":accountId,"Friend":client};
            contactControlller.removeFriend(params,(results)=>{
                currentObj.hideLoading();
                if(results.success){

                    let pages = currentObj.props.navigator.getCurrentRoutes();
                    let target = pages[pages.length - 3];

                    currentObj.route.popToSpecialRoute(currentObj.props,target);
                }else{
                    alert("http请求出错")
                }
            })

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
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')} style={{marginTop:15}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>设置备注和标签</Text>
                            {/*<Text style={styles.arrow}>{'>'}</Text>*/}
                            <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                        </View>
                    </TouchableHighlight>
                    <View style={{marginTop:15,borderBottomWidth:1,borderColor:'#eee'}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>不让他看我朋友圈</Text>
                            <Switch
                                value={this.state.notSeeMyZoom}
                                onValueChange={this.changeNotSeeMyZoom}
                            ></Switch>
                        </View>
                    </View>
                    <View>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>不看他朋友圈</Text>
                            <Switch
                                value={this.state.notSeeHisZoom}
                                onValueChange={this.changeNotSeeHisZoom}
                            ></Switch>
                        </View>
                    </View>
                    <View style={{marginTop:15,borderBottomWidth:1,borderColor:'#eee'}}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>加入黑名单</Text>
                            <Switch
                                value={this.state.joinBlackList}
                                onValueChange={this.changeJoinBlackList}
                            ></Switch>
                        </View>
                    </View>
                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')}>
                        <View  style={styles.remarksBox}>
                            <Text style={styles.remarks}>投诉</Text>
                            {/*<Text style={styles.arrow}>{'>'}</Text>*/}
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
    accountId:state.loginStore.accountMessage.accountId,
    relations:state.relationStore,
});

const mapDispatchToProps = dispatch => ({

    ...bindActionCreators(unReadMessageActions, dispatch),
});

 export default connect(mapStateToProps, mapDispatchToProps)(InformationSetting);