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


GroupManager.addNewRelation = function(Relation){
    groupStoreSqlite.addNewRelation(Relation)
}

GroupManager.initGroupMemberByGroupId = function(GroupId,members){
    groupStoreSqlite.initGroupMemberByGroupId(GroupId,members)
}

GroupManager.GetMembersByGroupId = function(groupId,callback){
    groupStoreSqlite.GetMembersByGroupId(groupId,callback);
}

GroupManager.getRelation = function (Id,type,callback) {
    groupStoreSqlite.getRelation(Id,type,callback);
}

GroupManager.GetRelationList = function(callback,show) {
    groupStoreSqlite.GetRelationList(callback, show);
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

GroupManager.RemoveGroupFromContact = function(groupId){
    groupStoreSqlite.RemoveGroupFromContact(groupId);
}

GroupManager.closeDB = function(){
    groupStoreSqlite.closeAccountDb()
}




