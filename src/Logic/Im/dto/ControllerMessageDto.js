export default Class ControllerMessageDto{
	this.group =  false,
    this.chatId =  "",//chatId={account/groupId}
    this.sender =  { account: "", name: "", HeadImageUrl: "" },//发送者
    this.messageId =  "",//消息编号
    this.message =  {data:"",time:""},//消息内容，
    this.type = enum,//消息类型
    this.status = enum,
    this.sendTime  = ""
}