/**
 * Created by apple on 2018/3/6.
 */
export default class QRCodeManager {
    static getSingleInstance() {
        if (QRCodeManager.SingleInstance == null) {
            QRCodeManager.SingleInstance = new QRCodeManager();
        }
        return QRCodeManager.SingleInstance;
    }
    constructor() {
    }
}
//# sourceMappingURL=QRCodeManager.js.map