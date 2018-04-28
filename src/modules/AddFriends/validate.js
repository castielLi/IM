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
    Switch,Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import AppComponent from '../../Core/Component/AppComponent';
import MyNavigationBar from '../Common/NavigationBar/NavigationBar';
import {bindActionCreators} from 'redux';

let currentObj;


class Validate extends AppComponent {
    constructor(props){
        super(props)
        this.state={
            privilege:false,
            text:''
        }
        currentObj = this;
        this.userController = this.appManagement.getUserLogicInstance();
        this.applyController = this.appManagement.getApplyLogicInstance();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
        this.applyController = undefined;
    }

    static defaultProps = {

    };

    static propTypes = {

    };



    goToSearchNewFriend = () =>{
        this.route.push(this.props,{key:'SearchNewFriend',routeId:'SearchNewFriend',params:{}});

    }

    changePrivilege = (value)=>{
        alert(value)
        this.setState({
            privilege:value
        })
    }

    sendApplyMessage= ()=>{
        let {Applicant,Respondent} = this.props;
        Keyboard.dismiss();

        this.applyController.applyFriend(Applicant,Respondent,this.state.text,(result)=>{
            if(result && result.Result === 1){
                if(result.Data instanceof Object){
                    currentObj.props.changeAddFriendButton(true);
                    currentObj.route.pop(currentObj.props);
                }else if(typeof result.Data === 'string'){
                    currentObj.alert(currentObj.Localization.Validate.ValidateMessage,currentObj.Localization.Common.Info,
                        function(){
                            currentObj.route.pop(currentObj.props);
                        });
                }
            }else{
                currentObj.alert(currentObj.Localization.Validate.ValidateErrorMessage);
            }
        });
    }
    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return(
            <View style={styles.container}>
                <MyNavigationBar
                    heading={this.Localization.Validate.Title}
                    left={{func:()=>{this.route.pop(this.props)}}}
                    right={{func:this.sendApplyMessage,text:this.Localization.Validate.Send}}
                />
                <View style={styles.Box}>
                    <View>
                        <View style={styles.textBox}>
                            <Text style={styles.rowTitle}>{this.Localization.Validate.NeedValidateMessage}</Text>
                        </View>
                        <View style={styles.validateView}>
                            <TextInput
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                                onChangeText={(v)=>{this.setState({text:v})}}
                                value={this.state.text}
                            />
                            {this.state.text.length ? <Icon name="times-circle" size={20} color="#aaa" onPress={()=>{this.setState({text:''})}} style={{marginRight:10}}/> : null}
                        </View>
                    </View>
                    <View style={styles.rowBox}>
                        <View style={styles.textBox}>
                            <Text style={styles.rowTitle}>{this.Localization.Validate.RightOfCircle}</Text>
                        </View>
                        <View style={styles.rowSetting}>
                            <View style={styles.textBox}>
                                <Text style={styles.rowText}>{this.Localization.Validate.ForbidWatchCircle}</Text>
                            </View>
                            <Switch
                                value={this.state.privilege}
                                onValueChange={(value)=>{this.changePrivilege(value)}}
                            />
                        </View>
                    </View>
                </View>
                <Popup ref={ popup => this.popup = popup}/>
                <Loading ref = { loading => this.loading = loading}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#ddd',
        flex:1
    },
    validateView:{
        height:50,
        backgroundColor:'#fff',
      flexDirection:'row',
        alignItems:'center',
    },
    textInput:{
      flex:1,
        fontSize:16,
        paddingLeft:10
    },
    textBox:{
        height:50,
        justifyContent:'center'
    },
    rowTitle:{
        fontSize:14,
        color:'#999',

    },
    rowSetting:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#fff',
        height:50,
        paddingHorizontal:15
    },
    rowText:{
        fontSize:16,
        color:'#000',
    },
});

const mapStateToProps = state => ({
    accountId:state.loginStore.accountMessage.Account,
    accountName:state.loginStore.accountMessage.Nickname,
    avator:state.loginStore.accountMessage.HeadImageUrl,
});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps,mapDispatchToProps)(Validate);