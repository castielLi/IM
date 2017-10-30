


export function initRelation(relationData){
    return {
        type: 'INIT_RELATION',
        relationData
    };

}
export function clearRelation(){
    return {
        type: 'CLEAR_RELATION',
    };

}

export function changeRelation(relation){
    return {
        type: 'CHANGE_RELATION',
        relation
    }
}

export function changeRelationOfShow(relationId){
    return {
        type: 'CHANGE_RELATION_OF_SHOW',
        relationId
    }
}

export function changeRelationOfBlackList(relationId){
    return {
        type: 'CHANGE_RELATION_OF_BLACKLIST',
        relationId
    }
}

export function addRelation(relation){
    return {
        type: 'ADD_RELATION',
        relation
    }
}

//从relationStore中删除指定好友
export function deleteRelation(relationId){
    return {
        type: 'DELETE_RELATION',
        relationId
    };

}
