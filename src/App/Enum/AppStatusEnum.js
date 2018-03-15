/**
 * Created by apple on 2018/3/9.
 */

export default AppStatusEnum={
    SocketConnecting: 0,
    //连接成功
    SocketConnect : 1,
    //断开连接
    SocketDisconnect : 2,
    //连接错误
    SocketConnectError : 3,
    //正在重连
    SocketResetConnect : 4,
    //正在登录
    Loginning : 5,
    //网络错误
    NetworkError : 6
}