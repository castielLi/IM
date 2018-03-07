import QRCodeType from "./Enums/QRCodeType";
export default class QRCodeController {
    static getSingleInstance() {
        if (QRCodeController.SingleInstance == null) {
            QRCodeController.SingleInstance = new QRCodeController();
        }
        return QRCodeController.SingleInstance;
    }
    init(uihandle) {
        this.uihandle = uihandle;
    }
    scanCode(data) {
        let tempArray = data.split(':');
        if (tempArray.length == 2) {
            let type = parseInt(tempArray[0]);
            switch (type) {
                case QRCodeType.UserInfoCard:
                    break;
                default:
                    //显示一个字符串
                    break;
            }
        }
        else {
            //显示一个字符串
        }
    }
}
//# sourceMappingURL=QRCodeController.js.map