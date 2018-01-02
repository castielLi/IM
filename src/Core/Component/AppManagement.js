/**
 * Created by apple on 2017/12/29.
 */

import Mark from './AppPageMarkEnum';

let Contact = {};

let ApplyMessage = {};

let ConversationList = {};

let ConversationDetail = {};

export default class AppManagement{

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
                    ConversationList[item] && ConversationList[item](params);
                }
                break
            case Mark.ConversationDetail:
                for(let item in ConversationDetail){
                    ConversationDetail[item] && ConversationDetail[item](params);
                }
                break
        }
    }

}