export default class ManagementChatConversationDto{
    constructor(){
            this.group =  false,
            this.chatId =  "",//chatId={account/groupId}
            this.lastSender =  null,
            this.lastMessage =  "",
            this.lastTime =  null,
            this.unreadCount =  0 //未读条数
    }

}

// var ManagementChatConversationDto={
//     group: false,
//     chatId: "",//chatId={account/groupId}
//     lastSender: null,
//     lastMessage: "",
//     lastTime: null,
//     unreadCount: 0, //未读条数
// }