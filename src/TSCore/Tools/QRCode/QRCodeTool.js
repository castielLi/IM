import QRCodeType from "../../../TSController/Enums/QRCodeType";
export default class QRCodeTool {
    static getSingleInstance() {
        if (QRCodeTool.SingleInstance == null) {
            QRCodeTool.SingleInstance = new QRCodeTool();
        }
        return QRCodeTool.SingleInstance;
    }
    init(callback) {
        this.callback = callback;
    }
    getCode(type, data) {
        return type + ":" + data;
    }
    scanCode(data) {
        let tempArray = data.split(':');
        if (tempArray.length == 2) {
            let type = parseInt(tempArray[0]);
            switch (type) {
                case QRCodeType.UserInfoCard:
                    this.callback.scanFinished && this.callback.scanFinished(type, tempArray[1]);
                    break;
                default:
                    //显示一个字符串
                    this.callback.scanFinished && this.callback.scanFinished(QRCodeType.UnKnow, data);
                    break;
            }
        }
        else {
            //显示一个字符串
            this.callback.scanFinished && this.callback.scanFinished(QRCodeType.UnKnow, data);
        }
    }
}
//# sourceMappingURL=QRCodeTool.js.map