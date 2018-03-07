import QRCodeTool from "../TSCore/Tools/QRCode/QRCodeTool";
/**
 * Created by apple on 2018/3/7.
 */
export default class ScanController {
    constructor() {
        this.codeTool = null;
        this.codeTool = QRCodeTool.getSingleInstance();
    }
    static getSingleInstance() {
        if (ScanController.SingleInstance == null) {
            ScanController.SingleInstance = new ScanController();
        }
        return ScanController.SingleInstance;
    }
    init(uihandle) {
        this.callback = uihandle;
    }
    scanCode(data) {
        this.codeTool.scanCode(data);
    }
    scanFinished(type, data) {
        this.callback && this.callback(type, data);
    }
}
//# sourceMappingURL=ScanController.js.map