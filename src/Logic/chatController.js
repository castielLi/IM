/**
 * Created by apple on 2017/11/21.
 */
import IM from '../Core/Management/IM'
import User from '../Core/Management/UserGroup'
import Chat from '../Core/Management/Chat'
import {buildMessageDto} from '../Core/Redux/dto/Common'
import AppCommandEnum from '../Core/Management/Common/dto/AppCommandEnum'
import MessageCommandEnum from '../Core/Management/Common/dto/MessageCommandEnum'

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

let user = new User();

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

//标示当前群组聊天人员名单变动回调
let currentGroupChatMemberChangesCallback = undefined;
//重新渲染recentList回调
let reRenderRecentListCallBack = undefined;
//重新渲染聊天记录回调
let reRenderChatRecordCallBack = undefined;
//数据缓存
let cache = {};
//{ "wg003723" : { messages: [],unread:1}}
//测试缓存
//let testCache = {};


let currentObj = undefined;

export default class chatController {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);
        this.im = new IM();
        this.user = new User();
        this.chat = new Chat();
        currentObj = this;
    }


    connectApp(getMessageResultHandle,changeMessageHandle,receiveMessageHandle,kickOutMessage,recieveAddFriendMessage,recieveChangeGroupNameMessage){
        AppMessageResultHandle = getMessageResultHandle;
        AppMessageChangeStatusHandle = changeMessageHandle;
        AppReceiveMessageHandle = receiveMessageHandle;
        AppKickOutHandle = kickOutMessage;
        handleRecieveAddFriendMessage = recieveAddFriendMessage;
        handleRecieveChangeGroupNameMessage = recieveChangeGroupNameMessage
        //向im注入controller chat回调方法
        connectIM()
    }


    //接口方法
    setCurrentChat(chat){
        currentChat = chat;
        currentObj.chat.operateChatCache('unread',currentChat,undefined,(results)=>{
            fillNickAndAvatorData(results,(needData)=>{
                reRenderRecentListCallBack(needData);
            })
        })

    }

    emptyCurrentChat(){
        currentChat = '';
    }

    setCurrentGroupChatMemberChangeCallback(callback){
        currentGroupChatMemberChangesCallback = callback;
    }

    emptyChangeCallback(){
        currentGroupChatMemberChangesCallback = undefined;
    }


    setMyAccount(accountObj){
        myAccount = accountObj;
    }
    //todo黄昊东  recentlist
    reRenderRecentList(callback){
        reRenderRecentListCallBack = callback;
    }
    reRenderChatRecord(callback){
        reRenderChatRecordCallBack = callback;
    }
    //初始化最近聊天数据
    initChat(callback){
        this.chat.getAllChatList((results)=>{
            fillNickAndAvatorData(results,(needData)=>{
                callback(needData);
            });

        })
    }
    //初始化某聊天窗口的聊天记录
    initChatRecord(clientId,type,callback){
        this.chat.getChatRecord(clientId,type,(ids)=>{
            currentObj.im.selectMessagesByIds(ids,(messages)=>{
                callback(messages)
            })
        })
    }
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


    //发送消息
    addMessage(message,callback,onprogress){
        this.im.addMessage(message,(status,messageId)=>{
            message.MSGID = messageId;
            currentObj.chat.operateChatCache('send',currentChat,message,(ids,results)=>{
                //重新渲染最近聊天列表
                fillNickAndAvatorData(results,(needData)=>{
                    reRenderRecentListCallBack(needData);
                })
                currentObj.im.selectMessagesByIds(ids,(messages)=>{
                    //重新渲染聊天记录
                    reRenderChatRecordCallBack(messages);
                })
                callback();
            })
            // if(ChatCache[message.Data.Data.Receiver]==undefined){//没有该会话
            // //新增一个会话
            //   currentObj.chat.addOneChat(message.Data.Data.Receiver,message,extractMessage(message),message.MSGID,(results)=>{
            //       //重新渲染聊天记录
            //       currentObj.chat.getChatRecord(message.Data.Data.Receiver,message.way,(ids)=>{
            //           currentObj.im.selectMessagesByIds(ids,(messages)=>{
            //               reRenderChatRecordCallBack(messages);
            //           })
            //       })
            //       //重新渲染最近聊天列表
            //       fillNickAndAvatorData(results,(needData)=>{
            //           reRenderRecentListCallBack(needData);
            //       })
            //
            //
            //       callback();
            //   })
            // }else{
            //     currentObj.chat.updateLastMessageAndTime(message.Data.Data.Receiver,extractMessage(message),message.Data.LocalTime,messageId,(results)=>{
            //         //重新渲染聊天记录
            //         currentObj.chat.getChatRecord(message.Data.Data.Receiver,message.way,(ids)=>{
            //             currentObj.im.selectMessagesByIds(ids,(messages)=>{
            //                 reRenderChatRecordCallBack(messages);
            //             })
            //         })
            //         //重新渲染最近聊天列表
            //         fillNickAndAvatorData(results,(needData)=>{
            //             reRenderRecentListCallBack(needData);
            //         })
            //
            //
            //         callback();
            //     })
            // }
        },onprogress);

        this.chat.sendMessage(message);
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
        this.im.updateMessageRemoteSource(MSGID,url)
    }

    // getRecentChatRecode(client,way,range,callback){
    //     this.im.getRecentChatRecode(client,way,range,callback)
    // }



    //todo 李宗骏  通过cache messageId 获得IM 数据


    manualDownloadResource(requestURL,filePath,callback,onprogress){
       this.im.manualDownloadResource(requestURL,filePath,callback,onprogress);
    }


    //获得当前聊天下所有的聊天记录
    getCurrentChatMessages(){

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

    currentObj.user.getInformationByIdandType(message.Data.Data.Sender,message.way,function(relation,groupMembers){
        //添加进relation redux

        if(message.way == "chatroom"){
            //添加进group数据库


            //todo 李宗骏:这里要根据实际情况进行判断，修改message的data值，并且更改数据库中的data

            if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_CREATEGROUP){

                var accounts = message.Data.Data.Data.split(',');

                let Nicks = "";


                for(let i = 0; i<accounts.length;i++){
                    if(accounts[i] == message.Data.Data.Receiver){
                        accounts.splice(i,1);
                    }
                }

                for(let i = 0; i<accounts.length;i++){
                    if(i != accounts.length - 1){
                        Nicks += currentObj.user.getUserInfoById(accounts[i]) + ",";
                    }else{
                        Nicks += currentObj.user.getUserInfoById(accounts[i]);
                    }
                }

                var inviter = currentObj.user.getUserInfoById(message.Data.Data.Receiver);
                message.Data.Data.Data = inviter + "邀请" + Nicks + "加入群聊";

            }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_ADDGROUPMEMBER){

                currentGroupChatMemberChangesCallback&&currentGroupChatMemberChangesCallback(groupMembers);

                var accounts = message.Data.Data.Data.split(',');

                var name = currentObj.user.getUserInfoById(accounts[0])

                var inviter = currentObj.user.getUserInfoById(accounts[1]);
                //
                message.Data.Data.Data = inviter + "邀请" + name + "加入群聊";

            }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_DELETEGROUPMEMBER){
                var accounts = message.Data.Data.Data.split(',');
                //默认收到被踢消息的人不是被踢人
                let isKickedClient = false;
                for(let i = 0; i<accounts.length;i++){
                    if(accounts[i] == myAccount.accountId){
                        isKickedClient = true;
                        break;
                    }
                }
                if(isKickedClient){
                    message.Data.Data.Data =  "你被群主踢出了该群聊";
                    //处理来自界面的回调方法，隐藏群设置按钮
                }else{
                    let Nicks = "";
                    for(let i = 0; i<accounts.length;i++){
                        if(i != accounts.length - 1){
                            Nicks += currentObj.user.getUserInfoById(accounts[i]) + ",";
                        }else{
                            Nicks += currentObj.user.getUserInfoById(accounts[i]);
                        }
                    }

                    //var name = currentObj.user.getUserInfoById(message.Data.Data.Data);
                    var inviter = '';
                    if(message.Data.Data.Receiver == myAccount.accountId){
                        inviter = myAccount.accountId;
                    }else{
                        inviter = currentObj.user.getUserInfoById(message.Data.Data.Receiver);
                    }

                    message.Data.Data.Data =  Nicks + "被"+ inviter+"踢出了群聊";
                }
            }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_EXITGROUP){

                var accounts = message.Data.Data.Data.split(',');

                var name = currentObj.user.getUserInfoById(accounts[0])

                message.Data.Data.Data =  name + "退出了群聊";
            }else if(message.Data.Data.Command == AppCommandEnum.MSG_BODY_APP_MODIFYGROUPINFO){

                 var name = currentObj.user.getUserInfoById(message.Data.Data.Receiver);

                message.Data.Data.Data =  name+"修改了群昵称";
                let groupName = relation.Nick;
                let groupId = message.Data.Data.Sender;
                //修改redux
                handleRecieveChangeGroupNameMessage(groupId,groupName)
                //修改数据库
                currentObj.user.updateGroupName(groupId,groupName);
            }

            //如果是chatroom 的通知消息需要修改数据库中message的内容，因为第一次存储只会有id，而不是文字
            if(message.Command == MessageCommandEnum.MSG_INFO){
                currentObj.im.updateReceiveMessageContentById(message.Data.Data.Data,message.MSGID);
            }
        }

        //let reduxMessageDto = buildMessageDto(message,relation);
        //AppReceiveMessageHandle(reduxMessageDto,relation);

        currentObj.chat.operateChatCache('receive',currentChat,message,(ids,results)=>{
            //重新渲染最近聊天列表
            fillNickAndAvatorData(results,(needData)=>{
                reRenderRecentListCallBack(needData);
            })
            currentObj.im.selectMessagesByIds(ids,(messages)=>{
                //重新渲染聊天记录
                reRenderChatRecordCallBack(messages);

            })
        })
        //收到消息，判断是否是当前对话

        //let sender = message.Data.Data.Sender;
        // if(sender == currentChat){
        //     currentObj.chat.updateLastMessageAndTime(message.Data.Data.Sender,extractMessage(message),message.Data.LocalTime,message.MSGID,(results)=>{
        //         //重新渲染聊天记录
        //         currentObj.chat.getChatRecord(message.Data.Data.Sender,message.way,(ids)=>{
        //             currentObj.im.selectMessagesByIds(ids,(messages)=>{
        //                 reRenderChatRecordCallBack(messages);
        //             })
        //         })
        //         //重新渲染最近聊天列表
        //         fillNickAndAvatorData(results,(needData)=>{
        //             reRenderRecentListCallBack(needData);
        //         })
        //
        //     })
        // }else{
        //     //新增一个会话
        //     currentObj.chat.addOneChat(message.Data.Data.Sender,message,extractMessage(message),message.MSGID,()=>{
        //         //未读消息+1
        //         currentObj.caht.addUnReadMsgNumber(message.Data.Data.Sender,(results)=>{
        //             //重新渲染聊天记录
        //             currentObj.chat.getChatRecord(message.Data.Data.Sender,message.way,(ids)=>{
        //                 currentObj.im.selectMessagesByIds(ids,(messages)=>{
        //                     reRenderChatRecordCallBack(messages);
        //                 })
        //             })
        //             //重新渲染最近聊天列表
        //             fillNickAndAvatorData(results,(needData)=>{
        //                 reRenderRecentListCallBack(needData);
        //             })
        //
        //         })
        //     })
        // }

        currentObj.chat.receiveMessage(message)
    },message.Command,message.Data.Data.Command);

}

function recieveAddFriendMessage(relationId){

    console.log("执行了chatcontroller")

    currentObj.user.updateDisplayOfRelation(relationId,'true');
    handleRecieveAddFriendMessage(relationId)
}
//消息提取
function extractMessage(message){
    switch (message.type) {
        case 'text':
            return message.Data.Data.Data;
        case 'image':
            return '[图片]';
        case 'audio':
            return '[音频]';
        case 'video':
            return '[视频]';
        case 'information':
            return '[通知]'
        // return message.Data.Data.Data
        default:
            return '';
    }
}
//数据填充
//填充最近聊天头像昵称
function fillNickAndAvatorData(data,callback){
    objLength = Object.keys(data).length;
    let account = 0;
    for(let key in data){
        user.getNickAndAvatorById(key,data[key].Type,(nickAndAvatorObj)=>{
            account++;
            data[key] = {...data[key],...nickAndAvatorObj}
            if(account == objLength){
                callback(data)
            }
        });
    }
}