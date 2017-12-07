/**
 * Created by apple on 2017/12/6.
 */


export default function getContentOfControllerMessageDto(messageDto){
    switch(messageDto.type){
        case "text":
            return messageDto.message;
        case "image":
            return "[图片]";
        case "video":
            return "[视频]";
        case "audio":
            return "[音频]";
        default:
            return "[通知]";
    }
}