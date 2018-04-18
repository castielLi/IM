import QRCodeTool from "../TSCore/Tools/QRCode/QRCodeTool";
/**
 * Created by apple on 2018/3/7.
 */
export default class ScanController {
    constructor() {
        this.codeTool = null;
        this.codeTool = QRCodeTool.getSingleInstance();
        this.codeTool.init(this);
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