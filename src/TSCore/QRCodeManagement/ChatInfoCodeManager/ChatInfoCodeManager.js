import QRCodeType from "../Enums/QRCodeType";
/**
 * Created by apple on 2018/3/6.
 */
export default class ChatInfoCodeManager {
    constructor() {
        this.callback = null;
    }
    static getSingleInstance() {
        if (ChatInfoCodeManager.SingleInstance == null) {
            ChatInfoCodeManager.SingleInstance = new ChatInfoCodeManager();
        }
        return ChatInfoCodeManager.SingleInstance;
    }
    init(callback) {
        this.callback = callback;
    }
    analysis(data) {
        this.callback.scanFinished && this.callback.scanFinished(QRCodeType.Chat);
    }
}
//# sourceMappingURL=ChatInfoCodeManager.js.map