/**
 * Created by apple on 2018/1/9.
 */
var MockMessageType;
(function (MockMessageType) {
    MockMessageType[MockMessageType["CreateGroup"] = 1] = "CreateGroup";
    MockMessageType[MockMessageType["AddMembers"] = 2] = "AddMembers";
    MockMessageType[MockMessageType["RemoveGroupMembers"] = 3] = "RemoveGroupMembers";
    MockMessageType[MockMessageType["ModifyGroupName"] = 4] = "ModifyGroupName";
    MockMessageType[MockMessageType["QuitGroup"] = 5] = "QuitGroup";
})(MockMessageType || (MockMessageType = {}));
export default MockMessageType;
//# sourceMappingURL=MockMessageType.js.map