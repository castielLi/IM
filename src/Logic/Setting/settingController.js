/**
 * Created by apple on 2017/11/21.
 */
import User from '../../Core/Management/UserGroup/index'
import Chat from '../../Core/Management/Chat/index'
import RNFS from 'react-native-fs'
import uuidv1 from 'uuid/v1';
import {buildInvationGroupMessage,buildChangeGroupNickMessage} from '../../Core/Management/IM/action/createMessage';
import RelationDto from '../Common/dto/RelationDto'
import IMMessageToManagementMessageDto from '../../Core/Management/Common/methods/IMMessageToManagementMessageDto'
import ApiBridge from '../ApiBridge/index'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

let currentObj = undefined;
let updateGroupContact = undefined;
export default class settingController {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);
        this.user = new User();
        this.chat = new Chat();
        this.apiBridge = new ApiBridge();
        currentObj = this;
    }


    //todo:群操作
    //群设置（GroupInformationSetting）
    addGroupToContact(params,groupObj,callback){
        this.apiBridge.request.AddGroupToContact(params,function(results){
            if(results.success && results.data.Result){
                //todo：张彤 这个obj 在 settingController dto里面写一个RelationDto  let obj = new RelationDto()
                let group = new RelationDto();
                group.RelationId = groupObj.ID;
                group.OtherComment = groupObj.Description;
                group.Nick = groupObj.Name;
                group.BlackList = false;
                group.Type = 'group';
                group.avator = groupObj.ProfilePicture==null?"":groupObj.ProfilePicture;
                group.owner = groupObj.Owner;
                group.show = true;
                currentObj.user.addGroupToContact(group);
                //todo:执行contact中grouplist 的刷新回调
            }
            callback(results);
        });
    }
    removeGroupFromContact(params,groupId,callback){
        this.apiBridge.request.RemoveGroupFromContact(params,function(results){
            if(results.success && results.data.Result){
                currentObj.user.removeGroupFromContact(groupId);
                //todo:执行contact中grouplist 的刷新回调
            }
            callback(results);
        })
    }
    getGroupInfo(params,callback){
        this.apiBridge.request.GetGroupInfo(params,function(results){
            callback(results);
        })
    }

    //修改群组的名称
    //参数 群id，群名称，请求参数，回调
    updateGroupName(accountId,groupId,params,callback){
        this.apiBridge.request.ModifyGroupName(params,function(result){
            if(result.success){
                if(result.data.Data){
                    currentObj.user.updateGroupName(params.GroupId,params.Name);
                    //todo:通知 RecentList和 chatDetali 改变名称   chatlist中还有新的消息通知

                    //本地模拟消息
                    let messageId = uuidv1();
                    let sendMessage = buildChangeGroupNickMessage(accountId,groupId,"你修改了群昵称",messageId);
                    currentObj.im.storeSendMessage(sendMessage);

                    //todo 李宗骏 创建chatmessagedto 转换
                    let chatMessageDto = {};
                    currentObj.chat.addMessage(chatMessageDto);
                    result.data.sendMessage = sendMessage;
                }
            }
            callback(result);
        });
    }

    //修改群公告
    toChangeDiscription(params,callback){
        //todo：目前是返回设置页面 重新http请求刷新
        this.apiBridge.request.ModifyGroupDescription(params,function(result){
            if(result.success){
                currentObj.user.updataGroupDiscription(params.GroupId,params.Desc);
            }
            callback(result);
        })
    }

    //创建群
    //参数：发起人id,发起人昵称,[{"Account":选中的id1},{"Account":选中的id2},...],“选中的nick1,选中的nick2,...”，请求参数，回调函数
    createGroup(accountId,accountName,splNeedArr,Nicks,params,callback){
        this.apiBridge.request.CreateGroup(params,function(result){
            if(result.success){
                if(result.data.Data != null){
                    let groupObj = new RelationDto();
                    groupObj.RelationId = result.data.Data;
                    groupObj.owner = accountId;
                    groupObj.Nick = accountName + "发起的群聊";
                    groupObj.Type = 'group';
                    groupObj.show = 'false';

                    //添加关系到数据库
                    currentObj.user.createGroup(groupObj,splNeedArr);
                    result.data.relation = groupObj;

                    let messageId = uuidv1();
                    //创建群组消息
                    let text = Nicks;
                    //todo：lizongjun 现在不需要自己发送消息，后台统一发送
                    //todo： lizongjun im 存储消息变为chat存储消息
                    //向添加的用户发送邀请消息
                    let sendMessage = buildInvationGroupMessage(accountId,result.data.Data,text,messageId);


                    let messageDto = IMMessageToManagementMessageDto(sendMessage);
                    currentObj.chat.addMessage(result.data.Data,messageDto,true);


                    //创建文件夹
                    let audioPath = RNFS.DocumentDirectoryPath + '/' +accountId+'/audio/chat/' + 'group' + '-' +result.data.Data;
                    let imagePath = RNFS.DocumentDirectoryPath + '/' +accountId+'/image/chat/' + 'group' + '-' +result.data.Data;
                    RNFS.mkdir(audioPath)
                    RNFS.mkdir(imagePath)
                }


            }
            callback(result);
        })
    }

    //添加群成员
    //参数：发起人id,“选中的nick1,选中的nick2,...”,[{"Account":选中的id1},{"Account":选中的id2},...]，群Id,,请求参数，回调函数
    addGroupMember(accountId,Nicks,splNeedArr,groupId,chooseArr,params,callback){
        this.apiBridge.request.AddGroupMember(params,function(result){
            if(result.success){
                if(result.data.Data != null){
                    let messageId = uuidv1();
                    //创建群组消息
                    let text = Nicks;

                    //todo：lizongjun 现在不需要自己发送消息，后台统一发送
                    //向添加的用户发送邀请消息
                    let sendMessage = buildInvationGroupMessage(accountId,groupId,text,messageId);

                    let messageDto = IMMessageToManagementMessageDto(sendMessage);
                    currentObj.chat.addMessage(result.data.Data,messageDto,true);

                    //添加新人到缓存和数据库
                    currentObj.user.addGroupMember(groupId,splNeedArr);
                    // chooseArr.forEach((val,it)=>{
                    //     currentObj.user.groupAddMemberChangeCash(groupId,val.RelationId);
                    //     currentObj.user.privateAddMemberChangeCash(val.RelationId,val)
                    // })
                    //成员增加后，聊天室的groupMembers也要增加
                    currentObj.user.getInformationByIdandType(groupId,'group',function(relation,groupMembers){
                        // currentGroupChatMemberChangesCallback(groupMembers);
                    })
                }
            }
            callback(result);
        })
    }

    //退群操作问题
    exitGroup(params,callback){
        let groupId = params.GroupId;
        this.apiBridge.request.ExitGroup(params,function(results){
            if(results.success){
                currentObj.destroyGroup(groupId);
            }
            callback(results);
        })
    }
    removeGroupMember(params,close = false,callback){
        this.apiBridge.request.RemoveGroupMember(params,function(results){
            if(results.success && results.data.Data){
                let members = params.Accounts.splice(",");//Accounts 字符串 a,b,c
                currentObj.user.removeGroupMember(params.GroupId,members);
                if(close){
                    currentObj.destroyGroup(params.GroupId);
                }
            }
            callback(results)
        })
    }
    //摧毁群
    destroyGroup(groupId){

        //todo:删除会话,删除群及群成员信息,删除未读消息数
        this.chat.removeConverse(groupId,true);
        this.im.deleteCurrentChatMessage(groupId,true);
        this.user.removeGroup(groupId);
    }


    getGroupIsInContact(groupId){
        return this.user.getGroupIsInContactFromCache(groupId);
    }

    getIsBlackList(relationId){
        return this.user.getIsBlackListFromCache(relationId)
    }
    //搜索用户界面也用到了
    searchUser(params,callback){
        this.apiBridge.request.SearchUser(params,function(results){
            callback(results);
        })
    }

    //用户页面（clientInformation.js）
    getFriendUserInfo(params,callback){
        this.apiBridge.request.GetFriendUserInfo(params,function(results){
            callback(results);
        })
    }

    //私聊设置
    //用户设置页面（InformationSetting）
    removeBlackMember(params,callback){
        this.apiBridge.request.RemoveBlackMember(params,function(results){
            if(results.success){
                currentObj.user.setBlackMember(false, params.Account);
            }
            callback(results);
        })
    }
    addBlackMember(params,callback){
        this.apiBridge.request.AddBlackMember(params,function(results){
            if(results.success){
                currentObj.user.setBlackMember(true, params.Account);
            }
            callback(results);
        })
    }

    //根据clientId ，判断是不是好友关系，是的话返回这条关系,否则返回null
    getUserRelationByIdFromCache(clientId){
        return this.user.getUserRelationById(clientId);
    }
}
