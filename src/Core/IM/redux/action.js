import IM from '../index';
import * as DtoMethods from '../dto/Common';
import InitChatRecordConfig from './InitChatRecordConfig';
import * as recentListAction from '../../../modules/RecentList/reducer/action';
let im = new IM();
import * as friendApplicationActions from '../../../modules/NewFriend/reducer/action'
//向chatRecordStore增加新的聊天对象
export function addClient(client){
	return{
		type:'ADD_CLIENT',
		client
	}
}
//向chatRecordStore中某确定的聊天对象添加 一条消息
export function addMessage(message){
	//let client = InterceptionClientFromId(message.MSGID);
	return (dispatch,getState)=>{
		dispatch({
		type:'ADD_MESSAGE',
		client:message.Data.Data.Receiver,
		message
		})
		//同时更新recentListStore
		dispatch(recentListAction.updateRecentItemLastMessage(message.Data.Data.Receiver,message.way,extractMessage(message),message.Data.LocalTime))
	}
}
export function receiveMessage(message){
	//let client = InterceptionClientFromId(message.MSGID);
    let {type} = message;
    if(type = 'friend'){
		return (dispatch) =>{
			dispatch(friendApplicationActions.getApplicantInfo(message))
		}
    }
    else{
        return (dispatch,getState)=>{
            dispatch({
                type:'RECEIVE_MESSAGE',
                client:message.Data.Data.Sender,
                message
            })
            //同时更新recentListStore
            dispatch(recentListAction.updateRecentItemLastMessage(message.Data.Data.Sender,message.way,extractMessage(message),message.Data.LocalTime,true))
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
//修改某条消息的网络路径
export function updateMessage(message){
	return{
		type:'UPDATE_MESSAGES',
		message,
		client:InterceptionClientFromId(message.MSGID),
		MSGID:message.MSGID,
	}
}
//打开聊天窗口的时候，给client对应的chatRecordStore.ChatRecord数据添加10条初始数据
export function getChatRecord(Client,Type){
	return (dispatch)=>{
        im.getRecentChatRecode(Client,Type,{start:0,limit:InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER},function (messages) {
        	let messageList = messages.map((message)=>{
								return DtoMethods.sqlMessageToMessage(message);
							})
            dispatch(initChatRecord(Client,messageList));
		})
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
        default:
        	return '';
	}
}