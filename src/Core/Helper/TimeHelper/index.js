/**
 * Created by apple on 2017/6/15.
 */




export default class TimeHelper{
    //当前时间转为指定格式
    static formatNowDate(fmt){
        return dateFtt(fmt);
    }
    //指定时间转为指定格式
    static formatSpecifiedDate(fmt, timenumber) { //author: meizz
        return dateFtt(fmt,timenumber);
    }

}

function dateFtt(fmt, timenumber) { //author: meizz
    let date = timenumber?new Date():new Date(parseInt(timenumber));
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
