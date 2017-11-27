


import * as recentListAction from '../RecentList/action';


import RNFS from 'react-native-fs';

import * as friendApplicationActions from '../applyFriend/action'
//向chatRecordStore增加新的聊天对象
export function addClient(client){
	return{
		type:'ADD_CLIENT',
		client
	}
}
//向chatRecordStore中某确定的聊天对象添加 一条消息
export function addMessage(message,NickAndHeadImageUrlObj){
	//let client = InterceptionClientFromId(message.MSGID);
	return (dispatch,getState)=>{
		dispatch({
		type:'ADD_MESSAGE',
		client:message.Data.Data.Receiver,
		message
		})
		//同时更新recentListStore
		dispatch(recentListAction.updateRecentItemLastMessage(message.Data.Data.Receiver,message.way,extractMessage(message),message.Data.LocalTime,false,NickAndHeadImageUrlObj))
	}
}
export function receiveMessage(message){
	//let client = InterceptionClientFromId(message.MSGID);
    let {type} = message;

    // if(message.Command == "5"){
    //
     //    dispatch({
     //        type:'RECEIVE_MESSAGE',
     //        client:message.Data.Data.Sender,
     //        message
     //    })
    	// return;
	// }

    if(type == 'friend'){
		return (dispatch) =>{
			dispatch(friendApplicationActions.getApplicantInfo(message))
		}
    }

    else{

        return (dispatch,getState)=>{
            let myId = getState().loginStore.accountMessage.accountId;
            let client = message.Data.Data.Sender;
            let way = message.way;
            let record = getState().chatRecordStore.ChatRecord[client];
            if(record === undefined){
            	//创建文件夹
                let audioPath = RNFS.DocumentDirectoryPath + '/' +myId+'/audio/chat/' + way + '-' +client;
                let imagePath = RNFS.DocumentDirectoryPath + '/' +myId+'/image/chat/' + way + '-' +client;
                let thumbnail = RNFS.DocumentDirectoryPath + '/' +myId+'/image/chat/' + type + '-' +client+'/thumbnail';
                let videoPath = RNFS.DocumentDirectoryPath + '/' +myId+'/video/chat/' + way + '-' +client;
                RNFS.mkdir(audioPath)
                RNFS.mkdir(imagePath)
                RNFS.mkdir(thumbnail)
                RNFS.mkdir(videoPath)

			}
                dispatch({
                    type:'RECEIVE_MESSAGE',
                    client:message.Data.Data.Sender,
                    message
                })
                //同时更新recentListStore
                dispatch(recentListAction.updateRecentItemLastMessage(message.Data.Data.Sender,message.way,extractMessage(message),message.Data.LocalTime,true,{Nick:message.Nick,avator:message.avator}))


        }
    }
}
//修改某条消息的状态 {status:'修改该状态',message:{...}}
export function updateMessageStatus(status,MSGID){
	return{
		type:'UPDATE_MESSAGES_STATUS',
		client:InterceptionClientFromId(MSGID),
		MSGID,
		status
	}
}
//修改下载完成视频消息的path
export function updateMessagePath(MSGID,path,sender){
    return{
        type:'UPDATE_MESSAGES_PATH',
        sender,
        MSGID,
        path
    }
}
//修改资源文件的远程地址
export function updateMessageUrl(MSGID,url,sender){
    return{
        type:'UPDATE_MESSAGES_URL',
        sender,
        MSGID,
        url
    }
}
//修改某条消息的网络路径
export function updateMessage(message){
	return{
		type:'UPDATE_MESSAGES',
		message,
		client:InterceptionClientFromId(message.MSGID),
		MSGID:message.MSGID,
	}
}


export function handleChatRecord(client){
    return {
        type:'HANDLE_CHATRECORD',
        client
    }
}

export function initChatRecord(client,messageList){
	return {
		type:'INIT_CHATRECORD',
        client,
        messageList
	}
}
//从id截取用户名
function InterceptionClientFromId(str){
    let client = '';
    client = str.slice(0,str.indexOf('_'));
    return client;
}
export function clearChatRecordFromId(client){
    return {
        type:'CLEAR_CHATRECORD_FROM_ID',
        client,
    }
}
//注销清空store
export function clearChatRecord(){
    return{
        type:'CLEAR_CHATRECORD',
    }
}
//消息提取
function extractMessage(message){
	switch (message.type) {
        case 'text':
        	return message.Data.Data.Data;
        case 'image':
        	return '[图片]';
        case 'audio':
        	return '[音频]';
        case 'video':
        	return '[视频]';
		case 'information':
			return '[通知]'
            // return message.Data.Data.Data
        default:
        	return '';
	}
}