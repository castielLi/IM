/**
 * Created by apple on 2017/11/8.
 */

<<<<<<< HEAD:src/Controller/AppHandler/receiveHandleMessage.js
import Store from '../../store/index'
import * as ActionForChatRecordStore from '../../Core/Redux/chat/action'
import {changeRelationOfShow,addRelation} from '../../Core/Redux/contact/action';
import * as ActionForLoginStore from '../../modules/Login/reducer/action'
=======
import Store from '../../../store'
import * as ActionForChatRecordStore from '../../Redux/chat/action'
import {changeRelationOfShow,addRelation} from '../../Redux/contact/action';
import * as ActionForLoginStore from '../../../modules/Login/reducer/action'
import {changeRelationOfNick} from '../../Redux/contact/action';
import {changeRecentListOfGropName} from '../../Redux/RecentList/action'
import Route from '../../route/router'
>>>>>>> develope:src/Core/IM/action/receiveHandleMessage.js
import {Alert} from 'react-native'
let store = Store;
let myAccountId = '';

export function setMyAccoundId(id){
    myAccountId = id;
}
export function handleRecieveMessage(message,relation){

    store.dispatch(addRelation(relation));

    store.dispatch(ActionForChatRecordStore.receiveMessage(message))

}

export function handleMessageResult(status,MSGID){
    store.dispatch(ActionForChatRecordStore.updateMessageStatus(status,MSGID))
}

export function handleMessageChange(message){
    store.dispatch(ActionForChatRecordStore.updateMessage(message))
}

export function handleKickOutMessage(){
    Alert.alert(
        '下线通知',
        "该账号在其他设备上登录,请确认是本人操作并且确保账号安全!",
        [
            {text: '确定', onPress: () => {
                Route.ToLogin();
                store.dispatch(ActionForLoginStore.signOut());
            }},
            {text: '不是本人操作',style:{color:"red"}, onPress: () => {
                store.dispatch(ActionForLoginStore.signOut());
            }},
        ]);
}

export function handleRecieveAddFriendMessage(relation){
    //修改relationStore
    store.dispatch(changeRelationOfShow(relation))
}

export function handleRecieveChangeGroupNameMessage(groupId,newGroupname){
    store.dispatch(changeRelationOfNick(groupId,newGroupname))
    store.dispatch(changeRecentListOfGropName(groupId,newGroupname))
}

