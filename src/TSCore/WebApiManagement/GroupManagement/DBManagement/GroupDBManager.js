import SQLiteHelper from '../../../Tools/SQLite/SQLiteHelper';
import SQLiteFactory from '../../../Tools/SQLite/SQLiteFactory';
import GroupInfoDto from '../Dtos/GroupInfoDto';
import SQLiteSql from './ExecuteCommand/SQLiteSql';
import TableNameDto from '../Dtos/TableNameDto';
import AddMembersDto from '../Dtos/AddMembersDto';
import SetContactsDto from '../Dtos/SetContactsDto';
import RemoveMembersDto from "../Dtos/RemoveMembersDto";
import ModifyGroupNameDto from "../Dtos/ModifyGroupNameDto";
import ModifyGroupNoteDto from "../Dtos/ModifyGroupNoteDto";
import GroupIdDto from "../Dtos/GroupIdDto";
import ExitGroupDto from "../Dtos/ExitGroupDto";
import GetGroupsDto from "../Dtos/GetGroupsDto";
import ModifySingleDto from '../Dtos/ModifySingleDto';
import GroupSettingDto from '../Dtos/GroupSettingDto';
export default class GroupDBManager {
    constructor() {
        this.sql = SQLiteFactory.GetSQLite(GroupDBManager.dbKey);
        if (this.sql == null) {
            throw new Error("GroupDBManager sql is null, config is error");
        }
        for (let key in SQLiteSql.initDatabase) {
            this.sql.ExecuteSQL(SQLiteSql.initDatabase[key]);
        }
    }
    //创建群
    createGroup(group, members) {
        if (group == null)
            return;
        let groupSql = SQLiteHelper.sqlStringFormat(SQLiteSql.addGroup, group);
        this.sql.ExecuteSQL(groupSql);
        let tableNameDto = new TableNameDto();
        tableNameDto.tableName = group.Id;
        let memberSql = SQLiteHelper.sqlStringFormat(SQLiteSql.createGroupMemberTable, tableNameDto);
        this.sql.ExecuteSQL(memberSql, () => {
            //在重新添加member的时候把之前的member都从列表中删除
            let clearGroupMembers = SQLiteHelper.sqlStringFormat(SQLiteSql.clearGroupMembers, tableNameDto);
            this.sql.ExecuteSQL(clearGroupMembers);
            if (members == null || members.length == 0)
                return;
            this.addGroupMember(group.Id, members);
        });
    }
    //添加或者更新群
    addOrUpdateGroupInfo(group) {
        if (group == null)
            return;
        let groupSql = SQLiteHelper.sqlStringFormat(SQLiteSql.addGroup, group);
        this.sql.ExecuteSQL(groupSql);
    }
    //将群移除通讯录
    addOrRemoveContacts(id, save) {
        let setContactsDto = new SetContactsDto();
        setContactsDto.Save = save;
        setContactsDto.Id = id;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.addOrRemoveContacts, setContactsDto);
        this.sql.ExecuteSQL(sql);
    }
    //添加群成员
    addGroupMember(id, members) {
        for (let i = 0; i < members.length; i++) {
            let addMembersDto = new AddMembersDto();
            addMembersDto.tableName = id;
            addMembersDto.member = members[i];
            let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.addGroupMember, addMembersDto);
            this.sql.ExecuteSQL(sql);
        }
    }
    //移除群成员
    removeGroupMember(id, members) {
        let removeMembersDto = new RemoveMembersDto();
        removeMembersDto.tableName = id;
        removeMembersDto.members = members;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.removeGroupMember, removeMembersDto);
        this.sql.ExecuteSQL(sql);
    }
    //修改群名称
    updateGroupName(id, value) {
        let modifyGroupNameDto = new ModifyGroupNameDto();
        modifyGroupNameDto.Name = value;
        modifyGroupNameDto.Id = id;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.updateGroupName, modifyGroupNameDto);
        this.sql.ExecuteSQL(sql);
    }
    //修改群公告
    updateGroupBulletin(id, value) {
        let modifyGroupNoteDto = new ModifyGroupNoteDto();
        modifyGroupNoteDto.OtherComment = value;
        modifyGroupNoteDto.Id = id;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.updateGroupBulletin, modifyGroupNoteDto);
        this.sql.ExecuteSQL(sql);
    }
    //删除群
    removeGroup(id) {
        let groupIdDto = new GroupIdDto();
        groupIdDto.Id = id;
        let groupSql = SQLiteHelper.sqlStringFormat(SQLiteSql.removeGroup, groupIdDto);
        this.sql.ExecuteSQL(groupSql);
        let tableNameDto = new TableNameDto();
        tableNameDto.tableName = id;
        let memberSql = SQLiteHelper.sqlStringFormat(SQLiteSql.removeGroupMemberTable, tableNameDto);
        this.sql.ExecuteSQL(memberSql);
    }
    //退出/被提出群
    setGroupExitSetting(id, value) {
        let exitGroupDto = new ExitGroupDto();
        exitGroupDto.Exited = value;
        exitGroupDto.Id = id;
        let groupSql = SQLiteHelper.sqlStringFormat(SQLiteSql.setGroupExitSetting, exitGroupDto);
        let groupIdDto = new GroupIdDto();
        groupIdDto.Id = id;
        let getGroupSql = SQLiteHelper.sqlStringFormat(SQLiteSql.getGroup, groupIdDto);
        this.sql.ExecuteSQL(getGroupSql, (data) => {
            if (data.length) {
                this.sql.ExecuteSQL(groupSql);
            }
        });
    }
    //获取指定群
    getGroupInfo(id, callback) {
        let groupIdDto = new GroupIdDto();
        groupIdDto.Id = id;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.getGroup, groupIdDto);
        this.sql.ExecuteSQLWithT(sql, (data) => {
            if (data.length != 0) {
                callback && callback(data[0]);
            }
            else {
                callback && callback(null);
            }
        }, GroupInfoDto);
    }
    //获取所有群
    getAllGroup(callback) {
        this.sql.ExecuteSQLWithT(SQLiteSql.getAllGroup, (data) => {
            callback && callback(data);
        }, GroupInfoDto);
    }
    //获取群成员ID
    getGroupMember(id, callback) {
        let tableNameDto = new TableNameDto();
        tableNameDto.tableName = id;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.getGroupMember, tableNameDto);
        this.sql.ExecuteSQL(sql, (data) => {
            callback && callback(data);
        });
    }
    getGroups(ids, callback) {
        let getGroupsDto = new GetGroupsDto();
        getGroupsDto.groups = ids;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.getGroups, getGroupsDto);
        this.sql.ExecuteSQLWithT(sql, (data) => {
            callback && callback(data);
        }, GroupInfoDto);
    }
    //修改群昵称设置
    modifyNicknameSetting(groupId, nicknameSetting) {
        let modifySingleDto = new ModifySingleDto();
        modifySingleDto.Value = nicknameSetting;
        modifySingleDto.Id = groupId;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.modifyNicknameSetting, modifySingleDto);
        this.sql.ExecuteSQL(sql);
    }
    //获取群设置
    getGroupSetting(groupId, callback) {
        let groupIdDto = new GroupIdDto();
        groupIdDto.Id = groupId;
        let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.getGroupSetting, groupIdDto);
        this.sql.ExecuteSQLWithT(sql, (data) => {
            if (data.length != 0) {
                callback && callback(data[0]);
            }
            else {
                callback && callback(null);
            }
        }, GroupSettingDto);
    }
    addGroupSetting(groupId) {
        // let addSettingDto = new AddSettingDto();
        // let sql = SQLiteHelper.sqlStringFormat(SQLiteSql.addGroupSetting, addSettingDto);
        // this.sql.ExecuteSQL(sql);
    }
    //退出关闭数据库
    logout() {
        this.sql = null;
    }
}
GroupDBManager.dbKey = "IM";
//# sourceMappingURL=GroupDBManager.js.map