/**
 * Created by apple on 2017/12/29.
 */

import Mark from './AppPageMarkEnum';
import * as AppHandles from './AppUIHandle'
import Request from './AppPageRequestEnum'

//controller
import UserController from '../TSController/UserController'
import ApplyController from '../TSController/ApplyController'
import LoginController from '../TSController/LoginController'
import TabTypeEnum from '../TSController/Enums/TabTypeEnum'
import IMLogicController from '../TSController/IMLogic/IMControllerLogic'
import PageInitReadyEnum from './PageInitReadyEnum'
import AppPushSpecifyPageEnum from './AppPushSpecifyPageEnum'

let userController = undefined;
let applyController = undefined;
let imLogicController = undefined;
let loginController = undefined;

let Contacts = {};

let ApplyMessage = {};

let ConversationList = {};

let ConversationDetail = {};

let UnReadMessage = {};

let ModifyGroupName = {};

let ModifyGroupSetting = {};

let ChangeHeadImage = {};

let ChangeNickname = {};

let ChangeRemark = {};

//todo:socket连接状态具体显示方式
let AppStatus = {};

let InitReady = {"ConversationList":false,"Contact":false}

let ConnectState = false;

let Logined = false;

let root = undefined;

export default class AppManagement{

    static Init(){
        userController = UserController.getSingleInstance();
        applyController = ApplyController.getSingleInstance();
        imLogicController = IMLogicController.getSingleInstance();
        loginController = LoginController.getSingleInstance();
    }

    static setRoot(rootComponent){
        root = rootComponent;
    }

    static loginSuccess(){
        Logined = true;
        tryConnectSocket();
    }

    static initBaseManagers(){

        AppManagement.Init();

        userController.init(
            AppHandles.pageManagement,
            AppManagement.pageInitReady
        )

        applyController.init(
            AppHandles.pageManagement,
        )

        imLogicController.init(
            AppHandles.pageManagement,
            AppManagement.pageInitReady
        )
    }

    static addPageManagement(type,pageName,handle){
        switch(type){
            case Mark.ConversationList:
               if(ConversationList[pageName])
                   return;
               ConversationList[pageName] = handle;
                   break;
            case Mark.ConversationDetail:
                if(ConversationDetail[pageName])
                    return;
                ConversationDetail[pageName] = handle;
                break;
            case Mark.ApplyMessage:
                if(ApplyMessage[pageName])
                    return;
                ApplyMessage[pageName] = handle;
                break;
            case Mark.Contacts:
                if(Contacts[pageName])
                    return;
                Contacts[pageName] = handle;
                break;
            case Mark.UnReadMessage:
                if(UnReadMessage[pageName])
                    return;
                UnReadMessage[pageName] = handle;
                break;
            case Mark.ModifyGroupName:
                if(ModifyGroupName[pageName])
                    return;
                ModifyGroupName[pageName] = handle;
                break;
            case Mark.ModifyGroupSetting:
                if(ModifyGroupSetting[pageName])
                    return;
                ModifyGroupSetting[pageName] = handle;
                break;
            case Mark.AppStatus:
                if(AppStatus[pageName])
                    return;
                AppStatus[pageName] = handle;
                break;
            case Mark.ChangeHeadImage:
                if(ChangeHeadImage[pageName])
                    return;
                ChangeHeadImage[pageName] = handle;
                break;
            case Mark.ChangeNickname:
                if(ChangeNickname[pageName])
                    return;
                ChangeNickname[pageName] = handle;
                break;
            case Mark.ChangeRemark:
                if(ChangeRemark[pageName])
                    return;
                ChangeRemark[pageName] = handle;
        }
    }

