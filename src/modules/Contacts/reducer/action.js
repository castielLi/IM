


export function initRelation(relationData){
    return {
        type: 'INIT_RELATION',
        relationData
    };

}
//从relationStore中删除指定好友
export function deleteRelation(relationId){
    return {
        type: 'DELETE_RELATION',
        relationId
    };

}
