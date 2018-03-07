import QRCodeType from "./Enums/QRCodeType";
export default class QRCodeManager {
    constructor() {
        this.moduleHandle = null;
    }
    static getSingleInstance() {
        if (QRCodeManager.SingleInstance == null) {
            QRCodeManager.SingleInstance = new QRCodeManager();
        }
        return QRCodeManager.SingleInstance;
    }
    init(handle) {
        this.moduleHandle = handle;
    }
    scanCode(data) {
        let tempArray = data.split(':');
        let type = parseInt(tempArray[0]);
        switch (type) {
            case QRCodeType.User:
                this.moduleHandle.scanFinished(type, data);
                break;
            default:
                break;
        }
    }
    getCode(type, params) {
        return "";
    }
}
//# sourceMappingURL=QRCodeManager.js.map