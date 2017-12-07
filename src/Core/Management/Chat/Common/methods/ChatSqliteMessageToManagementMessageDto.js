/**
 * Created by apple on 2017/12/7.
 */

import ManagementMessageDto from '../../../Common/dto/ManagementMessageDto'

export default function chatSqliteMessageToManagementMessageDto(message){
    let messageDto = new ManagementMessageDto();
    messageDto.messageId = message.messageId;
    messageDto.id = message.Id;
    messageDto.status = message.status;

    let messageBody = JSON.parse(message.message);
    messageDto.message = messageBody.message;
    messageDto.group = messageBody.group;
    messageDto.chatId = messageBody.chatId;
    messageDto.type = messageBody.type;
    messageDto.sendTime = messageBody.sendTime;
    messageDto.sender = messageBody.sender;
    return messageDto;
}