/**
 * Created by apple on 2017/9/14.
 */

import ChatCommandEnum from './ChatCommandEnum'
import MessageBodyTypeEnum from './MessageBodyTypeEnum'
import MessageCommandEnum from './MessageCommandEnum'

import SendMessageBodyDto from './SendMessageBodyDto'
import SendMessageDto from './SendMessageDto'
import messageBodyChatDto from './messageBodyChatDto'

import MessageType from './MessageType'
import ResourceTypeEnum from './ResourceTypeEnum'
import uploadResourceDto from './uploadResourceDto'


export function sqliteMessageToMessage(sqliteMessage){

    let message = new SendMessageDto();
    let messageBody = new SendMessageBodyDto();
    let messageData = new messageBodyChatDto();

    messageData.Data = sqliteMessage.content;
    messageData.Command = ChatCommandEnum.MSG_BODY_CHAT_C2C
    messageData.Sender = sqliteMessage.send;
    messageData.Receiver = sqliteMessage.rec;

    messageBody.LocalTime = new Date().getTime();
    messageBody.Command = MessageBodyTypeEnum.MSG_BODY_CHAT;
    messageBody.Data = messageData;

    message.Command = MessageCommandEnum.MSG_BODY;
    message.Data = messageBody;
    message.MSGID = sqliteMessage.messageId;

    message.status = sqliteMessage.status;

    if(sqliteMessage.type == MessageType.image){
         message.type = "image"
         let file = new uploadResourceDto()
         file.type = ResourceTypeEnum.Image;
         file.LocalSource =  sqliteMessage.localPath.split(",")[0];
         message.Resource = [file];
    }else if(sqliteMessage.type == MessageType.audio){
        message.type = "audio"
        let file = new uploadResourceDto()
        file.type = ResourceTypeEnum.audio;
        file.LocalSource =  sqliteMessage.localPath.split(",")[0];
        message.resourceTime = sqliteMessage.resourceTime;
        message.Resource = [file];
    }
    else{
        message.type = "text"
    }
    return message;
}

export function sqlMessageToMessage(sqliteMessage){

    let status = sqliteMessage.status;
    let message = new SendMessageDto();
    let messageBody = new SendMessageBodyDto();
    let messageData = new messageBodyChatDto();

    messageData.Data = sqliteMessage.content;
    messageData.Command = ChatCommandEnum.MSG_BODY_CHAT_C2C
    messageData.Sender = sqliteMessage.send;
    messageData.Receiver = sqliteMessage.rec;

    messageBody.LocalTime = sqliteMessage.time;
    messageBody.Command = MessageBodyTypeEnum.MSG_BODY_CHAT;
    messageBody.Data = messageData;


    message.Data = messageBody;
    message.MSGID = sqliteMessage.messageId;
    message.Command = MessageCommandEnum.MSG_BODY;
    if(sqliteMessage.type === MessageType.error){
        message.Command = MessageCommandEnum.MSG_ERROR;
    }
    if(sqliteMessage.type === MessageType.imitation){
        message.Command = MessageCommandEnum.MSG_IMITATION;
    }
    if(sqliteMessage.type != MessageType.text){
        let msgType = sqliteMessage.type;
        message.type = msgType;
        let file = new uploadResourceDto();
        file.FileType = ResourceTypeEnum.msgType;
        file.LocalSource =  sqliteMessage.localPath.split(",")[0];
        file.RemoteSource =  sqliteMessage.url.split(",")[0];
        if(sqliteMessage.type != MessageType.image){
            file.Time = sqliteMessage.resourceTime;
        }

        message.Resource = [file];
    }else{
        message.type = "text"
    }
    return {message,status};
}