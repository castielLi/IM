import TimeHelper from "../../Tools/TimeHelper";
import BodyCommand from "../Enums/BodyCommand";
export default class MessageBodyDto {
    createBodyMessage() {
        this.Command = BodyCommand.MSG_BODY_CHAT;
        this.IsACK = true;
        this.IsOfflineSaved = true;
        this.IsHistorySaved = true;
        this.IsOfflineNotify = true;
        this.LocalTime = TimeHelper.getTimestamp();
        return this;
    }
}
//# sourceMappingURL=MessageBodyDto.js.map