/**
 * Created by apple on 2017/11/22.
 */
import reduxMessageDto from './reduxMessageDto'

export function buildMessageDto(message,relation){

    let dto = new reduxMessageDto();
    dto.MSGID = message.MSGID;
    dto.Resource = message.Resource;
    dto.type = message.type;
    dto.Data = message.Data;
    dto.resourceTime = message.resourceTime;
    dto.Nick = relation.Nick;
    dto.avator = relation.localImage == ""?relation.avatar:relation.localImage;
    dto.way = message.way;
    return dto;
}