/**
 * Created by apple on 2017/11/3.
 */

import netWorking from '../../Networking/Network'

let _network = new netWorking()

export function getAccountByAccountId(accountId,type,callback){
    let url = ""
    let param = {};
    if(type == "user"){
        url = "Member/SearchUser";
        param = {"Keyword":accountId};
    }else{
        url = "Member/GetGroupInfo";
        param = {"GroupId":accountId};
    }

    _network.methodPOST(url,param,function(result){
        return result;
    })
}