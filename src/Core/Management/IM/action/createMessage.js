import ChatCommandEnum from '../../Common/dto/ChatCommandEnum';
import MessageBodyTypeEnum from '../../Common/dto/MessageBodyTypeEnum';
import MessageCommandEnum from '../../Common/dto/MessageCommandEnum';
import SendMessageBodyDto from '../Common/dto/SendMessageBodyDto';
import SendMessageDto from '../Common/dto/SendMessageDto';
import messageBodyChatDto from '../Common/dto/messageBodyChatDto';
import MessageType from '../../../../Logic/Im/dto/MessageType'
import MessageStatus from '../../Common/dto/MessageStatus'
import ResourceTypeEnum from '../../Common/dto/ResourceTypeEnum'
import uploadResourceDto from '../Common/dto/uploadResourceDto'
import ChatWayEnum from '../../Common/dto/ChatWayEnum'
import ManagementMessageDto from '../../Common/dto/ManagementMessageDto'
import AppCommandEnum from '../../Common/dto/AppCommandEnum'

 function createMessageObj(text,Resource,Sender,Receiver,messageDataCommand,messageBodyCommand,MessageCommand=MessageCommandEnum.MSG_BODY,messageId=""){
    let addMessage = new SendMessageDto();
    let messageBody = new SendMessageBodyDto();
    let messageData = new messageBodyChatDto();

    messageData.Data = text;
    messageData.Command = messageDataCommand;

    messageData.Sender = Sender;
    messageData.Receiver = Receiver;

    messageBody.LocalTime = new Date().getTime();
     messageBody.Command = messageBodyCommand;

     messageBody.Data = messageData;


    addMessage.Command = MessageCommand;
    addMessage.Data = messageBody;
    if(Resource != null){
        addMessage.Resource = [Resource];
    }
    addMessage.MSGID = messageId;
    return addMessage;
}

//构造发送消息体
export function buildSendMessage(messageDto = new ManagementMessageDto()){

   let way = messageDto.group ? ChatWayEnum.Group:ChatWayEnum.Private;

   switch (messageDto.type){
       case MessageType.text:
           return addTextMessage(way,messageDto.message,messageDto.sender,messageDto.chatId)
       case MessageType.image:
           var file = new uploadResourceDto();
           file.FileType = ResourceTypeEnum.image;
           file.RemoteSource = messageDto.message.remoteSource;
           file.LocalSource = messageDto.message.localSource;
           return addResourceMessage(way,file,messageDto.sender,messageDto.chatId);
       case MessageType.audio:
           var file = new uploadResourceDto();
           file.FileType = ResourceTypeEnum.audio;
           file.RemoteSource = messageDto.message.remoteSource;
           file.LocalSource = messageDto.message.localSource;
           file.Time = messageDto.time;

           return addResourceMessage(way,file,messageDto.sender,messageDto.chatId);
       case MessageType.video:
           var file = new uploadResourceDto();
           file.FileType = ResourceTypeEnum.video;
           file.RemoteSource = messageDto.message.remoteSource;
           file.LocalSource = messageDto.message.localSource;
           file.Time = messageDto.message.time;
           return addResourceMessage(way,file,messageDto.sender,messageDto.chatId);
   }
}



//发送文本
 export function addTextMessage(way,text,Sender,Receiver) {
     if(way==='private'){
         return createMessageObj(text,undefined,Sender,Receiver,ChatCommandEnum.MSG_BODY_CHAT_C2C,MessageBodyTypeEnum.MSG_BODY_CHAT)
     }else if(way === 'group'){
         return createMessageObj(text,undefined,Sender,Receiver,ChatCommandEnum.MSG_BODY_CHAT_C2G,MessageBodyTypeEnum.MSG_BODY_CHAT)

     }
};
 //发送资源
 export function addResourceMessage(way,Resource,Sender,Receiver){
     if(way==='private'){
         return createMessageObj('',Resource,Sender,Receiver,ChatCommandEnum.MSG_BODY_CHAT_C2C,MessageBodyTypeEnum.MSG_BODY_CHAT)
     }else if(way === 'group'){
         return createMessageObj('',Resource,Sender,Receiver,ChatCommandEnum.MSG_BODY_CHAT_C2G,MessageBodyTypeEnum.MSG_BODY_CHAT)

     }
 };

//本地存储群组邀请通知
export function buildInvationGroupMessage(Sender,Receiver,text,messageId){
    text = "你邀请" + text + "进入群聊";
    let message = createMessageObj(text,undefined,Sender,Receiver,AppCommandEnum.MSG_BODY_APP_CREATEGROUP,MessageBodyTypeEnum.MSG_BODY_APP)
    message.status = MessageStatus.SendSuccess
    message.MSGID = messageId;
    return message;
}

//本地存储群组移除通知
export function buildRemoveGroupMessage(Sender,Receiver,text,messageId){
    text = "你将" + text + "移除了群聊";
    let message = createMessageObj(text,undefined,Sender,Receiver,AppCommandEnum.MSG_BODY_APP_CREATEGROUP,MessageBodyTypeEnum.MSG_BODY_APP)
    message.status = MessageStatus.SendSuccess
    message.MSGID = messageId;
    return message;
}


//本地存储群组昵称修改通知
export function buildChangeGroupNickMessage(Sender,Receiver,text,messageId){
    let message = createMessageObj(text,undefined,Sender,Receiver,AppCommandEnum.MSG_BODY_APP_MODIFYGROUPINFO,MessageBodyTypeEnum.MSG_BODY_APP)
    message.status = MessageStatus.SendSuccess
    message.MSGID = messageId;
    return message;
}