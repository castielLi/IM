/**
 * Created by apple on 2017/8/25.
 */


//发送消息的最外层

export default class SendMessageDto{
    constructor(){
        this.MSGID = "";
        this.Command = -1;
        this.Resource = null;
        this.Data = {};
        //为了数据库和传递参数的时候更好的判断，代表text image audio friend消息
        this.type = "";
        //同上，代表chatroom，private
        this.way = "";
        //同上，代表message的状态
        this.status = "";
        this.resourceTime="";
    }
}