/**
 * Created by apple on 2017/9/28.
 */

let SQLite = require('react-native-sqlite-storage')
import * as sqls from './GroupExcuteSql'
import { Platform, StyleSheet } from 'react-native';
import * as commonMethods from '../../../Helper/formatQuerySql';




var databaseObj = {
    name: "Group.db",//数据库文件

}
if (Platform.OS === 'ios') {
    databaseObj.createFromLocation = '1'
    databaseObj.location = 'Documents'
}

export function initIMDatabase(AccountId,callback){
    if(Platform.OS === 'ios'){
        databaseObj.name =  AccountId + "/database/Group.db"
    }

    GROUPFMDB.initIMDataBase(AccountId,callback);
}

//获取所有群
export function GetRelationList(callback){
    GROUPFMDB.GetRelationList(callback);
}
//获取指定群
export function getRelation(Id,type,callback){
    GROUPFMDB.GetRelationByIdAndType(Id,type,callback);
}

//初始化群列表（登录时，插入服务器返回的群列表，没有则插入，有则更新）
export function initRelations(GroupList,callback){
    GROUPFMDB.InitRelations(GroupList,callback)
}



//删除关系
export function deleteRelation(RelationId){
    GROUPFMDB.DeleteRelation(RelationId)
}



//修改关系
export function updateRelation(Relation) {
    GROUPFMDB.updateRelation(Relation);
}


//更新relation显示状态
export function updateRelationDisplayStatus(relationId,bool){
    GROUPFMDB.UpdateRelationDisplayStatus(relationId,bool);
}

//更新群名
export function UpdateGroupName(relationId,name){
    GROUPFMDB.UpdateGroupName(relationId,name);
}
//添加新的关系
export function addNewRelation(Relation){
    GROUPFMDB.AddNewRelation(Relation)
}


export function closeAccountDb(){
    GROUPFMDB.closeAccountDb()
}


let GROUPFMDB = {};

GROUPFMDB.initIMDataBase = function(){
    var db = SQLite.openDatabase({
        ...databaseObj

    }, () => {
        db.transaction((tx) => {
            for (key in sqls.InitIMTable) {
                let sql = sqls.InitIMTable[key];
                tx.executeSql(sql, [], (tx, results) => {
                    console.log('create User database success');
                }, (err)=>{errorDB('创建数据表',err)});
            }
        });
    }, (err)=>{errorDB('初始化数据库',err)});
}


//更新群名称
GROUPFMDB.UpdateGroupName = function(relationId,name){

    let sql = sqls.ExcuteIMSql.UpdateGroupName;

    sql = commonMethods.sqlFormat(sql,[name,relationId])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(sql, [], (tx, results) => {

                console.log("更新状态成功")

            }, (err)=>{errorDB('更新好友',err)});

        }, errorDB);
    }, errorDB);
}


//通过type和ID获取relation
GROUPFMDB.GetRelationByIdAndType = function(Id,type,callback){

    let selectSql = sqls.ExcuteIMSql.SelectRelationByIdAndType;

    selectSql = commonMethods.sqlFormat(selectSql,[Id,type])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(selectSql, [], (tx, results) => {

                callback(results.rows.raw());

            }, (err)=>{errorDB('获取特定关系',err)});

        }, errorDB);
    }, errorDB);
}



//获取好友列表
GROUPFMDB.GetRelationList = function(callback){

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(sqls.ExcuteIMSql.GetAllRelation, [], (tx, results) => {

                callback(results.rows.raw());

            }, (err)=>{errorDB('获取好友列表',err)});

        }, errorDB);
    }, errorDB);
}

//初始化好友列表
GROUPFMDB.InitRelations = function(GroupList,callback){

    let relationsSqls = [];

    // (RelationId,OtherComment,Nick,Remark,BlackList,Type,avator,Email)



    for(let item in GroupList){

        let sql = sqls.ExcuteIMSql.AddtRelations;

        let group = GroupList[item];

        group.Name = group.Name == null?"未命名":group.Name;
        group.Description = group.Description == null?" ":group.Description;
        group.ProfilePicture = group.ProfilePicture == null?" ":group.ProfilePicture;

        sql = commonMethods.sqlFormat(sql,[group.GroupId,group.Description,group.Name," ",false,"chatroom",group.ProfilePicture," ",group.Owner,true]);
        relationsSqls.push(sql);
    }


    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            for(let item in relationsSqls){
                let executeSql = relationsSqls[item];
                tx.executeSql(executeSql, [], (tx, results) => {

                   console.log("添加关系成功")

                }, (err)=>{errorDB('初始化关系表内容',err)});
            }

            callback&&callback();

        }, errorDB);
    }, errorDB);
}

//添加新关系
GROUPFMDB.AddNewRelation = function(Relation){
    //todo 检查数据表中是否已经存在，存在才添加

    let sql = sqls.ExcuteIMSql.AddtRelations;

    sql = commonMethods.sqlFormat(sql,[Relation.RelationId,Relation.OtherComment,Relation.Nick,Relation.Remark,Relation.BlackList,Relation.Type,Relation.avator,Relation.Email,Relation.owner,Relation.show,Relation.RelationId]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {


                tx.executeSql(sql, [], (tx, results) => {

                    console.log("添加关系成功")

                }, errorDB);


            // callback();

        }, errorDB);
    }, errorDB);
}




//删除关系
GROUPFMDB.DeleteRelation = function(RelationId){
    let deleteSql = sqls.ExcuteIMSql.DeleteRelation;

    deleteSql = commonMethods.sqlFormat(deleteSql,[RelationId]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(deleteSql, [], (tx, results) => {

                console.log("删除关系成功")

            }, errorDB);

        }, errorDB);
    }, errorDB);
}




//修改关系
GROUPFMDB.updateRelation =function(Relation){
    let updateSql = sqls.ExcuteIMSql.UpdateRelation;

    updateSql = commonMethods.sqlFormat(updateSql,[Relation.OtherComment,Relation.Nick,Relation.Remark,Relation.BlackList,Relation.avator,Relation.Email,Relation.LocalImage,Relation.owner,Relation.show])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(updateSql, [], (tx, results) => {

                console.log("更新关系成功")

            }, errorDB);

        }, errorDB);
    }, errorDB);
}







GROUPFMDB.closeAccountDb = function(){
     var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.close();

    });
}

function errorDB(type,err) {
    console.log("SQL Error: " +type,err);
}

function successDB() {
    console.log("open database");
}