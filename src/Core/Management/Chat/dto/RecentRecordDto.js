/**
 * Created by apple on 2017/8/25.
 */


//发送消息的最外层

export default class RecentRecordDtoDto{
    constructor(){
            this.Client = "",
            this.LastMessage =  "",
            this.Time =  "",
            this.Type = "",
            this.unReadMessageCount = 0,
            this.Record = []
    }
}