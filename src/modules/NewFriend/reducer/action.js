/**
 * Created by Hsu. on 2017/10/23.
 */
import netWorking from '../../../Core/Networking/Network'

export function getApplicantInfo(message) {
    let network = new netWorking();
    return (dispatch)=>{
        network.methodPOST('Member/SearchUser',{Keyword:message.Data.Data.Sender},function (result) {
            let status = 'wait';
            let {comment,key} = message.Data.Data;
            message = {...result,comment,key,status};
            dispatch(addFriendApplication(message))
        },false)
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