/**
 * Created by apple on 2017/12/6.
 */

export default class ManagementMessageDto{
    constructor(){
        this.group = false;
        this.chatId = "";//chatId={account/groupId},
        this.id = 0 ;//自增
        this.sender = "" ;//"wg003722"
        this.messageId = "";//消息编号
        this.message = {};//消息内容，
        //如果是 resource消息 {data:{localSource:"",remoteSource:""},Time:""};
        //如果是 非resource消息  {data:""}
        this.type = 0;//消息类型
        this.status = 0;
        this.sendTime = "";

        //错误消息中存放原发送消息的messageId
        this.errorMessageId = "";
    }
}

