import ApplyMessageStatus from '../Enums/ApplyMessageStatus';
export default class ApplyMessageDto {
    convertInfoMessageToApplyMessageDto(info) {
        let data = info.Data;
        this.key = data.ApplyKey;
        this.comment = data.Message;
        this.sender = info.Sender;
        this.time = new Date().getTime();
        this.status = ApplyMessageStatus.WAIT;
        return this;
    }
}
//# sourceMappingURL=ApplyMessageDto.js.map