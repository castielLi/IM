/**
 * Created by apple on 2017/11/8.
 */

import Store from '../../../store'
import MessageCommandEnum from '../dto/MessageCommandEnum'
import AppCommandEnum from '../dto/AppCommandEnum'
import * as ActionForChatRecordStore from '../redux/chat/action'
import {changeRelationOfShow,addRelation} from '../../../modules/Contacts/reducer/action';
import * as ActionForLoginStore from '../../../modules/Login/reducer/action'
import User from '../../User'
import {Alert} from 'react-native'

let user = new User();
let store = Store;

export function handleRecieveMessage(message){
    //如果是通知消息
    if(message.Command == MessageCommandEnum.MSG_INFO){
        user.getInformationByIdandType(message.Data.Data.Sender,message.way,function(relation){
            //添加进relation redux
            store.dispatch(addRelation(relation));

            if(message.way == "chatroom"){
                //添加进group数据库

                if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_CREATEGROUP){

                    // let accounts = message.Data.Data.Data.split(',');
                    //
                    // let nicks = "";
                    // for(let i = 0; i<accounts.length;i++){
                    //     if(i != accounts.length - 1){
                    //         nicks += user.getUserInfoById(accounts[i]).Nick + ",";
                    //     }else{
                    //         nicks += user.getUserInfoById(accounts[i]).Nick;
                    //     }
                    // }
                    //
                    // let inviter = user.getUserInfoById(message.Data.Data.Receiver).Nick;
                    // message.Data.Data.Data = inviter + "邀请" + nicks + "加入群聊";

                }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_ADDGROUPMEMBER){

                    // let accounts = message.Data.Data.Data.split(',');
                    //
                    // let nick = user.getUserInfoById(accounts[0]).Nick
                    //
                    // let inviter = user.getUserInfoById(accounts[1]).Nick;
                    //
                    // message.Data.Data.Data = inviter + "邀请" + nick + "加入群聊";

                }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_DELETEGROUPMEMBER){

                    // let nick = user.getUserInfoById(message.Data.Data.Data).Nick
                    //
                    // let inviter = user.getUserInfoById(message.Data.Data.Receiver).Nick;
                    //
                    // message.Data.Data.Data =  nick + "被踢"+ inviter+"出了群聊";

                }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_EXITGROUP){

                    // let accounts = message.Data.Data.Data.split(',');
                    //
                    // let nick = user.getUserInfoById(accounts[0]).Nick
                    //
                    // message.Data.Data.Data =  nick + "退出了群聊";
                }

                store.dispatch(ActionForChatRecordStore.receiveMessage(message))

            }else{
                store.dispatch(ActionForChatRecordStore.receiveMessage(message))
            }
        });
        //todo: 添加这个新的relation进 redux， 如果是group则还需要添加进group数据库

    }else{

        if(message.way == "chatroom"){

            //这里要获取群组里面发送消息的成员的信息
            user.getInformationByIdandType(message.Data.Data.Sender,"chatroom",function(relation){

                //这里因为群消息发送者是群,而receiver则是真正的发送人员

                //添加进relation redux
                store.dispatch(addRelation(relation));

                store.dispatch(ActionForChatRecordStore.receiveMessage(message))
            });
        }else{
            store.dispatch(ActionForChatRecordStore.receiveMessage(message))
        }
    }
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
                store.dispatch(ActionForLoginStore.signOut());
            }},
            {text: '不是本人操作',style:{color:"red"}, onPress: () => {
                store.dispatch(ActionForLoginStore.signOut());
            }},
        ]);
}

export function handleRecieveAddFriendMessage(relation){
    user.updateDisplayOfRelation(relation,'true');
    //修改relationStore
    store.dispatch(changeRelationOfShow(relation))
}