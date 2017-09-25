import React,{Component}from 'react';
import {ToastAndroid}from 'react-native';
import SQLiteStorage from 'react-native-sqlite-storage';

SQLiteStorage.DEBUG(true);

var database_name = "account.db"; //数据库文件
var database_version = "1.0";//版本号
var database_displayname = "MySQLite";
var database_size = -1;
var db;

export default class SQLite extends Component {
	componentWillUnmount() {
		if(db) {
			this._successCB('close');
			db.close();
		}else{
			console.log('SQLiteStorage not open');
		}
	}

	open() {
		db = SQLiteStorage.openDatabase(
			database_name,
			database_version,
			database_displayname,
			database_size,
			()=>{
				this._successCB('open');
			},
			()=>{this._errorCB('open',err);}
			);
		return db;
	}
	createTable(){
		if(!db) {
			this.open();
		}
		//创建用户表
		db.transaction((tx)=>{
			tx.executeSql('CREATE TABLE IF NOT EXISTS USER('+
				'id INTEGER PRIMARY KEY AUTOINCREMENT,'+
				'userName VARCHAR,'+
				'passWord VARCHAR)',[],()=>{
					this._successCB('executeSql');
				},(err)=>{
					this._errorCB('executeSql',err);
				});
		},(err)=>{this._errorCB('createTable',err);},()=>{
			this._successCB('createTable');
		})
	}

	deleteData(){
		if(!db){
			this.open();
		}
		db.transaction((tx)=>{
			tx.executeSql('delete from user',[],()=>{this._successCB('delete success!')

			});
		});
	}

	dropTable(){
		db.transaction((tx)=>{
			tx.executeSql('drop table user',[],()=>{

			});
		},(err)=>{
			this._errorCB('dropTable',err);
		},()=>{this._successCB('dropTable');
		});
	}

	insertUserData(userData) {
		let len = userData.length;
		if(!db) {
			this.open();
		}
		this.createTable();
		db.transaction((tx)=>{
			for(let i = 0;i<len;i++){
				var user = userData[i];
				let userName = user.userName;
				let passWord = user.passWord;
				let sql = "INSERT INTO user(userName,passWord)"+"values(?,?)";
				tx.executeSql(sql,[userName,passWord],()=>{

				},(err)=>{console.log(err);
				});
			}
		},(error)=>{
			this._errorCB('transaction',err);
			ToastAndroid.show("数据插入失败",ToastAndroid.SHORT);
		},()=>{
			this._successCB('transaction insert data');
			ToastAndroid.show("成功插入" +len +"条数据",ToastAndroid.SHORT);
		});
	}
	close(){
		if(db){
			this._successCB('close');
			db.close();
		}else{
			console.log("SQLiteStorage not open");
		}
		db = null;
	}

	_successCB(name){
		console.log("SQLiteStorage" +name+"success");
	}

	_errorCB(name,err){
		console.log('SQLiteStorage' + name);
		console.log(err);
	}

	render(){
		return null;
	}

};