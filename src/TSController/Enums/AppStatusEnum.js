/**
 * Created by apple on 2018/3/9.
 */
var AppStatusEnum;
(function (AppStatusEnum) {
    AppStatusEnum[AppStatusEnum["SocketConnecting"] = 0] = "SocketConnecting";
    //连接成功
    AppStatusEnum[AppStatusEnum["SocketConnect"] = 1] = "SocketConnect";
    //断开连接
    AppStatusEnum[AppStatusEnum["SocketDisconnect"] = 2] = "SocketDisconnect";
    //连接错误
    AppStatusEnum[AppStatusEnum["SocketConnectError"] = 3] = "SocketConnectError";
    //正在重连
    AppStatusEnum[AppStatusEnum["SocketResetConnect"] = 4] = "SocketResetConnect";
    //正在登录
    AppStatusEnum[AppStatusEnum["Loginning"] = 5] = "Loginning";
    //网络错误
    AppStatusEnum[AppStatusEnum["NetworkError"] = 6] = "NetworkError";
})(AppStatusEnum || (AppStatusEnum = {}));
export default AppStatusEnum;
//# sourceMappingURL=AppStatusEnum.js.map