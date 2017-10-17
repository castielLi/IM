export default function formateRelationData(arr){
    let obj = {};
    arr.forEach((v,i)=>{
        obj[v.RelationId] = v;
    })
    return obj
}