export default class ControllerMessageDto{
    constructor(){
        this.group =  false,
            this.chatId =  "",//chatId={account/groupId}
            this.sender =  { account: "", name: "", HeadImageUrl: "" },//发送者
            this.messageId =  "",//消息编号
            this.message =  {data:"",time:""},//消息内容，
            this.type = '',//消息类型
            this.status = '',
            this.sendTime  = ""
    }

}
// var ControllerMessageDto={
//     group: false,
//     chatId: "",//chatId={account/groupId}
//     sender: { account: "", name: "", HeadImageUrl: "" },//发送者
//     messageId: "",//消息编号
//     message: {data:"",time:""},//消息内容，
//     type:enum，//消息类型
// status:enum，
// sendTime : ""
// }