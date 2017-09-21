import IM from '../index';
import * as DtoMethods from '../dto/Common'
let im = new IM();
//向chatRecordStore增加新的聊天对象
export function addClient(client){
	return{
		type:'ADD_CLIENT',
		client
	}
}
//向chatRecordStore中某确定的聊天对象添加 一条消息
export function addMessage(client,message){
	return{
		type:'ADD_MESSAGE',
		client,
		message
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
//打开app的时候，初始化chatRecordStore.ChatRecord,给所以会话列表里的client添加10条初始数据
export function initChatRecord(chatListArr){
	let chatRecord = {li:[],2:[]};
    // chatListArr.forEach((v,i)=>{
     //    im.getRecentChatRecode(v.Client,v.Type,{start:0,limit:10},function (messages) {
     //    	let messageList = messages.map((message)=>{
	// 							return DtoMethods.sqlMessageToMessage(message);
	// 						})
     //        chatRecord[v.Client] = messageList;
	// 	})
	// })
	console.log('bbbbbbbbbbbbbbbbbbbbbb')
    return{
        type:'INIT_CHATRECORD',
        chatRecord,
    }
}

//从id截取用户名
function InterceptionClientFromId(str){
    let client = '';
    client = str.slice(0,str.indexOf('_'));
    return client;
}