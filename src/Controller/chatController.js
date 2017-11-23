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


//
let myAccount;
//标示当前正在聊天的对象
let currentChat = undefined

//数据缓存
let cache = {};
//{ "wg003723" : { messages: [],unread:1}}


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

        //向im注入controller chat回调方法
        connectIM()
    }


    //接口方法
    setCurrentChat(chat){
        currentChat = chat;
    }

    emptyCurrentChat(){
        currentChat = undefined;
    }


    setMyAccount(accountObj){
        myAccount = accountObj;
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
    //界面通知controller正在与某人会话
    chatWithNewClient(client){
        currentChat = client;
        if(cache[client]){
            cache[client].unread = 0;
            this.im.updateUnReadMessageNumber(client,0);
        }else{
            cache[client] = { messages: [],unread:0}
        }
    }
    //界面通知controller结束与某人会话
    stopChatWithOldClient(){
        currentChat = '';
    }
    //发送消息
    addMessage(message,callback,onprogress){
        this.im.addMessage(message,callback,onprogress);
    }







    //todo 张彤 applyFriend
    acceptFriend(params,callback){
        let {key} = params;
        this.network.methodPOST('Member/AcceptFriend',params,function(results){
            if(results.success){
                //todo controller operate
                let {Account,HeadImageUrl,Nickname,Email} = results.data.Data;
                let relationObj = {RelationId:Account,avator:HeadImageUrl,localImage:'',Nick:Nickname,Type:'private',OtherComment:'',Remark:'',Email,owner:'',BlackList:'false',show:'true'}
                currentObj.user.AddNewRelation(relationObj);
                //修改好友申请消息状态
                currentObj.im.updateApplyFriendMessage({"status":ApplyFriendEnum.ADDED,"key":key});
                results.data.acceptFriend = {key,Account}
            }
            callback(results);
        },false)
    }
    getApplicantsInfo(idS,callback){
        this.user.GetRelationsByRelationIds(idS,callback)
    }

    //聊天信息显示页面(chatDetail/List)
    getInformationByIdandType(Id,type,callback,messageCommand,contentCommand){
        this.user.getInformationByIdandType(Id,type,callback,messageCommand,contentCommand)
    }

    updateMessageLocalSource(MSGID,path){
        this.im.updateMessageLocalSource(MSGID,path)
    }

    updateMessageRemoteSource(MSGID,url){
        this.im.updateMessageLocalSource(MSGID,url)
    }

    // getRecentChatRecode(client,way,range,callback){
    //     this.im.getRecentChatRecode(client,way,range,callback)
    // }



    //todo 李宗骏  通过cache messageId 获得IM 数据


    downloadVideo(requestURL,filePath,callback,onprogress){
       this.im.addDownloadVideoSource(requestURL,filePath,callback,onprogress);
    }


    //获得当前聊天下所有的聊天记录
    getMessagesByIds(){

         let ids;
         for(let item in cache){
            if(item == currentChat){
                ids = cache[item].messages;
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


            //todo 李宗骏:这里要根据实际情况进行判断，修改message的data值，并且更改数据库中的data

            if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_CREATEGROUP){

                let accounts = message.Data.Data.Data.split(',');

                let Nicks = "";
                for(let i = 0; i<accounts.length;i++){
                    if(i != accounts.length - 1){
                        Nicks += currentObj.user.getUserInfoById(accounts[i]).Nick + ",";
                    }else{
                        Nicks += currentObj.user.getUserInfoById(accounts[i]).Nick;
                    }
                }

                let inviter = currentObj.user.getUserInfoById(message.Data.Data.Receiver).Nick;
                message.Data.Data.Data = inviter + "邀请" + Nicks + "加入群聊";

            }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_ADDGROUPMEMBER){

                let accounts = message.Data.Data.Data.split(',');

                let Nick = currentObj.user.getUserInfoById(accounts[0]).Nick

                let inviter = currentObj.user.getUserInfoById(accounts[1]).Nick;
                //
                message.Data.Data.Data = inviter + "邀请" + Nick + "加入群聊";

            }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_DELETEGROUPMEMBER){

                let Nick = currentObj.user.getUserInfoById(message.Data.Data.Data).Nick;
                let inviter = '';
                if(message.Data.Data.Receiver == myAccount.accountId){
                    inviter = myAccount.accountId;
                }else{
                    inviter = currentObj.user.getUserInfoById(message.Data.Data.Receiver).Nick;
                }

                message.Data.Data.Data =  Nick + "被踢"+ inviter+"出了群聊";

            }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_EXITGROUP){

                let accounts = message.Data.Data.Data.split(',');

                let Nick = currentObj.user.getUserInfoById(accounts[0]).Nick

                message.Data.Data.Data =  Nick + "退出了群聊";
            }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_MODIFYGROUPINFO){
                message.Data.Data.Data =  "群主修改了群昵称";
            }
        }

        let reduxMessageDto = buildMessageDto(message,relation);
        currentObj.im.storeRecMessage(reduxMessageDto);
        AppReceiveMessageHandle(reduxMessageDto,relation);
        //收到消息，判断数据库是否需要修改未读消息
        let sender = message.Data.Data.Sender;
        if(sender != currentChat){
            currentObj.im.addChatUnReadMessageaNumber(sender);
        }
    },message.Command,message.Data.Data.Command);
    //todo: 添加这个新的relation进 redux， 如果是group则还需要添加进group数据库
}

function recieveAddFriendMessage(relationId){
    currentObj.user.updateDisplayOfRelation(relationId,'true');
    recieveAddFriendMessage(relationId)
}