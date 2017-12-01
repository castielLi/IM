/**
 * Created by apple on 2017/11/21.
 */
import IM from '../Core/Management/IM'
import User from '../Core/Management/UserGroup'
import Network from '../Core/Networking/Network'
import RNFS from 'react-native-fs'
import uuidv1 from 'uuid/v1';
import {buildInvationGroupMessage,buildChangeGroupNickMessage} from '../Core/Management/IM/action/createMessage';
import RelationModel from '../Core/Management/UserGroup/dto/RelationModel'
import ApiBridge from './ApiBridge'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

let currentObj = undefined;

//标示当前群组聊天人员名单变动回调
let currentGroupChatMemberChangesCallback = undefined;
let setGroupListChangeCallback = undefined;
let setContactListChangeCallback = undefined;

export default class settingController {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);
        this.im = new IM();
        this.user = new User();
        this.network = new Network();
        this.apiBridge = new ApiBridge();
        currentObj = this;
    }


    //todo:来之页面的注入回调
    setGroupListChangeCallback(callback){
        setGroupListChangeCallback = callback;
    }
    setContactListChangeCallback(callback){
        setContactListChangeCallback = callback;
    }

    //todo：页面获取到信息的方法
    getLatestGroupList(callback){
        let concat = this.user.getCacheChatroomInfo();
        callback && callback(concat);
    }
    getLatestContactList(callback){
        let concat = this.user.getCachePrivateInfo();
        callback && callback(concat);
    }
    initUserGroupCache(relations){
        this.user.initUserGroupCache(relations)
    }

    //群设置（GroupInformationSetting）
    addGroupToContact(data,callback){
        let params = data.params;
        let info = data.info;
        this.apiBridge.request.AddGroupToContact(params,function(results){
            if(results.success && results.data.Result){
                let obj = {
                    RelationId:info.ID,
                    OtherComment:info.Description,
                    Nick:info.Name,
                    BlackList:false,
                    Type:'chatroom',
                    avator:info.ProfilePicture==null?"":info.ProfilePicture,
                    owner:info.Owner,
                    show:true}
                currentObj.user.AddNewGroup(obj);
            }
            callback(results);
        });
    }
    removeGroupFromContact(data,callback){
        let params = data.params;
        let info = data.info;
        this.apiBridge.request.RemoveGroupFromContact(params,function(results){
            if(results.success && results.data.Result){
                currentObj.user.RemoveGroupFromContact(info.ID);
            }
            callback(results);
        })
    }
    getGroupInfo(params,callback){
        this.apiBridge.request.GetGroupInfo(params,function(results){
            callback(results);
        })
    }
    exitGroup(params,callback){
        let {GroupId,Account} = params;
        this.apiBridge.request.ExitGroup(params,function(results){
            if(results.success){
                // //删除ChatRecode表中记录
                // currentObj.im.deleteChatRecode(groupId);
                // //删除该与client的所以聊天记录
                // currentObj.im.deleteCurrentChatMessage(groupId,'chatroom');
                // //删除account数据库中数据
                // currentObj.user.deleteFromGrroup(groupId);
                currentObj.destroyGroup(GroupId);
            }
            callback(results);
        })
    }
    removeGroupMember(data,callback){
        let {GroupId} = data.params;
        let {close} = data.argument;
        this.apiBridge.request.RemoveGroupMember(data.params,function(results){
            if(results.success && results.data.Data){
                if(close){
                    currentObj.destroyGroup(GroupId);
                }
            }
            callback(results)
        })
    }

    //搜索用户界面也用到了
    searchUser(params,callback){
        this.apiBridge.request.SearchUser(params,function(results){
            callback(results);
        })
    }

    //申请好友验证(validate)
    addNewRelation(relationObj){
        this.user.AddNewRelation(relationObj);
        this.user.addUserGroupCache(relationObj);
    }
    //私聊设置
    //用户设置页面（InformationSetting）
    removeBlackMember(params,callback){
        this.apiBridge.request.RemoveBlackMember(params,function(results){
            if(results.success){
                currentObj.user.changeRelationBlackList(false, params.Account);
            }
            callback(results);
        })
    }
    addBlackMember(params,callback){
        this.apiBridge.request.AddBlackMember(params,function(results){
            if(results.success){
                currentObj.user.changeRelationBlackList(true, params.Account);
            }
            callback(results);
        })
    }
    deleteFriend(params,callback){
        let {Friend,Applicant} = params;
        this.apiBridge.request.DeleteFriend(params,function(results){

            if(results.success){
                //删除ChatRecode表中记录
                currentObj.im.deleteChatRecode(Friend);
                //删除该与client的所以聊天记录
                currentObj.im.deleteCurrentChatMessage(Friend,'private');
                //删除account数据库
                currentObj.user.deleteRelation(Friend);
            }
            callback(results);
        })
    }
    //用户页面（clientInformation.js）
    getFriendUserInfo(params,callback){
        this.apiBridge.request.GetFriendUserInfo(params,function(results){
            callback(results);
        })
    }
    applyFriend(params,callback){
        this.apiBridge.request.ApplyFriend(params,function(result){
            //单方面添加好友
            if(result.success && result.data.Data instanceof Object){
                let {Account,HeadImageUrl,Nickname,Email} = result.data.Data.MemberInfo;
                let IsInBlackList =result.data.Data.IsInBlackList
                let relationObj = {RelationId:Account,avator:HeadImageUrl,Nick:Nickname,Type:'private',OtherComment:'',Remark:'',Email,owner:'',BlackList:IsInBlackList,show:'true'}
                currentObj.user.AddNewRelation(relationObj)
                currentObj.user.addUserGroupCache(relationObj)

            }
            callback(result);
        })
    }
    acceptFriend(params,callback){
        let {key} = params;
        this.apiBridge.request.AcceptFriend(params,function(results){
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
        })
    }
    //更新关系和头像 （clientInformation.js）
    UpdateFriendInfo(accountId,UserInfo,propsRelation){
        let isUpdate;
        let toFile = `${RNFS.DocumentDirectoryPath}/${accountId}/image/avator/${new Date().getTime()}.jpg`;

        if(propsRelation.Nick !== UserInfo.Nickname || propsRelation.OtherComment !== UserInfo.Gender || propsRelation.Email !== UserInfo.Email){
            propsRelation.Nick = UserInfo.Nickname;
            propsRelation.OtherComment = UserInfo.Gender;
            propsRelation.Email = UserInfo.Email;
            isUpdate = true;
        }
        updateImage = (result) => {
            console.log('下载成功,对数据库进行更改')
            //LocalImage = toFile;
            if(propsRelation.LocalImage){
                RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${accountId}/image/avator/${propsRelation.LocalImage}`).then(()=>{console.log('旧头像删除成功')}).catch(()=>{console.log('旧图片删除失败')})
            }
            //todo:缺少数据库操作
        };
        if(UserInfo.HeadImageUrl&&propsRelation.avator !== UserInfo.HeadImageUrl){
            propsRelation.avator = UserInfo.HeadImageUrl;
            isUpdate = true;
            this.network.methodDownload(UserInfo.HeadImageUrl,toFile,updateImage)
        }

        if(isUpdate){
            this.user.updateRelation(propsRelation)
        }
    }



    //摧毁群
    destroyGroup(groupId){
        this.im.deleteChatRecode(groupId);
        this.im.deleteCurrentChatMessage(groupId,"chatroom");
        this.user.deleteFromGrroup(groupId);
    }

    //创建群
    //参数：发起人id,发起人昵称,[{"Account":选中的id1},{"Account":选中的id2},...],“选中的nick1,选中的nick2,...”，请求参数，回调函数
    createGroup(accountId,accountName,splNeedArr,Nicks,params,callback){
        this.apiBridge.request.CreateGroup(params,function(result){
            if(result.success){
                if(result.data.Data != null){
                    let relation = new RelationModel();
                    relation.RelationId = result.data.Data;
                    relation.owner = accountId;
                    relation.Nick = accountName + "发起的群聊";
                    relation.Type = 'chatroom';
                    relation.show = 'false';

                    //添加关系到数据库
                    currentObj.user.AddGroupAndMember(relation,splNeedArr);
                    currentObj.user.addGroupAndMemberCache(relation,splNeedArr );
                    result.data.relation = relation;
                    let messageId = uuidv1();
                    //创建群组消息
                    let text = Nicks;

                    //todo：lizongjun 现在不需要自己发送消息，后台统一发送
                    //向添加的用户发送邀请消息
                    let sendMessage = buildInvationGroupMessage(accountId,result.data.Data,text,messageId);
                    currentObj.im.storeSendMessage(sendMessage);
                    result.data.sendMessage = sendMessage;
                    //创建文件夹
                    let audioPath = RNFS.DocumentDirectoryPath + '/' +accountId+'/audio/chat/' + 'chatroom' + '-' +result.data.Data;
                    let imagePath = RNFS.DocumentDirectoryPath + '/' +accountId+'/image/chat/' + 'chatroom' + '-' +result.data.Data;
                    RNFS.mkdir(audioPath)
                    RNFS.mkdir(imagePath)
                }


            }
            callback(result);
        })
    }

    setCurrentGroupChatMemberChangeCallback(callback){
        currentGroupChatMemberChangesCallback = callback;
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
                    result.data.sendMessage = sendMessage;
                    currentObj.im.storeSendMessage(sendMessage);

                    //添加新人到缓存和数据库
                    currentObj.user.AddGroupAndMember(groupId,splNeedArr);
                    chooseArr.forEach((val,it)=>{
                        currentObj.user.groupAddMemberChangeCash(groupId,val.RelationId);
                        currentObj.user.privateAddMemberChangeCash(val.RelationId,val)
                    })
                    //成员增加后，聊天室的groupMembers也要增加
                    currentObj.user.getInformationByIdandType(groupId,'chatroom',function(relation,groupMembers){
                        currentGroupChatMemberChangesCallback(groupMembers);
                    })
                }

            }
            callback(result);
        })
    }

    //修改群组的名称
    //参数 群id，群名称，请求参数，回调
    updateGroupName(accountId,groupId,name,params,callback){
        this.apiBridge.request.ModifyGroupName(params,function(result){
            if(result.success){
                if(result.data.Data){
                    //本地模拟消息
                    let messageId = uuidv1();
                    let sendMessage = buildChangeGroupNickMessage(accountId,groupId,"你修改了群昵称",messageId);
                    currentObj.im.storeSendMessage(sendMessage);
                    result.data.sendMessage = sendMessage;
                    currentObj.user.updateGroupName(groupId,name);
                }
            }
            callback(result);
        })
    }

    //修改群公告
    toChangeDiscription(params,callback){
        this.apiBridge.request.ModifyGroupDescription(params,function(result){
            callback(result);
        })
    }
}