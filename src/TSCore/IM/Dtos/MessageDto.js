import GUID from "../../Tools/GUID";
export default class MessageDto {
    createMessage(command, prefix = "") {
        this.Command = command;
        this.MSGID = prefix + "_" + GUID.NewGUID();
        return this;
    }
}
//# sourceMappingURL=MessageDto.js.map