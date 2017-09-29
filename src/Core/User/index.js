/**
 * Created by apple on 2017/9/29.
 */
import * as storeSqlite from './StoreSqlite'

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

//在登录账号之后，返回账号id，通过id找到对应的文件夹来进行sqlite的选择
export default class User {
    constructor() {
        if (__instance()) return __instance();

        __instance(this);
        //初始化数据库
        storeSqlite.initIMDatabase()

    }

    getAllRelation(){
        return storeSqlite.GetRelationList(function(relations){

        })
    }


    AddNewRelation(){

    }
}