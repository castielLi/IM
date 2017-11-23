/**
 * Created by Hsu. on 2017/10/23.
 */
import ApplyFriendEnum from '../../IM/dto/ApplyFriendEnum'
import {addUnDealRequestNumber} from '../../../modules/MainTabbar/reducer/action';
export function getApplicantInfo(message) {

    return (dispatch)=>{
            let status = ApplyFriendEnum.WAIT;
            let key = message.Data.Data.Data;
            let {Sender,Receiver} = message.Data.Data;
            let time = Date.now();
            let send = Sender;
            let rec = Receiver;
            let messageObj = {send,rec,time,key,status};
            dispatch(addFriendApplication(messageObj));
    }
}

// export function getApplicantList(messageList) {
//     return (dispatch)=>{
//         let msgList = messageList.map((message)=>{
//             return;
//         })
//         dispatch(initFriendApplication(msgList))
//     }
// }
export function initFriendApplication(messageList){
    return{
        type:'INIT_FRIEND_APPLICATION',
        messageList
    }
}
export function addFriendApplication(message){
    return (dispatch,getState)=>{
        let isAddUnDealRequest = true;
        let applyArr = getState().friendApplicationStore.applicationRecord;
        for(let i=0;i<applyArr.length;i++){
            if(applyArr[i].send == message.send&&applyArr[i].status == 'wait'){
                isAddUnDealRequest = false;
            }
        }
        if(isAddUnDealRequest){
            dispatch(addUnDealRequestNumber())
        }
        dispatch({
            type:'ADD_FRIEND_APPLICATION',
            message
        })
    }
}
export function deleteFriendApplication(index){
    return{
        type:'DELETE_FRIEND_APPLICATION',
        index
    }
}
export function acceptFriendApplication(key){
    return{
        type:'ACCEPT_FRIEND_APPLICATION',
        key
    }
}
export function updateFriendApplication(index){
    return{
        type:'UPDATE_FRIEND_APPLICATION',
        index
    }
}
export function clearFriendApplication(){
    return{
        type:'CLEAR_FRIEND_APPLICATION',
    }
}