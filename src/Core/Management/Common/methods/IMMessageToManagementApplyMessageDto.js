/**
 * Created by apple on 2017/12/8.
 */

import ManagementApplyMessageDto from '../../ApplyFriend/Common/dto/ManagementApplyMessageDto'
import ApplyFriendEnum from '../../Common/dto/ApplyFriendEnum'

export default function IMMessageToManagementApplyMessageDto(message){
    let applyMessageDto = new ManagementApplyMessageDto();

    applyMessageDto.key = message.Data.Data.Data;
    applyMessageDto.sender = message.Data.Data.Sender;
    applyMessageDto.time = new Date().getTime();
    applyMessageDto.comment = "";
    applyMessageDto.status = ApplyFriendEnum.WAIT;
    return applyMessageDto;
}