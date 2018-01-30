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

    static DateFormat(date,hasTime,format){
        date = parseInt(date)
        return DateFormat(date,hasTime,format);
    }

}

function dateFtt(fmt, timenumber) { //author: meizz
    let date = timenumber?new Date(parseInt(timenumber)):new Date();
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

function DateFormat(date,hasTime,format) {
    let newDate = new Date();
    let oldDate = new Date(date);
    //判断在不在同一年
    if(newDate.getFullYear() == oldDate.getFullYear()){
        //在不在同一周
        let day = newDate.getDay();
        let oldday = oldDate.getDay();
        day == 0 ? day = 7 : null;
        if(newDate.getTime() - date < day*1000*60*60*24){
            //判断在不在同一天
            if(day == oldday){
                console.log(dateFtt(format,date))
                return dateFtt(format,date)
            }else{
                return  hasTime ? DateDayFormat(oldday) +' '+ dateFtt(format,date) : DateDayFormat(oldday);
            }
        }else{
            let date = (oldDate.getMonth() + 1) + "月" + oldDate.getDate() + "日 ";
            hasTime ? date = date +' '+ dateFtt(format,date) : null;
            return date;
        }
    }else{
        let date = oldDate.getFullYear() + "年" +(oldDate.getMonth() + 1) + "月" + oldDate.getDate() + "日 ";
        hasTime ? date = date +' '+ dateFtt(format,date) : null;
        return date;
    }
}

function DateDayFormat(day) {
    switch (day){
        case 0:
            return '星期天';
        case 1:
            return '星期一';
        case 2:
            return '星期二';
        case 3:
            return '星期三';
        case 4:
            return '星期四';
        case 5:
            return '星期五';
        case 6:
            return '星期六';
    }
}
