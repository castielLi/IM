import IM from '../../Core/Management/IM/index'
import User from '../../Core/Management/UserGroup/index'
import Chat from '../../Core/Management/Chat/index'
import ApplyFriend from '../../Core/Management/ApplyFriend/index'
import Network from '../../Core/Networking/Network'
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
        this.chat = new Chat();
        this.network = new Network();
        this.apiBridge = new ApiBridge();
        this.applyFriend = new ApplyFriend();
        currentObj = this;
    }

    setApplyFriendRecord(callback){
        currentPage = true;
        updateApplyFriendHandle = callback;
        this.applyFriend.GetAllApplyMessage(function (record) {
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

            // for(let i=0; i<record.length;i++){
            //     let applyFriendObj = new applyFriendDto();
            //     applyFriendObj.time = record[i].time;
            //     applyFriendObj.comment = record[i].comment;
            //     applyFriendObj.key = record[i].key;
            //     applyFriendObj.send = record[i].send;
            //     applyFriendObj.status = record[i].status;
            //
            //     applyFriendObj.avator = record[i].avator;
            //     applyFriendObj.nick = record[i].Nick;
            //     applyFriendObj.rec = record[i].rec;
            //     cache[applyFriendObj.send] = applyFriendObj;
            // }
            // let applyRecord = Object.values(cache);
            // updateApplyFriendHandle(applyRecord)
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
        // this.user.getUserInfoByIdandType(userId,'private',function (userInfo) {
        //     let applyFriendObj = new applyFriendDto();
        //     applyFriendObj.time = userInfo.time;
        //     applyFriendObj.avator = userInfo.avator;
        //     applyFriendObj.comment = userInfo.comment;
        //     applyFriendObj.key = userInfo.key;
        //     applyFriendObj.nick = userInfo.Nick;
        //     applyFriendObj.send = userId;
        //     applyFriendObj.rec = userInfo.rec;
        //     applyFriendObj.status = 'wait';
        //     cache[applyFriendObj.send] = applyFriendObj;
        //     let applyRecord = Object.values(cache);
        //     updateApplyFriendHandle(applyRecord)
        // });
    }

    acceptFriend(params,callback){
        this.apiBridge.request.AcceptFriend(params,function(results){
            if(results.success){
                //todo controller operate
                let {Account,HeadImageUrl,Nickname,Email} = results.data.Data;
                let relationObj = {RelationId:Account,avator:HeadImageUrl,localImage:'',Nick:Nickname,Type:'private',OtherComment:'',Remark:'',Email,owner:'',BlackList:'false',show:'true'}
                let userCache = currentObj.user.acceptFriend(relationObj);

                //修改缓存好友申请消息状态
                cache[Account].status = ApplyFriendEnum.ADDED;
                //修改数据库好友申请消息状态
                currentObj.applyFriend.UpdateApplyMessageStatus({"key":params.key,"status":ApplyFriendEnum.ADDED});

                let Record = Object.values(cache);
                updateApplyFriendHandle(Record);
                //todo: 数据库改变数据  通知contact页面刷新




                //重新渲染通讯录
                let tempArr = filterShowToArr(userCache)
                updateContact(tempArr);
            }
            callback(results);
        })
    }

    outApplyFriendPage(){
        currentPage = false;
    }

    updataApplyFriendRecord(applyId){

    }

    removeApplyFriendRecord(applyId){

    }




}