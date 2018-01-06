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

let Contact = {};

let ApplyMessage = {};

let ConversationList = {};

let ConversationDetail = {};

export default class AppManagement{

    static Init(){
        imController = IMController.getSingleInstance();
        userController = new UserController.getSingleInstance();
        applyController = new ApplyController.getSingleInstance();
    }

    static onLoginSuccess(){

        AppManagement.Init();

        userController.init({
            "updateContactList":AppHandles.updateContactHandle
        })

        applyController.init({
            "updateApplyMessageList":AppHandles.updateApplyMessageHandle
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
            "appOnConnect":AppHandles.appOnConnect,
            "appOnClosed":AppHandles.appOnClosed,
            "appOnError":AppHandles.appOnError,
            "appOnWillReconnect":AppHandles.appOnWillReconnect
        })
    }

    static reqeustSource(type,params=undefined){
        switch (type) {
            case Request.ContactList:
                userController.getContactList(false,false)
                break;
            case Request.ConversationList:
                imController.getConversationList();
                break;
            case Request.ConversationDetail:
                if(params == undefined) return;
                let {chatId,group} = params;
                imController.setCurrentConverse(chatId,group);
                break;
            case Request.ApplyMessageList:
                applyController.setApplyFriendRecord()
                break;
            case Request.ConversationDetailHistory:
                if(params == undefined) return;
                let {chatId,group} = params;
                imController.getHistoryChatRecord(chatId,group);
                break;
            case Request.AcceptApplyFriend:
                userController.getContactList(false,false)
                applyController.setApplyFriendRecord()
                break;
        }

    }

    static addPageManagement(type,pageName,handle){

        switch(type){
            case Mark.ConversationList:
               if(ConversationList[pageName])
                   return;
               ConversationList[pageName] = handle;
                   break
            case Mark.ConversationDetail:
                if(ConversationDetail[pageName])
                    return;
                ConversationDetail[pageName] = handle;
                break
        }
    }

    static removePageManagement(type,name){
        switch(type){
            case Mark.ConversationList:
                delete ConversationList[name];
                break
            case Mark.ConversationDetail:
                delete ConversationDetail[name];
                break
        }
    }

    static dispatchMessageToMarkPage(type,params){
        switch(type){
            case Mark.ConversationList:
                for(let item in ConversationList){
                    ConversationList[item] && ConversationList[item](type,params);
                }
                break
            case Mark.ConversationDetail:
                for(let item in ConversationDetail){
                    ConversationDetail[item] && ConversationDetail[item](type,params);
                }
                break
        }
    }

}