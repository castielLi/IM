/**
 * Created by apple on 2017/12/29.
 */

import Mark from './Enum/AppPageMarkEnum';
import TabTypeEnum from '../TSController/Enums/TabTypeEnum'
import PageInitReadyEnum from './Enum/PageInitReadyEnum'
import AppPushSpecifyPageEnum from './Enum/AppPushSpecifyPageEnum'
import {Alert} from 'react-native'
import AppPageMarkEnum from './Enum/AppPageMarkEnum'
import {InitState,NoTokenState,WaitValidateTokenState,TokenValidateSuccessState
    ,TokenValidateFailedState,LogoutState
    ,LoginedState}
from './AppManagementState'
import AppTokenStateEnum from './Enum/AppTokenStateEnum';
import DeviceInfo from 'react-native-device-info';
let currentApp = undefined;

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

export default class AppManagement{

    constructor(){
        if (__instance()) return __instance();

        __instance(this);
        this.state = null;
        this.Contacts = {};
        this.ApplyMessage = {};
        this.ConversationList = {};
        this.ConversationDetail = {};
        this.UnReadMessage = {};
        this.ModifyGroupName = {};
        this.ModifyGroupSetting = {};
        this.ChangeHeadImage = {};
        this.ChangeNickname = {};
        this.ChangeRemark = {};
        this.ConversationDetailBackgroundImage = {};
        this.AppStatus = {};
        this.InitReady = {"ConversationList":false,"Contact":false}
        this.ConnectState = false;
        this.Logined = false;
        this.root = undefined;
        this.userController = undefined;
        this.applyController = undefined;
        this.imLogicController = undefined;
        this.loginController = undefined;
        this.validateManager = undefined;
        this.normalNetwork = true;
        this.uniqueId = DeviceInfo.getUniqueID();
        let initState = new InitState()
        initState.stateOpreation(this);
        currentApp = this;
    }

    setRoot(rootComponent){
        this.root = rootComponent;
    }

    addPageManagement(type,pageName,handle){
        switch(type){
            case Mark.ConversationList:
               if(this.ConversationList[pageName])
                   return;
                this.ConversationList[pageName] = handle;
                   break;
            case Mark.ConversationDetail:
                if(this.ConversationDetail[pageName])
                    return;
                this.ConversationDetail[pageName] = handle;
                break;
            case Mark.ApplyMessage:
                if(this.ApplyMessage[pageName])
                    return;
                this.ApplyMessage[pageName] = handle;
                break;
            case Mark.Contacts:
                if(this.Contacts[pageName])
                    return;
                this.Contacts[pageName] = handle;
                break;
            case Mark.UnReadMessage:
                if(this.UnReadMessage[pageName])
                    return;
                this.UnReadMessage[pageName] = handle;
                break;
            case Mark.ModifyGroupName:
                if(this.ModifyGroupName[pageName])
                    return;
                this.ModifyGroupName[pageName] = handle;
                break;
            case Mark.ModifyGroupSetting:
                if(this.ModifyGroupSetting[pageName])
                    return;
                this.ModifyGroupSetting[pageName] = handle;
                break;
            case Mark.AppStatus:
                if(this.AppStatus[pageName])
                    return;
                this.AppStatus[pageName] = handle;
                break;
            case Mark.ChangeHeadImage:
                if(this.ChangeHeadImage[pageName])
                    return;
                this.ChangeHeadImage[pageName] = handle;
                break;
            case Mark.ChangeNickname:
                if(this.ChangeNickname[pageName])
                    return;
                this.ChangeNickname[pageName] = handle;
                break;
            case Mark.ChangeRemark:
                if(this.ChangeRemark[pageName])
                    return;
                this.ChangeRemark[pageName] = handle;
            case Mark.ConversationDetailBackgroundImage:
                if(this.ConversationDetailBackgroundImage[pageName])
                    return;
                this.ConversationDetailBackgroundImage[pageName] = handle;
                break
        }
    }

    removePageManagement(type,name){
        switch(type){
            case Mark.ConversationList:
                delete this.ConversationList[name];
                break;
            case Mark.ConversationDetail:
                delete this.ConversationDetail[name];
                break;
            case Mark.ApplyMessage:
                delete this.ApplyMessage[name];
                break;
            case Mark.Contacts:
                delete this.Contacts[name];
                break;
            case Mark.UnReadMessage:
                delete this.UnReadMessage[name];
                break;
            case Mark.ModifyGroupName:
                delete this.ModifyGroupName[name];
                break;
            case Mark.ModifyGroupSetting:
                delete this.ModifyGroupSetting[name];
                break;
            case Mark.AppStatus:
                delete this.AppStatus[name];
                break;
            case Mark.ChangeHeadImage:
                delete this.ChangeHeadImage[name];
                break;
            case Mark.ChangeNickname:
                delete this.ChangeNickname[name];
                break;
            case Mark.ChangeRemark:
                delete this.ChangeRemark[name];
                break;
            case Mark.ConversationDetailBackgroundImage:
                delete this.ConversationDetailBackgroundImage[name];
                break
        }
    }

