import { Platform } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
const AndroidDBPath = "/data/data/com.im/databases/";
const AndroidDBStorePath = '/data/data/com.im/files/';
import DatabaseObjDto from "./Dtos/DatabaseObjDto";
import SQLiteHelper from "./SQLiteHelper";
import CryptoJS from 'crypto-js';
export default class MobileSQLite {
    constructor(path, dbName) {
        this.databaseObj = new DatabaseObjDto();
        if (Platform.OS != 'ios') {
            // let filePath: string = CryptoJS.MD5(path).toLowerCase();
            let filePath = CryptoJS.MD5(path).toString().toLowerCase();
            this.databaseObj.name = filePath + "_" + dbName;
            this.databaseObj.location = "";
            this.databaseObj.createFromLocation = "";
        }
        else {
            let filePath = path + "/" + dbName;
            this.databaseObj.name = filePath;
            this.databaseObj.location = "Documents";
            this.databaseObj.createFromLocation = "1";
        }
    }
    ExecuteSQL(sql, callback = null) {
        var db = SQLite.openDatabase(Object.assign({}, this.databaseObj), () => {
            db.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                    callback && callback(results.rows.raw());
                }, (err) => {
                    console.log("SQL Error:", err);
                    callback && callback(null);
                });
            });
        }, (err) => {
            this.errorDB(err);
        });
    }
    //todo:用于解决收到消息 异步错误存储的 需要改进
    ExecuteSQLSync(sql, callback = null) {
        var db = SQLite.openDatabase(Object.assign({}, this.databaseObj), () => {
            db.transaction((tx) => {
                tx.executeSql(sql[0], [], (tx, results) => {
                    if (results.rows.raw().length) {
                        tx.executeSql(sql[2], [], (tx, results) => {
                        });
                    }
                    else {
                        tx.executeSql(sql[1], [], (tx, results) => {
                            tx.executeSql(sql[3], [], (tx, results) => {
                            });
                        });
                    }
                    tx.executeSql(sql[4], [], (tx, results) => {
                    });
                });
            });
        }, (err) => {
            this.errorDB(err);
        });
    }
    ExecuteSQLCondition(condition, trueCondition, falseCondiftion) {
        var db = SQLite.openDatabase(Object.assign({}, this.databaseObj), () => {
            db.transaction((tx) => {
                tx.executeSql(condition, [], (tx, results) => {
                    if (results.rows.raw().length) {
                        for (let item in trueCondition) {
                            tx.executeSql(trueCondition[item], [], (tx, results) => {
                            });
                        }
                    }
                    else {
                        for (let item in falseCondiftion) {
                            tx.executeSql(falseCondiftion[item], [], (tx, results) => {
                            });
                        }
                    }
                });
            });
        }, (err) => {
            this.errorDB(err);
        });
    }
    ExecuteSQLWithT(sql, callback = null, className) {
        var db = SQLite.openDatabase(Object.assign({}, this.databaseObj), () => {
            db.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                    console.log("SQL 语句 执行成功！！！");
                    let data = results.rows.raw();
                    if (data.length) {
                        let dataResult = [];
                        for (let i = 0; i < data.length; i++) {
                            dataResult.push(this.fillingObjectBySqlData(data[i], className));
                        }
                        callback && callback(dataResult);
                    }
                    else {
                        callback && callback(results.rows.raw());
                    }
                }, (err) => {
                    console.log("SQL Error:", err);
                    callback && callback(null);
                });
            });
        }, (err) => {
            this.errorDB(err);
        });
    }
    errorDB(err) {
        console.log("SQL Error:" + err);
    }
    fillingObjectBySqlData(data, className) {
        let obj = new className();
        for (let item in obj) {
            if (data[item] != undefined) {
                if (typeof (obj[item]) === 'boolean') {
                    obj[item] = data[item] ? true : false;
                }
                else if (typeof (obj[item]) === 'string') {
                    obj[item] = SQLiteHelper.transToSpecialChatToDisplay(data[item]);
                }
                else {
                    obj[item] = data[item];
                }
            }
        }
        return obj;
    }
}
//# sourceMappingURL=MobileSQLite.js.map