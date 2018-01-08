/**
 * Created by apple on 2018/1/4.
 */
import AppManagement from './AppManagement'
import {Alert} from 'react-native'
import Route from '../Core/route/router'
import AppPageMarkEnum from './AppPageMarkEnum'

export function AppKickOutHandle(){
    Alert.alert(
        '下线通知',
        "该账号在其他设备上登录,请确认是本人操作并且确保账号安全!",
        [
            {text: '确定', onPress: () => {
                Route.ToLogin();
            }},
            {text: '不是本人操作',style:{color:"red"}, onPress: () => {
                Route.ToLogin();
            }},
        ]);
}

//Tab数字回调
export function AppReceiveMessageHandle(data){
    AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.UnReadMessage,data);
}
//会话列表的回调
export function updateConversListHandle(data){
    AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.ConversationList,data);
}

//渲染聊天记录回调
export function updateChatRecordHandle(data){
    AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.ConversationDetail,data);
};
//聊天头部名字回调
export function updateHeadNameHandle(data){
    AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.ModifyGroupName,data);
}
//聊天设置回调
export function updateChatDisplaySetting(data){
    AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.ModifyGroupSetting,data);
};

//通讯录回调
export function updateContactHandle(data){
    AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.Contacts,data);
};

//好友申请界面回调
export function updateApplyMessageHandle(data){
    AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.ApplyMessage,data);
};

export function appOnConnect(data){
    // AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.AppStatus,data);
};

//关闭连接
export function appOnClosed(data){
    // AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.AppStatus,data);
};

//socket错误
export function appOnError(data){
    // AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.AppStatus,data);
};

//重新连接
export function appOnWillReconnect(data){
    // AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.AppStatus,data);
};


export function pageManagement(type,data){
    switch (type){
        case AppPageMarkEnum.AppKickOutHandle:
            Alert.alert(
                '下线通知',
                "该账号在其他设备上登录,请确认是本人操作并且确保账号安全!",
                [
                    {text: '确定', onPress: () => {
                        Route.ToLogin();
                    }},
                    {text: '不是本人操作',style:{color:"red"}, onPress: () => {
                        Route.ToLogin();
                    }},
                ]);
            break;
        default :
            if(type){
                AppManagement.dispatchMessageToMarkPage(type,data);
                break;
            }
        // case 0:
        //     AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.UnReadMessage,data);
        //     break;
        // case 1:
        //     AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.ConversationList,data);
        //     break;
        // case 2:
        //     AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.ConversationDetail,data);
        //     break;
        // case 3:
        //     AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.ModifyGroupName,data);
        //     break;
        // case 4:
        //     AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.ModifyGroupSetting,data);
        //     break;
        // case 5:
        //     AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.Contacts,data);
        //     break;
        // case 6:
        //     AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.ApplyMessage,data);
        //     break;
        // case 7:
        //     AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.AppStatus,data);
        //     break;
        // case 8:
        //     AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.AppStatus,data);
        //     break;
        // case 9:
        //     AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.AppStatus,data);
        //     break;
        // case 10:
        //     AppManagement.dispatchMessageToMarkPage(AppPageMarkEnum.AppStatus,data);
        //     break;
    }
}