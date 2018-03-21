import DBManager from './DBManagement/DBManager';
export default class ApplyFriendManager {
    constructor(isDB) {
        this.dbManager = null;
        if (isDB)
            this.dbManager = new DBManager();
    }
    static getSingleInstance(isDB) {
        if (ApplyFriendManager.SingleInstance == null) {
            ApplyFriendManager.SingleInstance = new ApplyFriendManager(isDB);
        }
        return ApplyFriendManager.SingleInstance;
    }
    addNewApply(message) {
        if (this.dbManager != null)
            this.dbManager.addNewApply(message);
    }
    clearUnCheckCount() {
        if (this.dbManager != null) {
            this.dbManager.clearUncheckCount();
            return;
        }
    }
    getAllApply(callback) {
        if (this.dbManager != null) {
            this.dbManager.getAllApply(callback);
            return;
        }
        callback(null);
    }
    getAllNotOpreatingApply(callback) {
        if (this.dbManager != null) {
            this.dbManager.getAllNotOpreatingApply(callback);
        }
        callback(null);
    }
    ;
    UpdateApplyStatus(status, key) {
        if (this.dbManager != null) {
            this.dbManager.UpdateApplyStatus(status, key);
        }
    }
    getUncheckApplyMessageCount(callback) {
        if (this.dbManager != null) {
            this.dbManager.getUncheckApplyMessageCount(callback);
        }
    }
    clear() {
        if (this.dbManager != null) {
            this.dbManager.clear();
        }
    }
    destroyInstance() {
        // if(this.dbManager != null)
        //     this.dbManager.logout();
        ApplyFriendManager.SingleInstance = null;
    }
}
//# sourceMappingURL=ApplyFriendManager.js.map