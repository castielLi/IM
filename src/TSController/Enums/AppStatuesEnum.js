/**
 * Created by apple on 2018/3/9.
 */
var AppStatusEnum;
(function (AppStatusEnum) {
    //连接成功
    AppStatusEnum[AppStatusEnum["SocketConnect"] = 0] = "SocketConnect";
    //断开连接
    AppStatusEnum[AppStatusEnum["SocketDisconnect"] = 1] = "SocketDisconnect";
    //连接错误
    AppStatusEnum[AppStatusEnum["SocketConnectError"] = 2] = "SocketConnectError";
    //正在重连
    AppStatusEnum[AppStatusEnum["SocketResetConnect"] = 3] = "SocketResetConnect";
    //正在登录
    AppStatusEnum[AppStatusEnum["Loginning"] = 4] = "Loginning";
    //网络错误
    AppStatusEnum[AppStatusEnum["NetworkError"] = 5] = "NetworkError";
})(AppStatusEnum || (AppStatusEnum = {}));
export default AppStatusEnum;
//# sourceMappingURL=AppStatuesEnum.js.map