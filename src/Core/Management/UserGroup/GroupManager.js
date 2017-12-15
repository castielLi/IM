/**
 * Created by apple on 2017/12/1.
 */
import * as groupStoreSqlite from './StoreSqlite/Group/index'

let GroupManager = {};
export default GroupManager;

GroupManager.initDatabase = function(AccountId){
    groupStoreSqlite.initIMDatabase(AccountId,function(){

    });
}

GroupManager.removeGroupMember = function(groupId,members){
    groupStoreSqlite.removeGroupMember(groupId,members)
}

GroupManager.addNewRelation = function(Relation){
    groupStoreSqlite.addNewRelation(Relation)
}

GroupManager.initGroupMemberByGroupId = function(GroupId,members){
    groupStoreSqlite.initGroupMemberByGroupId(GroupId,members)
}

GroupManager.addGroupMembersByGroupId =  function(groupId,members){
    groupStoreSqlite.AddGroupMembersByGroupId(groupId,members);
}

GroupManager.GetMembersByGroupId = function(groupId,callback){
    groupStoreSqlite.GetMembersByGroupId(groupId,callback);
}

GroupManager.GetRelationList = function(callback,show) {
    groupStoreSqlite.GetRelationList(callback, show);
}

GroupManager.GetRelationByIdAndType = function(Id,type,callback) {
    groupStoreSqlite.GetRelationByIdAndType(Id,type,callback)
}
GroupManager.initRelations = function(GroupList,callback){
    groupStoreSqlite.initRelations(GroupList,callback);
}

GroupManager.UpdateGroupName = function(relationId,name){
    groupStoreSqlite.UpdateGroupName(relationId,name);
}

GroupManager.deleteRelation = function(RelationId){
    groupStoreSqlite.deleteRelation(RelationId)
}

GroupManager.deleteGroupMemberTable = function(groupId) {
    groupStoreSqlite.deleteGroupMemberTable(groupId)
}

GroupManager.RemoveGroupFromContact = function(groupId){
    groupStoreSqlite.RemoveGroupFromContact(groupId);
}


GroupManager.GetRelationsByRelationIds = function(Ids,callback){
    groupStoreSqlite.getRelationsByIds(Ids,callback);
}

GroupManager.setGroupBlackList = function(value,groupId){
   groupStoreSqlite.setGroupBlackList(value,groupId);
}


GroupManager.closeDB = function(){
    groupStoreSqlite.closeAccountDb()
}




