/**
 * Created by apple on 2017/9/14.
 */

import SendMessageBodyDto from '../dto/SendMessageBodyDto'
import SendMessageDto from '../dto/SendMessageDto'
import messageBodyChatDto from '../dto/messageBodyChatDto'

export function sqliteMessageToMessage(sqliteMessage){

    let message = new SendMessageDto();
    let messageBody = new SendMessageBodyDto();
    let messageData = new messageBodyChatDto();

    let sqliteMessageDto = JSON.parse(sqliteMessage.messageBody)


    messageData.Command = sqliteMessageDto.Data.Data.Command;


    messageData.Sender = sqliteMessageDto.Data.Data.Sender;
    messageData.Receiver = sqliteMessageDto.Data.Data.Receiver;
    messageData.Data = sqliteMessageDto.Data.Data.Data;

    messageBody.LocalTime = sqliteMessageDto.Data.LocalTime;
    messageBody.Command = sqliteMessageDto.Data.Command;
    messageBody.Data = messageData;

    message.Command = sqliteMessageDto.Command;
    message.Data = messageBody;
    message.MSGID = sqliteMessageDto.MSGID;

    message.status = sqliteMessage.status;
    message.Resource = sqliteMessageDto.Resource;

    return message;
}
