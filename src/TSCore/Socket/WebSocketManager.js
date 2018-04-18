import Config from './Config';
let webSocketObj = undefined;
export default class WebSocketManager {
    constructor() {
        this.resetConnect = true;
        this.webSocket = null;
        this.resetTime = 2000;
        //检查连接状态
        this.checkStatsTimer = 0;
        this.checkTime = 30000;
        webSocketObj = this;
    }
    //初始化
    init(param) {
        if (param == null)
            throw ("param is null");
        if (param.sink == null)
            throw ("sink is null");
        this.sink = param.sink;
        if (param.resetConnect != null)
            this.resetConnect = param.resetConnect;
    }
    //连接
    connect(socketUrl) {
        if (this.checkStatsTimer != 0)
            clearTimeout(this.checkStatsTimer);
        let hasBaseUrl = socketUrl.indexOf(Config.BaseUrl);
        if (hasBaseUrl !== -1) {
            this.webSocketUrl = socketUrl;
        }
        else {
            this.webSocketUrl = Config.BaseUrl + socketUrl;
        }
        if (this.webSocket != null) {
            if (this.webSocket.readyState == this.webSocket.OPEN) {
                this.close();
            }
            this.webSocket = null;
        }
        this.webSocket = new WebSocket(this.webSocketUrl);
        //连接成功
        this.webSocket.addEventListener('open', this.onOpen);
        //收到消息
        this.webSocket.addEventListener('message', this.onMessage);
        //错误
        this.webSocket.addEventListener('error', this.onError);
        //关闭连接
        this.webSocket.addEventListener('close', this.onClose);
        // this.checkStatus();
    }
    //关闭连接
    close() {
        if (this.checkStatsTimer != 0)
            clearTimeout(this.checkStatsTimer);
        if (this.webSocket != null) {
            if (this.webSocket.readyState == this.webSocket.OPEN) {
                this.webSocket.close();
            }
            this.webSocket.removeEventListener('open', this.onOpen);
            this.webSocket.removeEventListener('message', this.onMessage);
            this.webSocket.removeEventListener('error', this.onError);
            this.webSocket.removeEventListener('close', this.onClose);
            this.webSocket = null;
        }
    }
    //发送消息
    send(message) {
        if (this.webSocket != null && this.webSocket.readyState == this.webSocket.OPEN) {
            this.webSocket.send(message);
            return true;
        }
        return false;
    }
    //获取连接状态
    getConnectState() {
        if (this.webSocket == null)
            return false;
        return this.webSocket.readyState == this.webSocket.OPEN;
    }
    onOpen(event) {
        console.log('Hello Server!');
        webSocketObj.sink.onConnect();
    }
    onMessage(event) {
        console.log("Socket TSCore:收到了一条新消息:" + event.data);
        if (event.data.length <= 0) {
            return;
        }
        webSocketObj.sink.onMessage(event.data);
    }
    onError(event) {
        console.log(event);
        webSocketObj.sink.onError(event.toString());
    }
    onClose(event) {
        console.log("socket close");
        console.log('GoodBye Server!');
        if (this.checkStatsTimer != 0)
            clearTimeout(this.checkStatsTimer);
        //两秒后自动重连
        if (webSocketObj.resetConnect) {
            webSocketObj.sink.onWillReconnect();
            //重新连接
            setTimeout(() => {
                webSocketObj.connect(webSocketObj.webSocketUrl);
            }, webSocketObj.resetTime);
        }
        else {
            webSocketObj.sink.onClosed();
        }
    }
    //检查连接状态重新连接
    checkStatus() {
        this.checkStatsTimer = setTimeout(() => {
            if (webSocketObj == null)
                return;
            if (webSocketObj.getConnectState() == false)
                webSocketObj.connect(webSocketObj.webSocketUrl);
            else
                webSocketObj.checkStatus();
        }, this.checkTime);
    }
}
//# sourceMappingURL=WebSocketManager.js.map