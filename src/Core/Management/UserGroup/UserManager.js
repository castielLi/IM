/**
 * Created by apple on 2017/12/1.
 */
import * as storeSqlite from './StoreSqlite/User/index'

let UserManager = {};
export default UserManager;


UserManager.initDatabase = function(AccountId){
    storeSqlite.initIMDatabase(AccountId,function(){

    });
}

UserManager.getAllUsers = function(callback){
    return storeSqlite.GetRelationList(callback)
}

UserManager.addGroupMembers = function(members){
    storeSqlite.addGroupMember(members)
}

UserManager.initRelations = function(friendList,blackList,callback){
    storeSqlite.initRelations(friendList,blackList,callback);
}


UserManager.changeRelationBliackList = function(isBlackList,RelationId){
    storeSqlite.changeRelationBliackList(isBlackList,RelationId);
}

UserManager.deleteRelation = function(RelationId){
    storeSqlite.deleteRelation(RelationId)
}

UserManager.updateRelation = function(Relation){
    storeSqlite.updateRelation(Relation)
}


UserManager.updateRelationDisplayStatus = function(relationId,bool){
    storeSqlite.updateRelationDisplayStatus(relationId,bool);
}


UserManager.getAllRelationAvatorAndName = function(callback){
    storeSqlite.getAllRelationAvatorAndName(callback);
}

UserManager.GetRelationByIdAndType = function(Id,type,callback){
    storeSqlite.GetRelationByIdAndType(Id,type,callback)
}

UserManager.addNewRelation = function(Relation,callback){
    storeSqlite.addNewRelation(Relation,callback)
}

UserManager.getRelationSetting = function(RelationId,callback){
    storeSqlite.getRelationSetting(RelationId,callback);
}


UserManager.updateRelationSetting = function(RelationSetting){
    storeSqlite.updateRelationSetting(RelationSetting);
}


UserManager.addNewRelationSetting = function(RelationSetting){
    storeSqlite.addNewRelationSetting(RelationSetting);
}

UserManager.getRelation = function(Id,type,callback){
    storeSqlite.getRelation(Id,type,callback);
}

UserManager.closeDB = function(){
    storeSqlite.closeAccountDb()
}