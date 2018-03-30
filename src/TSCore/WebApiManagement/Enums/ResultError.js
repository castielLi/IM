var ResultError;
(function (ResultError) {
    /*****************共有错误码*****************/
    //系统错误
    ResultError[ResultError["SystemError"] = 0] = "SystemError";
    //操作成功
    ResultError[ResultError["Success"] = 1] = "Success";
    //参数无效
    ResultError[ResultError["InvalidArgument"] = 2] = "InvalidArgument";
    /*****************登录错误码*****************/
    //会员不存在
    ResultError[ResultError["MemberNotExist"] = 1001] = "MemberNotExist";
    //会员被冻结
    ResultError[ResultError["MemberClosed"] = 1002] = "MemberClosed";
    //登录密码错误
    ResultError[ResultError["WrongPassword"] = 1003] = "WrongPassword";
    /*****************Token错误*****************/
    //Token为空
    ResultError[ResultError["NullToken"] = 2001] = "NullToken";
    //服务器时间差错误
    ResultError[ResultError["OverTime"] = 2002] = "OverTime";
    //token失效
    ResultError[ResultError["TokenInvalid"] = 2003] = "TokenInvalid";
    //Token解密失败
    ResultError[ResultError["TokenDecodeError"] = 2004] = "TokenDecodeError";
    //Signature签名错误
    ResultError[ResultError["SignatureError"] = 2005] = "SignatureError";
    //Playload参数错误
    ResultError[ResultError["PlayloadError"] = 2006] = "PlayloadError";
    //帐号无效
    ResultError[ResultError["AccountInvalid"] = 2007] = "AccountInvalid";
    //拒绝游客
    ResultError[ResultError["RefuseTourist"] = 2008] = "RefuseTourist";
    //Token为空
    ResultError[ResultError["OtherLogin"] = 2010] = "OtherLogin";
    /*****************好友操作错误码*****************/
    ///好友申请记录不存在
    ResultError[ResultError["AcceptRecordNotExist"] = 3001] = "AcceptRecordNotExist";
    //已成功添加为好友
    ResultError[ResultError["AddFriendSuccess"] = 3002] = "AddFriendSuccess";
    //已经是好友
    ResultError[ResultError["AlreadyFriend"] = 3003] = "AlreadyFriend";
    //在对方黑名单中
    ResultError[ResultError["InBlacklist"] = 3004] = "InBlacklist";
    /*****************群操作错误码*****************/
    //操作人不是群成员
    ResultError[ResultError["OperaterNotGroupMember"] = 4001] = "OperaterNotGroupMember";
    //用户不存在
    ResultError[ResultError["AccountNotExist"] = 4002] = "AccountNotExist";
    //已经是群成员
    ResultError[ResultError["AlreadyGroupMember"] = 4003] = "AlreadyGroupMember";
    //不是群成员
    ResultError[ResultError["NotGroupMember"] = 4004] = "NotGroupMember";
    //群不存在
    ResultError[ResultError["GroupNotExist"] = 4005] = "GroupNotExist";
    //操作人不是群主
    ResultError[ResultError["OperaterNotGroupOwner"] = 4006] = "OperaterNotGroupOwner";
    //创建群时 成员少于三人
    ResultError[ResultError["LessThanThreePeople"] = 4007] = "LessThanThreePeople";
    /*****************验证码错误*****************/
    //达到今日次数限制
    ResultError[ResultError["NumberBeyondLimit"] = 5001] = "NumberBeyondLimit";
    //手机号已存在(已被注册)
    ResultError[ResultError["PhoneExist"] = 5002] = "PhoneExist";
    //手机号不存在
    ResultError[ResultError["PhoneNotExist"] = 5003] = "PhoneNotExist";
    //请求频繁
    ResultError[ResultError["TooOften"] = 5004] = "TooOften";
    //验证码无效
    ResultError[ResultError["InvalidCaptcha"] = 5005] = "InvalidCaptcha";
    /*****************网络请求出错***************/
    ResultError[ResultError["NetWorkFailed"] = 6001] = "NetWorkFailed";
})(ResultError || (ResultError = {}));
export default ResultError;
//# sourceMappingURL=ResultError.js.map