    dispatchMessageToMarkPage(type,params){
        switch(type){
            case Mark.AppKickOutHandle:
                Alert.alert(
                    '下线通知',
                    "该账号在其他设备上登录,请确认是本人操作并且确保账号安全!",
                    [
                        {text: '确定', onPress: () => {
                            currentApp.root.root.ToLogin();
                        }},
                        {text: '不是本人操作',style:{color:"red"}, onPress: () => {
                            currentApp.root.root.ToLogin();
                        }},
                    ]);
                break;
            case Mark.ConversationList:
                for(let item in currentApp.ConversationList){
                    currentApp.ConversationList[item] && currentApp.ConversationList[item](type,params);
                }
                break;
            case Mark.ConversationDetail:
                for(let item in currentApp.ConversationDetail){
                    currentApp.ConversationDetail[item] && currentApp.ConversationDetail[item](type,params);
                }
                break;
            case Mark.ApplyMessage:
                for(let item in currentApp.ApplyMessage){
                    currentApp.ApplyMessage[item] && currentApp.ApplyMessage[item](type,params);
                }
                break;
            case Mark.Contacts:
                for(let item in currentApp.Contacts){
                    currentApp.Contacts[item] && currentApp.Contacts[item](type,params);
                }
                break;
            case Mark.UnReadMessage:
                for(let item in currentApp.UnReadMessage){
                    if(params.type == TabTypeEnum.Contact) {
                      if(this.ApplyMessage["NewFriend"]){
                          return;
                      }
                    }
                    currentApp.UnReadMessage[item] && currentApp.UnReadMessage[item](type,params);
                }
                break;
            case Mark.ModifyGroupName:
                for(let item in currentApp.ModifyGroupName){
                    currentApp.ModifyGroupName[item] && currentApp.ModifyGroupName[item](type,params);
                }
                break
            case Mark.ModifyGroupSetting:
                for(let item in currentApp.ModifyGroupSetting){
                    currentApp.ModifyGroupSetting[item] && currentApp.ModifyGroupSetting[item](type,params);
                }
                break
            case Mark.AppStatus:
                for(let item in currentApp.AppStatus){
                    currentApp.AppStatus[item] && currentApp.AppStatus[item](type,params);
                }
                break
            case Mark.ChangeHeadImage:
                for(let item in currentApp.ChangeHeadImage){
                    currentApp.ChangeHeadImage[item] && currentApp.ChangeHeadImage[item](type,params);
                }
                break
            case Mark.ChangeNickname:
                for(let item in currentApp.ChangeNickname){
                    currentApp.ChangeNickname[item] && currentApp.ChangeNickname[item](type,params);
                }
                break
            case Mark.ChangeRemark:
                for(let item in currentApp.ChangeRemark){
                    currentApp.ChangeRemark[item] && currentApp.ChangeRemark[item](type,params);
                }
                break
            case Mark.ConversationDetailBackgroundImage:
                for(let item in currentApp.ConversationDetailBackgroundImage){
                    currentApp.ConversationDetailBackgroundImage[item] && currentApp.ConversationDetailBackgroundImage[item](type,params);
                }
                break
        }
    }

    setState(state){
        this.state = state;
    }

    pageInitReady(type){
        switch(type){
            case PageInitReadyEnum.ConversationList:
                currentApp.InitReady["ConversationList"] = true;
                break;
            case PageInitReadyEnum.Contact:
                currentApp.InitReady["Contact"] = true;
                break;
        }
        currentApp.checkNeedConnectSocket();
    }

    dispatchAppTokenState(type){
        switch (type){
            case AppTokenStateEnum.NoToken:
                let noToken = new NoTokenState()
                noToken.stateOpreation(currentApp);
                break;
            case AppTokenStateEnum.WaitValidateToken:
                let waitValidateToken = new WaitValidateTokenState()
                waitValidateToken.stateOpreation(currentApp);
                break;
            case AppTokenStateEnum.ValidateTokenSuccess:
                let validateSuccess = new TokenValidateSuccessState()
                validateSuccess.stateOpreation(currentApp);
                break;
            case AppTokenStateEnum.ValidateTokenFailed:
                let validateFailed = new TokenValidateFailedState()
                validateFailed.stateOpreation(currentApp);
                break;
        }
    }

    systemLoginSuccess(){
        this.checkNeedConnectSocket();
    }

    checkNeedConnectSocket(){
        if(this.Logined) {
            for (let item in this.InitReady) {
                if (!this.InitReady[item]) {
                    return;
                }
            }

            if(!this.ConnectState) {
                this.imLogicController.initSocket();
                this.ConnectState = true;
            }
        }
    }

    systemLogin(){
        let loginState = new LoginedState();
        loginState.stateOpreation(this);
    }

    systemLogout(){
        let logoutState = new LogoutState()
        logoutState.stateOpreation(this);
    }

    requestPageManagement(type,data){
       switch (type){
           case AppPushSpecifyPageEnum.UserInfo:
               currentApp.root.route.replaceTop(currentApp.root,{
                   key:'ClientInformation',
                   routeId: 'ClientInformation',
                   params:{"clientId":data,"scan":true}
               });
               break;
           case AppPushSpecifyPageEnum.UnKnow:
               currentApp.root.route.replaceTop(currentApp.root,{
                   key:'ScanCode',
                   routeId: 'ScanUnknow',
                   params:{"data":data}
               });
               break;
       }
    }
}

