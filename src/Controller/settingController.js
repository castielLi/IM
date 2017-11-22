/**
 * Created by apple on 2017/11/21.
 */
import IM from '../Core/IM'
import User from '../Core/UserGroup'
import Network from '../Core/Networking/Network'

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
        this.network = new Network();
        currentObj = this;
    }

    //群设置（GroupInformationSetting）
    addGroupToContact(data,callback){
        let params = data.params;
        let info = data.info;
        this.network.methodPOST('Member/AddGroupToContact',params,function(results){
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
        })
    }
    removeGroupFromContact(data,callback){
        let params = data.params;
        let info = data.info;
        this.network.methodPOST('Member/RemoveGroupFromContact',params,function(results){
            if(results.success && results.data.Result){
                currentObj.user.RemoveGroupFromContact(info.ID);
            }
            callback(results);
        })
    }
    getGroupInfo(params,callback){
        this.network.methodPOST('Member/GetGroupInfo',params,function(results){
            callback(results);
        })
    }
    exitGroup(params,callback){
        let {groupId,accountId} = params;
        this.network.methodPOST('Member/ExitGroup',params,function(results){
            if(results.success){
                //删除ChatRecode表中记录
                currentObj.im.deleteChatRecode(groupId);
                //删除该与client的所以聊天记录
                currentObj.im.deleteCurrentChatMessage(groupId,'chatroom');
                //删除account数据库中数据
                currentObj.user.deleteFromGrroup(groupId);
            }
            callback(results);
        })
    }
    searchUser(params,callback){
        this.network.methodPOST('Member/SearchUser',params,function(results){
            callback(results);
        })
    }

    //申请好友验证(validate)
    addNewRelation(relationObj){
        this.user.AddNewRelation(relationObj);
    }
    //私聊设置
    //用户设置页面（InformationSetting）
    removeBlackMember(params,callback){
        this.network.methodPOST('Member/RemoveBlackMember',params,function(results){
            if(results.success){
                currentObj.user.changeRelationBlackList(false, params.Account);
            }
            callback(results);
        })
    }
    addBlackMember(params,callback){
        this.network.methodPOST('Member/AddBlackMember',params,function(results){
            if(results.success){
                currentObj.user.changeRelationBlackList(true, params.Account);
            }
            callback(results);
        })
    }
    deleteFriend(params,callback){
        let {client,accountId} = params;
        this.network.methodPOST('Member/DeleteFriend',params,function(results){
            if(results.success){
                //删除ChatRecode表中记录
                currentObj.im.deleteChatRecode(client);
                //删除该与client的所以聊天记录
                currentObj.im.deleteCurrentChatMessage(client,'private');
                //删除account数据库
                currentObj.user.deleteRelation(client);
            }
            callback(results);
        })
    }
}