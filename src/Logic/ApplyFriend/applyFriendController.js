import IM from '../../Core/Management/IM/index'
import ApplyFriend from '../../Core/Management/ApplyFriend/index'
import User from '../../Core/Management/UserGroup/index'
import applyFriendDto from './dto/applyFriendDto'
import ApiBridge from '../ApiBridge/index'
import ApplyFriendEnum from '../../Core/Management/Common/dto/ApplyFriendEnum'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());
let currentObj = undefined;
let cache = {}; //{{key:{}},{key:{}}
let currentPage = false;

//todo:注入回调
let updateApplyFriendHandle = undefined;

export default class ApplyFriendController {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);
        this.im = new IM();
        this.user = new User();
        this.apply = new ApplyFriend();
        this.apiBridge = new ApiBridge();
        currentObj = this;
    }

    setApplyFriendRecord(callback){
        currentPage = true;
        updateApplyFriendHandle = callback;

        connectManagement();

        this.apply.GetAllApplyMessage(function (record) {
            let sendArray = record.map(function (current,index,array) {
                return {chatId:current.send,group:false};
            });
            this.user.init(sendArray, (userArray) => {

                for(let i=0; i<userArray.length;i++){
                    let applyFriendObj = new applyFriendDto();
                    applyFriendObj.time = record[i].time;
                    applyFriendObj.comment = record[i].comment;
                    applyFriendObj.key = record[i].key;
                    applyFriendObj.send = record[i].send;
                    applyFriendObj.status = record[i].status;

                    applyFriendObj.avator = userArray[i].avator;
                    applyFriendObj.nick = userArray[i].Nick;
                    applyFriendObj.localImage = userArray[i].localImage;

                    cache[applyFriendObj.send] = applyFriendObj;
                }
            });

            let Record = Object.values(cache);
            updateApplyFriendHandle(Record);
        })
    }

    receiveApplyFriend(applyRecord){
        let sendArray = [].push(applyRecord)
        this.user.init(sendArray, (userArray) => {
            for(let i=0; i<userArray.length;i++){
                let applyFriendObj = new applyFriendDto();
                applyFriendObj.time = applyRecord[i].time;
                applyFriendObj.comment = applyRecord[i].comment;
                applyFriendObj.key = applyRecord[i].key;
                applyFriendObj.send = applyRecord[i].send;
                applyFriendObj.status = applyRecord[i].status;

                applyFriendObj.avator = userArray[i].avator;
                applyFriendObj.nick = userArray[i].Nick;
                applyFriendObj.localImage = userArray[i].localImage;

                cache[applyFriendObj.send] = applyFriendObj;
            }
        });
        let Record = Object.values(cache);
        updateApplyFriendHandle(Record)
    }

    acceptFriend(params,callback){
        this.apiBridge.request.AcceptFriend(params,function(results){
            if(results.success){
                //todo controller operate
                let {Account,HeadImageUrl,Nickname,Email} = results.data.Data;
                let relationObj = {RelationId:Account,avator:HeadImageUrl,localImage:'',Nick:Nickname,Type:'private',OtherComment:'',Remark:'',Email,owner:'',BlackList:'false',show:'true'}
                currentObj.user.acceptFriend(relationObj);

                //修改缓存好友申请消息状态
                cache[Account].status = ApplyFriendEnum.ADDED;
                //修改数据库好友申请消息状态
                currentObj.apply.UpdateApplyMessageStatus({"key":params.key,"status":ApplyFriendEnum.ADDED});

                let Record = Object.values(cache);
                updateApplyFriendHandle(Record);
                //todo: 数据库改变数据  通知contact页面刷新

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
                currentObj.user.acceptFriend(relationObj);
            }else if(result.success && typeof result.data.Data === 'string'){

            }
            callback(result);
        })
    }

    //申请好友验证(validate)
    tempApplyFriend(userObj){
        this.user.applyFriend(userObj);
    }


    outApplyFriendPage(){
        currentPage = false;
    }

    // updataApplyFriendRecord(applyId){
    //
    // }
    //
    // removeApplyFriendRecord(applyId){
    //
    // }
}

function connectManagement(){
   currentObj.apply.connnectApplyFriend(updateApplyFriendHandle);
}