/**
 * Created by apple on 2017/12/21.
 */
import TimeHelper from "../../Tools/TimeHelper";
import RequestMethod from "./RequestMethod";
export default class RequestDto {
    constructor() {
        /*请求方式POST/GET*/
        this.method = RequestMethod.POST;
        this.header = null;
        //请求时间
        this.requestTime = TimeHelper.getTimestamp();
    }
}
//# sourceMappingURL=RequestDto.js.map