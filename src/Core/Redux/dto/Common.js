/**
 * Created by apple on 2017/11/22.
 */
import reduxMessageDto from './reduxMessageDto'

export function buildMessageDto(message,relation){

    let dto = new reduxMessageDto();
    dto.MSGID = message.MSGID;
    dto.Resource = message.Resource;
    dto.type = message.type;
    dto.Data = message.Data.Data.Data;
    dto.resourceTime = message.resourceTime;
    dto.nick = relation.Nick;
    dto.avator = relation.avatar;
    return dto;
}