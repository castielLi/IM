import ChatCommandEnum from '../dto/ChatCommandEnum';
import AppCommandEnum from '../dto/AppCommandEnum'
import MessageBodyTypeEnum from '../dto/MessageBodyTypeEnum';
import MessageCommandEnum from '../dto/MessageCommandEnum';

import SendMessageBodyDto from '../dto/SendMessageBodyDto';
import SendMessageDto from '../dto/SendMessageDto';
import messageBodyChatDto from '../dto/messageBodyChatDto';
import MessageType from '../dto/MessageType'

 function createMessageObj(type,text,way,Resource,Sender,Receiver,messageDataCommand,messageBodyCommand){
    let addMessage = new SendMessageDto();
    let messageBody = new SendMessageBodyDto();
    let messageData = new messageBodyChatDto();

    messageData.Data = text;
    //messageData.Command = ChatCommandEnum.MSG_BODY_CHAT_C2C;
     messageData.Command = messageDataCommand;

     messageData.Sender = Sender;
    messageData.Receiver = Receiver;

    messageBody.LocalTime = new Date().getTime();
    //messageBody.Command = MessageBodyTypeEnum.MSG_BODY_CHAT;
     messageBody.Command = messageBodyCommand;

     messageBody.Data = messageData;


    addMessage.Command = MessageCommandEnum.MSG_BODY;
    addMessage.Data = messageBody;
    addMessage.type = type;
    addMessage.way = way;
    addMessage.Resource = Resource;
    return addMessage;
}
//发送文本
 export function addTextMessage(text,way,Sender,Receiver) {
     if(way==='private'){
         return createMessageObj(MessageType.text,text,way,null,Sender,Receiver,ChatCommandEnum.MSG_BODY_CHAT_C2C,MessageBodyTypeEnum.MSG_BODY_CHAT)
     }else if(way === 'chatroom'){
         return createMessageObj(MessageType.text,text,way,null,Sender,Receiver,ChatCommandEnum.MSG_BODY_CHAT_C2G,MessageBodyTypeEnum.MSG_BODY_CHAT)

     }
};
 //发送资源
 export function addResourceMessage(type,way,Resource,Sender,Receiver){
     if(way==='private'){
         return createMessageObj(type,'',way,Resource,Sender,Receiver,ChatCommandEnum.MSG_BODY_CHAT_C2C,MessageBodyTypeEnum.MSG_BODY_CHAT)
     }else if(way === 'chatroom'){
         return createMessageObj(type,'',way,Resource,Sender,Receiver,ChatCommandEnum.MSG_BODY_CHAT_C2G,MessageBodyTypeEnum.MSG_BODY_CHAT)

     }
 };
 //申请好友请求
 export function addApplyFriendMessage(text,Sender,Receiver){
     return createMessageObj(MessageType.friend,text,'',null,Sender,Receiver,AppCommandEnum.MSG_BODY_APP_APPLYFRIEND,MessageBodyTypeEnum.MSG_BODY_APP)
 }
 //添加好友请求
export function addAddFriendMessage(text,Sender,Receiver){
    return createMessageObj(MessageType.friend,text,'',null,Sender,Receiver,AppCommandEnum.MSG_BODY_APP_ADDFRIEND,MessageBodyTypeEnum.MSG_BODY_APP)
}
//添加群成员请求
export function addAddGroupMemberMessage(text,Sender,Receiver){
    return createMessageObj(MessageType.friend,text,'',null,Sender,Receiver,AppCommandEnum.MSG_BODY_APP_ADDGROUPMEMBER,MessageBodyTypeEnum.MSG_BODY_APP)
}
//删除群成员请求
export function addDeleteGroupMemberMessage(text,Sender,Receiver){
    return createMessageObj(MessageType.friend,text,'',null,Sender,Receiver,AppCommandEnum.MSG_BODY_APP_DELETEGROUPMEMBER,MessageBodyTypeEnum.MSG_BODY_APP)
}

//判断申请好友消息的类型
export function isApplyFriendMessageType(message){
    if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_APPLYFRIEND){
        return true;
    }else{
        return false;
    }
}

//返回黑名单消息结构
export function blackListMessage(Sender,messageId){
    let message = createMessageObj(MessageType.error,"","private",null,Sender,"ME",0,0)
    message.MSGID = messageId;
    message.Command = MessageCommandEnum.MSG_ERROR;
    return message;
}

//返回发起群聊成功提示消息结构
export function startChatRoomMessage(Sender,messageId){
    let message = createMessageObj(MessageType.imitation,"","chatroom",null,Sender,"ME",0,0)
    message.MSGID = messageId;
    message.Command = MessageCommandEnum.MSG_IMITATION;
    return message;
}