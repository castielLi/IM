/**
 * Created by apple on 2017/12/29.
 */

import Mark from './AppPageMarkEnum';
import * as AppHandles from './AppUIHandle'
import Request from './AppPageRequestEnum'

//controller
import IMController from '../TSController/IMController'
import UserController from '../TSController/UserController'
import ApplyController from '../TSController/ApplyController'

let imController = undefined;
let userController = undefined;
let applyController = undefined;

let Contacts = {};

let ApplyMessage = {};

let ConversationList = {};

let ConversationDetail = {};

let UnReadMessage = {};

export default class AppManagement{

    static Init(){
        imController = IMController.getSingleInstance();
        userController = UserController.getSingleInstance();
        applyController = ApplyController.getSingleInstance();
    }

    static onLoginSuccess(){

        AppManagement.Init();

        userController.init({
            "updateContactHandle":AppHandles.updateContactHandle,
        })

        applyController.init({
            "updateApplyHandle":AppHandles.updateApplyMessageHandle,
            "updateContactHandle":AppHandles.updateContactHandle,
        })

        imController.init({
            "AppKickOutHandle":AppHandles.AppKickOutHandle,
            "AppReceiveMessageHandle":AppHandles.AppReceiveMessageHandle,
            "updateConversListHandle":AppHandles.updateConversListHandle,
            "updateChatRecordHandle":AppHandles.updateChatRecordHandle,
            "updateHeadNameHandle":AppHandles.updateHeadNameHandle,
            "updateChatDisplaySetting":AppHandles.updateChatDisplaySetting,
            "updateContactHandle":AppHandles.updateContactHandle,
            "updateApplyHandle":AppHandles.updateApplyMessageHandle,
            "updateUnReadMessageHandle":AppHandles.updateUnReadMessageHandle,
            "appOnConnect":AppHandles.appOnConnect,
            "appOnClosed":AppHandles.appOnClosed,
            "appOnError":AppHandles.appOnError,
            "appOnWillReconnect":AppHandles.appOnWillReconnect
        })
    }

    static reqeustSource(type,params=undefined){
        switch (type) {
            case Request.ContactList:
                userController.getUserContactList(false);
                break;
            case Request.ConversationList:
                imController.getConversationList();
                break;
            case Request.ConversationDetail:
                if(params == undefined) return;
                var {chatId,group} = params;
                imController.setCurrentConverse(chatId,group);
                break;
            case Request.ApplyMessageList:
                applyController.setApplyFriendRecord();
                break;
            case Request.ConversationDetailHistory:
                if(params == undefined) return;
                var {chatId,group} = params;
                imController.getHistoryChatRecord(chatId,group);
                break;
            case Request.AcceptApplyFriend:
                if(params == undefined) return;
                var {key,callback} = params;
                applyController.acceptFriend(key,callback);
                break;
        }

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
                    UnReadMessage[item] && UnReadMessage[item](type,params);
                }
        }
    }

}