/**
 * Created by apple on 2017/11/22.
 */

import IM from '../Core/IM'
import User from '../Core/UserGroup'
import Network from '../Core/Networking/Network'
import {Platform,AsyncStorage}from 'react-native';
import RNFS from 'react-native-fs'
import {setMyAccoundId} from '../Core/IM/action/receiveHandleMessage';

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
        this.im = new IM();
        this.user = new User();
    }
}());

let currentObj = undefined;

export default class loginController {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);

        currentObj = this;
        this.user = new User();
        this.im = new IM();
        this.network = new Network();

    }

    login(callback,params){
        this.network.methodPOST("/Member/Login",params,function(result){

            if(result.success){
                Network.setNeedAuth(true)
                Network.setAuthorization(result.data.Data["SessionToken"]);

                let account = { accountId:result.data.Data["Account"],SessionToken:result.data.Data["SessionToken"],IMToken:result.data.Data["IMToken"]
                    ,gender:result.data.Data["Gender"],nick:result.data.Data["Nickname"],avator:result.data.Data["HeadImageUrl"],phone:result.data.Data["PhoneNumber"]
                    ,device:"Mobile",deviceId:"1"};

                //存储登录状态
                AsyncStorage.setItem('account',JSON.stringify(account));
                setMyAccoundId(account.accountId);

                if(Platform.OS === 'ios'){
                    //初始化im
                    currentObj.im.setSocket(account.accountId,account.device,account.deviceId,account.IMToken);
                    currentObj.im.initIMDatabase(account.accountId)
                    currentObj.user.initIMDatabase(account.accountId);
                    callback(result)

                }else{
                    let ImDbPath = '/data/data/com.im/files/'+account.accountId +'/database/IM.db';
                    let AccountDbPath = '/data/data/com.im/files/'+account.accountId +'/database/Account.db';
                    let GroupDbPath = '/data/data/com.im/files/'+account.accountId +'/database/Group.db';
                    //文件夹判断是否是第一次登录
                    RNFS.exists(ImDbPath).then((bool)=>{
                        if(bool){
                            //若不是
                            //根据accountId在对应文件夹中找数据库文件，移动我数据库文件至databases
                            RNFS.copyFile(ImDbPath,'/data/data/com.im/databases/IM.db').then(()=>{
                                RNFS.copyFile(AccountDbPath,'/data/data/com.im/databases/Account.db').then(()=>{
                                    RNFS.copyFile(GroupDbPath,'/data/data/com.im/databases/Group.db').then(()=>{
                                        //初始化im
                                        currentObj.im.setSocket(account.accountId,account.device,account.deviceId,account.IMToken);
                                        currentObj.user.initIMDatabase(account.accountId);
                                        callback(result)
                                    })
                                })
                            });
                            //若是第一次登陆
                        }else{
                            //初始化im
                            currentObj.im.setSocket(account.accountId,account.device,account.deviceId,account.IMToken);
                            currentObj.im.initIMDatabase(account.accountId);
                            currentObj.user.initIMDatabase(account.accountId);
                            callback(result)
                        }
                    })
                }


            }else{
                callback(result)
            }


        },false);
    }

    getContactList(callback,params){
        this.network.methodPOST("/Member/GetContactList",params,function(result){
            if(result.success){

                currentObj.user.initRelations(result.data.Data["FriendList"],result.data.Data["BlackList"],function(){
                    user.getAllRelation((data)=>{
                        currentObj.user.initGroup(result.data.Data["GroupList"],function(){

                            currentObj.user.getAllGroupFromGroup(function(results){

                                data = results.reduce(function(prev, curr){ prev.push(curr); return prev; },data);
                                result.data.relations = data;

                                currentObj.im.getAllApplyFriendMessage(function(results){

                                    result.data.applyFriendMessage = results;
                                    let unUnDealRequestCount = 0;
                                    results.forEach((v,i)=>{
                                        if(v.status == "wait"){
                                            unUnDealRequestCount++
                                        }
                                    })
                                    result.data.unUnDealRequestCount = unUnDealRequestCount;
                                    callback(result);
                                })
                            })
                        })
                    })
                })

            }else{
                callback(result)
            }
        },false)
    }

}