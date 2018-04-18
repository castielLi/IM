var ChatCommand;
(function (ChatCommand) {
    // 单聊消息
    ChatCommand[ChatCommand["MSG_BODY_CHAT_C2C"] = 1] = "MSG_BODY_CHAT_C2C";
    // 群聊消息
    ChatCommand[ChatCommand["MSG_BODY_CHAT_C2G"] = 2] = "MSG_BODY_CHAT_C2G";
    // 聊天室消息
    ChatCommand[ChatCommand["MSG_BODY_CHAT_C2R"] = 3] = "MSG_BODY_CHAT_C2R";
    // 商家消息(会员发送给商家)
    ChatCommand[ChatCommand["MSG_BODY_CHAT_C2B"] = 4] = "MSG_BODY_CHAT_C2B";
    //商家消息(商家发送给会员:包括客服和群发消息)
    ChatCommand[ChatCommand["MSG_BODY_CHAT_B2C"] = 5] = "MSG_BODY_CHAT_B2C";
    //撤回消息
    ChatCommand[ChatCommand["MSG_BODY_CHAT_RETACT"] = 6] = "MSG_BODY_CHAT_RETACT";
})(ChatCommand || (ChatCommand = {}));
export default ChatCommand;
//# sourceMappingURL=ChatCommand.js.map