    static removePageManagement(type,name){
        switch(type){
            case Mark.ConversationList:
                delete ConversationList[name];
                break;
            case Mark.ConversationDetail:
                delete ConversationDetail[name];
                break;
            case Mark.ApplyMessage:
                delete ApplyMessage[name];
                break;
            case Mark.Contacts:
                delete Contacts[name];
                break;
            case Mark.UnReadMessage:
                delete UnReadMessage[name];
                break;
            case Mark.ModifyGroupName:
                delete ModifyGroupName[name];
                break;
            case Mark.ModifyGroupSetting:
                delete ModifyGroupSetting[name];
                break;
            case Mark.AppStatus:
                delete AppStatus[name];
                break;
            case Mark.ChangeHeadImage:
                delete ChangeHeadImage[name];
                break;
            case Mark.ChangeNickname:
                delete ChangeNickname[name];
                break;
            case Mark.ChangeRemark:
                delete ChangeRemark[name];
                break;
        }
    }

    static dispatchMessageToMarkPage(type,params){
        switch(type){
            case Mark.ConversationList:
                for(let item in ConversationList){
                    ConversationList[item] && ConversationList[item](type,params);
                }
                break;
            case Mark.ConversationDetail:
                for(let item in ConversationDetail){
                    ConversationDetail[item] && ConversationDetail[item](type,params);
                }
                break;
            case Mark.ApplyMessage:
                for(let item in ApplyMessage){
                    ApplyMessage[item] && ApplyMessage[item](type,params);
                }
                break;
            case Mark.Contacts:
                for(let item in Contacts){
                    Contacts[item] && Contacts[item](type,params);
                }
                break;
            case Mark.UnReadMessage:
                for(let item in UnReadMessage){
                    if(params.type == TabTypeEnum.Contact) {
                      if(ApplyMessage["NewFriend"]){
                          return;
                      }
                    }
                    UnReadMessage[item] && UnReadMessage[item](type,params);
                }
                break;
            case Mark.ModifyGroupName:
                for(let item in ModifyGroupName){
                    ModifyGroupName[item] && ModifyGroupName[item](type,params);
                }
                break
            case Mark.ModifyGroupSetting:
                for(let item in ModifyGroupSetting){
                    ModifyGroupSetting[item] && ModifyGroupSetting[item](type,params);
                }
                break
            case Mark.AppStatus:
                for(let item in AppStatus){
                    AppStatus[item] && AppStatus[item](type,params);
                }
                break
            case Mark.ChangeHeadImage:
                for(let item in ChangeHeadImage){
                    ChangeHeadImage[item] && ChangeHeadImage[item](type,params);
                }
                break
            case Mark.ChangeNickname:
                for(let item in ChangeNickname){
                    ChangeNickname[item] && ChangeNickname[item](type,params);
                }
                break
            case Mark.ChangeRemark:
                for(let item in ChangeRemark){
                    ChangeRemark[item] && ChangeRemark[item](type,params);
                }
                break
        }
    }

    static AppLogout(){
        ConnectState = false;
        Logined = false;
    }

    static getAppLoginStates(){
        return Logined;
    }

    static pageInitReady(type){

        switch(type){
            case PageInitReadyEnum.ConversationList:
                InitReady["ConversationList"] = true;
                break;
            case PageInitReadyEnum.Contact:
                InitReady["Contact"] = true;
                break;
        }

        tryConnectSocket();
    }

    static requestPageManagement(type,data){
       switch (type){
           case AppPushSpecifyPageEnum.UserInfo:
               root.route.replaceTop(root,{
                   key:'ClientInformation',
                   routeId: 'ClientInformation',
                   params:{"clientId":data,"scan":true}
               });
               break;
           case AppPushSpecifyPageEnum.UnKnow:
               root.route.replaceTop(root,{
                   key:'ScanCode',
                   routeId: 'ScanUnknow',
                   params:{"data":data}
               });
               break;

       }
    }
}

function tryConnectSocket(){
    for(let item in InitReady){
        if(!InitReady[item]){
            return;
        }
    }

    if(!ConnectState && Logined) {
        imLogicController.initSocket();
        ConnectState = !ConnectState;
    }
}