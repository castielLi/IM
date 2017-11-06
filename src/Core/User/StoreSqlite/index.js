/**
 * Created by apple on 2017/9/28.
 */

let SQLite = require('react-native-sqlite-storage')
import * as sqls from './UserExcuteSql'
import { Platform, StyleSheet } from 'react-native';
import * as commonMethods from '../../Helper/formatQuerySql'
import ChatWayEnum from '../dto/ChatWayEnum'

export function GetRelationList(callback){
    USERFMDB.GetRelationList(callback);
}

var databaseObj = {
    name: "Account.db",//数据库文件

}
if (Platform.OS === 'ios') {
    databaseObj.createFromLocation = '1'
    databaseObj.location = 'Documents'
}

export function initIMDatabase(AccountId,callback){
    if(Platform.OS === 'ios'){
        databaseObj.name =  AccountId + "/database/Account.db"
    }

    USERFMDB.initIMDataBase(AccountId,callback);
}

export function getRelation(Id,type,callback){
    USERFMDB.GetRelationByIdAndType(Id,type,callback);
}

//初始化好友列表
export function initRelations(friendList,blackList,GroupList,callback){
    USERFMDB.InitRelations(friendList,blackList,GroupList,callback)
}

//更改好友黑名单设置
export function changeRelationBliackList(isBlackList,RelationId){
    USERFMDB.UpdateBlackListByRelation(isBlackList,RelationId)
}


//删除关系
export function deleteRelation(RelationId){
    USERFMDB.DeleteRelation(RelationId)
}

//更新关系头像
export function updateRelationAvator(RelationId,LocalImage,AvatorUrl){
    USERFMDB.updateRelationAvator(RelationId,LocalImage,AvatorUrl);
}

//修改关系
export function updateRelation(Relation) {
    USERFMDB.updateRelation(Relation);
}

//获取所有关系的头像和名字
export function getAllRelationAvatorAndName(callback){
    USERFMDB.GetAllRelationAvatorAndName(callback);
}

//更新relation显示状态
export function updateRelationDisplayStatus(relationId,bool){
   USERFMDB.UpdateRelationDisplayStatus(relationId,bool);
}


//添加新的关系
export function addNewRelation(Relation){
    USERFMDB.AddNewRelation(Relation)
}

//添加新的关系设置
export function addNewRelationSetting(RelationSetting){
    USERFMDB.AddNewRelationSetting(RelationSetting);
}

//修改关系设置
export function updateRelationSetting(RelationSetting){
    USERFMDB.UpdateRelationSetting(RelationSetting);
}

//获取关系设置
export function getRelationSetting(RelationId,callback){
    USERFMDB.GetRelationSetting(RelationId,callback);
}

export function closeAccountDb(){
    USERFMDB.closeAccountDb()
}


let USERFMDB = {};

USERFMDB.initIMDataBase = function(){
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

//更新好友显示状态
USERFMDB.UpdateRelationDisplayStatus = function(relationId,bool){

    let sql = sqls.ExcuteIMSql.UpdateRelationDisplayStatus;

    sql = commonMethods.sqlFormat(sql,[bool,relationId])

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
USERFMDB.GetRelationByIdAndType = function(Id,type,callback){

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
USERFMDB.GetRelationList = function(callback){

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
USERFMDB.InitRelations = function(friendList,blackList,GroupList,callback){

    let relationsSqls = [];

    // (RelationId,OtherComment,Nick,Remark,BlackList,Type,avator,Email)

    for(let item in friendList){

        let sql = sqls.ExcuteIMSql.InitRelations;

        let friend = friendList[item];

        //判断是否当前好友同样在黑名单中
        let exist = false;
        for(let i in blackList) {
            if(blackList[i].Account == friend.Account){
                exist = true;
                break;
            }
        }

        if(exist){
            continue;
        }
        sql = commonMethods.sqlFormat(sql,[friend.Account,friend.Gender,friend.Nickname," ",false,"private",friend.HeadImageUrl,friend.Email," ",true]);
        relationsSqls.push(sql);
    }

    for(let item in blackList){

        let sql = sqls.ExcuteIMSql.InitRelations;

        let friend = blackList[item];

        sql = commonMethods.sqlFormat(sql,[friend.Account,friend.Gender,friend.Nickname," ",true,"private",friend.HeadImageUrl,friend.Email," ",true]);
        relationsSqls.push(sql);
    }

    for(let item in GroupList){

        let sql = sqls.ExcuteIMSql.InitRelations;

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

            callback();

        }, errorDB);
    }, errorDB);
}

//添加新关系
USERFMDB.AddNewRelation = function(Relation){
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


//拉入或移除黑名单
USERFMDB.UpdateBlackListByRelation = function(isBlackList,RelationId){
    let updateSql = sqls.ExcuteIMSql.SetBlackList;

    updateSql = commonMethods.sqlFormat(updateSql,[isBlackList,RelationId]);

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(updateSql, [], (tx, results) => {

                console.log("修改黑名单关系成功")

            }, errorDB);



        }, errorDB);
    }, errorDB);

}

