/**
 * Created by apple on 2017/12/29.
 */

import Mark from './AppPageMarkEnum';
import IMController from '../TSController/IMController'
import * as AppHandles from './AppUIHandle'

let Contact = {};

let ApplyMessage = {};

let ConversationList = {};

let ConversationDetail = {};

export default class AppManagement{

    static onLoginSuccess(){
        let im = IMController.getSingleInstance();
        im.init({
            "AppKickOutHandle":AppHandles.AppKickOutHandle,
            "AppReceiveMessageHandle":AppHandles.AppReceiveMessageHandle,
            "updateConversListHandle":AppHandles.updateConversListHandle,
            "updateChatRecordHandle":AppHandles.updateChatRecordHandle,
            "updateHeadNameHandle":AppHandles.updateHeadNameHandle,
            "updateChatDisplaySetting":AppHandles.updateChatDisplaySetting,
            "updateContactHandle":AppHandles.updateContactHandle,
            "updateApplyHandle":AppHandles.updateApplyHandle,
            "appOnConnect":AppHandles.appOnConnect,
            "appOnClosed":AppHandles.appOnClosed,
            "appOnError":AppHandles.appOnError,
            "appOnWillReconnect":AppHandles.appOnWillReconnect
        })
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