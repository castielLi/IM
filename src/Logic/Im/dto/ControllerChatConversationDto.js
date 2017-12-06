export default class ControllerChatConversationDto{
	constructor(){
        this.group =  false,
            this.chatId =  "",//chatId={account/groupId}
            this.name = "",//好友名字或者群名字
            this.HeadImageUrl =  "",//头像地址, 本地地址
            this.lastSender =  null,
            this.lastMessage =  "",
            this.lastTime =  null,
            this.unreadCount =  0, //未读条数
            this.noSound =  false//禁音
	}

}

// var ControllerChatConversationDto={
//     group: false,
//     chatId: "",//chatId={account/groupId}
//     name:"",//好友名字或者群名字
//     HeadImageUrl: "",//头像地址, 本地地址
//     lastSender: null,
//     lastMessage: "",
//     lastTime: null,
//     unreadCount: 0, //未读条数
//     noSound: false,//禁音
// }