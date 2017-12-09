/**
 * Created by apple on 2017/12/7.
 */

import ManagementMessageDto from '../dto/ManagementMessageDto'
import ChatCommandEnum from '../dto/ChatCommandEnum'
import MessageCommandEnum from '../dto/MessageCommandEnum';
import DtoMessageTypeEnum from '../dto/DtoMessageTypeEnum'
import MessageBodyTypeEnum from '../dto/MessageBodyTypeEnum'
import ResourceTypeEnum from '../dto/ResourceTypeEnum'
import CommandErrorCodeEnum from '../dto/CommandErrorCodeEnum'
import AppCommandEnum from '../dto/AppCommandEnum'

export default function IMMessageToMessagementMessageDto(message){
    let messageDto = new ManagementMessageDto();

    if(message.Command == MessageCommandEnum.MSG_ERROR){
        messageDto.type = DtoMessageTypeEnum.error;

        messageDto.message = message.Description;
        messageDto.chatId = message.Data.Data.Data.Receiver;
        messageDto.sender = messageDto.Data.Data.Data.Sender;
        messageDto.messageId = message.MSGID;
        messageDto.sendTime = message.Data.Data.LocalTime;

    }else{
       if(message.Data.Command == MessageBodyTypeEnum.MSG_BODY_APP){
           if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_APPLYFRIEND ||
           message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_ADDFRIEND){
               messageDto.type = DtoMessageTypeEnum.friend;
           }else{
               messageDto.type = DtoMessageTypeEnum.info;
               if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_CREATEGROUP){
                   messageDto.group = true;
                   messageDto.chatId = message.Data.Data.Receiver;
                   messageDto.sender = message.Data.Data.Receiver;
                   messageDto.message = message.Data.Data.Data;
               }
           }

       }else{
           if(message.Resource == undefined){
               messageDto.type = DtoMessageTypeEnum.text;
               messageDto.message = message.Data.Data.Data;
           }else{

               messageDto.group = message.Data.Data.Command == ChatCommandEnum.MSG_BODY_CHAT_C2G?true:false;

               switch(message.Resource[0].FileType){
                   case ResourceTypeEnum.video:
                       messageDto.type = DtoMessageTypeEnum.video;
                       messageDto.message = {"Data":{"localSource":message.Resource[0].LocalSource,
                           "remoteSource":message.Resource[0].RemoteSource},
                       "Time":message.Resource[0].Time}
                       break;
                   case ResourceTypeEnum.audio:
                       messageDto.type = DtoMessageTypeEnum.audio;
                       messageDto.message = {"localSource":message.Resource[0].LocalSource,"remoteSource":message.Resource[0].RemoteSource}
                       break;
                   case ResourceTypeEnum.image:
                       messageDto.type = DtoMessageTypeEnum.image;
                       messageDto.message = {"localSource":message.Resource[0].LocalSource,"remoteSource":message.Resource[0].RemoteSource}
                       break;
               }
           }
           messageDto.chatId = message.Data.Data.Receiver;
           messageDto.sender = message.Data.Data.Sender;
       }

        messageDto.messageId = message.MSGID;
        messageDto.sendTime = message.Data.LocalTime;
    }
    return messageDto;
}