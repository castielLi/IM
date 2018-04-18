export default class Queue {
    constructor(name) {
        this.manager = QueueManager.Instance;
        this.name = name;
    }
    //队列名字
    send(data) {
        this.manager.send(this.name, data);
    }
    receive() {
        return this.manager.receive(this.name);
    }
    receiveAll() {
        return this.manager.receiveAll(this.name);
    }
    Destroy() {
        this.manager.deleteQueue(this.name);
    }
}
export class QueueManager {
    constructor() {
        this.datas = {};
    }
    //队列名字
    send(name, data) {
        if (this.datas[name] == null) {
            this.datas[name] = [];
        }
        this.datas[name].push(data);
    }
    receive(name) {
        if (this.datas[name] && this.datas[name].length > 0) {
            return this.datas[name].shift();
        }
        return null;
    }
    receiveAll(name) {
        if (this.datas[name] && this.datas[name].length > 0) {
            let data = Array.from(this.datas[name]);
            this.datas[name] = [];
            return data;
        }
        return null;
    }
    getNames() {
        let names;
        for (let name in this.datas) {
            names.push(name);
        }
        return names;
    }
    deleteQueue(name) {
        delete this.datas[name];
    }
}
QueueManager.Instance = new QueueManager();
//# sourceMappingURL=Queue.js.map