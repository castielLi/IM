/**
 * Created by apple on 2017/12/8.
 */
import User from '../../Core/Management/UserGroup/index'
import ApiBridge from '../ApiBridge/index'
import ApplyFriendEnum from '../../Core/Management/Common/dto/AppCommandEnum'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

let currentObj = undefined;

let updateContact = undefined;
let updateGroupContact = undefined;

export default class contactController {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);
        this.user = new User();
        this.apiBridge = new ApiBridge();
        currentObj = this;
    }

    //todo:好友操作
    //获取通讯录好友或者群列表
    getLatestContactList(callback){
        updateContact = callback;

        this.user.getUserRelationsOfShow((relations)=>{
            updateContact(relations);
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
                let userCache= currentObj.user.removeFriend(userId);
                //重新渲染通讯录
                let tempArr = filterShowToArr(userCache)
                updateContact(tempArr);
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
            let userCache = this.user.updateUserInfo(propsRelation)
            //重新渲染通讯录
            let tempArr = filterShowToArr(userCache)
            updateContact(tempArr);
        }
    }

    getGroupContactList(callback){
        updateGroupContact = callback;
        this.user.getGroupRelationsOfShow((relations)=>{
            updateGroupContact(relations);
        })
    }

    applyFriend(params,callback){
        this.apiBridge.request.ApplyFriend(params,function(result){
            //单方面添加好友
            if(result.success && result.data.Data instanceof Object){
                let {Account,HeadImageUrl,Nickname,Email} = result.data.Data.MemberInfo;
                let IsInBlackList =result.data.Data.IsInBlackList
                let relationObj = {RelationId:Account,avator:HeadImageUrl,Nick:Nickname,Type:'private',OtherComment:'',Remark:'',Email,owner:'',BlackList:IsInBlackList,show:'true'}
                let userCache= currentObj.user.applyFriend(relationObj);
                //重新渲染通讯录
                let tempArr = filterShowToArr(userCache)
                updateContact(tempArr);
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
                let userCache = currentObj.user.acceptFriend(relationObj);
                //重新渲染通讯录
                let tempArr = filterShowToArr(userCache)
                updateContact(tempArr);
                //修改好友申请消息状态
                currentObj.im.updateApplyFriendMessage({"status":ApplyFriendEnum.ADDED,"key":key});
            }
            callback(results);
        })
    }
}

function filterShowToArr(obj){
    let tempArr = [];
    for(let key in obj){
        if(obj[key].show == true || obj[key].show == 'true'){
            tempArr.push(obj[key])
        }
    }
    return tempArr;
}