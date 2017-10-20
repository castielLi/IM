import ChatCommandEnum from '../dto/ChatCommandEnum';
import MessageBodyTypeEnum from '../dto/MessageBodyTypeEnum';
import MessageCommandEnum from '../dto/MessageCommandEnum';

import SendMessageBodyDto from '../dto/SendMessageBodyDto';
import SendMessageDto from '../dto/SendMessageDto';
import messageBodyChatDto from '../dto/messageBodyChatDto';

 function createMessageObj(type,text,way,Resource,Sender,Receiver,messageDataCommand,messageBodyCommand){
    let addMessage = new SendMessageDto();
    let messageBody = new SendMessageBodyDto();
    let messageData = new messageBodyChatDto();

    messageData.Data = type;
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
 export  function addTextMessage(text,way,Sender,Receiver,messageDataCommand) {
     return createMessageObj('text',text,way,null,Sender,Receiver,messageDataCommand,MessageBodyTypeEnum.MSG_BODY_CHAT)
};
 //发送资源
 export function addResourceMessage(type,way,Resource,Sender,Receiver,messageDataCommand){
     return createMessageObj(type,'',way,Resource,Sender,Receiver,messageDataCommand,MessageBodyTypeEnum.MSG_BODY_CHAT)
 };
 //申请好友请求
 export function addApplyFriendMessage(text,Sender,Receiver){
     return createMessageObj('friend',text,'',null,Sender,Receiver,ChatCommandEnum.MSG_BODY_APP_APPLYFRIEND,MessageBodyTypeEnum.MSG_BODY_CHAT)
 }
 //添加好友请求
export function addAddFriendMessage(text,Sender,Receiver){
    return createMessageObj('friend',text,'',null,Sender,Receiver,ChatCommandEnum.MSG_BODY_APP_ADDFRIEND,MessageBodyTypeEnum.MSG_BODY_CHAT)
}
//添加群成员请求
export function addAddGroupMemberMessage(text,Sender,Receiver){
    return createMessageObj('friend',text,'',null,Sender,Receiver,ChatCommandEnum.MSG_BODY_APP_ADDGROUPMEMBER,MessageBodyTypeEnum.MSG_BODY_CHAT)
}
//删除群成员请求
export function addDeleteGroupMemberMessage(text,Sender,Receiver){
    return createMessageObj('friend',text,'',null,Sender,Receiver,ChatCommandEnum.MSG_BODY_APP_DELETEGROUPMEMBER,MessageBodyTypeEnum.MSG_BODY_CHAT)
}