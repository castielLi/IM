/**
 * Created by apple on 2017/12/20.
 */
export default class SQLiteHelper {
    static sqlFormat(sql, parameters = []) {
        let currentSql = sql;
        for (let i = 0; i < parameters.length; i++) {
            // parameters[i] == "" ? parameters[i] = "blank":parameters[i];
            (typeof (parameters[i]) === "boolean") ? (parameters[i] ? "true" : "false") : parameters[i];
            if (typeof (parameters[i]) === "number") {
                currentSql = currentSql.replace("?", parameters[i]);
            }
            else {
                currentSql = currentSql.replace("?", "'" + parameters[i] + "'");
            }
        }
        return currentSql;
    }
    static sqlQueueFormat(sql, queue = []) {
        let currentSql = sql;
        let parameter = "";
        for (let i = 0; i < queue.length; i++) {
            if (queue.length != i + 1) {
                parameter += ("'" + queue[i] + "',");
            }
            else {
                parameter += ("'" + queue[i] + "'");
            }
        }
        currentSql = currentSql.replace("?", parameter);
        return currentSql;
    }
    //将sql语句中的? 替换为parameters中的数据 如果数据还是一个数组 将他转换成字符串供 in(?)使用
    static sqlFormatIn(sql, parameters = []) {
        let currentSql = sql;
        for (let i = 0; i < parameters.length; i++) {
            (typeof (parameters[i]) === "boolean") ? (parameters[i] ? "true" : "false") : parameters[i];
            if (typeof (parameters[i]) === "number") {
                currentSql = currentSql.replace("?", parameters[i]);
            }
            else if (parameters[i] instanceof Array) {
                let parameter = "";
                for (let j = 0; j < parameters[i].length; j++) {
                    if (parameters[i].length != j + 1) {
                        parameter += ("'" + parameters[i][j] + "',");
                    }
                    else {
                        parameter += ("'" + parameters[i][j] + "'");
                    }
                }
                currentSql = currentSql.replace("?", parameter);
            }
            else {
                currentSql = currentSql.replace("?", "'" + parameters[i] + "'");
            }
        }
        return currentSql;
    }
    static sqlStringFormat(sql, formatObject) {
        //取出占位符
        var regex = new RegExp('\\{[a-zA-Z0-9\\/\\u4e00-\\u9fa5]+\\}', 'g');
        let array = sql.match(regex);
        if (!array || array.length == 0)
            return sql;
        for (let key in array) {
            var regexAttribute = new RegExp(array[key], 'g');
            let attribute = array[key].replace("{", "").replace("}", "");
            if (formatObject[attribute] != undefined) {
                if (typeof (formatObject[attribute]) === 'boolean') {
                    let value = formatObject[attribute] ? 1 : 0;
                    sql = sql.replace(regexAttribute, value.toString());
                }
                else if (typeof (formatObject[attribute]) === 'number') {
                    sql = sql.replace(regexAttribute, formatObject[attribute]);
                }
                else if (formatObject[attribute] instanceof Array) {
                    let parameter = "";
                    for (let i = 0; i < formatObject[attribute].length; i++) {
                        if (formatObject[attribute].length != i + 1) {
                            parameter += ("'" + formatObject[attribute][i] + "',");
                        }
                        else {
                            parameter += ("'" + formatObject[attribute][i] + "'");
                        }
                    }
                    sql = sql.replace(regexAttribute, parameter);
                }
                else {
                    let content = formatObject[attribute];
                    //进行特殊字符的转义
                    content = SQLiteHelper.transSpecialChar(content);
                    sql = sql.replace(regexAttribute, "'" + content + "'");
                }
            }
            else {
                sql = sql.replace(regexAttribute, "''");
            }
        }
        return sql;
    }
    static transSpecialChar(content) {
        if (content != undefined && content != "" && content != 'null') {
            content = content.replace(/\r/g, "");
            content = content.replace(/\n/g, "&#10");
            content = content.replace(/\t/g, "\\t");
            content = content.replace(/\\/g, "\\\\");
            content = content.replace(/\'/g, "&#39;");
            // content = content.replace(/\"/g, "&#34;");
            content = content.replace(/ /g, "&nbsp;");
            content = content.replace(/</g, "&lt;");
            content = content.replace(/>/g, "&gt;");
        }
        return content;
    }
    static transToSpecialChatToDisplay(content) {
        if (content != undefined && content != "" && content != 'null') {
            content = content.replace(/\r/g, "");
            content = content.replace(/&#10/g, "\n");
            content = content.replace(/\\t/g, "\t");
            content = content.replace(/\\\\/g, "\\");
            content = content.replace(/&nbsp;/g, " ");
            content = content.replace(/&#39;/g, "\'");
            // content = content.replace(/&#34;/g,"\"");
            content = content.replace(/&lt;/g, "<");
            content = content.replace(/&gt;/g, ">");
        }
        return content;
    }
}
//# sourceMappingURL=SQLiteHelper.js.map