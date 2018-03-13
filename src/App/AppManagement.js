/**
 * Created by apple on 2017/12/29.
 */

import Mark from './Enum/AppPageMarkEnum';
import TabTypeEnum from '../TSController/Enums/TabTypeEnum'
import PageInitReadyEnum from './Enum/PageInitReadyEnum'
import AppPushSpecifyPageEnum from './Enum/AppPushSpecifyPageEnum'


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
        this.AppStatus = {};
        this.InitReady = {"ConversationList":false,"Contact":false}
        this.ConnectState = false;
        this.Logined = false;
        this.root = undefined;
        this.userController = undefined;
        this.applyController = undefined;
        this.imLogicController = undefined;
        this.loginController = undefined;
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
        }
    }

    dispatchMessageToMarkPage(type,params){
        switch(type){
            case Mark.ConversationList:
                for(let item in this.ConversationList){
                    this.ConversationList[item] && this.ConversationList[item](type,params);
                }
                break;
            case Mark.ConversationDetail:
                for(let item in this.ConversationDetail){
                    this.ConversationDetail[item] && this.ConversationDetail[item](type,params);
                }
                break;
            case Mark.ApplyMessage:
                for(let item in this.ApplyMessage){
                    this.ApplyMessage[item] && this.ApplyMessage[item](type,params);
                }
                break;
            case Mark.Contacts:
                for(let item in this.Contacts){
                    this.Contacts[item] && this.Contacts[item](type,params);
                }
                break;
            case Mark.UnReadMessage:
                for(let item in this.UnReadMessage){
                    if(params.type == TabTypeEnum.Contact) {
                      if(ApplyMessage["NewFriend"]){
                          return;
                      }
                    }
                    this.UnReadMessage[item] && this.UnReadMessage[item](type,params);
                }
                break;
            case Mark.ModifyGroupName:
                for(let item in this.ModifyGroupName){
                    this.ModifyGroupName[item] && this.ModifyGroupName[item](type,params);
                }
                break
            case Mark.ModifyGroupSetting:
                for(let item in this.ModifyGroupSetting){
                    this.ModifyGroupSetting[item] && this.ModifyGroupSetting[item](type,params);
                }
                break
            case Mark.AppStatus:
                for(let item in this.AppStatus){
                    this.AppStatus[item] && this.AppStatus[item](type,params);
                }
                break
            case Mark.ChangeHeadImage:
                for(let item in this.ChangeHeadImage){
                    this.ChangeHeadImage[item] && this.ChangeHeadImage[item](type,params);
                }
                break
            case Mark.ChangeNickname:
                for(let item in this.ChangeNickname){
                    this.ChangeNickname[item] && this.ChangeNickname[item](type,params);
                }
                break
            case Mark.ChangeRemark:
                for(let item in ChangeRemark){
                    this.ChangeRemark[item] && this.ChangeRemark[item](type,params);
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
                this.InitReady["ConversationList"] = true;
                break;
            case PageInitReadyEnum.Contact:
                this.InitReady["Contact"] = true;
                break;
        }
        this.checkNeedConnectSocket();
    }

    systemLogined(){
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

    requestPageManagement(type,data){
       switch (type){
           case AppPushSpecifyPageEnum.UserInfo:
               this.root.route.replaceTop(this.root,{
                   key:'ClientInformation',
                   routeId: 'ClientInformation',
                   params:{"clientId":data,"scan":true}
               });
               break;
           case AppPushSpecifyPageEnum.UnKnow:
               this.root.route.replaceTop(this.root,{
                   key:'ScanCode',
                   routeId: 'ScanUnknow',
                   params:{"data":data}
               });
               break;
       }
    }
}

