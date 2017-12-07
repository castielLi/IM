/**
 * Created by apple on 2017/11/21.
 */
import IM from '../../Core/Management/IM/index'
import User from '../../Core/Management/UserGroup/index'
import Chat from '../../Core/Management/Chat/index'
import Network from '../../Core/Networking/Network'
import RNFS from 'react-native-fs'
import uuidv1 from 'uuid/v1';
import {buildInvationGroupMessage,buildChangeGroupNickMessage} from '../../Core/Management/IM/action/createMessage';
import RelationDto from '../../Logic/Setting/dto/RelationDto'
import ApiBridge from '../ApiBridge/index'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

let currentObj = undefined;

export default class settingController {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);
        this.im = new IM();
        this.user = new User();
        this.chat = new Chat();
        this.network = new Network();
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
                    currentObj.im.storeSendMessage(sendMessage);
                    result.data.sendMessage = sendMessage;
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
                    result.data.sendMessage = sendMessage;
                    currentObj.im.storeSendMessage(sendMessage);

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


    //todo:好友操作
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
            this.user.updateUserInfo(propsRelation)
        }
    }

    //申请好友验证(validate)
    addNewRelation(userObj){
        //todo 张彤 少了 向cache中添加这个人  而且这个relationobj 应该由controller来构造
        this.user.applyFriend(userObj);
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
    removeFriend(params,callback){
        let userId = params.Friend;
        this.apiBridge.request.DeleteFriend(params,function(results){
            if(results.success){
                //删除ChatRecode表中记录
                currentObj.chat.removeConverse(userId);
                // //删除该与client的所以聊天记录
                // currentObj.im.deleteCurrentChatMessage(userId,'private');
                //删除account数据库
                currentObj.user.removeFriend(userId);
            }
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
                currentObj.user.applyFriend(relationObj);
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
                currentObj.user.acceptFriend(relationObj);
                //修改好友申请消息状态
                currentObj.im.updateApplyFriendMessage({"status":ApplyFriendEnum.ADDED,"key":key});
            }
            callback(results);
        })
    }
}