//删除关系
USERFMDB.DeleteRelation = function(RelationId){
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

//更新关系头像
USERFMDB.updateRelationAvator = function(RelationId,LocalImage,AvatorUrl){

    let updateSql = sqls.ExcuteIMSql.UpdateRelationAvator;

    updateSql = commonMethods.sqlFormat(updateSql,[AvatorUrl,LocalImage,RelationId])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(updateSql, [], (tx, results) => {

                console.log("更新头像成功")

            }, errorDB);

        }, errorDB);
    }, errorDB);
}


//修改关系
USERFMDB.updateRelation =function(Relation){
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

//获取所有关系的头像和名字
USERFMDB.GetAllRelationAvatorAndName = function(callback){
   let sql = sqls.ExcuteIMSql.GetAllRelationAvatorAndName;

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(sql, [], (tx, results) => {

                callback(results.rows.raw());

            }, (err)=>{errorDB('查找',err)});

        });
    }, (err)=>{errorDB('打开数据',err)});
}

//获取当前关系的关系设置
USERFMDB.GetRelationSetting = function(RelationId,callback){
    let sql = sqls.ExcuteIMSql.GetRelationSettingByRelationId;

    sql = commonMethods.sqlFormat(sql,[RelationId])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(sql, [], (tx, results) => {

                if(results.rows.length>0) {
                    callback(results.rows.raw()[0]);
                }else{
                    callback(null);
                }

            }, (err)=>{errorDB('查找',err)});

        });
    }, (err)=>{errorDB('打开数据',err)});
}


//修改当前关系的关系设置
USERFMDB.UpdateRelationSetting = function(RelationSetting){
    let sql = sqls.ExcuteIMSql.UpdateRelationSetting;

    // update RelationSetting set setTop=?,disturb=?,saveContact=?,showNick=? where RelationId=?
    sql = commonMethods.sqlFormat(sql,[RelationSetting.setTop,RelationSetting.disturb,RelationSetting.saveContact,RelationSetting.showNick,
        RelationSetting.displayZoom,RelationSetting.allowCheckZoom,RelationSetting.starMark,RelationSetting.RelationId])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(sql, [], (tx, results) => {

                console.log("修改成功")

            }, (err)=>{errorDB('修改',err)});

        });
    }, (err)=>{errorDB('打开数据',err)});
}

//添加新的关系设置
USERFMDB.AddNewRelationSetting = function(RelationSetting){
    let sql = sqls.ExcuteIMSql.InsertRelationSetting;

    // update RelationSetting set setTop=?,disturb=?,saveContact=?,showNick=? where RelationId=?
    sql = commonMethods.sqlFormat(sql,[RelationSetting.RelationId,RelationSetting.setTop,RelationSetting.disturb,RelationSetting.saveContact,RelationSetting.showNick,
    RelationSetting.displayZoom,RelationSetting.allowCheckZoom,RelationSetting.starMark])

    var db = SQLite.openDatabase({
        ...databaseObj
    }, () => {

        db.transaction((tx) => {

            tx.executeSql(sql, [], (tx, results) => {

                console.log("添加成功")

            }, (err)=>{errorDB('添加',err)});

        });
    }, (err)=>{errorDB('打开数据',err)});
}


USERFMDB.closeAccountDb = function(){
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