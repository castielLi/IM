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
export function updateApplyHandle(data){
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