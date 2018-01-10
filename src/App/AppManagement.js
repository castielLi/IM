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
import TabTypeEnum from '../TSController/Enums/TabTypeEnum'

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

        userController.init(
            AppHandles.pageManagement,
        )

        applyController.init(
            AppHandles.pageManagement,
        )

        imController.init(
            AppHandles.pageManagement,
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
                    if(params.type == TabTypeEnum.Contact) {
                      if(ApplyMessage["NewFriend"]){
                          return;
                      }
                    }else
                    UnReadMessage[item] && UnReadMessage[item](type,params);
                }
        }
    }

}