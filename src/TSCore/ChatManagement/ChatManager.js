import DBManager from "./DBManagement/DBManager";
export default class ChatManager {
    constructor(isDB) {
        this.dbManager = null;
        if (isDB) {
            this.dbManager = new DBManager();
        }
    }
    addMessage(chatId, group, message, inConversation, callback) {
        if (this.dbManager != null)
            this.dbManager.addMessage(chatId, group, message, inConversation, callback);
    }
    removeMessage(chatId, group, messageId) {
        if (this.dbManager != null)
            this.dbManager.removeMessage(chatId, group, messageId);
    }
    removeAllMessage(chatId, group) {
        if (this.dbManager != null)
            this.dbManager.removeAllMessage(chatId, group);
    }
    updateMessageStatus(chatId, group, messageId, status) {
        if (this.dbManager != null) { }
        this.dbManager.updateMessageStatus(chatId, group, messageId, status);
    }
    updateMessageLocalSource(chatId, group, messageId, path) {
        if (this.dbManager != null)
            this.dbManager.updateMessageLocal(chatId, group, messageId, path);
    }
    updateMessageUrl(chatId, group, messageId, url) {
        if (this.dbManager != null)
            this.dbManager.updateMessageUrl(chatId, group, messageId, url);
    }
    getConversationList(callback) {
        if (this.dbManager != null)
            this.dbManager.getConverseList(callback);
    }
    getChatList(chatId, group, maxId, callback) {
        if (this.dbManager != null)
            this.dbManager.getMessages(chatId, group, maxId, callback);
    }
    updateChatRecord(chatId, lastSender, lastTime, message) {
        if (this.dbManager != null)
            this.dbManager.updateChatRecord(chatId, lastSender, lastTime, message);
    }
    removeConversation(chatId, group = false) {
        if (this.dbManager != null)
            this.dbManager.removeConverse(chatId, group);
    }
    clearUnRead(chatId = "", group = false) {
        if (this.dbManager != null)
            this.dbManager.updateUnRead(chatId, group, 0);
    }
    changeUnRead(chatId = "", group = false, number) {
        if (this.dbManager != null)
            this.dbManager.updateUnRead(chatId, group, number);
    }
    markMessageRead(chatId) {
        if (this.dbManager != null)
            this.dbManager.markMessageRead(chatId);
    }
    getAllChatSetting(callback) {
        this.dbManager.getAllChatSetting(callback);
    }
    setChatStickToTheTop(chatId, group, value) {
        this.dbManager.setStickToTheTop(chatId, group, value);
    }
    setChatNoDisturb(chatId, group, value) {
        this.dbManager.setNoDisturb(chatId, group, value);
    }
    setChatBackgroundImage(chatId, group, path) {
        this.dbManager.setChatBackGroundImage(chatId, group, path);
    }
}
//# sourceMappingURL=ChatManager.js.map