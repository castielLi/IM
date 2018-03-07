import QRCodeType from "../../TSController/Enums/QRCodeType";
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
//# sourceMappingURL=QRCodeTool.js.map