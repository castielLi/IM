
import formateRelationData from './formateRelationData';

export function initRelation(data){
    return {
        type: 'INIT_RELATION',
        relationArr:formateRelationData(data)
    };

}

