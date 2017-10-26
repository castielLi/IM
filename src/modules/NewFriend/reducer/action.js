/**
 * Created by Hsu. on 2017/10/23.
 */
import IM from '../../../Core/IM/index'
let im = new IM();

export function getApplicantInfo(message) {

    return (dispatch)=>{
            let status = 'wait';
            let {comment,key} = message.Data.Data.Data;
            let {Sender,Receiver} = message.Data.Data;
            let time = Date.now();
            let send = Sender;
            let rec = Receiver;
            let messageObj = {send,rec,time,comment,key,status};
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

    return{
        type:'ADD_FRIEND_APPLICATION',
        message
    }
}
export function deleteFriendApplication(index){
    return{
        type:'DELETE_FRIEND_APPLICATION',
        index
    }
}
export function acceptFriendApplication(index){
    return{
        type:'ACCEPT_FRIEND_APPLICATION',
        index
    }
}
export function updateFriendApplication(index){
    return{
        type:'UPDATE_FRIEND_APPLICATION',
        index
    }
}