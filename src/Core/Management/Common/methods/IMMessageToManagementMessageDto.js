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

export default function IMMessageToMessagementMessageDto(message){
    let messageDto = new ManagementMessageDto();

    if(message.Command == MessageCommandEnum.MSG_ERROR){
        messageDto.type = DtoMessageTypeEnum.error;

        switch (message.Data.ErrorCode){
            case CommandErrorCodeEnum.NotBelongToGroup:
                messageDto.message = "您已经被管理员踢了群聊";
                break;
            case CommandErrorCodeEnum.AlreadyFriend:
                messageDto.message = "你们已经是好友了";
                break;
            default:
                messageDto.message = "你们已经不再是好友了,请重新添加";
                break;
        }

        messageDto.chatId = message.Data.Data.Data.Receiver;
        messageDto.sender = messageDto.Data.Data.Data.Sender;
        messageDto.messageId = message.MSGID;
        messageDto.sendTime = message.Data.Data.LocalTime;

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

        messageDto.chatId = message.Data.Data.Receiver;
        messageDto.sender = messageDto.Data.Data.Sender;
        messageDto.messageId = message.MSGID;
        messageDto.sendTime = message.Data.LocalTime;
    }
    return messageDto;
}