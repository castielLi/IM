/**
 * Created by Hsu. on 2017/10/23.
 */
import IM from '../../index'
let im = new IM();
import ApplyFriendEnum from '../../dto/ApplyFriendEnum'

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