//格式转换
//{
//     'wg003722':{
//         Client: "wg003722",
//         LastMessage: "4444",
//         Time: "1511925305221",
//         Type: "private",
//         unReadMessageCount: 0,
//         Record:[msgId1,msgId2...]},
//     }
//to
//         [{Client: "wg003722",
//         LastMessage: "4444",
//         Time: "1511925305221",
//         Type: "private",
//         unReadMessageCount: 0,
//         Record:[msgId1,msgId2...]},...]
export default function formatOjbToneedArr(obj){
    let needArr = [];
    for(let key in obj){
        needArr.push(obj[key]);
    }
    return needArr;
}