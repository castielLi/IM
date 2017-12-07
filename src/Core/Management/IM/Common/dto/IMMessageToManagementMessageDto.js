/**
 * Created by apple on 2017/12/7.
 */

import ManagementMessageDto from '../../../Common/dto/ManagementMessageDto'
import ChatCommandEnum from '../../../Common/dto/ChatCommandEnum'
import MessageCommandEnum from '../../../Common/dto/MessageCommandEnum';
import DtoMessageTypeEnum from '../../../Common/dto/DtoMessageTypeEnum'
import MessageBodyTypeEnum from '../../../Common/dto/MessageBodyTypeEnum'
import ResourceTypeEnum from '../../../Common/dto/ResourceTypeEnum'

export default function IMMessageToMessagementMessageDto(message){
    let messageDto = new ManagementMessageDto();

    if(message.Command == MessageCommandEnum.MSG_ERROR){
        messageDto.type = DtoMessageTypeEnum.error;
    }else{
       if(message.Data.Command == MessageBodyTypeEnum.MSG_BODY_APP){
           messageDto.type = DtoMessageTypeEnum.info;
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
       }
    }

    messageDto.chatId = message.Data.Data.Receiver;
    messageDto.sender = messageDto.Data.Data.Sender;
    messageDto.messageId = message.MSGID;
    messageDto.sendTime = message.Data.LocalTime;

    return messageDto;
}