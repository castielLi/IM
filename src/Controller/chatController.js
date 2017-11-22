/**
 * Created by apple on 2017/11/21.
 */
import IM from '../Core/IM'
import User from '../Core/UserGroup'
import Network from '../Core/Networking/Network'
import {buildMessageDto} from '../Core/Redux/dto/Common'

//上层应用Controller的接口
//返回消息结果回调
let AppMessageResultHandle = undefined;
//function(success:boolean,data:{})
//返回修改消息状态回调
let AppMessageChangeStatusHandle = undefined;
//function(message:message);

//返回收到消息回调
let AppReceiveMessageHandle = undefined;

//踢出消息回调
let AppKickOutHandle = undefined;

let handleRecieveAddFriendMessage = undefined;

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());



//标示当前正在聊天的对象
let currentChat = undefined

//数据缓存
let cache = {};
//{"wg003723":[MSGID,MSGID]}

let currentObj = undefined;

export default class chatController {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);
        this.im = new IM();
        this.user = new User();
        this.network = new Network();
        currentObj = this;
    }


    connectApp(getMessageResultHandle,changeMessageHandle,receiveMessageHandle,kickOutMessage,recieveAddFriendMessage){
        AppMessageResultHandle = getMessageResultHandle;
        AppMessageChangeStatusHandle = changeMessageHandle;
        AppReceiveMessageHandle = receiveMessageHandle;
        AppKickOutHandle = kickOutMessage;
        handleRecieveAddFriendMessage = recieveAddFriendMessage;
    }


    //接口方法
    setCurrentChat(chat){
        currentChat = chat;
    }

    emptyCurrentChat(){
        currentChat = undefined;
    }


    //todo黄昊东  recentlist
    deleteRecentChatList(rowData){
        //删除chatRecord表中对应记录
        this.im.deleteChatRecode(rowData.Client);
        //删除与该client的所有聊天记录
        this.im.deleteCurrentChatMessage(rowData.Client,rowData.Type)
    }
    //从数据库获取与client的指定聊天记录  start:{start:起始位置,limit:结束位置}
    getRecentChatRecode(client,type,start,callback){
        this.im.getRecentChatRecode(client,type,start,function(messages){
            callback(messages)
        })
    }
     AcceptFriend(requestURL,params,callback){
        this.network.methodPOST(requestURL,params,function(result){

            //todo controller operate

            // callback(success,data);

        })
     }






    //todo 张彤 applyFriend
    acceptFriend(requestURL,params,callback){
        let {key,send} = params.data;
        this.network.methodPOST(requestURL,params,function(results){
            let result;
            if(results.success){
                //todo controller operate
                let {Account,HeadImageUrl,Nickname,Email} = results.data.Data;
                let relationObj = {RelationId:Account,avator:HeadImageUrl,Nick:Nickname,Type:'private',OtherComment:'',Remark:'',Email,owner:'',BlackList:'false',show:'true'}
                currentObj.user.AddNewRelation(relationObj);
                //修改好友申请消息状态
                currentObj.im.updateApplyFriendMessage({"status":ApplyFriendEnum.ADDED,"key":key});
                result = true;
            }
            else{
                result = false;
            }
            callback(result,data);
        })
    }
    getApplicantsInfo(idS,callback){
        this.user.GetRelationsByRelationIds(idS,callback)
    }









    //todo 李宗骏  通过cache messageId 获得IM 数据

    getMessagesByIds(){

         let ids;
         for(let item in cache){
            if(item == currentChat){
                ids = cache[item];
            }
         }

        return this.im.getStoreMessagesByMSGIDs(ids);
    }


}
//私有方法,不允许外部调用
function connectIM(){
    currentObj.im.connectIM(getMessageResultHandle,changeMessageHandle,receiveMessageHandle,kickOutMessage,recieveAddFriendMessage)
}

function getMessageResultHandle(status,MSGID){
   AppMessageResultHandle(status,MSGID);
}

function changeMessageHandle(message){
    AppMessageChangeStatusHandle(message);
}

function kickOutMessage(){
    AppKickOutHandle()
}

function receiveMessageHandle(message){

    currentObj.user.getInformationByIdandType(message.Data.Data.Sender,message.way,function(relation){
        //添加进relation redux

        if(message.way == "chatroom"){
            //添加进group数据库

            if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_CREATEGROUP){

                // let accounts = message.Data.Data.Data.split(',');
                //
                // let nicks = "";
                // for(let i = 0; i<accounts.length;i++){
                //     if(i != accounts.length - 1){
                //         nicks += user.getUserInfoById(accounts[i]).Nick + ",";
                //     }else{
                //         nicks += user.getUserInfoById(accounts[i]).Nick;
                //     }
                // }
                //
                // let inviter = user.getUserInfoById(message.Data.Data.Receiver).Nick;
                // message.Data.Data.Data = inviter + "邀请" + nicks + "加入群聊";

            }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_ADDGROUPMEMBER){

                // let accounts = message.Data.Data.Data.split(',');
                //
                // let nick = user.getUserInfoById(accounts[0]).Nick
                //
                // let inviter = user.getUserInfoById(accounts[1]).Nick;
                //
                // message.Data.Data.Data = inviter + "邀请" + nick + "加入群聊";

            }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_DELETEGROUPMEMBER){

                // let nick = user.getUserInfoById(message.Data.Data.Data).Nick;
                // let inviter = '';
                // if(message.Data.Data.Receiver == myAccountId){
                //     inviter = myAccountId;
                // }else{
                //     inviter = user.getUserInfoById(message.Data.Data.Receiver).Nick;;
                // }
                //
                // message.Data.Data.Data =  nick + "被踢"+ inviter+"出了群聊";

            }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_EXITGROUP){

                // let accounts = message.Data.Data.Data.split(',');
                //
                // let nick = user.getUserInfoById(accounts[0]).Nick
                //
                // message.Data.Data.Data =  nick + "退出了群聊";
            }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_MODIFYGROUPINFO){
                message.Data.Data.Data =  "群主修改了群昵称";
            }
        }


        //todo 李宗骏： 向message中添加头像和昵称

        let reduxMessageDto = buildMessageDto(message,relation);

        AppReceiveMessageHandle(reduxMessageDto,relation);
    },message.Command,message.Data.Data.Command);
    //todo: 添加这个新的relation进 redux， 如果是group则还需要添加进group数据库
}

function recieveAddFriendMessage(relationId){
    currentObj.user.updateDisplayOfRelation(relationId,'true');
    recieveAddFriendMessage(relationId)
}